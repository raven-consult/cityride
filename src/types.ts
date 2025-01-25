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

export interface Wallet {
  id: string;
  balance: number;
}

export interface Transaction {
  id: string;
  title: string;
  sender: string;
  amount: number;
  timestamp: Date;
  receiver: string;
  comment?: string;
  type: "credit" | "debit";
}

export type Role = "passenger" | "driver";

export interface DriverInfo {
  carNumber: string;
  maxPassengers: number;
}

export interface UserData {
  role: Role;
  email: string;
  displayName: string;
  driverInfo?: DriverInfo;
}

export interface Ride {
  id: string;
  price: number;
  itenary: {
    start: Station;
    end: Station;
  }
  metadata: {
    driverId: string;
    driverArrival: number;
    maxPassengers: number;
  }
}

export type SelectedRoute = {
  end: Station | null;
  start: Station | null;
}