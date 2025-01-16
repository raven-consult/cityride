import React from "react";

import { View, StyleSheet } from "react-native";

import RNBottomSheet, { BottomSheetBackgroundProps } from "@gorhom/bottom-sheet";

import Header from "./Header";
import SetPrice from "./SetPrice";
import SelectRoute from "./SelectRoute";
import { SelectedRoute } from "@/types";

enum Step {
  SetPrice,
  SelectRoute,
}

const CreateRide = (): JSX.Element => {
  const snapPoints = React.useMemo(() => ["30%"], []);
  const bottomSheetRef = React.useRef<RNBottomSheet>(null);

  const [price, setPrice] = React.useState<string>("");
  const [step, setStep] = React.useState<Step>(Step.SelectRoute);
  const [selectedRoute, setSelectedRoute] = React.useState<SelectedRoute>({
    end: null,
    start: null,
  });

  const leadingText = React.useMemo(() => {
    if (step === Step.SetPrice) {
      return "Submit";
    }
    return "Next";
  }, [step]);

  const onPressBack = () => {
    if (step === Step.SetPrice) {
      setStep(Step.SelectRoute);
    } else {
      bottomSheetRef.current?.snapToIndex(0);
    }
  }

  const onPressNext = () => {
    if (step === Step.SelectRoute) {
      setStep(Step.SetPrice);
    }
  }

  return (
    <>
      <Header
        leadingText={leadingText}
        onPressBack={onPressBack}
        onPressNext={onPressNext}
      />
      <RNBottomSheet
        index={1}
        enableDynamicSizing
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        handleComponent={() => null}
        enablePanDownToClose={false}
        backgroundComponent={props => <BottomSheetBackground {...props} />}
      >
        {step === Step.SelectRoute && (
          <SelectRoute
            selectedRoute={selectedRoute}
          />
        )}
        {step === Step.SetPrice && (
          <SetPrice
            setPrice={setPrice}
          />
        )}
      </RNBottomSheet>
    </>
  );
};

export default CreateRide;


const BottomSheetBackground = ({ style }: BottomSheetBackgroundProps) => {
  return (
    <View style={[{ borderRadius: 0, backgroundColor: "white" }, style,]} />
  );
};



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
