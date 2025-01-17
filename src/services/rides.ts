import auth from "@react-native-firebase/auth";

import { getUrl } from "@/utils";
import { DriverRideInfo } from "@/types";


export const getRidesStartingAtStation = async (stationId: string) => {
  const url = getUrl("rideShare-getAvailableRides");
  const authToken = await auth().currentUser?.getIdToken();
  const req = { stationId } as { stationId: string };

  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(req),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  const rides = await res.json();
  return rides;
}

interface CreateRideRequest {
  price: number;
  driver: string;
  endStation: string;
  startStation: string;
}

export const createRide = async (driver: string, price: number, startStation: string, endStation: string): Promise<DriverRideInfo> => {
  const url = getUrl("rideShare-createRide");
  const authToken = await auth().currentUser?.getIdToken();
  const req = { driver, price, startStation, endStation} as CreateRideRequest;

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


export const boardRide = async (rideId: string, passengerId: string) => {
  const url = getUrl("rideShare-boardRide");
  const authToken = await auth().currentUser?.getIdToken();

  const req = { rideId, passengerId } as { rideId: string, passengerId: string };

  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(req),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return res.json();
} 