import React from "react";
import { StyleSheet, View } from "react-native";

import Markdown from "react-native-markdown-display";

import ColorTheme from "@/design-system/themes/color";
import Typography from "@/design-system/themes/typography";

const body = `
We"re here to assist you with any questions, issues, or feedback regarding the app. Explore the following options to find answers or get in touch with us:

> Check out our FAQs section for quick answers to common questions about app features and functionality.

#### Here are some tips to resolve common issues:
* **Location not working**: Ensure your device"s GPS is enabled and that the app has permission to access your location.
* **App crashes or freezes**: Restart your device and check for app updates in the app store.

> If these don"t resolve your issue, please contact us using the options below.

#### Contact us if you need personalized assistance:

- **Email:** [support@appdomain.com](mailto:support@appdomain.com)
- **Phone:** [+1 (123) 456-7890](tel:+1-123-456-7890)
`

const HelpPage = () => {
  return (
    <View style={styles.container}>
      <Markdown style={{
        heading4: {
          ...Typography.heading5,
          fontSize: 18,
          paddingVertical: 16,
          fontFamily: "Nunito-SemiBold",
        },
        blockquote: {
          borderLeftWidth: 0,
          paddingVertical: 4,
          backgroundColor: "transparent",
          color: ColorTheme.neutralDarkModeLight,
        },
        heading3: {
          ...Typography.heading4,
          lineHeight: 40,
        },
        strong: {
          ...Typography.body,
          // fontWeight: "700",
          fontFamily: "Nunito-Semibold",
        },
        link: {
          color: "rgb(49, 97, 255)",
        },
        body: {
          ...Typography.body,
          color: ColorTheme.neutralDarkModeDarkest
        },
      }}>
        {body}
      </Markdown>
    </View>
  )
}

export default HelpPage

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  }
})