import { geohashQueryBounds } from "geofire-common";
import firestore from "@react-native-firebase/firestore";

import { Coordinate, Station } from "@/types";


const SEARCH_RADIUS_M = 1_000;


export const getAllStations = async () => {
  const stations = await firestore().collection("stations").get();
  return stations.docs.map((station) => ({ ...station.data(), id: station.id } as Station));
}


export const getNearestStation = async (center: Coordinate, searchRadiusM: number = SEARCH_RADIUS_M): Promise<Station | null> => {
  const bounds = geohashQueryBounds([center.latitude, center.longitude], searchRadiusM);
  const stationDocs = await firestore().collection("stations")
    .where("geohash", ">=", bounds[0])
    .where("geohash", "<=", bounds[1])
    .get();

  if (stationDocs.empty) {
    return null;
  }

  const stations = stationDocs.docs.map((station) => ({...station.data(), id: station.id }) as Station);

  type StationWithDistance = { station: Station | null; distance: number };
  const nearestStation = stations.reduce<StationWithDistance>((acc, station) => {
    const distance = Math.sqrt(
      (center.latitude - station.coordinates.latitude) ** 2 +
      (center.longitude - station.coordinates.longitude) ** 2
    );

    if (distance < acc.distance) {
      return { station, distance };
    }

    return acc;
  }, { station: null, distance: Infinity });

  return nearestStation.station;
}