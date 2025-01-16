import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

import { getUrl } from "@/utils";
import { DriverRideInfo, Ride } from "@/types";


export const getRidesStartingAtStation = async (stationId: string) => {
  const rides = await firestore().collection("rides")
    .where("itenary.start.id", "==", stationId)
    .get();

  return rides.docs.map((ride) => ({ ...ride.data(), id: ride.id }) as Ride);
}

interface CreateRideRequest {
  price: number;
  driver: string;
  endStation: string;
  startStation: string;
}

export const createRide = async (
  driver: string,
  price: number,
  startStation: string,
  endStation: string,
): Promise<DriverRideInfo> => {

  const url = getUrl("rideShare-createRide");
  const authToken = await auth().currentUser?.getIdToken();

  const req = {
    driver,
    price,
    startStation,
    endStation,
  } as CreateRideRequest;

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(req),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`
    },
  });

  if (!response.ok) {
    const res = await response.text();
    throw new Error(res);
  }

  return response.json();
}