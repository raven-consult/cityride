import React from "react";

import { View, StyleSheet } from "react-native";

import { Image } from "expo-image";
import { useRouter } from "expo-router";

import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

import BrandIcon from "@/assets/images/branding/logo.png";


const Home = (): JSX.Element => {
  const router = useRouter();

  React.useEffect(() => {
    const subscriber = auth()
      .onAuthStateChanged((user: FirebaseAuthTypes.User | null) => {
        if (user) {
          setTimeout(() => {
            router.replace("/(app)/home");
          }, 500);

        } else {
          setTimeout(() => {
            router.replace("/(onboarding)");
          }, 500);
        }
      });
    return () => subscriber();
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
