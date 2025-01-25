import React from "react";
import { View, StyleSheet, Pressable, ViewStyle } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";


// Define types for props
interface AccordionItemProps {
  isExpanded: { value: boolean }; // Shared value, assumed type
  children: React.ReactNode;
  viewKey?: string;
  style?: ViewStyle; // Optional style prop
  duration?: number; // Optional duration for the animation
}

const AccordionItem = ({
  isExpanded,
  children,
  viewKey,
  style,
  duration = 300,
}: AccordionItemProps): JSX.Element => {
  const height = useSharedValue(0);

  const derivedHeight = useDerivedValue(() =>
    withTiming(height.value * Number(isExpanded.value), {
      duration,
    })
  );
  const bodyStyle = useAnimatedStyle(() => ({
    height: derivedHeight.value,
  }));

  return (
    <Animated.View key={`accordionItem_${viewKey}`} style={[styles.animatedView, bodyStyle, style]}>
      <View
        onLayout={(e) => {
          height.value = e.nativeEvent.layout.height;
        }}
        style={styles.wrapper}
      >
        {children}
      </View>
    </Animated.View>
  );
};


interface AccordionProps {
  title: React.ReactNode;
  content: React.ReactNode;
}

const Accordion = ({ title, content }: AccordionProps): JSX.Element => {
  const [rotated, setRotated] = React.useState<boolean>(false);
  const [expanded, setExpanded] = React.useState<boolean>(false);

  const toggleIcons = () => setRotated(val => !val);
  const toggleAccordion = () => setExpanded(val => !val);

  const toggle = () => {
    toggleIcons();
    toggleAccordion();
  }

  return (
    <View>
      <Pressable style={styles.dropDown} onPress={toggle}>
        {title}
        <Ionicons style={{ transform: [{ rotate: rotated ? "90deg" : "0deg" }], }} name="chevron-forward-outline" size={18} color="grey" />
      </Pressable>

      <AccordionItem isExpanded={{ value: expanded }}>
        {content}
      </AccordionItem>
    </View>
  );
}

export default Accordion;

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    position: "absolute",
    display: "flex",
    alignItems: "center",
  },
  animatedView: {
    width: "100%",
    overflow: "hidden",
  },
  answerContainer: {
    paddingLeft: 0,
  },
  answerText: {
    fontSize: 16,
    color: "grey",
  },
  dropDown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F8F9FE",
  }
});
