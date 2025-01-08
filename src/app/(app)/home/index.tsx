import React from "react";

import { View, Text, StatusBar, Pressable, StyleSheet } from "react-native";

import { useRouter } from "expo-router";

import Feather from "@expo/vector-icons/Feather";

import { RideProvider } from "./context";
import BottomSheet from "./_components/BottomSheet";


const Home = (): JSX.Element => {
  const router = useRouter();

  const onPressMenu = () => router.push("/(app)/profile");

  return (
    <RideProvider>
      <View style={styles.container}>
        <StatusBar backgroundColor="transparent" />
        <View style={styles.menuContainer}>
          <Pressable onPress={onPressMenu} style={styles.menuButtonContainer}>
            <Feather name="menu" size={24} color="black" />
          </Pressable>
        </View>

        <Text>Home</Text>
        <BottomSheet />
      </View>
    </RideProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red",
  },
  menuContainer: {
    left: 12,
    position: "absolute",
    top: (StatusBar.currentHeight || 32) + 10,
  },
  menuButtonContainer: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: "white",
  }
});


export default Home;