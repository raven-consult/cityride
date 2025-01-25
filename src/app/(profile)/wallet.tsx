import React from "react";
import { Text, View, ToastAndroid as Toast, ActivityIndicator, StyleSheet, ScrollView, ViewStyle, ImageSourcePropType, Pressable, Linking } from "react-native";

import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

import { useRouter } from "expo-router";
import Feather from "@expo/vector-icons/Feather";

import { Transaction } from "@/types";
import Spacer from "@/components/Spacer";
import ImageIcon from "@/components/ImageIcon";
import { getLastTransactions, getWallet } from "@/services/wallet";

import ArrowLeftIcon from "@/assets/icons/arrow_left.svg";


const Wallet = (): JSX.Element => {
  const router = useRouter();

  const [loading, setLoading] = React.useState<boolean>(false);
  const [balance, setBalance] = React.useState<number | null>(null);
  const [transactions, setTransactions] = React.useState<Transaction[] | null>(null);
  const [currentUser, setCurrentUser] = React.useState<FirebaseAuthTypes.User | null>(null);

  React.useEffect(() => {
    const subscriber = auth()
      .onAuthStateChanged((user: FirebaseAuthTypes.User | null) => {
        if (user) {
          setCurrentUser(user);
        }
      });
    return () => subscriber();
  }, []);

  React.useEffect(() => {
    (async () => {
      if (!currentUser) return null;
      setLoading(true);

      await Promise.all([
        (async () => {
          try {
            const wallet = await getWallet(currentUser.uid);
            setBalance(wallet.balance);
          } catch (error: any) {
            console.error(error);
            const message = `Error: ${error.message}`;
            const duration = Toast.LONG;
            Toast.show(message, duration);
          }
        })(),
        (async () => {
          try {
            const transactions = await getLastTransactions(currentUser.uid);
            setTransactions(transactions);
          } catch (error: any) {
            console.error(error);
            const message = `Error: ${error.message}`;
            const duration = Toast.LONG;
            Toast.show(message, duration);
          }
        })(),
      ]);
      setLoading(false);
    })();
  }, [currentUser]);

  const onPressWithdraw = () => {
    Linking.openURL("tel:08184223451");
  }

  const formattedBalance = React.useMemo(() => {
    if (!balance) return "0.00";

    const wholeNumber = Math.floor(balance);
    const decimal = (balance - wholeNumber).toFixed(2).split(".")[1];

    return `${wholeNumber.toLocaleString()}.${decimal}`;
  }, [balance]);

  const TopContainer = (
    <View style={styles.topContainer}>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Text style={textStyles.balanceText}>₦{formattedBalance}</Text>
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
        {transactions && transactions.map((transaction, index) => (
          <TransactionItem
            key={index}
            transaction={transaction}
          />
        ))}
      </View>
    </View>
  );

  return (
    <>
      {loading && (
        <View style={{
          height: "100%",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <ActivityIndicator
            size={100}
            color="black"
          />
        </View>
      )}
      {!loading && (
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
              <ImageIcon icon={ArrowLeftIcon} style={{ width: 26, height: 26 }} />
            </Pressable>
          </View>
          {TopContainer}
          <Spacer height={12} />
          {BottomContainer}
        </ScrollView>
      )}
    </>
  );
};


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