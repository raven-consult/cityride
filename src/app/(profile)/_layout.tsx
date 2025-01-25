import React from "react";

import { useRouter } from "expo-router";
import { Pressable } from "react-native";
import { Stack } from "expo-router/stack";
import { getHeaderTitle } from "@react-navigation/elements";

import Octicons from "@expo/vector-icons/Octicons";

import ExtendedAppBar from "@/components/ExtendedAppBar";


const Layout = (): JSX.Element => {
  return (
    <Stack screenOptions={{
      animation: "fade",
      statusBarStyle: "dark",
      statusBarBackgroundColor: "white",
      contentStyle: { backgroundColor: "white" },
    }}>
      <Stack.Screen
        name="edit-profile"
        options={{
          title: "Edit Profile",
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
        name="wallet"
        options={{
          title: "Wallet",
          statusBarStyle: "dark",
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
        name="fund-wallet"
        options={{
          title: "Fund Wallet",
          statusBarStyle: "dark",
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
        name="faq"
        options={{
          title: "FAQs",
          header: ({ navigation, route, options }) => {
            const title = getHeaderTitle(options, route.name);
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
        name="help"
        options={{
          title: "Help",
          header: ({ navigation, route, options }) => {
            const title = getHeaderTitle(options, route.name);
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