import React from "react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router/stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";

import RideProvider from "@/context/ride";
import RideInfo from "@/components/RideInfo";
import useDMSans from "@/design/fonts/DM_Sans";


// SplashScreen.preventAutoHideAsync();


const RootLayout = (): JSX.Element => {
  const [loaded] = useDMSans();

  // @ts-ignore
  const [iconsLoaded] = useFonts([Feather.font, Ionicons.font]);

  // React.useEffect(() => {
  //   if (loaded && iconsLoaded) {
  //     SplashScreen.hideAsync();
  //   }
  // }, [loaded, iconsLoaded]);

  return (
    <GestureHandlerRootView>
      <RideProvider>
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
      </RideProvider>
    </GestureHandlerRootView>
  );
};


export default RootLayout;