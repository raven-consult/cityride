import * as admin from "firebase-admin";

admin.initializeApp({
  databaseURL: "https://cityride-dev-default-rtdb.firebaseio.com"
});

export * as map from "./services/map";
export * as auth from "./services/auth";
// export * as wallet from "./services/wallet";
// export * as search from "./services/search";
export * as rideShare from "./services/rides";
export * as stations from "./services/stations";