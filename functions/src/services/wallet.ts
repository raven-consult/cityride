import * as crypto from "node:crypto";

import * as admin from "firebase-admin";
import { auth } from "firebase-functions/v1";
import { logger } from "firebase-functions/v2";
import { FieldValue } from "firebase-admin/firestore";
import { onRequest, Request } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/v2/firestore";

import { Expo, ExpoPushMessage } from "expo-server-sdk";

import { isAuthorized } from "../utils";
import { InitializedTransaction, Transaction, UserTransaction, Wallet } from "../types";


const kLastTransactionslimit = 10;
const expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });

const firestore = admin.firestore();
firestore.settings({ ignoreUndefinedProperties: true });


export const createWallet = auth.user().onCreate((user) => {
  return firestore.collection("wallets").doc(user.uid).set({
    balance: 0,
  });
});


export const sendNotificationOnTransaction = onDocumentCreated("transactions/{transactionId}", async (event) => {
  const data = event?.data?.data() as Transaction;
  const amount = data.amount;

  const senderNotificationTokenRef = await admin
    .database()
    .ref(`/users/${data.sender}/notificationToken`)
    .get();

  if (!senderNotificationTokenRef.exists()) {
    logger.error("Sender notification token not found", { sender: data.sender });
  }

  const senderNotificationTokenData = senderNotificationTokenRef.val();
  if (!Expo.isExpoPushToken(senderNotificationTokenData)) {
    logger.error(`Could not send notification to user: ${data.sender}`);
  }

  const message = {
    sound: "default",
    title: "Transaction Notification",
    to: senderNotificationTokenData,
    body: `You just paid ${amount} to a customer`,
  } as ExpoPushMessage;

  try {
    await expo.sendPushNotificationsAsync([message]);
  } catch (error) {
    logger.error(error);
  }

  const receiverNotificationTokenRef = await admin
    .database()
    .ref(`/users/${data.receiver}/notificationToken`)
    .get();

  if (!receiverNotificationTokenRef.exists()) {
    logger.error("Sender notification token not found", { sender: data.sender });
  }

  const receiverNotificationTokenData = receiverNotificationTokenRef.val();
  if (!Expo.isExpoPushToken(receiverNotificationTokenRef)) {
    logger.error(`Could not send notification to user: ${data.sender}`);
  }

  try {
    await expo.sendPushNotificationsAsync([{
      sound: "default",
      title: "Transaction Notification",
      to: receiverNotificationTokenData,
      body: `You just received ${amount} from a customer`,
    }]);
  } catch (error) {
    logger.error(error);
  }
});

export const getWallet = onRequest(async (req, res) => {
  if (!isAuthorized(req, res)) return;

  // TODO: Check if the user is the owner of the wallet

  const { uid } = req.body;

  const wallet = await firestore.collection("wallets").doc(uid).get();
  if (!wallet.exists) {
    res.status(404).send("Wallet not found");
    return;
  }

  res.status(200).send(wallet.data());
});

export const getLastTransactions = onRequest(async (req, res) => {
  if (!isAuthorized(req, res)) return;

  // TODO: Check if the user is the owner of the wallet

  const { uid } = req.body;

  const fetchRes = await Promise.all([
    firestore
      .collection("transactions")
      .where("sender", "==", uid)
      .orderBy("timestamp", "desc")
      .limit(kLastTransactionslimit)
      .get(),
    firestore
      .collection("transactions")
      .where("receiver", "==", uid)
      .orderBy("timestamp", "desc")
      .limit(kLastTransactionslimit)
      .get(),
  ]);

  const allData = [];
  for (const res of fetchRes) {
    const docs = res.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      type: doc.data().sender === uid ? "debit" : "credit",
    }) as UserTransaction);
    allData.push(...docs);
  }

  const transactions = allData
    .sort((a, b) => new Date(b.timestamp as Date).getTime() - new Date(a.timestamp as Date).getTime());

  res.status(200).send(transactions);
});

