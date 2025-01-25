import React from "react";
import { View, Text, StyleSheet, Pressable, Linking } from "react-native";

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const Discover = (): JSX.Element => {

  const onPressWhatsapp = () => {
    Linking.openURL("https://chat.whatsapp.com/EEaFWHxuDcA1J8qMJUFaQG");
  }

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={textStyles.mainText}>Thank you for Downloading this app</Text>
        <Text style={textStyles.leadingText}>Please join our community on Whatsapp</Text>
      </View>

      <Pressable
        onPress={onPressWhatsapp}
        style={styles.joinWhatsappBtn}
      >
        <FontAwesome6 name="whatsapp" size={20} color="green" />
        <Text style={textStyles.joinGroupBtn}>WhatsApp</Text>
      </Pressable>
    </View>
  );
};


export default Discover;

const textStyles = StyleSheet.create({
  mainText: {
    fontSize: 30,
    textAlign: "center",
    fontFamily: "DMSans-SemiBold",
  },
  leadingText: {
    fontSize: 15,
    fontFamily: "DMSans-Regular",
  },
  joinGroupBtn: {
    fontSize: 13,
    fontFamily: "DMSans-Regular",
  }
});


const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    alignItems: "center",
    backgroundColor: "white",
    justifyContent: "center",
  },
  textContainer: {
    gap: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  joinWhatsappBtn: {
    gap: 6,
    padding: 8,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "hsl(0, 0%, 90%)",
  }
});