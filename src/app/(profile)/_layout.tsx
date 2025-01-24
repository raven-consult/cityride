import React from "react";

import { Stack } from "expo-router/stack";
import { getHeaderTitle } from "@react-navigation/elements";

import ExtendedAppBar from "@/components/ExtendedAppBar";

const Layout = (): JSX.Element => {
  return (
    <Stack screenOptions={{
      statusBarStyle: "dark",
      statusBarTranslucent: false,
      statusBarBackgroundColor: "white",
      contentStyle: { backgroundColor: "white" },
    }}>
      <Stack.Screen
        name="edit-profile"
        options={{
          title: "Edit Profile",
          statusBarTranslucent: false,
          header: ({ navigation, route, options }) => {
            const title = getHeaderTitle(options, route.name)
            return (
              <ExtendedAppBar
                title={title}
                onPressBack={navigation.goBack}
              />
            );
          }
        }}
      />
      <Stack.Screen
        name="driver-information"
        options={{
          title: "Driver Information",
          statusBarTranslucent: false,
          header: ({ navigation, route, options }) => {
            const title = getHeaderTitle(options, route.name)
            return (
              <ExtendedAppBar
                title={title}
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