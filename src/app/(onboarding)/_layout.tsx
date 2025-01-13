import React from "react";

import { Stack } from "expo-router";


const Layout = (): JSX.Element => {
  return (
    <Stack screenOptions={{
      contentStyle: {
        backgroundColor: "white",
      },
      headerShown: false,
      statusBarStyle: "dark",
      statusBarTranslucent: true,
    }} />
  )
};


export default Layout;