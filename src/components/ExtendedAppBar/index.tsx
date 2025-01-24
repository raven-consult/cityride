import React from "react";

import { View, Text, Pressable, StatusBar, StyleSheet } from "react-native";

import { Image } from "expo-image";

import ArrowLeftIcon from "@/assets/icons/arrow_left.svg";

interface ExtendedAppBarProps {
  title: string;
  leadingText?: string;
  onPressBack: () => void;
}

const ExtendedAppBar = ({ title, leadingText, onPressBack }: ExtendedAppBarProps): JSX.Element => {
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
          <Text style={textStyles.leadingText}>{leadingText}</Text>
        ): <></>}
      </View>
      <View>
        <Text style={textStyles.mainText}>{title}</Text>
      </View>
    </View>
  );
};


export default ExtendedAppBar;


const textStyles = StyleSheet.create({
  mainText: {
    fontSize: 36,
    fontFamily: "DMSans-Bold",
  },
  leadingText: {
    fontSize: 16,
    fontFamily: "DMSans-Regular",
  }
})


const styles = StyleSheet.create({
  container: {
    gap: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: "flex-end",
    height: (StatusBar.currentHeight || 30) + 96,
  }
});