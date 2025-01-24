import React from "react";
import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";

import { useFormik } from "formik";


const EditProfile = (): JSX.Element => {
  const formik = useFormik({
    initialValues: {
      fullName: "",
      emailAddress: "",
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.textContainer}>
          <Text style={textStyles.inputText}>Full Name</Text>
          <TextInput
            placeholder="Jane Doe"
            style={styles.textInput}
            value={formik.values.fullName}
            onChangeText={formik.handleChange("fullName")}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={textStyles.inputText}>Email Address</Text>
          <TextInput
            style={styles.textInput}
            placeholder="info@gmail.com"
            keyboardType="email-address"
            value={formik.values.emailAddress}
            onChangeText={formik.handleChange("emailAddress")}
          />
        </View>
      </View>

      <View>
        <Pressable
          style={styles.submitButton}
          onPress={() => formik.handleSubmit()}
        >
          <Text style={textStyles.submitBtn}>Submit</Text>
        </Pressable>
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
  submitBtn: {
    fontSize: 16,
    color: "white",
    fontFamily: "DMSans-Regular",
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  textContainer: {
    gap: 6,
  },
  formContainer: {
    gap: 16,
  },
  submitButton: {
    borderRadius: 8,
    alignItems: "center",
    paddingVertical: 16,
    backgroundColor: "black",
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