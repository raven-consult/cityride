import React from "react";

import { Image } from "expo-image";
import { useRouter } from "expo-router";

import BrandIcon from "@/assets/images/branding/logo.png";

import { StatusBar } from "expo-status-bar";
import { View, StyleSheet } from "react-native";


const Home = (): JSX.Element => {
  const router = useRouter();

  React.useEffect(() => {
    setTimeout(() => {
      router.replace("/(onboarding)");
      // router.replace("/(app)/home");
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <Image contentFit="contain" source={BrandIcon} style={{
        width: 200,
        height: 200,
      }} />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    justifyContent: "center",
  }
});


export default Home;