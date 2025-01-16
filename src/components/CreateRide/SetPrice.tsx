import React from "react";

import { Text, View, Keyboard, Pressable, TextInput, StyleSheet } from "react-native";

import { Image } from "expo-image";

import { BottomSheetView } from "@gorhom/bottom-sheet";

import EditIcon from "@/assets/icons/edit.svg";

interface SetPriceProps {
  setPrice: (price: string) => void;
}

const SetPrice = ({ setPrice }: SetPriceProps): JSX.Element => {
  const [isFocused, setIsFocused] = React.useState<boolean>(false);

  React.useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (event) => {
      setIsFocused(true);
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", (event) => {
      setIsFocused(false);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    }
  }, []);

  return (
    <BottomSheetView style={styles.container}>
      <View style={styles.currentStation}>
        <Text style={textStyles.headingTitle}>Set your Price</Text>
        <Text style={textStyles.headingSubtitle}>Set your preferred price for this ride</Text>
      </View>

      <View style={styles.mainContentContainer}>
        <View style={{ alignItems: "center", flexDirection: "row", gap: 8 }}>
          <Text style={textStyles.nairaText}>₦</Text>
          <TextInput
            placeholder="00.00"
            keyboardType="numeric"
            style={[textStyles.textInput]}
            onChangeText={(text) => setPrice(text)}
          />
          {!isFocused && (
              <Image
                source={EditIcon}
                style={{
                  width: 24,
                  height: 24,
                  tintColor: "black",
                }}
              />
            )}
        </View>
      </View>
    </BottomSheetView>
  );
};


export default SetPrice;


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
  },
  nairaText: {
    fontSize: 40,
    fontFamily: "DMSans-Regular",
  },
  textInput: {
    fontSize: 40,
    fontFamily: "DMSans-Regular",
  },
  ctaText: {
    fontSize: 16,
    color: "white",
    fontFamily: "DMSans-Regular",
  },
  descriptionText: {
    fontSize: 14,
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
  },
  mainContentContainer: {
    gap: 32,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
  },
});
