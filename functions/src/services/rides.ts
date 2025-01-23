import * as admin from "firebase-admin";
import { logger } from "firebase-functions/v2";
import { onRequest } from "firebase-functions/v2/https";

import { Expo, ExpoPushMessage } from "expo-server-sdk";

import { isAuthorized } from "../utils";
import { PassengerPayDriverForRide } from "./wallet";
import { MapResponse, Passengers, Ride, Station, UserData } from "../types";


// const kAllowedWaitTimeMins = 30;
const MAPS_API_KEY = process.env.MAPS_API_KEY || "";

export const database = admin.firestore();
database.settings({
  ignoreUndefinedProperties: true,
});

const expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });


export interface CreateRideRequest {
  price: number;
  driver: string;
  endStation: string;
  startStation: string;
}

// TODO: Add comments
export const createRide = onRequest(async (req, res) => {
  if (!isAuthorized(req, res)) return;

  const { driver, startStation, endStation, price } = (req.body as CreateRideRequest);

  // Check if driver is driver
  const driverData = await database.collection("users").doc(driver).get();
  if (!driverData.exists) {
    logger.error("A User tried to create with ride with invalid driver", driver);
    res.status(400).send("Driver does not exist");
    return;
  }

  const driverInfo = driverData.data() as UserData;
  if (driverInfo.role !== "driver") {
    logger.error("A User tried to create with ride with invalid driver", driver);
    res.status(400).send("User is not a driver");
    return;
  }

  // Check if start is bus stops
  const startStationDoc = await database.collection("stations").doc(startStation).get();
  if (!startStationDoc.exists) {
    logger.error("A User tried to create with ride with invalid start point", driver);
    res.status(400).send("Start point does not exist");
    return;
  }
  const startStationData = { ...startStationDoc.data(), id: startStationDoc.id } as Station;

  // Check if end is bus stops
  const endStationDoc = await database.collection("stations").doc(endStation).get();
  if (!endStationDoc.exists) {
    res.status(400).send("End point does not exist");
    logger.error("A User tried to create with ride with invalid destination point", driver);
    return;
  }
  const endStationData = { ...endStationDoc.data(), id: endStationDoc.id } as Station;

  // TODO: Use the driver's coordinates and the start station coordinates
  // const routeData = await getGMapsRoutes(startStationData.coordinates, endStationData.coordinates);
  const timeMins = 5;
  const driverArrivalTimestamp = Date.now() + timeMins * 60 * 1000;

  const rideId = database.collection("rides").doc().id;
  const ride: Ride = {
    id: rideId,
    itenary: {
      end: endStationData,
      start: startStationData,
    },
    price,
    metadata: {
      driverId: driver,
      driverArrivalTimestamp,
      maxPassengers: driverInfo.driverInfo!.maxPassengers,
    }
  };

  await database.collection("rides").doc(rideId).set(ride);
  await admin.database().ref(`/rides/${rideId}/passengers`).set({});

  res.status(200).send(ride);
});


interface GetAvailableRidesRequest {
  stationId: string;
}

// TODO: Add comments
// TODO: Filter rides that have maxed out passengers
export const getAvailableRides = onRequest(async (req, res) => {
  if (!isAuthorized(req, res)) return;

  const { stationId } = (req.body as GetAvailableRidesRequest);

  const rides = await database
    .collection("rides")
    .where("itenary.start.id", "==", stationId)
    .get();

  const availableRides = rides.docs
    .map((doc) => ({ ...doc.data(), id: doc.id }) as Ride)
  // .filter((ride) => ride.metadata.driverArrrivalTimeMins <= kAllowedWaitTimeMins)

  res.status(200).send(availableRides);
});

function checkRideIsFull(ride: Ride, passengers: Passengers | undefined) {
  if (!passengers) return false;
  return ride.metadata.maxPassengers === Object.keys(passengers).length;
}

function checkUserNotInRide(passengers: Passengers | undefined, userId: string) {
  if (!passengers) return false;
  return !Object.keys(passengers).includes(userId);
}

