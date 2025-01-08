import React from "react";

import { View, Text, StyleSheet, Button, Pressable } from "react-native";

import { BottomSheetView } from "@gorhom/bottom-sheet";

import Ionicons from "@expo/vector-icons/Ionicons";
import { useRideProvider } from "../../context";


const RideDetails = (): JSX.Element => {
  const { setRide } = useRideProvider();

  const onClose = () => setRide(null);

  return (
    <BottomSheetView style={styles.container}>
      <View style={styles.topContainer}>
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
            <Text>Ride Item</Text>
            <Text>Ride Item</Text>
          </View>
        </View>
        <Pressable onPress={onClose}>
          <Ionicons name="close-outline" size={32} color="black" />
        </Pressable>
      </View>

      <View style={styles.contentsContainer}>
        <View>
          <Text style={[]}>Ride Details</Text>
          <Text>Ride Details</Text>
        </View>
        <View>
          <Text>Ride Details</Text>
          <Text>Ride Details</Text>
        </View>
        <View>
          <Text>Ride Details</Text>
          <Text>Ride Details</Text>
        </View>
      </View>

      <View>
        <Button title="Book Ride" />
      </View>
    </BottomSheetView>
  );
};


export default RideDetails;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    padding: 12,
    height: 100,
    width: "100%",
    backgroundColor: "white",
  },
  topContainer: {
    gap: 8,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  contentsContainer: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: "row",
    paddingHorizontal: 8,
    borderColor: "hsl(0, 0%, 80%)",
    justifyContent: "space-between",
  },
});
