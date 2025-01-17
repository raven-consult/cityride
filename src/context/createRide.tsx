import React from "react";

import { SelectedRoute } from "@/types";


export interface CreateRideContextType {
  createRideMode: boolean;
  selectedRoute: SelectedRoute;
  setCreateRideMode: (createRideMode: boolean) => void;
  setSelectedRoute: (selectedRoute: SelectedRoute) => void;
}


export const useCreateRideState = (): CreateRideContextType => {
  const [createRideMode, setCreateRideMode] = React.useState<boolean>(false);
  const [selectedRoute, setSelectedRoute] = React.useState<SelectedRoute>({} as SelectedRoute);

  React.useEffect(() => {
    if(!createRideMode) {
      setSelectedRoute({} as SelectedRoute);
    }
  }, [createRideMode]);

  return {
    selectedRoute,
    setSelectedRoute,

    createRideMode,
    setCreateRideMode,
  };
};
