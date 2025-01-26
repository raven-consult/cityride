import React from "react";

import { Stack } from "expo-router";
import { getHeaderTitle } from "@react-navigation/elements";

import ExtendedAppBar from "@/components/ExtendedAppBar";


const Layout = (): JSX.Element => {
  return (
    <Stack screenOptions={{
      statusBarTranslucent: true,
      contentStyle: { backgroundColor: "white" },
    }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="fund-wallet"
        options={{
          title: "Fund Wallet",
          header: ({ navigation, route, options }) => {
            const title = getHeaderTitle(options, route.name)
            return (
              <ExtendedAppBar
                title={title}
                leadingText="Skip for Now"
                onPressBack={navigation.goBack}
              />
            );
          }
        }}
      />
      <Stack.Screen
        name="location"
        options={{
          title: "Location Access",
          statusBarTranslucent: true,
          header: ({ navigation, route, options }) => {
            const title = getHeaderTitle(options, route.name)
            return (
              <ExtendedAppBar
                title={title}
                leadingText="Skip for Now"
                onPressBack={navigation.goBack}
              />
            );
          }
        }}
      />
    </Stack>
  );
};


export default Layout;