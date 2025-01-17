import * as admin from "firebase-admin";
import { logger } from "firebase-functions/v2";
import { onRequest } from "firebase-functions/v2/https";

import { Expo, ExpoPushMessage } from "expo-server-sdk";

import { isAuthorized } from "../utils";
import { PassengerPayDriverForRide } from "./wallet";


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

  // TODO: Check if user is an authorized driver

  const { driver, startStation, endStation, price } = (req.body as CreateRideRequest);

  // Check if driver is driver
  const driverData = await database.collection("users").doc(driver).get();
  if (!driverData.exists) {
    logger.error("A User tried to create with ride with invalid driver", driver);
    res.status(400).send("Driver does not exist");
    return;
  }
  const driverInfo = driverData.data() as RiderUserData;

  // Check if start is bus stops
  const startStationDoc = await database.collection("stations").doc(startStation).get();
  if (!startStationDoc.exists) {
    logger.error("A User tried to create with ride with invalid start point", driver);
    res.status(400).send("Start point does not exist");
    return;
  }
  const startStationData = {...startStationDoc.data(), id: startStationDoc.id} as Station;

  // Check if end is bus stops
  const endStationDoc = await database.collection("stations").doc(endStation).get();
  if (!endStationDoc.exists) {
    res.status(400).send("End point does not exist");
    logger.error("A User tried to create with ride with invalid destination point", driver);
    return;
  }
  const endStationData = {...endStationDoc.data(), id: endStationDoc.id} as Station;

  const rideId = database.collection("rides").doc().id;
  const ride: Ride = {
    itenary: {
      end: endStationData,
      start: startStationData,
    },
    price,
    driver: {
      id: driver,
      carNumber: driverInfo.driver.carNumber,
    },
    passengers: {},
    metadata: {} as RideMetadata,
    maxPassengers: driverInfo.driver.maxPassengers,
  };

  // TODO: Use the driver's coordinates and the start station coordinates
  // const routeData = await getGMapsRoutes(startStationData.coordinates, endStationData.coordinates);
  ride.metadata = {
    ...ride.metadata,
    driverArrivalMins: 5,
  }

  await database.collection("rides").doc(rideId).set(ride);

  const driverRideInfo: DriverRideInfo = {
    id: rideId,
    price: ride.price,
    itenary: {
      end: endStationData,
      start: startStationData,
    },
    driver: { id: driver },
    metadata: ride.metadata,
  }

  res.status(200).send(driverRideInfo);
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
    .map((ride) => ({
      id: ride.id,
      driver: ride.driver,
      itenary: ride.itenary,
      metadata: ride.metadata,
      maxPassengers: ride.maxPassengers,
    }) as PassengerRideInfo);

  res.status(200).send(availableRides);
});

/**
 * Passenger boards a ride
 * and sends a notification to the driver about the new passenger.
 * 
 * It returns an error if the ride is full or the
 * passenger is already in the ride.
 */
