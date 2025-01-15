import React from "react";

import { View, Text, Pressable, StatusBar, StyleSheet } from "react-native";

import { Image } from "expo-image";

import ArrowLeftIcon from "@/assets/icons/arrow_left.svg";

interface HeaderProps {
  leadingText: string;
  onPressBack: () => void;
  onPressNext: () => void;
}

const Header = ({ leadingText, onPressBack, onPressNext }: HeaderProps): JSX.Element => {
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Pressable onPress={onPressBack}>
          <Image
            source={ArrowLeftIcon}
            style={{ width: 20, height: 20 }}
          />
        </Pressable>
        {leadingText ? (
          <Pressable onPress={onPressNext}>
            <Text style={textStyles.leadingText}>{leadingText}</Text>
          </Pressable>
        ) : <></>}
      </View>
      <View>
        <Text style={textStyles.mainText}>Create Ride</Text>
      </View>
    </View>
  );
};


export default Header;


const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    gap: 12,
    zIndex: 100,
    width: "100%",
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "white",
    justifyContent: "flex-end",
    paddingTop: (StatusBar.currentHeight || 30) + 30,
  },
});



const textStyles = StyleSheet.create({
  mainText: {
    fontSize: 36,
    fontFamily: "DMSans-Bold",
  },
  leadingText: {
    fontSize: 16,
    fontFamily: "DMSans-Regular",
  }
});