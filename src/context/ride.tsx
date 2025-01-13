import React from "react";

import { Ride } from "@/types";

interface RideContext {
  ride: Ride | null;
  setCurrentRide: (ride: Ride | null) => void;
}


const RideContext = React.createContext<RideContext>({} as RideContext);

export const useRide = () => React.useContext(RideContext);


interface RideProviderProps {
  children: React.ReactNode;
}

const RideProvider = ({ children }: RideProviderProps): JSX.Element => {
  const [ride, setRide] = React.useState<Ride | null>(null);

  const setCurrentRide = (ride: Ride | null) => setRide(ride);

  return (
    <RideContext.Provider value={{ ride, setCurrentRide }}>
      {children}
    </RideContext.Provider>
  );
};


export default RideProvider;