import React from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ride } from "@/types";


export interface RideContextType {
  ride: Ride | null;
  setCurrentRide: React.Dispatch<React.SetStateAction<Ride | null>>;
  pendingRide: Ride | null;
  setPendingRide: React.Dispatch<React.SetStateAction<Ride | null>>;
}

export const useRideState = (): RideContextType => {
  const [ride, setCurrentRide] = React.useState<Ride | null>(null);
  const [pendingRide, setPendingRide] = React.useState<Ride | null>(null);

  const pendingRideKey = "pendingRide";

  React.useEffect(() => {
    (async () => {
      const pendingRide = await AsyncStorage.getItem(pendingRideKey);
      if (pendingRide) {
        setPendingRide(JSON.parse(pendingRide));
      }
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      if (pendingRide == null) {
        await AsyncStorage.removeItem(pendingRideKey);
      } else {
        await AsyncStorage.setItem(pendingRideKey, JSON.stringify(pendingRide));
      }
    })();
  }, [pendingRide]);

  return {
    ride,
    setCurrentRide,
    pendingRide,
    setPendingRide,
  };
};
