import React from "react";

import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";

import { Image } from "expo-image";

import RNBottomSheet, { BottomSheetBackgroundProps, BottomSheetView } from "@gorhom/bottom-sheet";

import { Ride } from "@/types";
import { useRide } from "@/context/ride";

import FlagIcon from "@/assets/icons/flag.svg";
import SearchIcon from "@/assets/icons/search.svg";
import CarImg from "@/assets/images/static/car.svg";
import ChevronIcon from "@/assets/icons/chevron.svg";


const BottomSheet = (): JSX.Element => {
  const { ride, setCurrentRide } = useRide();
  const bottomSheetRef = React.useRef<RNBottomSheet>(null);
  const snapPoints = React.useMemo(() => ["15%", "30%"], []);

  const [currentLocation, setCurrentLocation] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (ride) {
      bottomSheetRef.current?.close();
    } else {
      bottomSheetRef.current?.snapToIndex(0);
    }
  }, [ride]);

  React.useEffect(() => {
    setTimeout(() => {
      setCurrentLocation("Unilag Bus Stop");
    }, 3000);
  }, []);

  const onPressItem = () => {
    setCurrentRide({} as Ride);
  }

  return (
    <RNBottomSheet
      index={1}
      enableDynamicSizing
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      handleComponent={() => null}
      enablePanDownToClose={false}
      backgroundComponent={props => <BottomSheetBackground {...props} />}
    >
      <BottomSheetView style={styles.container}>
        <View style={styles.currentLocation}>
          {currentLocation ? (
            <Text style={textStyles.currentLocationText}>Unilag Bus Stop</Text>
          ) : (
            <Text style={textStyles.loadingLocation}>Locating Nearest Bus Stop...</Text>
          )}
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchItemContainer}>
            <View style={{ paddingHorizontal: 8 }}>
              <Image
                source={SearchIcon}
                style={{ width: 16, height: 16 }}
              />
            </View>
            <TextInput
              placeholder="Search for Location"
              style={textStyles.searchContainer}
            />
          </View>
        </View>

        <View style={styles.driverActionsContainer}>
          <Pressable style={styles.driverActionsItem}>
            <View style={{ paddingHorizontal: 8 }}>
              <Text style={textStyles.driverActionSubtitle}>Create a</Text>
              <Text style={textStyles.driverActionTitle}>Ride</Text>
            </View>
            <Image
              source={CarImg}
              style={{
                width: 68,
                height: "100%",
              }}
            />
          </Pressable>
          <Pressable style={styles.driverActionsItem}>
            <View style={{ paddingHorizontal: 8 }}>
              <Text style={textStyles.driverActionSubtitle}>Find a</Text>
              <Text style={textStyles.driverActionTitle}>Ride</Text>
            </View>
            <Image
              source={CarImg}
              style={{
                width: 68,
                height: "100%",
              }}
            />
          </Pressable>
        </View>

        <View style={{ gap: 10, paddingHorizontal: 16 }}>
          <Text style={textStyles.nearbyRidesText}>Nearby Rides</Text>
          {Array.from({ length: 8 }).map((_, index) => (
            <RideItem
              key={index}
              onPress={onPressItem}
            />
          ))}
        </View>
      </BottomSheetView>
    </RNBottomSheet>
  );
};


const BottomSheetBackground = ({ style }: BottomSheetBackgroundProps) => {
  return (
    <View style={[{ borderRadius: 0, backgroundColor: "white" }, style,]} />
  );
};


export default BottomSheet;


interface RideItemProps {
  price?: string;
  rideId?: string;
  destination?: string;
  onPress?: () => void;
}

const RideItem = ({ price, rideId, destination, onPress }: RideItemProps): JSX.Element => {
  return (
    <Pressable onPress={onPress} style={{ minHeight: 60, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
      <View style={{ padding: 12 }}>
        <Image
          source={FlagIcon}
          style={{ width: 24, height: 24 }}
        />
      </View>
      <View style={{ flex: 1, flexDirection: "row", justifyContent: "center", borderBottomWidth: 1, borderColor: "hsl(0, 0%, 90%)" }}>
        <View style={{ flex: 1, gap: 1.5, width: "100%" }}>
          <Text style={textStyles.rideItemTitle}>PO124AC</Text>
          <View style={{ flexDirection: "row", gap: 6 }}>
            <Text style={[textStyles.rideItemSubtitle, { fontFamily: "DMSans-SemiBold" }]}>₦500</Text>
            <Text style={textStyles.rideItemSubtitle}>•</Text>
            <Text style={textStyles.rideItemSubtitle}>Lekki Phase One</Text>
          </View>
        </View>
        <View style={{ padding: 12 }}>
          <Image
            source={ChevronIcon}
            style={{ width: 24, height: 24 }}
          />
        </View>
      </View>
    </Pressable>
  );
};


const textStyles = StyleSheet.create({
  loadingLocation: {
    fontSize: 14,
    fontFamily: "DMSans-Italic",
  },
  rideItemTitle: {
    fontSize: 16,
    fontFamily: "DMSans-SemiBold",
  },
  rideItemSubtitle: {
    fontSize: 14,
    color: "hsl(0, 0%, 29%)",
    fontFamily: "DMSans-Regular",
  },
  nearbyRidesText: {
    fontSize: 16,
    fontFamily: "DMSans-Bold",
  },
  searchContainer: {
    flex: 1,
    fontSize: 14,
    height: "100%",
    fontFamily: "DMSans-Regular",
  },
  currentLocationText: {
    fontSize: 14,
    fontFamily: "DMSans-SemiBold",
  },
  driverActionSubtitle: {
    fontSize: 14,
    fontFamily: "DMSans-Regular",
  },
  driverActionTitle: {
    fontSize: 30,
    fontFamily: "DMSans-SemiBold",
  }
});

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  currentLocation: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "hsl(0, 0%, 90%)",
  },
  driverActionsContainer: {
    gap: 24,
    paddingVertical: 4,
    flexDirection: "row",
    paddingHorizontal: 16
  },
  driverActionsItem: {
    flex: 1,
    height: 72,
    borderRadius: 12,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "hsl(0, 0%, 95%)",
  },
  searchContainer: {
    paddingHorizontal: 16,
  },
  searchItemContainer: {
    gap: 8,
    paddingHorizontal: 8,
    height: 48,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "hsl(0, 0%, 90%)",
  }
});
