import React from "react";

import { Stack } from "expo-router/stack";
import * as SplashScreen from "expo-splash-screen";

import auth from "@react-native-firebase/auth";
import database from "@react-native-firebase/database";
import firestore from "@react-native-firebase/firestore";
import analytics from "@react-native-firebase/analytics";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

import { GestureHandlerRootView } from "react-native-gesture-handler";


import RideProvider from "@/context/ride";
import InfoProvider from "@/context/info";
import RideInfo from "@/components/RideInfo";
import useDMSans from "@/design/fonts/DM_Sans";
import InfoSheet from "@/components/InfoSheet";
import StationProvider from "@/context/station";
import CreateRide from "@/components/CreateRide";
import CreateRideProvider from "@/context/createRide";


SplashScreen.preventAutoHideAsync();


// if (__DEV__) {
//   const firebaseEmulatorHost = process.env.EXPO_PUBLIC_EMULATOR_HOST || "localhost";

//   console.log("is dev");
//   database().useEmulator(firebaseEmulatorHost, 9000);
//   firestore().useEmulator(firebaseEmulatorHost, 8080);
//   auth().useEmulator(`http://${firebaseEmulatorHost}:9099`);
// }


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
      <RideProvider>
        <StationProvider>
          <CreateRideProvider>
            <InfoProvider>
              <Stack screenOptions={{
                animation: "fade",
                headerShown: false,
                contentStyle: { backgroundColor: "white" },
              }}>
                <Stack.Screen name="(app)" />
                <Stack.Screen name="(onboarding)" />
              </Stack>
              <RideInfo />
              <InfoSheet />
              <CreateRide />
            </InfoProvider>
          </CreateRideProvider>
        </StationProvider>
      </RideProvider>
    </GestureHandlerRootView>
  );
};


export default RootLayout;
