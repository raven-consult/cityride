import React from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { Ride } from "@/types";

interface RideContext {
  ride: Ride | null;
  pendingRide: Ride | null;
  setPendingRide: (ride: Ride | null) => void;
  setCurrentRide: (ride: Ride | null) => void;
}


const RideContext = React.createContext<RideContext>({} as RideContext);


export const useRide = () => React.useContext(RideContext);


interface RideProviderProps {
  children: React.ReactNode;
}

const RideProvider = ({ children }: RideProviderProps): JSX.Element => {
  const [ride, setRide] = React.useState<Ride | null>(null);
  const [pendingRide, setPendingRide] = React.useState<Ride | null>(null);

  const pendingRideKey = "pendingRide";

  const setCurrentRide = (ride: Ride | null) => setRide(ride);

  React.useEffect(() => {
    (async () => {
      if (pendingRide == null) {
        await AsyncStorage.removeItem(pendingRideKey);
      } else {
        await AsyncStorage.setItem(pendingRideKey, JSON.stringify(pendingRide));
      }
    })();
  }, [pendingRide]);

  return (
    <RideContext.Provider value={{
      ride,
      setCurrentRide,

      pendingRide,
      setPendingRide,
    }}>
      {children}
    </RideContext.Provider>
  );
};


export default RideProvider;