function checkUserHasNoPendingRide(userId: string): boolean {
  return true;
}

function checkUserHasEnoughBalance(userId: string): boolean {
  return true;
  // throw new Error("Not implemented");
}

/**
 * Passenger boards a ride
 * and sends a notification to the driver about the new passenger.
 * 
 * It returns an error if the ride is full or the
 * passenger is already in the ride.
 */
export const boardRide = onRequest(async (req, res) => {
  if (!isAuthorized(req, res)) return;

  const { rideId, passengerId } = req.body;

  const rideRef = database.collection("rides").doc(rideId);
  const ride = (await rideRef.get()).data() as Ride;

  const rideRtdbRef = admin.database().ref(`/rides/${rideId}`);
  const passengers = (await rideRtdbRef.child("passengers").get()).toJSON() as Passengers;

  if (!ride) {
    res.status(404).send("Ride not found");
    return;
  }

  const isRideFull = checkRideIsFull(ride, passengers);
  if (isRideFull) {
    res.status(400).send("Ride is full");
    return;
  }

  const isUserInRide = checkUserNotInRide(passengers, passengerId);
  if (isUserInRide) {
    res.status(400).send("User is already in the ride");
    return;
  }

  const userHasNoPendingRide = checkUserHasNoPendingRide(passengerId);
  if (!userHasNoPendingRide) {
    res.status(400).send("User has a pending ride");
    return;
  }

  const userHasEnoughBalance = checkUserHasEnoughBalance(passengerId);
  if (!userHasEnoughBalance) {
    res.status(400).send("User does not have enough balance");
    return;
  }

  const passengerCode = generateCode();

  // This adds the passenger to the temporary checks storage
  // This will reduce the cost of reads for other operations like
  // confirming the passenger, etc
  await rideRtdbRef.child(`passengers/${passengerId}`).set({
    id: passengerId,
    verified: false,
    code: passengerCode,
  });

  // [START] Send notification to driver

  const driverNotificationToken = await admin
    .database()
    .ref(`/users/${ride.metadata.driverId}/notificationToken`)
    .get();

  if (!driverNotificationToken.exists) {
    logger.error(`Could not send notification to driver:
      ${ride.metadata.driverId} of ride: ${ride.id} because notification token does not exist`);
  }

  const notificationToken = driverNotificationToken.val();
  if (!Expo.isExpoPushToken(notificationToken)) {
    logger.error(`Could not send notification to driver: ${ride.metadata.driverId} of ride: ${ride.id}`);
  }

  const message = {
    sound: "default",
    to: notificationToken,
    title: "New Passenger",
    body: "A new passenger has joined your ride",
  } as ExpoPushMessage;

  try {
    await expo.sendPushNotificationsAsync([message]);
  } catch (error) {
    logger.error(error);
  }

  // [END] Send notification to driver

  res.status(200).send(passengerCode);
});


export const passengerCancelRide = onRequest(async (req, res) => {
  if (!await isAuthorized(req, res)) return;

  const { rideId, passengerId } = req.body;

  const passengersRef = admin.database().ref(`/rides/${rideId}/passengers`);
  const passengersData = await passengersRef.get();

  if (!passengersData.exists()) {
    res.status(400).send("No passengers yet registered");
    return;
  }

  const passengers = passengersData.toJSON() as Passengers;
  if (!passengers) {
    res.status(400).send("No passengers yet registered");
    return;
  }

  if (!Object.keys(passengers).includes(passengerId)) {
    res.status(400).send("Passenger not found");
    return;
  }

  await passengersRef.child(`${passengerId}`).remove();

  // Notify driver
  const rideRef = await database.collection("rides").doc(rideId).get();
  const ride = { ...rideRef.data(), id: rideRef.id } as Ride;

  const driverNotificationToken = await admin
    .database()
    .ref(`/users/${ride.metadata.driverId}/notificationToken`)
    .get();

  if (!driverNotificationToken.exists) {
    logger.error(`Could not send notification to driver: ${ride.metadata.driverId} of ride: ${ride.id} because notification token does not exist`);
  }

  const notificationToken = driverNotificationToken.val();
  if (!Expo.isExpoPushToken(notificationToken)) {
    logger.error(`Could not send notification to driver: ${ride.metadata.driverId} of ride: ${ride.id}`);
  }

  const message = {
    sound: "default",
    to: notificationToken,
    title: "Passenger Cancelled",
    body: "A passenger has cancelled the ride",
  } as ExpoPushMessage;

  try {
    await expo.sendPushNotificationsAsync([message]);
  } catch (error) {
    logger.error(error);
  }

  res.status(200).send("Passenger removed");
});

