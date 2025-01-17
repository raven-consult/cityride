import React from "react";

import { View, Text, StyleSheet, Pressable } from "react-native";

import { Image } from "expo-image";

import RNBottomSheet, { BottomSheetBackgroundProps, BottomSheetView } from "@gorhom/bottom-sheet";

import { Info } from "@/types";
import CloseIcon from "@/assets/icons/close.svg";
import { useAppContext } from "@/context/AppContext";


const RideInfo = (): JSX.Element => {
  const { setInfo } = useAppContext();
  const { ride, setCurrentRide } = useAppContext();
  const bottomSheetRef = React.useRef<RNBottomSheet>(null);
  const snapPoints = React.useMemo(() => ["15%", "30%"], []);

  React.useEffect(() => {
    if (ride) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [ride]);

  const clearRide = () => setCurrentRide(null);

  const boardRide = () => {
    clearRide();
    setInfo({} as Info);
  }

  const driverArrival = React.useMemo(() => {
    const arrival = ride?.driverArrival;
    return `${arrival} mins`;
  }, [ride]);

  const itenary = React.useMemo(() => {
    const end = ride?.itenary.end.name;
    const start = ride?.itenary.start.name;
    return `${start} → ${end}`;
  }, [ride]);

  const price = React.useMemo(() => {
    return ride
      ?.price
      .toLocaleString("en-NG", {
        style: "currency",
        currency: "NGN" });
  }, [ride]);

  const maxPassengers = React.useMemo(() => {
    return `${ride?.maxPassengers} seats`;
  }, [ride]);

  return (
    <RNBottomSheet
      index={-1}
      enableDynamicSizing
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      handleComponent={() => null}
      enablePanDownToClose={false}
      backgroundComponent={props => <BottomSheetBackground {...props} />}
    >
      <BottomSheetView style={styles.container}>
        <View style={styles.header}>
          <Text style={textStyles.mainText}>{ride?.id}</Text>
          <Text style={textStyles.itenaryText}>{itenary}</Text>
        </View>

        <View style={styles.rideDetailsGrid}>
          <View style={styles.rideDetailsItemContainer}>
            <Text style={textStyles.rideDetailValue}>{driverArrival}</Text>
            <Text style={textStyles.rideDetailTitle}>Arriving in</Text>
          </View>
          <View style={styles.rideDetailsItemContainer}>
            <Text style={textStyles.rideDetailValue}>{price}</Text>
            <Text style={textStyles.rideDetailTitle}>Price</Text>
          </View>
          <View style={styles.rideDetailsItemContainer}>
            <Text style={textStyles.rideDetailValue}>{maxPassengers}</Text>
            <Text style={textStyles.rideDetailTitle}>Passengers</Text>
          </View>
        </View>

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
            onPress={boardRide}
            style={{ borderRadius: 8, flex: 1, padding: 16, alignItems: "center", backgroundColor: "black" }}>
            <Text style={textStyles.boardRideText}>Board Ride</Text>
          </Pressable>
        </View>
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
            onPress={boardRide}
            style={{ borderRadius: 8, flex: 1, padding: 16, alignItems: "center", backgroundColor: "black" }}>
            <Text style={textStyles.boardRideText}>View Ticket</Text>
          </Pressable>
          <Pressable
            onPress={boardRide}
            style={{ borderRadius: 8, flex: 1, padding: 16, alignItems: "center", backgroundColor: "black" }}>
            <Text style={textStyles.boardRideText}>Cancel Ride</Text>
          </Pressable>
        </View>
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
            onPress={boardRide}
            style={{ borderRadius: 8, flex: 1, padding: 16, alignItems: "center", backgroundColor: "black" }}>
            <Text style={textStyles.boardRideText}>Scan QR Code</Text>
          </Pressable>
          <Pressable
            onPress={boardRide}
            style={{ borderRadius: 8, flex: 1, padding: 16, alignItems: "center", backgroundColor: "black" }}>
            <Text style={textStyles.boardRideText}>Cancel Ride</Text>
          </Pressable>
        </View>
      </BottomSheetView>
    </RNBottomSheet>
  );
};


export default RideInfo;


const BottomSheetBackground = ({ style }: BottomSheetBackgroundProps) => {
  return (
    <View style={[{ borderRadius: 0, backgroundColor: "white" }, style,]} />
  );
};


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