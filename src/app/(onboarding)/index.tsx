import React from "react";

import { Text, View, StyleSheet, Button } from "react-native";

import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

import Typography from "@/design-system/theme/typography";
import WeddingOnboardingImg from "@/assets/images/wedding-onboarding.jpg";

const strings = {
  title: "City Ride",
  ctaButton: "Get Started",
  description: "City Ride is a ride-sharing app that helps you get around the city with ease.",
}


export default function Index() {
  const router = useRouter();

  const signIn = React.useCallback(async () => {
    router.replace("/(app)/home");
  }, [router]);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Image style={styles.onboardingImg} source={WeddingOnboardingImg} />
      <View style={styles.mainContainer}>
        <View style={styles.textContainer}>
          <Text style={[Typography.mainHeading, styles.mainText]}>
            {strings.title}
          </Text>
          <Text style={[Typography.subHeading, styles.subText]}>
            {strings.description}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button onPress={signIn} title={strings.ctaButton} />
        </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  onboardingImg: {
    width: "100%",
    height: "100%",
  },
  mainContainer: {
    bottom: 0,
    height: "35%",
    width: "100%",
    paddingVertical: 36,
    position: "absolute",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  textContainer: {
    gap: 8,
    width: "85%",
  },
  mainText: {
    color: "white",
    textAlign: "center",
    fontSize: 32,
    fontWeight: "800",
  },
  subText: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    fontFamily: "DMSans-Regular",
  },
  buttonContainer: {
    width: "85%",
  },
});