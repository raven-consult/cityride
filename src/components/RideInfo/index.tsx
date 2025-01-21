import React from "react";

import { View, Text, StyleSheet } from "react-native";

import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import RNBottomSheet, { BottomSheetBackgroundProps, BottomSheetView } from "@gorhom/bottom-sheet";

import { Info } from "@/types";
import { useAppContext } from "@/context/AppContext";
import { boardRide, userIsPassengerOfRide } from "@/services/rides";

import DriverBottomBar from "./_components/DriverBotttomBar";
import PassengerBottomBar from "./_components/PassengerBotttomBar";

import RoadPathImg from "@/assets/images/static/road-path.svg";


const RideInfo = (): JSX.Element => {
  const router = useRouter();
  const { setInfo, setRideCode } = useAppContext();
  const { ride, setCurrentRide } = useAppContext();
  const { pendingRide, setPendingRide } = useAppContext();
  const bottomSheetRef = React.useRef<RNBottomSheet>(null);
  const snapPoints = React.useMemo(() => ["15%", "30%"], []);

  // const [userIsDriver, setUserIsDriver] = React.useState<boolean | null>(null);
  const [currentUser, setCurrentUser] = React.useState<FirebaseAuthTypes.User | null>(null);

  React.useEffect(() => {
    const sub = auth().onAuthStateChanged(user => {
      setCurrentUser(user);
    });

    return sub;
  }, []);

  const userIsDriver = React.useMemo(() => {
    return ride?.metadata.driverId == currentUser?.uid;
  }, [ride, currentUser]);

  React.useEffect(() => {
    if (ride) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [ride]);

  const clearRide = () => setCurrentRide(null);

  const onPressBoardRide = async () => {
    if (!ride || !currentUser) return;

    try {
      const rideCode = await boardRide(ride.id, currentUser.uid);
      setRideCode(rideCode);
      setPendingRide(ride);
      setCurrentRide(null);
      setInfo({
        title: "Ride Boarded",
        illustration: RoadPathImg,
        description: "Your ride has been scheduled. You will be notified when your arrived has arrived.",
      } as Info);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  const isPendingRide = React.useMemo(() => {
    return pendingRide?.id === ride?.id;
  }, [ride, pendingRide]);

  const hasPendingRide = React.useMemo(() => {
    return !!pendingRide;
  }, [pendingRide]);

  const driverArrival = React.useMemo(() => {
    const arrival = ride?.metadata.driverArrival;
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
        currency: "NGN"
      });
  }, [ride]);

  const maxPassengers = React.useMemo(() => {
    return `${ride?.metadata.maxPassengers} seats`;
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

        {userIsDriver ? (
          <DriverBottomBar
            clearRide={clearRide}
            isPendingRide={isPendingRide}
          />
        ) : (
          <PassengerBottomBar
            clearRide={clearRide}
            isPendingRide={isPendingRide}
            hasPendingRide={hasPendingRide}
            onPressBoardRide={onPressBoardRide}
          />
        )}
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
    paddingBottom: 8,
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