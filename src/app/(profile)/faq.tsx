import React from "react";
import { StyleSheet, Text, View } from "react-native";

import Accordion from "@/components/Accordion";


const faqItems = [
  {
    title: "What is CityRide about?",
    content: "React Native is a framework for building mobile apps using JavaScript and React."
  },
] satisfies {
  title: string;
  content: string;
}[];


const FaqPage = () => {
  return (
    <View style={{
      gap: 24,
      flex: 1,
      paddingVertical: 16,
      paddingHorizontal: 16,
      flexDirection: "column",
    }}>
      <View style={{ gap: 12 }}>
        {faqItems.map((item, index) => (
          <Accordion
            key={index}
            title={(
              <Text style={[{
                fontSize: 16,
                lineHeight: 20,
                letterSpacing: 0.5,
                fontFamily: "DMSans-Regular",
                width: "85%",
              }]}>{item.title}</Text>
            )}
            content={(
              <View style={styles.answerContainer}>
                <Text style={[{
                  lineHeight: 20,
                  fontSize: 13.333,
                  letterSpacing: 0.25,
                  fontFamily: "DMSans-Regular",
                }, styles.answerText]}>{item.content}</Text>
              </View>
            )}
          />
        ))}
      </View>
    </View>
  )
};

export default FaqPage;

const styles = StyleSheet.create({
  answerContainer: {
    paddingLeft: 0,
    paddingVertical: 8,
  },
  answerText: {
    color: "hsl(0, 0%, 70%)",
  },
  dropDown: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#F8F9FE",
    justifyContent: "space-between",
  }
})