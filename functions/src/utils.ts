import * as admin from "firebase-admin";
import { Request, Response } from "express";
import { UserRecord } from "firebase-admin/auth";


const firestore = admin.firestore();
firestore.settings({ ignoreUndefinedProperties: true });

export { firestore };

export const isAuthorized = async (req: Request, res: Response): Promise<UserRecord | null> => {
  const isInEmulator = process.env.FUNCTIONS_EMULATOR === "true";
  if (isInEmulator) {
    return {} as UserRecord;
  }

  const tokenId = (req.headers.authorization || "").split("Bearer ")[1];
  if (!tokenId) {
    res.status(401).send("Unauthorized");
    return null;
  }

  const tokenData = await admin.auth().verifyIdToken(tokenId);
  if (!tokenData) {
    res.status(401).send("Unauthorized");
    return null;
  }

  return await admin.auth().getUser(tokenData.uid);
}


export const generateCode = (length = 5): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
  }

  return result;
}