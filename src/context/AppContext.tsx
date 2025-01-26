import React from "react";

import { useInfoState, InfoContextType } from "@/context/info";
import { useRideState, RideContextType } from "@/context/ride";
import { useStationState, StationContextType } from "@/context/station";
import { useCreateRideState, CreateRideContextType } from "@/context/createRide";

type AppContextType = InfoContextType
  & StationContextType
  & RideContextType
  & CreateRideContextType;

const AppContext = React.createContext({} as AppContextType);


export const useAppContext = () => React.useContext(AppContext);


interface AppContextProviderProps {
  children: React.ReactNode
}

const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const rideState = useRideState();
  const infoState = useInfoState();
  const stationState = useStationState();
  const createRideState = useCreateRideState();

  return (
    <AppContext.Provider value={{
      ...rideState,
      ...infoState,
      ...stationState,
      ...createRideState,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
