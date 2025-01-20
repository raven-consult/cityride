import React from "react";

import { View, Text, StyleSheet, Pressable, Alert } from "react-native";

import { Image } from "expo-image";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";

import LocationImg from "@/assets/images/static/location.svg";


const RequestLocation = (): JSX.Element => {
  const router = useRouter();

  const requestPermission = React.useCallback(async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if( status === Location.PermissionStatus.GRANTED) {
      router.replace("/(onboarding)/fund-wallet");
    } else if (status !== Location.PermissionStatus.DENIED) {
      Alert.alert(
        "Location Permission",
        "Please grant location permission to continue",
        [
          {
            text: "OK",
            onPress: () => requestPermission(),
          }
        ]
      );
    }
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="white" translucent={false} />
      <View style={styles.mainContentContainer}>
        <View style={{ gap: 8 }}>

          <View style={{ alignItems: "center", flexDirection: "row", gap: 8 }}>
            <Image
              source={LocationImg}
              style={{
                width: 120,
                height: 120,
              }}
            />
          </View>
          <Text style={[textStyles.descriptionText, { width: "80%" }]}>
            Please give us location access
            Please give us location access abeg...
          </Text>
        </View>
      </View>
      <Pressable
        onPress={requestPermission}
        style={{
          padding: 16,
          borderRadius: 8,
          alignItems: "center",
          backgroundColor: "black",
          justifyContent: "center",
        }}>
        <Text style={textStyles.ctaText}>Grant Permission</Text>
      </Pressable>
    </View>
  );
};


export default RequestLocation;

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
    flex: 1,
    paddingTop: 48,
    paddingBottom: 20,
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  mainContentContainer: {
    gap: 32,
  },
});