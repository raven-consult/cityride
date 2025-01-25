import React from "react";
import { View, Text, StyleSheet, TextInput, Pressable, ActivityIndicator } from "react-native";

import { useFormik } from "formik";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

import { updateEmail, updateFullName } from "@/services/user";


const EditProfile = (): JSX.Element => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [currentUser, setCurrentUser] = React.useState<FirebaseAuthTypes.User | null>(null);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      emailAddress: "",
    },
    onSubmit: async (values) => {
      if (!currentUser) return null;
      setLoading(true);

      try {
        if (values.emailAddress) {
          await updateEmail(currentUser.uid, values.emailAddress);
        }

        if (values.fullName) {
          await updateFullName(currentUser.uid, values.fullName);
        }
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

      formik.setFieldValue("emailAddress", currentUser.email || "");
      formik.setFieldValue("fullName", currentUser.displayName || "");
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