import * as crypto from "node:crypto";

import * as firebase from "firebase-admin";
import { logger } from "firebase-functions/v2";
import { onRequest } from "firebase-functions/v2/https";
import { HttpsError } from "firebase-functions/v2/https";

const MAPS_API_KEY = process.env.MAPS_API_KEY || "";

interface MapsRequest {
  end: Coordinate;
  start: Coordinate;
}


export const getRoutes = onRequest(async (req, res) => {
  const database = firebase.database();

  const { start, end } = req.body as MapsRequest;

  if (!start || !end) {
    throw new HttpsError("invalid-argument", "Invalid request data");
  }

  const inputString = `${JSON.stringify(start)}:${JSON.stringify(end)}`;
  const hash = crypto.createHash("sha256").update(inputString).digest("hex");

  const cacheRef = database.ref("cache").child(hash);

  const cacheData = await cacheRef.get();
  if (cacheData.exists()) {
    const data = cacheData.val();
    res.set(200).json(JSON.parse(data));
    return;
  }

  try {
    const response = await getGMapsRoutes(end, start);
    await cacheRef.set(JSON.stringify(response));
    res.set(200).json(response);
  } catch (error) {
    logger.error(error);
    res.status(500).send("Failed to get route");
  }
});


const getGMapsRoutes = async (start: Coordinate, end: Coordinate): Promise<MapResponse> => {
  const url = "https://routes.googleapis.com/directions/v2:computeRoutes";

  const headers = {
    "X-Goog-FieldMask": "routes",
    "X-Goog-Api-Key": MAPS_API_KEY,
    "Content-Type": "application/json",
  }

  const request = {
    origin: {
      location: {
        latLng: {
          latitude: start.latitude,
          longitude: start.longitude
        }
      }
    },
    destination: {
      location: {
        latLng: {
          latitude: end.latitude,
          longitude: end.longitude
        }
      }
    },
    polylineEncoding: "GEO_JSON_LINESTRING",
    polylineQuality: "HIGH_QUALITY",
    computeAlternativeRoutes: false,
    routeModifiers: {
      avoidTolls: false,
      avoidHighways: false,
      avoidFerries: false
    },
    units: "METRIC",
    languageCode: "en-NG"
  }

  const response = await fetch(url, {
    headers,
    method: "POST",
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text);
  }

  const data = await response.json();
  return extractResponseFromApiData(data);
}


function extractResponseFromApiData(apiData: any): MapResponse {
  const route = apiData.routes[0];
  const leg = route.legs[0];

  const mapData = {
    distance: route.distanceMeters,
    polyline: route.polyline.geoJsonLinestring.coordinates,
    directions: leg.steps.map((step: any) => ({
      distance: step.distanceMeters,
      instruction: step.navigationInstruction.instructions,
      polyline: step.polyline.geoJsonLinestring.coordinates,
      duration: parseInt(step.staticDuration.replace("s", "")),
    })),
  };

  const duration = parseInt(route.duration.replace("s", ""));
  const staticDuration = parseInt(route.staticDuration.replace("s", ""));

  const timeMins = Math.ceil(duration / 60);

  let trafficDensity: "sparse" | "medium" | "dense" = "sparse";
  const ratio = duration / staticDuration;

  if (ratio > 1.2) {
    trafficDensity = "dense";
  } else if (ratio > 1.0) {
    trafficDensity = "medium";
  }

  const trafficData = {
    timeMins,
    trafficDensity,
  };

  return {
    mapData,
    trafficData,
  };
}


interface Coordinate {
  latitude: number;
  longitude: number;
}


type GeojsonLineString = [number, number];

interface Step {
  distance: number;
  duration: number;
  instruction: string;
  polyline: GeojsonLineString[];
}


interface MapResponse {
  mapData: {
    distance: number;
    directions: Step[];
    polyline: GeojsonLineString[];
  }
  trafficData: {
    timeMins: number;
    trafficDensity: "sparse" | "medium" | "dense",
  }
}
