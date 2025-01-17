import React from "react";
import { useRideState } from "@/context/ride";
import { useStationState } from "@/context/station";
import { useCreateRideState } from "@/context/createRide";
import { useInfoState } from "@/context/info";

const AppContext = React.createContext({});

export const useAppContext = () => React.useContext(AppContext);

const AppContextProvider = ({ children }) => {
  const rideState = useRideState();
  const stationState = useStationState();
  const createRideState = useCreateRideState();
  const infoState = useInfoState();

  return (
    <AppContext.Provider value={{ ...rideState, ...stationState, ...createRideState, ...infoState }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
