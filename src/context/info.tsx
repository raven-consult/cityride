import React from "react";

import { Info } from "@/types";


interface InfoContextType {
  info: Info | null;
  setInfo: React.Dispatch<React.SetStateAction<Info | null>>;
}

const InfoContext = React.createContext<InfoContextType>({} as InfoContextType);

export const useInfo = (): InfoContextType => React.useContext(InfoContext);

interface InfoProviderProps {
  children: React.ReactNode;
}

const InfoProvider = ({ children }: InfoProviderProps): JSX.Element => {
  const [info, setInfo] = React.useState<Info | null>(null);

  return (
    <InfoContext.Provider value={{ info, setInfo }}>
      {children}
    </InfoContext.Provider>
  );
};


export default InfoProvider;