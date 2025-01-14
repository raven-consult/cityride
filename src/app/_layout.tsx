import React from "react";

import {Stack} from "expo-router/stack";
import * as SplashScreen from "expo-splash-screen";
import {GestureHandlerRootView} from "react-native-gesture-handler";

import {GoogleSignin} from "@react-native-google-signin/google-signin";

import RideProvider from "@/context/ride";
import InfoProvider from "@/context/info";
import RideInfo from "@/components/RideInfo";
import useDMSans from "@/design/fonts/DM_Sans";
import InfoSheet from "@/components/InfoSheet";


SplashScreen.preventAutoHideAsync();


const RootLayout = (): JSX.Element => {
  const [loaded] = useDMSans();

  React.useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  React.useEffect(() => {
    GoogleSignin.configure({
      offlineAccess: true,
      webClientId: "605211420713-4h2i0fm6fva1ofli724jlm548bk2esfk.apps.googleusercontent.com",
    });
  }, []);

  return (
    <GestureHandlerRootView>
      <RideProvider>
        <InfoProvider>
          <Stack screenOptions={{
            contentStyle: {
              backgroundColor: "white",
            },
            animation: "fade",
            headerShown: false,
            statusBarStyle: "dark",
          }}>
            <Stack.Screen name="(app)" />
            <Stack.Screen name="(onboarding)" />
          </Stack>

          <RideInfo />
          <InfoSheet />
        </InfoProvider>
      </RideProvider>
    </GestureHandlerRootView>
  );
};


export default RootLayout;
