import database from "@react-native-firebase/database";

export const initializeTransaction = async (uid: string, txref: string) => {
  const ref = database().ref("transactions").child(txref);
  await ref.set({
    sender: uid,
    initialized: true,
    date: database.ServerValue.TIMESTAMP,
  });
};