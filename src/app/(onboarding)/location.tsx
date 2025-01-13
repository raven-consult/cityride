import React from "react";

import { View, Text, StyleSheet, Pressable, TextInput, Keyboard } from "react-native";

import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";

import LocationImg from "@/assets/images/static/location.svg";


const Location = (): JSX.Element => {
  const [isFocused, setIsFocused] = React.useState<boolean>(false);

  React.useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (event) => {
      setIsFocused(true);
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", (event) => {
      setIsFocused(false);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    }
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="white" translucent={false} />
      <View style={styles.mainContentContainer}>
        <View style={{ gap: 8 }}>

          <View style={{ alignItems: "center", flexDirection: "row", gap: 8 }}>
            <Image
              source={LocationImg}
              style={{
                width: 120,
                height: 120,
              }}
            />
          </View>
          <Text style={[textStyles.descriptionText, { width: "80%" }]}>
            Please give us location access
            Please give us location access abeg...
          </Text>
        </View>
      </View>
      <Pressable style={{
        padding: 16,
        borderRadius: 8,
        alignItems: "center",
        backgroundColor: "black",
        justifyContent: "center",
      }}>
        <Text style={textStyles.ctaText}>Grant Permission</Text>
      </Pressable>
    </View>
  );
};


export default Location;

const textStyles = StyleSheet.create({
  nairaText: {
    fontSize: 48,
    fontFamily: "DMSans-Regular",
  },
  textInput: {
    fontSize: 48,
    fontFamily: "DMSans-Regular",
  },
  ctaText: {
    fontSize: 16,
    color: "white",
    fontFamily: "DMSans-Regular",
  },
  descriptionText: {
    fontSize: 14,
    fontFamily: "DMSans-Regular",
  }
});


const styles = StyleSheet.create({
  container: {
    gap: 8,
    flex: 1,
    paddingTop: 48,
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  mainContentContainer: {
    gap: 32,
  },
});