import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";


const EditProfile = (): JSX.Element => {
  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.textContainer}>
          <Text style={textStyles.inputText}>Full Name</Text>
          <TextInput
            placeholder="Jane Doe"
            style={styles.textInput}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={textStyles.inputText}>Email Address</Text>
          <TextInput
            style={styles.textInput}
            placeholder="info@gmail.com"
          />
        </View>
      </View>
    </View>
  );
};


export default EditProfile;

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
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    fontFamily: "DMSans-Regular",
    borderColor: "hsl(0, 0%, 30%)",
  },
});