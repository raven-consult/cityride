import * as admin from "firebase-admin";
import { auth } from "firebase-functions/v1";
import { logger } from "firebase-functions/v2";
import { onRequest } from "firebase-functions/v2/https";

import { UserData } from "../types";


export const initializeUserData = auth.user().onCreate((user) => {
  const userData: UserData = {
    role: "passenger",
    email: user?.email || "",
    displayName: user?.displayName || "",
  };

  return admin.firestore().collection("users").doc(user.uid).set(userData);
});

export const updateUserInfo = onRequest(async (req, res) => {
  const { displayName, uid } = req.body;

  if (!uid) {
    res.status(400).send("Missing uid");
    return;
  }

  const user = admin.auth().getUser(uid);
  const collection = admin.firestore().collection("users").doc(uid);

  if (!user) {
    res.status(404).send("User not found");
    return;
  }

  try {
    await admin.auth().updateUser(uid, {
      displayName,
    });
    await collection.set({
      displayName,
    }, { merge: true });
    res.status(200).send("Phone number updated successfully");
  } catch (error) {
    logger.error(error);
    res.status(500).send("Error updating phone number");
  }
});
