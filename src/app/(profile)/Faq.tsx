import React from "react";
import { StyleSheet, Text, View } from "react-native";

import ColorTheme from "@/design-system/themes/color";
import Typography from "@/design-system/themes/typography";
import Accordion from "@/design-system/components/Accordion";


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
              <Text style={[Typography.body, {
                width: "85%",
              }]}>{item.title}</Text>
            )}
            content={(
              <View style={styles.answerContainer}>
                <Text style={[Typography.caption, styles.answerText]}>{item.content}</Text>
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
    color: ColorTheme.neutralDarkModeLight,
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