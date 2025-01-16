export interface Ride {
  id: string;
  name: string;
  price: number;
}

export interface Info {
  title: string;
  description: string;
  illustration: string;
  action?: () => void;
}

export interface Ride {
  id: string;
  itenary: {
    start: Station;
    end: Station;
  }
  driverArrival: Date;
}

export interface Coordinate {
  latitude: number;
  longitude: number;
}


export interface Station {
  id: string;
  name: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  }
}

export type SelectedRoute = {
  end: Station | null;
  start: Station | null;
}