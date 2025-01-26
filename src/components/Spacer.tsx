import React from "react";

import { View, DimensionValue } from "react-native";


interface SpacerProps {
  width?: DimensionValue;
  height?: DimensionValue;
}

const Spacer = ({ width = 0, height = 0 }: SpacerProps) => {
  return (
    <View
      style={{
        height: height,
        width: width
      }}
    />
  );
};

export default Spacer;