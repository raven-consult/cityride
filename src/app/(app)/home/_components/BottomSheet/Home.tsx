import React from "react";

import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";

import { BottomSheetView } from "@gorhom/bottom-sheet";

import Feather from "@expo/vector-icons/Feather";

import { Ride } from "@/types";
import Typography from "@/design-system/theme/typography";

import { useRideProvider } from "../../context";


const Home = (): JSX.Element => {
  const { setRide } = useRideProvider();

  return (
    <BottomSheetView style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.textInputContainer}>
          <TextInput style={styles.textInput} placeholder="Get me Somewhere" />
          <Feather name="search" size={20} color="black" />
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <Text>Nearby Rides</Text>
        <View>
          <RideItem
            ride={({} as Ride)}
            onPress={() => setRide({} as Ride)}
          />
          <RideItem
            ride={({} as Ride)}
            onPress={() => setRide({} as Ride)}
          />
          <RideItem
            ride={({} as Ride)}
            onPress={() => setRide({} as Ride)}
          />
        </View>
      </View>
    </BottomSheetView>
  );
};

interface RideItemProps {
  ride: Ride;
  onPress: () => void;
}


const RideItem = ({ ride, onPress }: RideItemProps): JSX.Element => {
  return (
    <Pressable onPress={onPress} style={styles.rideItemContainer}>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <View
          style={{
            width: 45,
            height: 45,
            borderRadius: 10,
            backgroundColor: "hsl(0, 0%, 90%)",
          }}
        />
        <View style={{ justifyContent: "center" }}>
          <Text style={[Typography.subHeading]}>P0124AC</Text>
          <Text style={[Typography.caption]}>Iyana Oworo {"=>"} Lekki Phase One</Text>
        </View>
      </View>
      <Feather name="chevron-right" size={32} color="black" />
    </Pressable>
  );
};

export default Home;


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
