import React from "react";

import { Info } from "@/types";

export interface InfoContextType {
  info: Info | null;
  setInfo: React.Dispatch<React.SetStateAction<Info | null>>;
}

export const useInfoState = () => {
  const [info, setInfo] = React.useState<Info | null>(null);

  return {
    info,
    setInfo,
  }
};

