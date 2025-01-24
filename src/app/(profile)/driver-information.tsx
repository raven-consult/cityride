import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";


const DriverInformation = (): JSX.Element => {
  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.textContainer}>
          <Text style={textStyles.inputText}>Car Number</Text>
          <TextInput
            placeholder="KTU-1234"
            style={styles.textInput}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={textStyles.inputText}>Car Capacity</Text>
          <TextInput
            placeholder="4"
            style={styles.textInput}
          />
        </View>
      </View>
    </View>
  );
};


export default DriverInformation;

const textStyles = StyleSheet.create({
  inputText: {
    fontSize: 14,
    fontFamily: "DMSans-Regular",
  },
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 12,
    paddingHorizontal: 16,
  },
  textContainer: {
    gap: 8,
  },
  formContainer: {
    gap: 12,
  },
  textInput: {
    height: 48,
    fontSize: 15,
    borderRadius: 8,
    borderWidth: 0.7,
    paddingHorizontal: 8,
    fontFamily: "DMSans-Regular",
    borderColor: "hsl(0, 0%, 70%)",
  },
});