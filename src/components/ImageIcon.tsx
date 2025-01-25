import React from "react";
import { Image, ImageSourcePropType, View, ViewStyle } from "react-native";


interface ImageIconProps {
  style: ViewStyle,
  icon: ImageSourcePropType;
}

const ImageIcon = ({ icon, style }: ImageIconProps): JSX.Element => {
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
  );
};


export default ImageIcon;