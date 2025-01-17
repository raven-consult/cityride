import { UserData } from "@/types";
import firestore from "@react-native-firebase/firestore";


export const getUserInfo = async (userId: string): Promise<UserData | null> => {
  const collection = firestore().collection("users");

  const userDoc = await collection.doc(userId).get();
  if (!userDoc.exists) {
    return null;
  }

  return userDoc.data() as UserData;
}