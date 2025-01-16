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


export default CreateRideProvider;