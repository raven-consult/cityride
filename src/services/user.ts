import { UserData, DriverInfo } from "@/types";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";


export const getUserInfo = async (userId: string): Promise<UserData | null> => {
  const collection = firestore().collection("users");

  const userDoc = await collection.doc(userId).get();
  if (!userDoc.exists) {
    return null;
  }

  return userDoc.data() as UserData;
}


export const updateDriverInfo = async (userId: string, data: Partial<DriverInfo>) => {
  const doc = firestore().collection("users").doc(userId);

  await doc.set({
    driverInfo: data,
  }, {
    merge: true,
  });
}


export const updateFullName = async (userId: string, fullName: string) => {
  const doc = firestore().collection("users").doc(userId);

  await auth().currentUser?.updateProfile({
    displayName: fullName,
  });

  await doc.set({
    fullName,
  }, {
    merge: true,
  });
};


export const updateEmail = async (userId: string, email: string) => {
  const doc = firestore().collection("users").doc(userId);

  await auth().currentUser?.updateEmail(email);

  await doc.set({
    email,
  }, {
    merge: true,
  });
};