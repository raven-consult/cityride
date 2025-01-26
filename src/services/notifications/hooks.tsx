import React from "react";

import * as Notifications from "expo-notifications";

import { registerForPushNotificationsAsync } from "./utils";

export const useNotifications = () => {
  const [expoPushToken, setExpoPushToken] = React.useState("");
  const [notification, setNotification] = React.useState<Notifications.Notification | undefined>(
    undefined
  );

  const responseListener = React.useRef<Notifications.Subscription>();
  const notificationListener = React.useRef<Notifications.Subscription>();

  React.useEffect(() => {
    registerForPushNotificationsAsync()
      .then(token => setExpoPushToken(token ?? ""))
      .catch((error: any) => setExpoPushToken(`${error}`));

    notificationListener.current = Notifications
      .addNotificationReceivedListener(notification => {
        setNotification(notification);
      });

    responseListener.current = Notifications
      .addNotificationResponseReceivedListener(response => {
        console.log(response);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return { expoPushToken, notification };
};