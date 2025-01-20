import React from "react";

import { Image } from "expo-image";
import { Tabs } from "expo-router";

import HomeActiveIcon from "@/assets/icons/navicons/home_active.svg";
import HomeInactiveIcon from "@/assets/icons/navicons/home_inactive.svg";

import ProfileActiveIcon from "@/assets/icons/navicons/user_active.svg";
import ProfileInactiveIcon from "@/assets/icons/navicons/user_inactive.svg";

import CompassActiveIcon from "@/assets/icons/navicons/compass_active.svg";
import CompassInactiveIcon from "@/assets/icons/navicons/compass_inactive.svg";

import RideInfo from "@/components/RideInfo";
import InfoSheet from "@/components/InfoSheet";
import CreateRide from "@/components/CreateRide";
import BottomTabBar from "@/components/BottomTabBar";
import AppContextProvider from "@/context/AppContext";


const Layout = (): JSX.Element => {
  return (
    <AppContextProvider>
      <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <BottomTabBar {...props} />}>
        <Tabs.Screen
          name="discover/index"
          options={{
            title: "Discover",
            tabBarIcon: ({ focused }) => {
              return focused ? (
                <Image source={CompassActiveIcon} style={{
                  width: 32,
                  height: 32
                }} />
              ) : (
                <Image source={CompassInactiveIcon} style={{
                  width: 32,
                  height: 32
                }} />
              )
            }
          }}
        />
        <Tabs.Screen
          name="home/index"
          options={{
            title: "Home",
            headerTransparent: true,
            tabBarIcon: ({ focused }) => {
              return focused ? (
                <Image source={HomeActiveIcon} style={{
                  width: 32,
                  height: 32
                }} />
              ) : (
                <Image source={HomeInactiveIcon} style={{
                  width: 32,
                  height: 32
                }} />
              )
            }
          }}
        />
        <Tabs.Screen
          name="profile/index"
          options={{
            title: "Profile",
            tabBarIcon: ({ focused }) => {
              return focused ? (
                <Image source={ProfileActiveIcon} style={{
                  width: 32,
                  height: 32
                }} />
              ) : (
                <Image source={ProfileInactiveIcon} style={{
                  width: 32,
                  height: 32
                }} />
              )

            }
          }}
        />
      </Tabs>
      <RideInfo />
      <InfoSheet />
      <CreateRide />
    </AppContextProvider>
  );
};


export default Layout;