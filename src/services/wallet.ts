import auth from "@react-native-firebase/auth";

import { getUrl } from "@/utils";
import { Transaction, Wallet } from "@/types";


export const getLastTransactions = async (userId: string): Promise<Transaction[]> => {
  const url = getUrl("wallet-getLastTransactions");
  const authToken = await auth().currentUser?.getIdToken();
  const req = { userId };

  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(req),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.log("Error", text);
    throw new Error(text);
  }

  const data = await res.json();
  return data;
};


export const getWallet = async (userId: string): Promise<Wallet> => {
  const url = getUrl("wallet-getWallet");
  const authToken = await auth().currentUser?.getIdToken();
  const req = { userId };

  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(req),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.log("Error", text);
    throw new Error(text);
  }

  const data = await res.json();
  return data;
}

const allTransactions: Transaction[] = [
  {
    id: "tx-001",
    title: "Ride to Downtown",
    sender: "John Doe",
    receiver: "CityRide Corp",
    amount: 25.50,
    timestamp: new Date("2024-03-10T09:30:00"),
    type: "credit",
    comment: "Morning commute"
  },
  {
    id: "tx-002",
    title: "Driver Payout",
    sender: "CityRide Corp",
    receiver: "Alice Smith",
    amount: 150.75,
    timestamp: new Date("2024-03-11T16:45:00"),
    type: "debit"
  },
  {
    id: "tx-003",
    title: "Airport Transfer",
    sender: "Bob Wilson",
    receiver: "CityRide Corp",
    amount: 75.00,
    timestamp: new Date("2024-03-12T13:15:00"),
    type: "credit"
  },
  {
    id: "tx-004",
    title: "Weekly Driver Bonus",
    sender: "CityRide Corp",
    receiver: "Charlie Brown",
    amount: 200.00,
    timestamp: new Date("2024-03-13T18:00:00"),
    type: "debit",
    comment: "Performance bonus"
  },
  {
    id: "tx-005",
    title: "Late Night Ride",
    sender: "Diana Prince",
    receiver: "CityRide Corp",
    amount: 35.25,
    timestamp: new Date("2024-03-14T23:20:00"),
    type: "credit"
  },
  {
    id: "tx-006",
    title: "Maintenance Payout",
    sender: "CityRide Corp",
    receiver: "AutoFix Services",
    amount: 450.00,
    timestamp: new Date("2024-03-15T11:00:00"),
    type: "debit"
  },
  {
    id: "tx-007",
    title: "Group Ride",
    sender: "Eve Anderson",
    receiver: "CityRide Corp",
    amount: 45.80,
    timestamp: new Date("2024-03-15T20:30:00"),
    type: "credit",
    comment: "Split fare ride"
  }
];
