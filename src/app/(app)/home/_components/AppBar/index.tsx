import React from "react";

import { View, Text, StatusBar, StyleSheet } from "react-native";

import { Image } from "expo-image";

import BellIcon from "@/assets/icons/bell.svg";

const AppBar = (): JSX.Element => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={textStyles.greetingText}>Good Morning,</Text>
        <Text style={textStyles.mainText}>John Doe</Text>
      </View>

      <View style={styles.notificationContainer}>
        <Image source={BellIcon} style={{
          width: 24,
          height: 24,
        }} />
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    top: 0,
    left: 0,
    zIndex: 100,
    width: "100%",
    position: "absolute",
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "white",
    justifyContent: "space-between",
    paddingTop: (StatusBar.currentHeight || 30) + 10,
  },
  notificationContainer: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 50,
    borderColor: "hsl(0, 0%, 95%)",
  }
});

const textStyles = StyleSheet.create({
  greetingText: {
    fontFamily: "DMSans-Regular",
    fontSize: 17,
  },
  mainText: {
    fontSize: 32,
    fontFamily: "DMSans-SemiBold",
  }
});


export default AppBar;