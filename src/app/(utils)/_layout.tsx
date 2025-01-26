import React from "react";
import { Pressable } from "react-native";

import { Octicons } from "@expo/vector-icons";

import { Stack, useRouter } from "expo-router";
import { getHeaderTitle } from "@react-navigation/elements";

import ExtendedAppBar from "@/components/ExtendedAppBar";


const Layout = (): JSX.Element => {
  return (
    <Stack screenOptions={{
      contentStyle: {
        backgroundColor: "white",
      },
      statusBarStyle: "dark",
    }}>
      <Stack.Screen
        name="notifications"
        options={{
          title: "Notifications",
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
        name="ride-ticket"
        options={{
          title: "Ride Ticket",
          headerLeft: ({ tintColor }) => {
            const router = useRouter();
            const onPressBack = () => router.back();
            return (
              <Pressable onPress={onPressBack} style={{ marginLeft: 10 }}>
                <Octicons name="chevron-left" size={30} color={tintColor} />
              </Pressable>
            );
          },
          headerTitleStyle: {
            fontFamily: "DMSans-SemiBold",
          },
          headerTitleAlign: "center",
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: "white",
          }
        }}
      />
      <Stack.Screen
        name="capture-qrcode"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  )
};


export default Layout;