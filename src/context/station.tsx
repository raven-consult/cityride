import React from "react";

import { Station } from "@/types";

export interface StationContextType {
  currentStation: Station | null;
  setCurrentStation: React.Dispatch<React.SetStateAction<Station | null>>;
}

export const useStationState = () => {
  const [currentStation, setCurrentStation] = React.useState<Station | null>(null);

  return {
    currentStation,
    setCurrentStation,
  };
};
