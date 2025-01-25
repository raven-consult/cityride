import React from "react";
import { View, Text, Pressable, ToastAndroid as Toast, StyleSheet, TouchableOpacity } from "react-native";

import { useRouter } from "expo-router";
import auth from "@react-native-firebase/auth";
import analytics from "@react-native-firebase/analytics";
import { Paystack, paystackProps } from "react-native-paystack-webview";

import { initializeTransaction } from "@/services/payment";

const PAYSTACK_PUBLIC_KEY = process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY || "";


const FundWallet = (): JSX.Element => {
  const router = useRouter();
  const currentUser = auth().currentUser;
  const paystackRef = React.useRef<paystackProps.PayStackRef>(null);

  const txRef = React.useMemo(() => {
    return `${currentUser?.uid}-${Date.now()}`;
  }, [currentUser]);

  const [amount, setAmount] = React.useState<number>(0);

  const onSubmit = async (value: string) => {
    if (!paystackRef.current) return;

    await initializeTransaction(
      currentUser?.uid || "",
      txRef,
    );

    setAmount(parseFloat(value));
    paystackRef.current.startTransaction();
  };

  const onCancel = () => {
    analytics().logEvent("fund_account_cancelled", {
      txRef,
    });

    const message = "Transaction cancelled";
    Toast.show(message, Toast.SHORT);
  }

  const onSuccess = () => {
    analytics().logEvent("fund_account_successful", {
      txRef,
      amount,
    });

    const message = "Transaction successful";
    Toast.show(message, Toast.SHORT);
    router.back();
  }

  return (
    <View style={styles.container}>
      <NumberPad
        onSubmit={onSubmit}
      />

      <Paystack
        // @ts-ignore
        ref={paystackRef}

        amount={amount}
        refNumber={txRef}
        onCancel={onCancel}
        onSuccess={onSuccess}
        activityIndicatorColor="green"
        paystackKey={PAYSTACK_PUBLIC_KEY}
        billingEmail={currentUser?.email || ""}
      />
    </View>
  );
};


export default FundWallet;

const textStyles = StyleSheet.create({
  heading2: {
    fontSize: 33.177,
    letterSpacing: 0.5,
    fontFamily: "DMSans-SemiBold",
  },
  heading4: {
    fontSize: 23.04,
    letterSpacing: 0.25,
    fontFamily: "DMSans-Bold",
  },
  overline: {
    fontSize: 11.111,
    lineHeight: 16,
    letterSpacing: 0.5,
    fontFamily: "DMSans-Bold",
    textTransform: "uppercase",
  },
})


const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    justifyContent: "space-between",
  },
  displayContainer: {
    height: "18%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 40,
  },
  numbersText: {
    fontSize: 32,
    letterSpacing: 2,
    marginRight: 10,
  },
  backspaceText: {
    fontSize: 24,
    color: "#666",
  },
  dialPadContainer: {
    flex: 1,
    marginTop: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  numberButton: {
    width: 90,
    height: 90,
    borderRadius: 35,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  numberText: {
    color: "#000",
    fontFamily: "Nunito-SemiBold",
  },
});


interface NumberPadProps {
  onSubmit: (amount: string) => void;
}

const NumberPad = ({ onSubmit }: NumberPadProps): JSX.Element => {
  const [numbers, setPhoneNumber] = React.useState("");

  const numberPad = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    [".", "0", "Pay"],
  ];

  const handleNumberPress = (num: string) => {
    setPhoneNumber(prevNumber => prevNumber + num);
  };

  const handleClear = () => {
    setPhoneNumber("");
  };

  const handleSubmit = () => {
    onSubmit(numbers);
  }

  const formatString = (number: string) => {
    // Check if number has decimal point
    if (number.includes(".")) {
      const [integer, decimal] = number.split(".");
      return `${Number(integer).toLocaleString()}.${decimal}`;
    } else {
      return Number(number).toLocaleString();
    }
  }

  return (
    <View style={{
      flex: 1,
    }}>
      <View style={styles.displayContainer}>
        {numbers.length > 0 ? (
          <>
            <Text style={[textStyles.heading2, styles.numbersText]}>₦</Text>
            <Text style={[textStyles.heading2]}>{formatString(numbers)}</Text>
          </>
        ) : (
          <Text style={[
            textStyles.heading2,
            { color: "hsl(0, 0%, 80%)" },
          ]}>
            ₦ 0.00
          </Text>
        )}
      </View>

      <View style={{
        alignItems: "center",
        justifyContent: "center",
      }}>
        {numbers.length > 0 ? (
          <Pressable onPress={handleClear}>
            <Text style={[
              textStyles.overline,
              { color: "hsl(0, 0%, 30%)" },
            ]}>Clear Amount</Text>
          </Pressable>
        ) : (
          <Text style={[
            textStyles.overline,
            { color: "hsl(0, 0%, 80%)" },
          ]}></Text>
        )}
      </View>


      {/* Number pad grid */}
      <View style={styles.dialPadContainer}>
        {numberPad.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((num) => (
              <TouchableOpacity
                key={num}
                style={[
                  styles.numberButton,
                  num === "Pay" && { backgroundColor: "green" },
                ]}
                onPress={
                  num === "Pay"
                    ? () => handleSubmit()
                    : () => handleNumberPress(num)
                }
              >
                <Text style={[
                  textStyles.heading4,
                  styles.numberText,
                  num === "Pay" && { color: "white" },
                ]}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};