// TODO: Add comments
export const confirmPassenger = onRequest(async (req, res) => {
  if (!await isAuthorized(req, res)) return;

  const authUser = await isAuthorized(req, res);
  if (!authUser) {
    res.status(401).send("Unauthorized");
    return;
  }

  const { rideId, code } = req.body;

  const rideRef = admin.firestore().collection("rides").doc(rideId);
  const ride = (await rideRef.get()).data() as Ride;

  if (!ride) {
    res.status(404).send("Ride not found");
    return;
  }

  if (ride.metadata.driverId !== authUser.uid) {
    res.status(401).send("Unauthorized");
    return;
  }

  const rideRtdbRef = admin.database().ref(`/rides/${rideId}`);
  const passengers = (await rideRtdbRef.child("passengers").get()).toJSON() as Passengers;

  const passenger = Object.values(passengers).find((passenger) => passenger.code === code);

  if (!passenger) {
    logger.error(`Invalid code tried on ride: ${ride.id} by driver: ${ride.metadata.driverId}`, ride);
    res.status(400).send("Invalid code");
    return;
  }

  if (passenger.verified) {
    logger.error("Passenger is already verified", passenger);
    res.status(400).send("Passenger is already verified");
    return;
  }

  passenger.verified = true;
  await rideRef.set(ride, { merge: true });

  try {
    // Pay the driver
    await PassengerPayDriverForRide(
      passenger.id,
      ride.metadata.driverId,
      ride.price,
      rideId,
    );
  } catch (err) {
    res.status(400).send((err as Error).message);
    return;
  }

  // Send notification to the passenger

  const notificationTokenData = await admin
    .database()
    .ref(`/users/${passenger.id}/notificationToken`)
    .get();

  if (!notificationTokenData.exists()) {
    logger.error(`Could not send notification to passenger: ${passenger.id} of ride: ${ride.id} because notification token does not exist`);
  }

  const notificationToken = notificationTokenData.val();
  if (!Expo.isExpoPushToken(notificationToken)) {
    logger.error(`Could not send notification to passenger: ${passenger.id} of ride: ${ride.id}`);
  }

  const notificationData = {
    type: "ride-confirmed",
    body: {
      rideId,
      userId: passenger.id,
    }
  }

  const message = {
    sound: "default",
    title: "Passenger confirmed",
    data: notificationData,
    to: notificationToken,
    body: "Your ride have been confirmed by the driver",
  } as ExpoPushMessage;

  try {
    await expo.sendPushNotificationsAsync([message]);
  } catch (error) {
    logger.error(error);
  }

  res.status(200).send("Passenger confirmed");
});


export const userIsPassengerOfRide = onRequest(async (req, res) => {
  if (!isAuthorized(req, res)) return;

  const { rideId, userId } = req.body;

  const rideRtdbRef = admin.database().ref(`/rides/${rideId}`);

  const passengers = await rideRtdbRef.child("passengers").get();

  let isPassenger = false;

  if (passengers.exists()) {
    isPassenger = Object.keys(passengers).includes(userId);
  }

  res.status(200).send({ isPassenger });
});


