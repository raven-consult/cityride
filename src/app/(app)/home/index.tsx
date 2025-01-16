import React from "react";

import { View, Text, StyleSheet } from "react-native";

import { StatusBar } from "expo-status-bar";

import AppBar from "@/components/AppBar";

import BottomSheet from "@/components/BottomSheet";


const Home = (): JSX.Element => {

  return (
    <View style={styles.container}>
      <StatusBar style="dark" translucent />
      <AppBar />
      <Text>Home</Text>

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