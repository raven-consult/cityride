import { Station } from "@/types";
import React from "react";

interface StationContextType {
  currentStation: Station | null;
  setCurrentStation: (stations: Station | null) => void;
}


const StationContext = React.createContext<StationContextType>({} as StationContextType);

export const useStation = () => React.useContext(StationContext);


interface StationProviderProps {
  children: React.ReactNode;
}

const StationProvider = ({ children }: StationProviderProps): JSX.Element => {
  const [currentStation, setCurrentStation] = React.useState<Station | null>(null);

  return (
    <StationContext.Provider value={{ currentStation, setCurrentStation }}>
      {children}
    </StationContext.Provider>
  );
};


export default StationProvider;