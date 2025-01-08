import React from "react";

import { View, StyleSheet } from "react-native";

import RNBottomSheet, { BottomSheetBackgroundProps } from "@gorhom/bottom-sheet";

import Home from "./Home";
import RideDetails from "./RideDetails";
import { useRideProvider } from "../../context";


const BottomSheet = (): JSX.Element => {
  const { ride } = useRideProvider();
  const snapPoints = React.useMemo(() => ["10%"], []);

  return (
    <RNBottomSheet
      index={1}
      enableDynamicSizing
      snapPoints={snapPoints}
      handleComponent={() => null}
      enablePanDownToClose={false}
      backgroundComponent={props => <BottomSheetBackground {...props} />}
    >
      {ride ? (
        <RideDetails />
      ) : (
        <Home />
      )}
    </RNBottomSheet>
  );
};


const BottomSheetBackground = ({ style }: BottomSheetBackgroundProps) => {
  return (
    <View style={[{ borderRadius: 0, backgroundColor: "white" }, style,]} />
  );
};


const styles = StyleSheet.create({
  container: {
    gap: 8,
    flex: 1,
    backgroundColor: "white",
  },
  topContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "hsl(0, 0%, 80%)",
  },
  bottomContainer: {
    gap: 8,
    paddingHorizontal: 16,
  },
  textInputContainer: {
    width: "100%",
    height: 44,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingHorizontal: 8,
    borderColor: "hsl(0, 0%, 80%)",
  },
  textInput: {
    flex: 1,
    height: "100%",
  },
  rideItemContainer: {
    gap: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: "hsl(0, 0%, 80%)",
  }
});



export default BottomSheet;