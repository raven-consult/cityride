import React from "react";

import { Stack } from "expo-router/stack";
import * as TaskManager from "expo-task-manager";
import * as Notifications from "expo-notifications";

import auth from "@react-native-firebase/auth";
import database from "@react-native-firebase/database";
import firestore from "@react-native-firebase/firestore";
import analytics from "@react-native-firebase/analytics";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

import { ExpoNotification } from "@/types";
import useDMSans from "@/design/fonts/DM_Sans";
import AppContextProvider from "@/context/AppContext";
import { addNotification } from "@/services/notifications";

const NOTIFICATION_RECEIVED_TASK = "notification-received";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldSetBadge: true,
    shouldShowAlert: true,
    shouldPlaySound: true,
  }),
});

type NotificationReceivedTaskData = { notification: ExpoNotification };
TaskManager.defineTask<NotificationReceivedTaskData>(NOTIFICATION_RECEIVED_TASK, async ({ data, error }) => {
  if (error) {
    console.error(error);
    return;
  }

  if (data) {
    const notification = data.notification as ExpoNotification;
    const sentTime = new Date(notification.sentTime);
    const { title, body } = notification.data;
    await addNotification({
      title,
      description: body,
      date: new Date(sentTime),
    });
  }
});
Notifications.registerTaskAsync(NOTIFICATION_RECEIVED_TASK);


const RootLayout = (): JSX.Element => {
  const [loaded] = useDMSans();

  React.useEffect(() => {
    (async () => {
      await analytics().setConsent({
        ad_storage: true,
        ad_user_data: true,
        analytics_storage: true,
        ad_personalization: true,
      });
      if (__DEV__) {
        await analytics().setAnalyticsCollectionEnabled(false);
      } else {
        await analytics().setAnalyticsCollectionEnabled(true);
      }
    })();
  }, []);

  React.useEffect(() => {
    GoogleSignin.configure({
      offlineAccess: true,
      webClientId: "605211420713-4h2i0fm6fva1ofli724jlm548bk2esfk.apps.googleusercontent.com",
    });
  }, []);

  return (
    <GestureHandlerRootView>
      <AppContextProvider>
        <Stack
          screenOptions={{
            animation: "fade",
            headerShown: false,
            statusBarStyle: "dark",
            statusBarTranslucent: true,
            contentStyle: {
              backgroundColor: "white"
            },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(app)" />
          <Stack.Screen name="(onboarding)" />
        </Stack>
      </AppContextProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
