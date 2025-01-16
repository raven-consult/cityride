import React from "react";

import { View, Text, StyleSheet, Pressable } from "react-native";

import { Image } from "expo-image";

import { useInfo } from "@/context/info";

import RNBottomSheet, { BottomSheetBackgroundProps, BottomSheetView } from "@gorhom/bottom-sheet";

import RoadPathImg from "@/assets/images/static/road-path.svg";


const InfoSheet = (): JSX.Element => {
  const { info, setInfo } = useInfo();
  const snapPoints = React.useMemo(() => ["15%"], []);
  const bottomSheetRef = React.useRef<RNBottomSheet>(null);

  React.useEffect(() => {
    if (info) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [info]);

  const clearInfo = () => setInfo(null);

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
          <Text style={textStyles.mainText}>Ride Boarded</Text>
        </View>
        <View style={styles.mainContainer}>
          <Text style={[textStyles.descriptionText, { flex: 1 }]}>
            Your ride has been scheduled. You will be notified when your arrived has arrived.
          </Text>
          <Image
            source={RoadPathImg}
            style={{
              width: 72,
              height: 72,
            }}
          />
        </View>
        <View style={styles.ctaSection}>
          <Pressable
            onPress={clearInfo}
            style={{ borderRadius: 8, flex: 1, padding: 16, alignItems: "center", backgroundColor: "black" }}>
            <Text style={textStyles.boardRideText}>Board Ride</Text>
          </Pressable>
        </View>
      </BottomSheetView>
    </RNBottomSheet>
  );
};


export default InfoSheet;


const BottomSheetBackground = ({ style }: BottomSheetBackgroundProps) => {
  return (
    <View style={[{ borderRadius: 0, backgroundColor: "white" }, style,]} />
  );
};

const textStyles = StyleSheet.create({
  mainText: {
    fontSize: 20,
    fontFamily: "DMSans-Bold",
  },
  descriptionText: {
    fontSize: 16,
    fontFamily: "DMSans-Regular",
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
    borderTopWidth: 1,
    borderColor: "hsl(0, 0%, 90%)",
  },
  header: {
    padding: 16,
    alignItems: "center",
    borderBottomWidth: 1,
    justifyContent: "center",
    borderColor: "hsl(0, 0%, 90%)",
  },
  ctaSection: {
    gap: 10,
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  mainContainer: {
    gap: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    justifyContent: "space-between",
  }
})