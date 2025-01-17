import React from "react";

import { View, StyleSheet } from "react-native";

import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import RNBottomSheet, { BottomSheetBackgroundProps } from "@gorhom/bottom-sheet";


import { createRide } from "@/services/rides";
import { useAppContext } from "@/context/AppContext";

import Header from "./Header";
import Finish from "./Finish";
import SetPrice from "./SetPrice";
import SelectRoute from "./SelectRoute";


enum Step {
  SelectRoute,
  SetPrice,
  Finish,
}

const CreateRide = (): JSX.Element => {
  const snapPoints = React.useMemo(() => ["30%"], []);
  const bottomSheetRef = React.useRef<RNBottomSheet>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  const { setInfo } = useAppContext();
  const { setPendingRide } = useAppContext();
  const { createRideMode, selectedRoute, setCreateRideMode } = useAppContext();

  const [price, setPrice] = React.useState<string>("");
  const [step, setStep] = React.useState<Step>(Step.SelectRoute);
  const [currentUser, setCurrentUser] = React.useState<FirebaseAuthTypes.User | null>(null);

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
      setStep(Step.SelectRoute);
      setCreateRideMode(false);
    }
  }

  const onPressNext = async () => {
    if (step === Step.SelectRoute) {
      setStep(Step.SetPrice);
    } else {
      setStep(Step.Finish);
      setLoading(true);

      try {
        const res = await createRide(
          currentUser!.uid,
          parseFloat(price),
          selectedRoute.start!.id,
          selectedRoute.end!.id,
        );
        setPendingRide(res);

        setInfo({
          title: "Ride Created",
          description: "Your ride has been created successfully",
          illustration: "",
          action: () => {
            setInfo(null);
          }
        });

        setCreateRideMode(false);
      } catch (e) {
        console.error(e);
      }
    }
  }

  React.useEffect(() => {
    if (createRideMode) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [createRideMode]);


  React.useEffect(() => {
    const subscriber = auth()
      .onAuthStateChanged((user: FirebaseAuthTypes.User | null) => {
        if (user) {
          console.log(user);
          setCurrentUser(user);
        }
      });
    return () => subscriber();
  }, []);


  return (
    <>
      <Header
        show={createRideMode}
        leadingText={leadingText}
        onPressBack={onPressBack}
        onPressNext={onPressNext}
      />
      <RNBottomSheet
        index={-1}
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

        {step === Step.Finish && (
          <Finish
            loading={loading}
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
