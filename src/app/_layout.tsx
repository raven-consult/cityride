import React from "react";

import { Stack } from "expo-router/stack";
import * as SplashScreen from "expo-splash-screen";

import auth from "@react-native-firebase/auth";
import database from "@react-native-firebase/database";
import firestore from "@react-native-firebase/firestore";
import analytics from "@react-native-firebase/analytics";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

import useDMSans from "@/design/fonts/DM_Sans";


SplashScreen.preventAutoHideAsync();


const RootLayout = (): JSX.Element => {
  const [loaded] = useDMSans();

  React.useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

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
      <Stack screenOptions={{
        animation: "fade",
        headerShown: false,
        statusBarStyle: "dark",
        contentStyle: { backgroundColor: "white" },
      }}>
        <Stack.Screen
          name="(app)"
          options={{
            statusBarStyle: "dark",
          }}
        />
        <Stack.Screen name="(onboarding)" />
      </Stack>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
