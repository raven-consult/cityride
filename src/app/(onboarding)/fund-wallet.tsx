import React from "react";

import { View, Text, StyleSheet, Pressable, TextInput, Keyboard } from "react-native";

import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";

import EditIcon from "@/assets/icons/edit.svg";


const FundWallet = (): JSX.Element => {
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
            <Text style={textStyles.nairaText}>₦</Text>
            <TextInput
              placeholder="00.00"
              keyboardType="numeric"
              style={[textStyles.textInput]}
            />
            {!isFocused && (
              <Image
                source={EditIcon}
                style={{
                  width: 24,
                  height: 24,
                  tintColor: "black",
                }}
              />
            )}
          </View>
          <Text style={[textStyles.descriptionText, { width: "80%" }]}>
            Get 100% discount on transaction fees
            for your first deposit
          </Text>
        </View>
        <Pressable style={{
          padding: 16,
          borderRadius: 8,
          width: "50%",
          alignItems: "center",
          backgroundColor: "black",
          justifyContent: "center",
        }}>
          <Text style={textStyles.ctaText}>Checkout</Text>
        </Pressable>
      </View>
    </View>
  );
};


export default FundWallet;

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
    paddingTop: 48,
    paddingHorizontal: 16,
  },
  mainContentContainer: {
    gap: 32,
  },
});