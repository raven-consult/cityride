import firestore from "@react-native-firebase/firestore";

import { Ride } from "@/types";


export const getRidesStartingAtStation = async (stationId: string) => {
  const rides = await firestore().collection("rides")
    .where("itenary.start.id", "==", stationId)
    .get();

  return rides.docs.map((ride) => ({ ...ride.data(), id: ride.id }) as Ride);
}