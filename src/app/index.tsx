import React from "react";

import { useRouter } from "expo-router";

import { View, StyleSheet, ActivityIndicator } from "react-native";


const Home = (): JSX.Element => {
  const router = useRouter();

  React.useEffect(() => {
    setTimeout(() => {
      router.replace("/(onboarding)");
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
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