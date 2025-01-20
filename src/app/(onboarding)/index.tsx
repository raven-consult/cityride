import React from "react";

import { Text, View, StyleSheet, Pressable } from "react-native";

import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import SplashScreenPng from "@/assets/images/static/splash-screen.png";
import { hasPlayServices, signInAsFakeUser, signInWithGoogle } from "@/services/auth";


const Index = () => {
  const router = useRouter();

  const signIn = React.useCallback(async () => {
    if (hasPlayServices()) {
      await signInWithGoogle();
    } else {
      await signInAsFakeUser();
    }
    router.replace("/(onboarding)/location");
  }, [router]);

  return (
    <View style={styles.container}>
      <Image
        source={SplashScreenPng}
        style={{
          width: "100%",
          height: "100%",
        }}
      />

      <View style={styles.textContainer}>
        <LinearGradient
          style={{
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            position: "absolute",
          }}
          colors={["rgba(56, 56, 56, 0)", "rgba(0, 0, 0, 1)"]}
        />
        <View style={styles.textContent}>
          <View style={{ gap: 8, alignItems: "center", justifyContent: "center" }}>
            <Text style={textStyles.mainText}>
              Find Rides near you across lagos
            </Text>
            <Text style={textStyles.subText}>
              Find Rides near you across lagos
            </Text>
          </View>
          <Pressable style={styles.actionBtn} onPress={signIn}>
            <Text style={textStyles.subText}>Sign in</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default Index;

const textStyles = StyleSheet.create({
  mainText: {
    fontSize: 40,
    color: "white",
    lineHeight: 45,
    textAlign: "center",
    fontFamily: "DMSans-SemiBold",
  },
  subText: {
    fontSize: 16,
    color: "white",
    fontFamily: "DMSans-Regular",
  },
})


const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  textContainer: {
    left: 0,
    bottom: 0,
    width: "100%",
    height: "40%",
    alignItems: "center",
    position: "absolute",
    justifyContent: "flex-end",
  },
  textContent: {
    gap: 32,
    height: "100%",
    width: "100%",
    paddingBottom: 12,
    alignItems: "center",
    paddingHorizontal: 16,
    justifyContent: "flex-end",
  },
  actionBtn: {
    padding: 16,
    width: "100%",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  }
});
