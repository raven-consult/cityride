import * as admin from 'firebase-admin';

import stations from '../private/stations.geojson.json';

admin.initializeApp({ projectId: "cityride-dev" });

export interface Station {
  name: string;
  address: string;
  google_maps: string;
  coordinates: {
    latitude: number;
    longitude: number;
  }
}

console.log(stations);
const db = admin.firestore();

const stationsCollection = db.collection('stations');

stations.features.forEach(async (station: any) => {
  console.log(station);
  const { properties, geometry } = station;

  const { name, address, google_maps } = properties;

  const { coordinates } = geometry;

  const stationData: Station = {
    name,
    address,
    coordinates,
    google_maps,
  };

  await stationsCollection.doc().set(stationData);
});

