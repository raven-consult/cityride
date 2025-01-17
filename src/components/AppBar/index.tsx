import React from "react";

import { View, Text, StyleSheet, Pressable } from "react-native";

import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

import { useAppContext } from "@/context/AppContext";

import BellIcon from "@/assets/icons/bell.svg";


const AppBar = (): JSX.Element => {
  const router = useRouter();
  const { pendingRide } = useAppContext();
  const { setCurrentRide } = useAppContext();

  const [currentUser, setCurrentUser] = React.useState<FirebaseAuthTypes.User | null>(null);

  const onPressNotification = () => {
    router.push("/(utils)/notifications");
  };

  const onPressPendingRide = () => {
    if (pendingRide) {
      setCurrentRide(pendingRide);
    }
  }

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
      <LinearGradient
        style={{
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          position: "absolute",
        }}
        colors={["rgba(255, 255, 255, 0.9)", "rgba(255, 255, 255, 0.28)"]}
        locations={[0.6, 1]}
      />

      <View style={styles.mainContainer}>
        <View style={styles.textContainer}>
          <View>
            <Text style={textStyles.greetingText}>Good Morning,</Text>
            <Text style={textStyles.mainText}>{currentUser?.displayName}</Text>
          </View>

          <Pressable onPress={onPressNotification} style={styles.notificationContainer}>
            <Image source={BellIcon} style={{
              width: 24,
              height: 24,
            }} />
          </Pressable>
        </View>
        {pendingRide && (
          <Pressable onPress={onPressPendingRide} style={styles.bannerContainer}>
            <Text style={textStyles.bannerText}>You have a ride scheduled for {pendingRide.metadata.driverArrival} mins from now</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    top: 0,
    left: 0,
    height: 150,
    zIndex: 100,
    width: "100%",
    flexDirection: "row",
    position: "absolute",
    alignItems: "flex-end",
  },
  mainContainer: {
    width: "100%",
  },
  textContainer: {
    paddingBottom: 8,
    flexDirection: "row",
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "space-between",
  },
  notificationContainer: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 50,
    borderColor: "hsl(0, 0%, 95%)",
  },
  bannerContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 3,
    paddingHorizontal: 20,
    backgroundColor: "black",
  }
});

const textStyles = StyleSheet.create({
  greetingText: {
    fontFamily: "DMSans-Regular",
    fontSize: 17,
  },
  mainText: {
    fontSize: 32,
    fontFamily: "DMSans-SemiBold",
  },
  bannerText: {
    fontSize: 14,
    color: "white",
    fontFamily: "DMSans-Regular",
  }
});


export default AppBar;
