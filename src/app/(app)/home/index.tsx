import React from "react";

import { View, StyleSheet } from "react-native";

import { StatusBar } from "expo-status-bar";

import AppBar from "@/components/AppBar";
import MapView from "@/components/MapView";
import BottomSheet from "@/components/BottomSheet";


const Home = (): JSX.Element => {

  return (
    <View style={styles.container}>
      <StatusBar style="dark" translucent />
      <AppBar />
      <MapView />
      <BottomSheet />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "gray",
  },
});


export default Home;
