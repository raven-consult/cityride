import { useFonts } from "expo-font";

const useDMSans = () => {
  const [loaded, error] = useFonts({
    "DMSans-Bold": require("./DMSans-Bold.ttf"),
    "DMSans-Black": require("./DMSans-Black.ttf"),
    "DMSans-Light": require("./DMSans-Light.ttf"),
    "DMSans-Italic": require("./DMSans-Italic.ttf"),
    "DMSans-Regular": require("./DMSans-Regular.ttf"),
    "DMSans-SemiBold": require("./DMSans-SemiBold.ttf"),
    "DMSans-ExtraBold": require("./DMSans-ExtraBold.ttf"),
    "DMSans-BoldItalic": require("./DMSans-BoldItalic.ttf"),
    "DMSans-ExtraLight": require("./DMSans-ExtraLight.ttf"),
    "DMSans-BlackItalic": require("./DMSans-BlackItalic.ttf"),
    "DMSans-LightItalic": require("./DMSans-LightItalic.ttf"),
    "DMSans-SemiBoldItalic": require("./DMSans-SemiBoldItalic.ttf"),
    "DMSans-ExtraBoldItalic": require("./DMSans-ExtraBoldItalic.ttf"),
    "DMSans-ExtraLightItalic": require("./DMSans-ExtraLightItalic.ttf"),
  });
  return [loaded, error];
};

export default useDMSans;