import React from "react";

import { SelectedRoute } from "@/types";


interface CreateRideContextType {
  createRideMode: boolean;
  selectedRoute: SelectedRoute;
  setCreateRideMode: (createRideMode: boolean) => void;
  setSelectedRoute: (selectedRoute: SelectedRoute) => void;
}


const CreateRideContext = React.createContext<CreateRideContextType>({} as CreateRideContextType);

export const useCreateRide = () => React.useContext(CreateRideContext);


interface CreateRideProviderProps {
  children: React.ReactNode;
}


const CreateRideProvider = ({ children }: CreateRideProviderProps): JSX.Element => {
  const [createRideMode, setCreateRideMode] = React.useState<boolean>(false);
  const [selectedRoute, setSelectedRoute] = React.useState<SelectedRoute>({} as SelectedRoute);

  React.useEffect(() => {
    if(!createRideMode) {
      setSelectedRoute({} as SelectedRoute);
    }
  }, [createRideMode]);

  return (
    <CreateRideContext.Provider value={{
      selectedRoute,
      setSelectedRoute,

      createRideMode,
      setCreateRideMode,
    }}>
      {children}
    </CreateRideContext.Provider>
  );
}

export const useCreateRideState = () => {
  const context = React.useContext(CreateRideContext);
  if (!context) {
    throw new Error("useCreateRideState must be used within a CreateRideProvider");
  }
  return {
    createRideMode: context.createRideMode,
    setCreateRideMode: context.setCreateRideMode,
    selectedRoute: context.selectedRoute,
    setSelectedRoute: context.setSelectedRoute,
  };
};

export default CreateRideProvider;
