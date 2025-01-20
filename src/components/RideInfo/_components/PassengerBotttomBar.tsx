import React from "react";
import { Pressable, ActivityIndicator, Text, View, StyleSheet } from "react-native";

import { Image } from "expo-image";

import CloseIcon from "@/assets/icons/close.svg";


interface PassengerBottomBarProps {
  clearRide: () => void;
  isPendingRide: boolean;
  hasPendingRide: boolean;
  onPressBoardRide: () => Promise<void>;
}

const PassengerBottomBar = ({ isPendingRide, hasPendingRide, clearRide, onPressBoardRide }: PassengerBottomBarProps): JSX.Element => {
  const [loading, setLoading] = React.useState<string>("");

  const _onPressBoardRide = async () => {
    setLoading("boardRide");
    await onPressBoardRide();
    setLoading("");
  }

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

      {isPendingRide ? (
        <>
          <Pressable
            // onPress={boardRide}
            style={{ borderRadius: 8, flex: 1, padding: 16, alignItems: "center", backgroundColor: "black" }}>
            <Text style={textStyles.boardRideText}>View Ticket</Text>
          </Pressable>
          <Pressable
            // onPress={boardRide}
            style={{ borderRadius: 8, flex: 1, padding: 16, alignItems: "center", backgroundColor: "black" }}>
            <Text style={textStyles.boardRideText}>Cancel Ride</Text>
          </Pressable>
        </>
      ) : (
        <Pressable
          disabled={hasPendingRide}
          onPress={_onPressBoardRide}
          style={[styles.mainButton, { backgroundColor: hasPendingRide ? "hsl(0, 0%, 50%)" : "black" }]}>
          {loading === "boardRide" ? (
            <ActivityIndicator color="white" />
          ) : hasPendingRide ? (
            <Text style={textStyles.boardRideText}>You have a pending ride</Text>
          ) : (
            <Text style={textStyles.boardRideText}>Board Ride</Text>
          )}
        </Pressable>
      )}
    </View>
  );
};


export default PassengerBottomBar;


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
  mainButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  }
});