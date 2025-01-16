export interface Info {
  title: string;
  description: string;
  illustration: string;
  action?: () => void;
}

export interface Ride {
  id: string;
  price: number;
  itenary: {
    start: Station;
    end: Station;
  }
  driverArrival: number;
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



///////////////////////


export interface Passenger {
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

export interface RiderUserData {
  id: string;
  driver: {
    carNumber: string;
    maxPassengers: number;
  }
}

export interface Driver {
  id: string;
  carNumber: string;
}

export interface RideMetadata {
  driverArrivalMins: number;
}

export interface PassengerRideInfo {
  id: string;
  itenary: {
    end: Station;
    start: Station;
  }
  driver: Driver;
  userAuthCode: string;
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