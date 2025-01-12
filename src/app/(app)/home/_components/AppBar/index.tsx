import React from "react";

import { View, Text, StatusBar, StyleSheet } from "react-native";

import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";

import BellIcon from "@/assets/icons/bell.svg";


const AppBar = (): JSX.Element => {
  return (
    <View style={styles.container}>
      <LinearGradient
        style={{
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          position: "absolute",
        }}
        colors={["rgba(255, 255, 255, 0.9)", "rgba(255, 255, 255, 0.28)"]}
        locations={[0.6, 1]}
      />

      <View style={styles.textContainer}>
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

    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    top: 0,
    left: 0,
    height: 120,
    zIndex: 100,
    width: "100%",
    flexDirection: "row",
    position: "absolute",
    alignItems: "flex-end",
    // paddingTop: (StatusBar.currentHeight || 30) + 10,
  },
  textContainer: {
    width: "100%",
    paddingBottom: 8,
    flexDirection: "row",
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "space-between",
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