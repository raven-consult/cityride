import React from "react";

import { View, Text, TextInput, StyleSheet, Pressable, ActivityIndicator } from "react-native";

import { Image } from "expo-image";
import * as Location from "expo-location";

import RNBottomSheet, { BottomSheetBackgroundProps, BottomSheetScrollView, BottomSheetView } from "@gorhom/bottom-sheet";

import { Ride } from "@/types";
import { useDebounce } from "@/utils";
import { useRide } from "@/context/ride";
import { useInfo } from "@/context/info";
import { useStation } from "@/context/station";
import { useCreateRide } from "@/context/createRide";
import { getNearestStation } from "@/services/stations";
import { getRidesStartingAtStation } from "@/services/rides";

import FlagIcon from "@/assets/icons/flag.svg";
import SearchIcon from "@/assets/icons/search.svg";
import CarImg from "@/assets/images/static/car.svg";
import ChevronIcon from "@/assets/icons/chevron.svg";


const BottomSheet = (): JSX.Element => {
  const { ride, setCurrentRide } = useRide();
  const bottomSheetRef = React.useRef<RNBottomSheet>(null);
  const snapPoints = React.useMemo(() => ["15%", "30%"], []);

  const { info } = useInfo();
  const { currentStation, setCurrentStation } = useStation();
  const { createRideMode, setCreateRideMode } = useCreateRide();

  const [rides, setRides] = React.useState<Ride[]>([]);
  const [query, setQuery] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [searchResults, setSearchResults] = React.useState<Ride[]>([]);

  const debouncedQuery = useDebounce<string>(query, 100);

  React.useEffect(() => {
    if (ride || createRideMode || info) {
      bottomSheetRef.current?.close();
    } else {
      bottomSheetRef.current?.snapToIndex(0);
    }
  }, [ride, createRideMode, info]);

  React.useEffect(() => {
    (async () => {
      if (currentStation) {
        setLoading(true);
        const rides = await getRidesStartingAtStation(currentStation.id);
        setRides(rides);
        setLoading(false);
      }
    })();
  }, [currentStation]);

  React.useEffect(() => {
    (async () => {
      setSearchResults([]);
      // const collections = await getStationsResults(debouncedQuery);
      // setResults(collections);
    })();
  }, [debouncedQuery]);

  React.useEffect(() => {
    (async () => {
      if (currentStation) return;
      const currentLocation = await Location.getCurrentPositionAsync();

      if (!currentLocation) return;

      const station = await getNearestStation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      setCurrentStation(station);
    })();
  }, []);

  const onPressItem = (ride: Ride) => {
    setCurrentRide(ride);
  }

  const onPressCreateRide = () => {
    setCreateRideMode(true);
  }

  const onPressFindRide = () => {
    bottomSheetRef.current?.snapToPosition("50%");
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
      <BottomSheetScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.currentStation}>
          {currentStation ? (
            <Text style={textStyles.currentStationText}>{currentStation.name}</Text>
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
              value={query}
              onChangeText={setQuery}
              placeholder="Search for Location"
              style={textStyles.searchContainer}
            />
          </View>
        </View>

        <View style={styles.driverActionsContainer}>
          <Pressable onPress={onPressCreateRide} style={styles.driverActionsItem}>
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
          <Pressable onPress={onPressFindRide} style={styles.driverActionsItem}>
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

          {(loading) && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator
                size="large"
                color="black"
              />
            </View>
          )}

          {searchResults.map((ride, index) => (
            <RideItem
              key={index}
              ride={ride}
              onPress={() => onPressItem(ride)}
            />
          ))}

          {(searchResults.length == 0) && rides.map((ride, index) => (
            <RideItem
              key={index}
              ride={ride}
              onPress={() => onPressItem(ride)}
            />
          ))}
        </View>
      </BottomSheetScrollView>
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
  ride: Ride;
  onPress?: () => void;
}

const RideItem = ({ ride, onPress }: RideItemProps): JSX.Element => {
  const formattedPrice = ride.price.toLocaleString("en-NG", { style: "currency", currency: "NGN" });

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
          <Text style={textStyles.rideItemTitle}>{ride.id}</Text>
          <View style={{ flexDirection: "row", gap: 6 }}>
            <Text style={[textStyles.rideItemSubtitle, { fontFamily: "DMSans-SemiBold" }]}>{formattedPrice}</Text>
            <Text style={textStyles.rideItemSubtitle}>•</Text>
            <Text style={textStyles.rideItemSubtitle}>{ride.itenary.end.name}</Text>
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
  currentStationText: {
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
  loadingContainer: {
    height: 200,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  currentStation: {
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
