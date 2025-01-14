import React from "react";

import { Stack } from "expo-router";
import { getHeaderTitle } from "@react-navigation/elements";

import ExtendedAppBar from "@/components/ExtendedAppBar";


const Layout = (): JSX.Element => {
  return (
    <Stack screenOptions={{
      contentStyle: {
        backgroundColor: "white",
      },
      statusBarStyle: "dark",
      statusBarTranslucent: false,
    }}>
      <Stack.Screen
        name="notifications"
        options={{
          title: "Notifications",
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
  )
};


export default Layout;