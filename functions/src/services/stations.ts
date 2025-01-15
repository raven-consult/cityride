import { logger } from "firebase-functions/v2";
import { onDocumentCreated, onDocumentUpdated } from "firebase-functions/v2/firestore";

import { geohashForLocation } from "geofire-common";


export const onStationCreatedAddGeohash = onDocumentCreated("station/{stationId}", async (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    logger.log("No data associated with the event");
    return;
  }

  const data = snapshot.data();

  const lat = data.coordinates.latitude;
  const lng = data.coordinates.longitude;
  const geohash = geohashForLocation([lat, lng]);

  return event.data?.ref.set({
    geohash,
  }, { merge: true });
});


export const onStationUpdatedUpdateGeoHash = onDocumentUpdated("station/{stationId}", async (event) => {
  const data = event.data?.after.data();
  const previousData = event.data?.before.data();

  if (!data || !previousData) {
    logger.log("No data associated with the event");
    return;
  }

  const latitudeIsSame = data.coordinates.latitude == previousData.coordinates.latitude;
  const longitudeIsSame = data.coordinates.longitude == previousData.coordinates.longitude;

  if (latitudeIsSame || longitudeIsSame) {
    return null;
  }

  const lat = data.coordinates.latitude;
  const lng = data.coordinates.longitude;
  const geohash = geohashForLocation([lat, lng]);

  return event.data?.after.ref.set({
    geohash,
  }, { merge: true });
});
