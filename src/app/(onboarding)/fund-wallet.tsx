import React from "react";

import { View, Text, StyleSheet, Pressable, TextInput, Keyboard } from "react-native";

import * as Burnt from "burnt";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import auth from "@react-native-firebase/auth";
import { Paystack, paystackProps } from "react-native-paystack-webview";

import EditIcon from "@/assets/icons/edit.svg";
import { initializeTransaction } from "@/services/payment";


const PAYSTACK_PUBLIC_KEY = process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY || "";


const FundWallet = (): JSX.Element => {
  const [isFocused, setIsFocused] = React.useState<boolean>(false);

  const router = useRouter();
  const currentUser = auth().currentUser;
  const paystackRef = React.useRef<paystackProps.PayStackRef>(null);

  const txRef = React.useMemo(() => {
    return `${currentUser?.uid}-${Date.now()}`;
  }, [currentUser]);

  const [amount, setAmount] = React.useState<string>("");

  const onSubmit = async () => {
    if (!paystackRef.current) return;

    await initializeTransaction(
      currentUser?.uid || "",
      txRef,
    );

    paystackRef.current.startTransaction();
  };

  const onCancel = () => {
    // analytics().logEvent("fund_account_cancelled", {
    //   txRef,
    // });

    const message = "Transaction cancelled";
    // Toast.show(message, Toast.SHORT);
    Burnt.toast({
      title: message,
      preset: "error",
      message: "Your wallet was not funded",
    });
  }

  const onSuccess = () => {
    // analytics().logEvent("fund_account_successful", {
    //   txRef,
    //   amount,
    // });

    const message = "Transaction successful";
    router.replace("/(app)/home");
    Burnt.toast({
      title: message,
      preset: "done",
      message: "Your wallet has been funded successfully",
    });
  }

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
    <View style={styles.container}>
      <StatusBar backgroundColor="white" translucent={false} />
      <View style={styles.mainContentContainer}>
        <View style={{ gap: 8 }}>
          <View style={{ alignItems: "center", flexDirection: "row", gap: 8 }}>
            <Text style={textStyles.nairaText}>₦</Text>
            <TextInput
              placeholder="00.00"
              keyboardType="numeric"
              onChangeText={setAmount}
              style={[textStyles.textInput]}
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
          <Text style={[textStyles.descriptionText, { width: "80%" }]}>
            Get 100% discount on transaction fees
            for your first deposit
          </Text>
        </View>
        <Pressable
          onPress={onSubmit}
          style={{
            padding: 16,
            borderRadius: 8,
            width: "50%",
            alignItems: "center",
            backgroundColor: "black",
            justifyContent: "center",
          }}>
          <Text style={textStyles.ctaText}>Checkout</Text>
        </Pressable>
      </View>
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
  nairaText: {
    fontSize: 48,
    fontFamily: "DMSans-Regular",
  },
  textInput: {
    fontSize: 48,
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
    gap: 8,
    paddingTop: 48,
    paddingHorizontal: 16,
  },
  mainContentContainer: {
    gap: 32,
  },
});