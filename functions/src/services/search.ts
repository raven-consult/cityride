import { logger } from "firebase-functions/v2";
import { onDocumentCreated, onDocumentUpdated } from "firebase-functions/v2/firestore";

import Typesense from "typesense";
import pRetry, { AbortError } from "p-retry";


const stationsCollection = "stations";
const port = process.env.TYPESENSE_PORT || "8108";
const host = process.env.TYPESENSE_HOST || "localhost";
const protocol = process.env.TYPESENSE_PROTOCOL || "http"
const apiKey = process.env.TYPESENSE_API_KEY || "<API_KEY>";


const client = new Typesense.Client({
  "nodes": [{
    "host": host,
    "port": Number(port),
    "protocol": protocol,
  }],
  "apiKey": apiKey,
  "connectionTimeoutSeconds": 2
});


export const onStationCreatedCreateNewDocument = onDocumentCreated("stations/{stationId}", async (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    logger.log("No data associated with the event");
    return;
  }

  const data = snapshot.data();

  const lat = data.latitude;
  const lng = data.longitude;

  logger.log("StationId: ", event.params.stationId);

  return pRetry((async () => await client.collections(stationsCollection).documents().create({
    rating: data.rating,
    name: data.company.name,
    logo: data.company.logo,
    coordinates: [lat, lng],
    id: event.params.stationId,
  })), {
    retries: 20,
    onFailedAttempt: (error) => {
      if (error instanceof AbortError) {
        logger.error("Aborted: ", error);
        return;
      }

      logger.error("Error: ", error);
    }
  });
});


export const onStationUpdatedReindexDocument = onDocumentUpdated("stations/{stationId}", async (event) => {
  const data = event.data?.after.data();
  const previousData = event.data?.before.data();

  if (!data || !previousData) {
    logger.log("No data associated with the event");
    return;
  }

  const latitudeIsSame = data.latitude == previousData.latitude;
  const longitudeIsSame = data.longitude == previousData.longitude;

  if (latitudeIsSame && longitudeIsSame) {
    return null;
  }

  const lat = data.latitude;
  const lng = data.longitude;

  logger.log("StationId: ", event.params.stationId);

  return pRetry((async () => await client.collections(stationsCollection).documents().upsert({
    rating: data.rating,
    name: data.company.name,
    logo: data.company.logo,
    coordinates: [lat, lng],
    id: event.params.stationId,
  })), {
    retries: 20,
    onFailedAttempt: (error) => {
      if (error instanceof AbortError) {
        logger.error("Aborted: ", error);
        return;
      }

      logger.error("Error: ", error);
    }
  });
});
