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