export const boardRide = onRequest(async (req, res) => {
  if (!isAuthorized(req, res)) return;

  // TODO: Check if ride is not full
  // TODO: Check if user is not a driver
  // TODO: Check if user is not already in a ride
  // TODO: Check if user is not already in the ride
  // TODO: Check if user has enough balance to pay for the ride

  const { rideId, passengerId } = req.body;

  const rideRef = database.collection("rides").doc(rideId);
  const ride = (await rideRef.get()).data() as Ride;

  if (!ride) {
    res.status(404).send("Ride not found");
    return;
  }

  if (ride.maxPassengers === Object.keys(ride.passengers).length) {
    res.status(400).send("Ride is full");
    return;
  }

  ride.passengers[passengerId] = {
    id: passengerId,
    verified: false,
    code: generateCode(),
  };

  await admin
    .database()
    .ref(`/rides/${rideId}/passengers/${passengerId}`)
    .set(ride.passengers[passengerId]);

  await rideRef.set(ride, { merge: true });

  const driverNotificationToken = await admin
    .database()
    .ref(`/users/${ride.driver.id}/notificationToken`)
    .get();

  if (!driverNotificationToken.exists) {
    logger.error(`Could not send notification to driver:
      ${ride.driver.id} of ride: ${ride.id} because notification token does not exist`);
  }

  const notificationToken = driverNotificationToken.val();
  if (!Expo.isExpoPushToken(notificationToken)) {
    logger.error(`Could not send notification to driver: ${ride.driver.id} of ride: ${ride.id}`);
  }

  const message = {
    sound: "default",
    title: "New Passenger",
    to: notificationToken,
    body: "A new passenger has joined your ride",
  } as ExpoPushMessage;

  try {
    await expo.sendPushNotificationsAsync([message]);
  } catch (error) {
    logger.error(error);
  }

  const rideInfo: PassengerRideInfo = {
    id: rideId,
    driver: ride.driver,
    itenary: ride.itenary,
    metadata: ride.metadata,
    maxPassengers: ride.maxPassengers,
    userAuthCode: ride.passengers[passengerId].code,
  }

  res.status(200).send(rideInfo);
});

// TODO: Add comments
export const confirmPassenger = onRequest(async (req, res) => {
  if (!isAuthorized(req, res)) return;

  // TODO: Check if user is a driver
  // TODO: Check if the requester is a valid passenger of the ride
  // TODO: Check if the code is valid
  // TODO: Check if the passenger is not already verified
  // TODO: Check if the ride is not already ended
  // TODO: Check if the ride is not already started
  // TODO: Check if the ride is not already full

  const { rideId, code } = req.body;

  const rideRef = admin.firestore().collection("rides").doc(rideId);
  const ride = (await rideRef.get()).data() as Ride;

  if (!ride) {
    res.status(404).send("Ride not found");
    return;
  }

  const passenger = Object.values(ride.passengers).find((passenger) => passenger.code === code);

  if (!passenger) {
    logger.error(`Invalid code tried on ride: ${ride.id} by driver: ${ride.driver.id}`, ride);
    res.status(400).send("Invalid code");
    return;
  }

  passenger.verified = true;
  await rideRef.set(ride, { merge: true });

  try {
    // Pay the driver
    await PassengerPayDriverForRide(
      passenger.id,
      ride.driver.id,
      ride.price,
      rideId,
    )
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

  const messages = [];
  const passengerIds = Object.entries(ride.passengers);

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


interface Coordinate {
  latitude: number;
  longitude: number;
}

interface Passenger {
  id: string;
  code: string;
  verified: boolean;
}

export interface Station {
  id: string;
  name: string;
  address: string;
  coordinates: Coordinate;
}

interface RiderUserData {
  id: string;
  driver: {
    carNumber: string;
    maxPassengers: number;
  }
}

interface Driver {
  id: string;
  carNumber: string;
  // coordinates: Coordinate;
}

interface RideMetadata {
  driverArrivalMins: number;
}

interface Ride {
  id?: string;
  price: number;
  driver: Driver;
  itenary: {
    end: Station;
    start: Station;
  }
  maxPassengers: number;
  metadata: RideMetadata;
  passengers: Record<string, Passenger>;
}


interface PassengerRideInfo {
  id: string;
  itenary: {
    end: Station;
    start: Station;
  }
  driver: Driver;
  userAuthCode: string;
  maxPassengers: number;
  metadata: RideMetadata;
}

export interface DriverRideInfo {
  id: string;
  price: number;
  itenary: {
    end: Station;
    start: Station;
  };
  driver: { id: string };
  metadata: RideMetadata;
}

type GeojsonLineString = [number, number];

interface Step {
  distance: number;
  duration: number;
  instruction: string;
  polyline: GeojsonLineString[];
}


interface MapResponse {
  mapData: {
    distance: number;
    directions: Step[];
    polyline: GeojsonLineString[];
  }
  trafficData: {
    timeMins: number;
    trafficDensity: "sparse" | "medium" | "dense",
  }
}
