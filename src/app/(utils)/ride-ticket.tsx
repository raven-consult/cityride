import React from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";

import { router } from "expo-router";
import { QrCodeSvg } from "react-native-qr-svg";
import { useAppContext } from "@/context/AppContext";

const FRAME_SIZE = 280;

const RideTicket = (): JSX.Element => {
  const CONTENT = "Hello world";

  const { pendingRide, rideCode } = useAppContext();
  if (!pendingRide || !(rideCode || CONTENT)) return <></>;

  const driverArrival = React.useMemo(() => {
    const arrival = pendingRide?.metadata.driverArrival;
    return `${arrival || 3} mins`;
  }, [pendingRide]);

  const itenary = React.useMemo(() => {
    const end = pendingRide?.itenary.end.name;
    const start = pendingRide?.itenary.start.name;
    return `${start} → ${end}`;
  }, [pendingRide]);

  const price = React.useMemo(() => {
    return pendingRide
      ?.price
      .toLocaleString("en-NG", {
        style: "currency",
        currency: "NGN",
      });
  }, [pendingRide]);

  const onPressDone = () => {
    router.back();
  }

  const maxPassengers = React.useMemo(() => {
    return `${pendingRide?.metadata.maxPassengers || 3} seats`;
  }, [pendingRide]);

  return (
    <View style={styles.container}>
      <View style={styles.ticketContainer}>
        <View style={styles.titleContainer}>
          <Text style={textStyles.rideIdText}>{pendingRide.id}</Text>
          <Text style={textStyles.rideItenaryText}>{itenary}</Text>
        </View>
        <View style={styles.rideDetailsContainer}>
          <View style={styles.rideDetails}>
            <Text style={textStyles.rideDetailValue}>{driverArrival}</Text>
            <Text style={textStyles.rideDetailTitle}>Arriving in</Text>
          </View>
          <View style={styles.rideDetails}>
            <Text style={textStyles.rideDetailValue}>{price}</Text>
            <Text style={textStyles.rideDetailTitle}>Price</Text>
          </View>
          <View style={styles.rideDetails}>
            <Text style={textStyles.rideDetailValue}>{maxPassengers}</Text>
            <Text style={textStyles.rideDetailTitle}>Passengers</Text>
          </View>
        </View>

        <QrCodeSvg
          value={rideCode || CONTENT}
          contentCells={5}
          style={styles.qr}
          frameSize={FRAME_SIZE}
          contentStyle={styles.box}
        // content={<Text style={styles.icon}>👋</Text>}
        />
      </View>

      <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between" }}>
        <Pressable
          style={{
            flex: 1,
            padding: 16,
            borderRadius: 8,
            alignItems: "center",
            backgroundColor: "black"
          }}
          onPress={onPressDone}
        >
          <Text style={textStyles.boardRideText}>Done</Text>
        </Pressable>
      </View>
    </View>
  );
};


const textStyles = StyleSheet.create({
  rideIdText: {
    fontSize: 28,
    fontFamily: "DMSans-Bold",
  },
  rideItenaryText: {
    fontSize: 13,
    fontFamily: "DMSans-Regular",
  },
  rideDetailTitle: {
    fontSize: 13,
    color: "hsl(0, 0%, 29%)",
    fontFamily: "DMSans-Regular",
  },
  rideDetailValue: {
    fontSize: 14,
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
    gap: 24,
    width: "100%",
    height: "100%",
    overflow: "hidden",
    alignItems: "center",
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  ticketContainer: {
    gap: 6,
    padding: 8,
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "hsl(0, 0%, 96%)",
  },
  titleContainer: {
    gap: 1,
    padding: 12,
    alignItems: "center",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: "white",
    justifyContent: "center",
  },
  rideDetailsContainer: {
    gap: 3,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rideDetails: {
    gap: 4,
    flex: 1,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRightColor: "hsl(0, 0%, 95%)",
  },
  qrCodeContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 20,
  },
  qr: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
});

export default RideTicket;