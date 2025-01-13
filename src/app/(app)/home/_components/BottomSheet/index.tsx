import React from "react";

import { View, Text, TextInput, StyleSheet } from "react-native";

import { Image } from "expo-image";
import RNBottomSheet, { BottomSheetBackgroundProps, BottomSheetView } from "@gorhom/bottom-sheet";

import FlagIcon from "@/assets/icons/flag.svg";
import SearchIcon from "@/assets/icons/search.svg";
import ChevronIcon from "@/assets/icons/chevron.svg";


const RideItem = (): JSX.Element => {
  return (
    <View style={{ minHeight: 60, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
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
    </View>
  );
};

const BottomSheet = (): JSX.Element => {
  const snapPoints = React.useMemo(() => ["15%", "30%"], []);

  return (
    <RNBottomSheet
      index={1}
      enableDynamicSizing
      snapPoints={snapPoints}
      handleComponent={() => null}
      enablePanDownToClose={false}
      backgroundComponent={props => <BottomSheetBackground {...props} />}
    >
      <BottomSheetView style={styles.container}>
        <View style={styles.currentLocation}>
          <Text style={textStyles.currentLocationText}>Unilag Bus Stop</Text>
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

        <View style={{ gap: 10, paddingHorizontal: 16 }}>
          <Text style={textStyles.nearbyRidesText}>Nearby Rides</Text>
          <RideItem />
          <RideItem />
          <RideItem />
          <RideItem />
          <RideItem />
          <RideItem />
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


const textStyles = StyleSheet.create({
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
    flexDirection: "row",
    justifyContent: "center",
    borderColor: "hsl(0, 0%, 90%)",
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
