import React from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";

import { Image } from "expo-image";

import CloseIcon from "@/assets/icons/close.svg";


interface DriverBottomBarProps {
  clearRide: () => void;
  isPendingRide: boolean;
  onPressScanQRCode: () => void;
}

const DriverBottomBar = ({ isPendingRide, clearRide, onPressScanQRCode }: DriverBottomBarProps): JSX.Element => {

  return (
    <View style={styles.ctaSection}>
      <Pressable onPress={clearRide} style={{ borderRadius: 8, padding: 8, borderWidth: 1, borderColor: "black" }}>
        <Image
          source={CloseIcon}
          style={{
            width: 38,
            height: 38,
          }}
        />
      </Pressable>
      <Pressable
        onPress={onPressScanQRCode}
        style={{ borderRadius: 8, flex: 1, padding: 16, alignItems: "center", backgroundColor: "black" }}>
        <Text style={textStyles.boardRideText}>Scan QR Code</Text>
      </Pressable>
      <Pressable
        // onPress={boardRide}
        style={{ borderRadius: 8, flex: 1, padding: 16, alignItems: "center", backgroundColor: "black" }}>
        <Text style={textStyles.boardRideText}>Cancel Ride</Text>
      </Pressable>
    </View>
  );
};


export default DriverBottomBar;


const textStyles = StyleSheet.create({
  mainText: {
    fontSize: 28,
    fontFamily: "DMSans-Bold",
  },
  itenaryText: {
    fontSize: 12,
    fontFamily: "DMSans-Regular",
  },
  rideDetailTitle: {
    fontSize: 13,
    color: "hsl(0, 0%, 29%)",
    fontFamily: "DMSans-Regular",
  },
  rideDetailValue: {
    fontSize: 18,
    fontFamily: "DMSans-Bold",
    color: "hsl(0, 0%, 29%)",
  },
  boardRideText: {
    fontSize: 16,
    color: "white",
    fontFamily: "DMSans-Regular",
  }
});


const styles = StyleSheet.create({
  container: {
    gap: 8,
    borderTopWidth: 1,
    borderColor: "hsl(0, 0%, 90%)",
  },
  header: {
    padding: 16,
    alignItems: "center",
    justifyContent: "space-between",
  },
  rideDetailsGrid: {
    flexDirection: "row",
    borderTopWidth: 0.7,
    borderBottomWidth: 0.7,
    justifyContent: "space-between",
    borderColor: "hsl(0, 0%, 90%)",
  },
  ctaSection: {
    gap: 10,
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  rideDetailsItemContainer: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    borderRightWidth: 0.7,
    borderColor: "hsl(0, 0%, 90%)",
  },
});