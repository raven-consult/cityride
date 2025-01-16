import React from "react";

import { Text, View, StyleSheet } from "react-native";

import { Image } from "expo-image";

import { BottomSheetView } from "@gorhom/bottom-sheet";

import { SelectedRoute } from "@/types";
import RoadPath2Img from "@/assets/images/static/road-path-2.svg";


interface SelectRouteProps {
  selectedRoute: SelectedRoute;
}

const SelectRoute = ({ selectedRoute }: SelectRouteProps): JSX.Element => {
  const selectedStation = React.useMemo(() => {
    if (selectedRoute.start && selectedRoute.end) {
      return `${selectedRoute.start.name} → ${selectedRoute.end.name}`;
    } else if (selectedRoute.start) {
      return `${selectedRoute.start.name} → Select Destination`;
    } else if (selectedRoute.end) {
      return `Select Origin → ${selectedRoute.end.name}`;
    } else {
      return "Select Route";
    }
  }, [selectedRoute]);

  return (
    <BottomSheetView style={styles.container}>
      <View style={styles.currentStation}>
        <Text style={textStyles.headingTitle}>Select Route</Text>
        <Text style={textStyles.headingSubtitle}>Select the start and stop routes on the map</Text>
      </View>

      <View style={styles.mainContainer}>
        <View style={styles.illustrationContainer}>
          <Image
            source={RoadPath2Img}
            style={{ width: 60, height: 60 }}
          />
        </View>
      </View>

      <View style={styles.selectedStationContainer}>
        <Text style={textStyles.selectedStation}>{selectedStation}</Text>
      </View>
    </BottomSheetView>
  );
};


export default SelectRoute;


const textStyles = StyleSheet.create({
  headingTitle: {
    fontSize: 27,
    letterSpacing: 0,
    fontFamily: "DMSans-Bold",
  },
  headingSubtitle: {
    fontSize: 12,
    fontFamily: "DMSans-Regular",
  },
  selectedStation: {
    fontSize: 16,
    fontFamily: "DMSans-Regular",
  }
});

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  currentStation: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "hsl(0, 0%, 90%)",
  },
  mainContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  illustrationContainer: {
    width: 150,
    height: 150,
    padding: 45,
    borderRadius: 120,
    backgroundColor: "hsl(0, 0%, 95%)",
  },
  selectedStationContainer: {
    width: "100%",
    borderTopWidth: 1,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "hsl(0, 0%, 95%)",
  }
});