export const sendMoney = onRequest(async (req, res) => {
  if (!isAuthorized(req, res)) return;

  // TODO: Check if the user is the owner of the wallet
  // TODO: Check if the receiver is a valid user
  // TODO: Check if the amount is valid
  // TODO: Check if the comment is valid
  // TODO: Check if the sender has enough balance
  // TODO: Check if the receiver is not the sender

  const { title, sender, receiver, amount, comment } = req.body;

  const walletsCollection = firestore.collection("wallets");
  const transactionsCollection = firestore.collection("transactions");

  await firestore.runTransaction(async (transaction) => {
    const senderWallet = await transaction.get(walletsCollection.doc(sender));
    const receiverWallet = await transaction.get(walletsCollection.doc(receiver));

    if (!senderWallet.exists || !receiverWallet.exists) {
      logger.error("User attempted to send money with invalid wallets", { sender, receiver });
      res.status(500).send("Error getting wallets");
      return;
    }

    const senderData = senderWallet.data() as Wallet;

    if (senderData.balance < amount) {
      logger.error("User attempted to send money with insufficient balance", { sender, receiver, amount });
      res.status(400).send("Insufficient balance");
      return;
    }

    transaction.update(walletsCollection.doc(sender), {
      balance: FieldValue.increment(-amount),
    });

    transaction.update(walletsCollection.doc(receiver), {
      balance: FieldValue.increment(amount),
    });
  });

  await transactionsCollection.add({
    title,
    sender,
    amount,
    comment,
    receiver,
    timestamp: FieldValue.serverTimestamp(),
  });

  res.status(200).send("Money sent successfully");
});

export const checkIfUserCanPay = onRequest(async (req, res) => {
  if (!isAuthorized(req, res)) return;

  // TODO: Check if the user is the owner of the wallet
  // TODO: Check if the amount is valid

  const { uid, amount } = req.body;

  const wallet = await firestore.collection("wallets").doc(uid).get();
  if (!wallet.exists) {
    logger.error("User attempted to check if can pay with invalid wallet", { uid, amount });
    res.status(400).send("Wallet not found");
    return;
  }

  const walletData = wallet.data() as Wallet;
  const canPay = walletData.balance >= amount;

  if (!canPay) {
    logger.error("User attempted to check if can pay with insufficient balance", { uid, amount });
  }

  res.status(200).send(canPay);
});

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || "";

const isValidEvent = (req: Request) => {
  const hash = crypto.createHmac("sha512", PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(req.body))
    .digest("hex");

  return hash === req.headers["x-paystack-signature"];
};

export const handlePaystackWebhook = onRequest(async (req, res) => {
  const { body } = req;

  if (!isValidEvent(req)) {
    logger.error("Invalid paystack event", body);
    res.status(400).send("Invalid event");
    return;
  }

  if (body.event !== "charge.success") {
    logger.error("Invalid event type", body);
    res.status(400).send("Invalid event type");
    return;
  }

  const { data } = body;
  const transaction = await admin.database().ref("transactions").child(data.reference).get();

  if (!transaction.exists) {
    logger.error("Transaction not found", data);
    res.status(404).send("Transaction not found");
    return;
  }

  const transactionData = transaction.toJSON() as InitializedTransaction;

  const userDoc = await firestore.collection("users").doc(transactionData.sender).get();
  if (!userDoc.exists) {
    logger.error("User not found", transactionData);
    res.status(400).send("User not found");
    return;
  }

  await firestore.collection("wallets").doc(transactionData.sender).update({
    balance: FieldValue.increment(data.amount / 100),
  });

  const resData = {
    sender: "paystack",
    title: "Fund Wallet",
    amount: data.amount / 100,
    timestamp: new Date(),
    metadata: {
      transactionId: data.id,
    },
    comment: "Fund wallet via paystack",
    receiver: transactionData.sender,
  } satisfies Transaction;

  await transaction.ref.remove();
  await firestore.collection("transactions").doc(data.reference).set(resData);
  res.status(200).send("Transaction successful");
});

export const PassengerPayDriverForRide = (passengerId: string, driverId: string, amount: number, rideId: string) => {
  logger.info("Passenger paying driver for ride", { passengerId, driverId, amount, rideId });

  const walletsCollection = firestore.collection("wallets");
  const transactionsCollection = firestore.collection("transactions");

  return firestore.runTransaction(async (transaction) => {
    const driverWallet = await transaction.get(walletsCollection.doc(driverId));
    const passengerWallet = await transaction.get(walletsCollection.doc(passengerId));

    if (!passengerWallet.exists || !driverWallet.exists) {
      logger.error("User attempted to pay driver with invalid wallets", { passengerId, driverId });
      throw new Error("User attempted to pay driver with invalid wallets");
    }

    const passengerData = passengerWallet.data() as Wallet;

    if (passengerData.balance < amount) {
      logger.error("User attempted to pay driver with insufficient balance", { passengerId, driverId, amount });
      throw new Error("User attempted to pay driver with insufficient balance");
    }

    transaction.update(walletsCollection.doc(passengerId), {
      balance: FieldValue.increment(-amount),
    });

    transaction.update(walletsCollection.doc(driverId), {
      balance: FieldValue.increment(amount),
    });

    await transactionsCollection.add({
      title: "Ride Payment",
      sender: passengerId,
      amount,
      receiver: driverId,
      timestamp: FieldValue.serverTimestamp(),
      metadata: {
        rideId,
      },
    } satisfies Transaction);
  });
}