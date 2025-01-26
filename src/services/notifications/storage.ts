import { INotification } from "@/types";

import AsyncStorage from "@react-native-async-storage/async-storage";

const storageKey = "notifications";

export const getAllNotifications = async (): Promise<INotification[]> => {
  const notifications = await AsyncStorage.getItem(storageKey);
  return notifications ? JSON.parse(notifications) : [];
}

export const addNotification = async (notification: INotification): Promise<void> => {
  const notifications = await getAllNotifications();
  notifications.push(notification);
  await AsyncStorage.setItem(
    storageKey,
    JSON.stringify(notifications)
  );
}