import React from "react";

import { Text, StyleSheet, ActivityIndicator } from "react-native";

import { BottomSheetView } from "@gorhom/bottom-sheet";

interface FinishProps {
  loading: boolean;
}

const Finish = ({ loading }: FinishProps): JSX.Element => {
  return (
    <BottomSheetView style={styles.container}>
      <ActivityIndicator size="large" color="hsl(0, 0.00%, 0.00%)" />
      <Text style={textStyles.selectedStation}>Creating Ride</Text>
    </BottomSheetView>
  );
};


export default Finish;


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
    fontSize: 14,
    fontFamily: "DMSans-Regular",
  }
});

const styles = StyleSheet.create({
  container: {
    gap: 12,
    width: "100%",
    height: "100%",
    borderTopWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "hsl(0, 0%, 90%)",
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
