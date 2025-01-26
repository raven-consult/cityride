import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface Info {
  title: string;
  description: string;
  illustration: string;
  action?: () => void;
}

export interface Station {
  id: string;
  name: string;
  address: string;
  coordinates: Coordinate;
}

export type Role = "passenger" | "driver";

export interface UserData {
  role: Role;
  email: string;
  displayName: string;
  driverInfo?: {
    carNumber: string;
    maxPassengers: number;
  };
}

export type Passengers = Record<string, {
  id: string;
  code: string;
  verified: boolean;
}>

export type RideStatus = "waiting" | "completed";

export interface Ride {
  id?: string;
  price: number;
  itenary: {
    start: Station;
    end: Station;
  }
  status: RideStatus;
  metadata: {
    driverId: string;
    maxPassengers: number;
    driverArrivalTimestamp: number;
  }
}

export interface InitializedTransaction {
  sender: string;
  initialized: boolean;
  date: typeof admin.database.ServerValue.TIMESTAMP;
}

export interface Wallet {
  id: string;
  balance: number;
}

export interface Transaction {
  id?: string;
  title: string;
  sender: string;
  amount: number;
  receiver: string;
  comment?: string;
  timestamp: Date | FieldValue;
  metadata: Record<string, any>;
}

export interface UserTransaction extends Transaction {
  type: "credit" | "debit";
}

export type SelectedRoute = {
  end: Station | null;
  start: Station | null;
}

export type GeojsonLineString = [number, number];

export interface Step {
  distance: number;
  duration: number;
  instruction: string;
  polyline: GeojsonLineString[];
}


export interface MapResponse {
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
