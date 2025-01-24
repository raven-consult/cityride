import React from "react";
import { Text, View, StyleSheet, ScrollView, ViewStyle, ImageSourcePropType, Pressable, Linking } from "react-native";

import { Image } from "expo-image";
import { useRouter } from "expo-router";
import Feather from "@expo/vector-icons/Feather";

import { Transaction } from "@/types";
import Spacer from "@/components/Spacer";
import ArrowLeftIcon from "@/assets/icons/arrow_left.svg";


const Wallet = (): JSX.Element => {
  const router = useRouter();
  const [transactions, setTransactions] = React.useState<Transaction[] | null>([...allTransactions, ...allTransactions]);

  React.useEffect(() => {
    setTransactions(allTransactions);
  }, []);

  const onPressWithdraw = () => {
    Linking.openURL("tel:08184223451");
  }

  const TopContainer = (
    <View style={styles.topContainer}>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Text style={textStyles.balanceText}>₦0.00</Text>
        <Text style={textStyles.currentBalanceText}>Current Balance</Text>
      </View>
      <View style={{ gap: 16, flexDirection: "row", alignItems: "center" }}>
        <Pressable
          style={styles.buttonContainer}
          onPress={() => router.navigate("/(profile)/fund-wallet")}
        >
          <Text style={textStyles.buttonText}>Fund Wallet</Text>
          <Feather name="arrow-up-right" size={20} color="white" />
        </Pressable>
        <Pressable
          onPress={onPressWithdraw}
          style={styles.buttonContainer}
        >
          <Text style={textStyles.buttonText}>Withdraw</Text>
          <Feather name="arrow-down" size={20} color="white" />
        </Pressable>
      </View>
    </View>
  );

  const BottomContainer = (
    <View style={styles.bottomContainer}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={textStyles.bottomContainerHeadingText}>Recent Transactions</Text>
        <Text style={textStyles.bottomContainerHeadingText}>See all</Text>
      </View>

      <View>
        {transactions.map((transaction, index) => (
          <TransactionItem
            key={index}
            transaction={transaction}
          />
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={{
        height: 48,
        paddingHorizontal: 4,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <Pressable onPress={() => router.back()}>
          <Icon icon={ArrowLeftIcon} style={{ width: 26, height: 26 }} />
        </Pressable>
      </View>
      {TopContainer}
      <Spacer height={12} />
      {BottomContainer}
    </ScrollView>
  );
};


interface IconProps {
  style: ViewStyle,
  icon: ImageSourcePropType;
}

const Icon = ({ icon, style }: IconProps): JSX.Element => {
  return (
    <View style={[
      {
        width: 24,
        height: 24,
        alignItems: "center",
        justifyContent: "center",
      },
      style
    ]}>
      <Image
        source={icon}
        style={{ width: "100%", height: "100%" }}
      />
    </View>
  )
}


interface TransactionItemProps {
  transaction: Transaction;
}

const TransactionItem = ({ transaction }: TransactionItemProps): JSX.Element => {
  return (
    <View style={styles.transactionContainer}>
      <View style={{ gap: 8, flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 6,
            borderWidth: 0.7,
            alignItems: "center",
            justifyContent: "center",
            borderColor: "hsl(0, 0%, 80%)",
          }}>
          <Feather
            size={20}
            color="black"
            name={transaction.type === "debit" ? "chevrons-down" : "chevrons-up"}
          />
        </View>
        <View>
          <Text style={[textStyles.body]}>
            {transaction.title}
          </Text>
          <Text style={[textStyles.overline, { fontSize: 10.7 }]}>
            {transaction.comment}
          </Text>
        </View>
      </View>
      <View style={{ justifyContent: "center", flexDirection: "row", alignItems: "center" }}>
        <Text style={[textStyles.body, { color: transaction.type === "debit" ? "red" : "green" }]}>
          {transaction.type === "debit" ? "-" : "+"}
        </Text>
        <Text style={[textStyles.body, { color: transaction.type === "debit" ? "red" : "green" }]}>
          ₦{transaction.amount.toLocaleString()}.00
        </Text>
      </View>
    </View>
  );
};


const allTransactions: Transaction[] = [
  {
    id: "tx-001",
    title: "Ride to Downtown",
    sender: "John Doe",
    receiver: "CityRide Corp",
    amount: 25.50,
    timestamp: new Date("2024-03-10T09:30:00"),
    type: "credit",
    comment: "Morning commute"
  },
  {
    id: "tx-002",
    title: "Driver Payout",
    sender: "CityRide Corp",
    receiver: "Alice Smith",
    amount: 150.75,
    timestamp: new Date("2024-03-11T16:45:00"),
    type: "debit"
  },
  {
    id: "tx-003",
    title: "Airport Transfer",
    sender: "Bob Wilson",
    receiver: "CityRide Corp",
    amount: 75.00,
    timestamp: new Date("2024-03-12T13:15:00"),
    type: "credit"
  },
  {
    id: "tx-004",
    title: "Weekly Driver Bonus",
    sender: "CityRide Corp",
    receiver: "Charlie Brown",
    amount: 200.00,
    timestamp: new Date("2024-03-13T18:00:00"),
    type: "debit",
    comment: "Performance bonus"
  },
  {
    id: "tx-005",
    title: "Late Night Ride",
    sender: "Diana Prince",
    receiver: "CityRide Corp",
    amount: 35.25,
    timestamp: new Date("2024-03-14T23:20:00"),
    type: "credit"
  },
  {
    id: "tx-006",
    title: "Maintenance Payout",
    sender: "CityRide Corp",
    receiver: "AutoFix Services",
    amount: 450.00,
    timestamp: new Date("2024-03-15T11:00:00"),
    type: "debit"
  },
  {
    id: "tx-007",
    title: "Group Ride",
    sender: "Eve Anderson",
    receiver: "CityRide Corp",
    amount: 45.80,
    timestamp: new Date("2024-03-15T20:30:00"),
    type: "credit",
    comment: "Split fare ride"
  }
];

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
  overline: {
    lineHeight: 16,
    fontSize: 11.111,
    letterSpacing: 0.5,
    fontFamily: "DMSans-Bold",
    textTransform: "uppercase",
  },
  body: {
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.5,
    fontFamily: "DMSans-Regular",
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
    // flex: 1,
    paddingTop: 40,
    paddingHorizontal: 14,
  },
  transactionContainer: {
    width: "100%",
    paddingVertical: 12,
    flexDirection: "row",
    borderColor: "#f0f0f0",
    borderBottomWidth: 0.8,
    backgroundColor: "white",
    justifyContent: "space-between",
  },
  topContainer: {
    gap: 32,
    height: 220,
    paddingBottom: 28,
    alignItems: "center",
    borderBottomWidth: 1,
    justifyContent: "flex-end",
    borderColor: "hsl(0, 0%, 90%)",
  },
  bottomContainer: {
    flex: 1,
    marginBottom: 40,
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