// TODO: Add comemnts
export const sendArrivalNotification = onRequest(async (req, res) => {
  if (!isAuthorized(req, res)) return;

  // TODO: Check if user is a driver
  // TODO: Check if the ride is not already ended
  // TODO: Check if the ride is not already started

  const { rideId } = req.body;

  const rideRef = await database.collection("rides").doc(rideId).get();
  const ride = { ...rideRef.data(), id: rideRef.id } as Ride;

  if (!ride) {
    res.status(404).send("Ride not found");
    return;
  }

  const rideRtdbRef = admin.database().ref(`/rides/${rideId}`);
  const passengers = (await rideRtdbRef.child("passengers").get()).toJSON() as Passengers;

  const messages = [];
  const passengerIds = Object.entries(passengers);

  for (const passenger of passengerIds) {
    const [passengerId, _] = passenger;

    const notificationTokenData = await admin
      .database()
      .ref(`/users/${passengerId}/notificationToken`)
      .get();

    if (!notificationTokenData.exists()) {
      logger.error(`Could not send notification to passenger: ${passengerId} of ride: ${ride.id} because notification token does not exist`);
    }
    const notificationToken = notificationTokenData.val();
    if (!Expo.isExpoPushToken(notificationToken)) {
      logger.error(`Could not send notification to passenger: ${passengerId} of ride: ${ride.id}`);
    }

    messages.push({
      sound: "default",
      title: "Bus Arrival",
      to: notificationToken,
      data: {
        type: "driver-arrived",
      },
      body: "Your bus has arrived at the station",
    } as ExpoPushMessage);
  }

  let tickets = [];
  let chunks = expo.chunkPushNotifications(messages);
  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      logger.info("Push notification tickets", ticketChunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      logger.error(error);
    }
  }

  res.status(200).send("Arrival notification sent");
});


const generateCode = () => Math.random().toString(36).substring(2, 6);

// @ts-ignore
const getGMapsRoutes = async (station: Coordinate, user: Coordinate): Promise<MapResponse> => {
  const url = "https://routes.googleapis.com/directions/v2:computeRoutes";

  const headers = {
    "X-Goog-FieldMask": "routes",
    "X-Goog-Api-Key": MAPS_API_KEY,
    "Content-Type": "application/json",
  }

  const request = {
    origin: {
      location: {
        latLng: {
          latitude: user.latitude,
          longitude: user.longitude
        }
      }
    },
    destination: {
      location: {
        latLng: {
          latitude: station.latitude,
          longitude: station.longitude
        }
      }
    },
    travelMode: "DRIVE",
    routingPreference: "TRAFFIC_AWARE",
    polylineEncoding: "GEO_JSON_LINESTRING",
    polylineQuality: "HIGH_QUALITY",
    computeAlternativeRoutes: false,
    routeModifiers: {
      avoidTolls: false,
      avoidHighways: false,
      avoidFerries: false
    },
    units: "METRIC",
    languageCode: "en-NG"
  }

  const response = await fetch(url, {
    headers,
    method: "POST",
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text);
  }

  const data = await response.json();
  return extractResponseFromApiData(data);
}


function extractResponseFromApiData(apiData: any): MapResponse {
  const route = apiData.routes[0];
  const leg = route.legs[0];

  const mapData = {
    distance: route.distanceMeters,
    polyline: route.polyline.geoJsonLinestring.coordinates,
    directions: leg.steps.map((step: any) => ({
      distance: step.distanceMeters,
      instruction: step.navigationInstruction.instructions,
      polyline: step.polyline.geoJsonLinestring.coordinates,
      duration: parseInt(step.staticDuration.replace("s", "")),
    })),
  };

  const duration = parseInt(route.duration.replace("s", ""));
  const staticDuration = parseInt(route.staticDuration.replace("s", ""));

  const timeMins = Math.ceil(duration / 60);

  let trafficDensity: "sparse" | "medium" | "dense" = "sparse";
  const ratio = duration / staticDuration;

  if (ratio > 1.2) {
    trafficDensity = "dense";
  } else if (ratio > 1.0) {
    trafficDensity = "medium";
  }

  const trafficData = {
    timeMins,
    trafficDensity,
  };

  return {
    mapData,
    trafficData,
  };
}