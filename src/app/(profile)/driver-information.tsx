import React from "react";
import { View, Text, StyleSheet, TextInput, Pressable, ActivityIndicator } from "react-native";

import { useFormik } from "formik";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

import { getUserInfo, updateDriverInfo } from "@/services/user";


const DriverInformation = (): JSX.Element => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [currentUser, setCurrentUser] = React.useState<FirebaseAuthTypes.User | null>(null);

  const formik = useFormik({
    initialValues: {
      carNumber: "",
      maxPassengers: "",
    },
    onSubmit: async (values) => {
      if (!currentUser) return null;
      setLoading(true);

      try {
        await updateDriverInfo(
          currentUser.uid,
          {
            carNumber: values.carNumber,
            maxPassengers: parseInt(values.maxPassengers),
          },
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
  });

  React.useEffect(() => {
    (async () => {
      if (!currentUser) return null;

      const user = await getUserInfo(currentUser.uid);
      formik.setFieldValue("carNumber", user?.driverInfo?.carNumber || "");
      formik.setFieldValue("maxPassengers", user?.driverInfo?.maxPassengers.toString() || "");
    })();
  }, [currentUser]);

  React.useEffect(() => {
    const subscriber = auth()
      .onAuthStateChanged((user: FirebaseAuthTypes.User | null) => {
        if (user) {
          setCurrentUser(user);
        }
      });
    return () => subscriber();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.textContainer}>
          <Text style={textStyles.inputText}>Car Number</Text>
          <TextInput
            placeholder="KTU-123-AB"
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
            value={formik.values.maxPassengers}
            onChangeText={formik.handleChange("maxPassengers")}
          />
        </View>
      </View>

      <View>
        <Pressable
          style={styles.submitButton}
          onPress={() => formik.handleSubmit()}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={textStyles.submitBtn}>Submit</Text>
          )}
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