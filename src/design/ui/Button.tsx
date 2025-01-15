import React from "react";

import { Pressable } from "react-native";

interface ButtonProps {
  onPress: () => void;
  children: React.ReactNode;
}

export const Button = ({ children, onPress }: ButtonProps): JSX.Element => {
  return (
    <Pressable>
      {children}
    </Pressable>
  );
};

export const TextButton = ({ children, onPress }: ButtonProps): JSX.Element => {
  return (
    <Pressable onPress={onPress}>
      {children}
    </Pressable>
  );
};


export default Button;