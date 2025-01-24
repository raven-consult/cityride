import React from "react";
import { Text, View, StyleSheet } from "react-native";

import Feather from "@expo/vector-icons/Feather";


const Wallet = (): JSX.Element => {
  const TopContainer = (
    <View style={styles.topContainer}>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Text style={textStyles.balanceText}>₦0.00</Text>
        <Text style={textStyles.currentBalanceText}>Current Balance</Text>
      </View>
      <View style={{ gap: 16, flexDirection: "row", alignItems: "center" }}>
        <View style={styles.buttonContainer}>
          <Text style={textStyles.buttonText}>Fund Wallet</Text>
          <Feather name="arrow-up-right" size={20} color="white" />
        </View>
        <View style={styles.buttonContainer}>
          <Text style={textStyles.buttonText}>Withdraw</Text>
          <Feather name="arrow-down" size={20} color="white" />
        </View>
      </View>
    </View>
  );

  const BottomContainer = (
    <View style={styles.bottomContainer}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={textStyles.bottomContainerHeadingText}>Recent Transactions</Text>
        <Text style={textStyles.bottomContainerHeadingText}>See all</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {TopContainer}
      {BottomContainer}
    </View>
  );
};

const textStyles = StyleSheet.create({
  buttonText: {
    color: "white",
    fontSize: 14,
    fontFamily: "DMSans-Regular",
  },
  balanceText: {
    fontSize: 42,
    fontFamily: "DMSans-Bold",
  },
  currentBalanceText: {
    fontSize: 14,
    color: "hsl(0, 0%, 50%)",
    fontFamily: "DMSans-Regular",
  },
  bottomContainerHeadingText: {
    fontSize: 15,
    fontFamily: "DMSans-Regular",
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 14,
  },
  topContainer: {
    gap: 32,
    height: "38%",
    paddingBottom: 28,
    alignItems: "center",
    borderBottomWidth: 1,
    justifyContent: "flex-end",
    borderColor: "hsl(0, 0%, 90%)",
  },
  bottomContainer: {
    flex: 1,
    paddingVertical: 8,
  },
  buttonContainer: {
    gap: 4,
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: "row",
    paddingHorizontal: 16,
    backgroundColor: "black",
  },
});


export default Wallet;