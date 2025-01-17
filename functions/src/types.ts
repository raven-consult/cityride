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

export interface Ride {
  id?: string;
  price: number;
  itenary: {
    start: Station;
    end: Station;
  }
  metadata: {
    driverId: string;
    maxPassengers: number;
    driverArrivalTimestamp: number;
  }
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
