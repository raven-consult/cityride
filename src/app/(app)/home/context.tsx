import React from "react";

import { Ride } from "@/types";


interface RideContext {
  ride: Ride | null;
  setRide: React.Dispatch<React.SetStateAction<Ride | null>>;
}

const RideContext = React.createContext({} as RideContext);

export const useRideProvider = () => React.useContext(RideContext);


interface RideProviderProps {
  children: React.ReactNode;
}

export const RideProvider = ({ children }: RideProviderProps): JSX.Element => {
  const [ride, setRide] = React.useState<Ride | null>(null);

  return (
    <RideContext.Provider value={{ ride, setRide }}>
      {children}
    </RideContext.Provider>
  );
};