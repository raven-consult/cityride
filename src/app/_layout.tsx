import React from "react";

import "react-native-reanimated";

import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";

import useDMSans from "@/design-system/fonts/DM_Sans";


SplashScreen.preventAutoHideAsync();


const RootLayout = (): JSX.Element => {
  const [loaded] = useDMSans();

  // @ts-ignore
  const [iconsLoaded] = useFonts([Feather.font, Ionicons.font]);

  React.useEffect(() => {
    if (loaded && iconsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded, iconsLoaded]);

  return (
    <GestureHandlerRootView>
      <Stack screenOptions={{
        contentStyle: {
          backgroundColor: "white",
        },
        animation: "fade",
        headerShown: false,
        statusBarHidden: false,
        navigationBarHidden: false,
        statusBarTranslucent: true,
      }} />
    </GestureHandlerRootView>
  );
};


export default RootLayout;