import React from "react";
import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";

import { useFormik } from "formik";


const DriverInformation = (): JSX.Element => {
  const formik = useFormik({
    initialValues: {
      carNumber: "",
      carCapacity: "",
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.textContainer}>
          <Text style={textStyles.inputText}>Car Number</Text>
          <TextInput
            placeholder="KTU 123 AB"
            style={styles.textInput}
            value={formik.values.carNumber}
            onChangeText={formik.handleChange("carNumber")}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={textStyles.inputText}>Car Capacity</Text>
          <TextInput
            placeholder="4"
            style={styles.textInput}
            value={formik.values.carCapacity}
            onChangeText={formik.handleChange("carCapacity")}
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


export default DriverInformation;

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