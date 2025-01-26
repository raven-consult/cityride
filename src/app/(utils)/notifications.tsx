import React from "react";
import { Text, View, StyleSheet } from "react-native";

import { StatusBar } from "expo-status-bar";
import * as ExpoNotification from "expo-notifications";

import { formatDistance } from "date-fns";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS } from "react-native-reanimated";

import { INotification } from "@/types";
import { getAllNotifications } from "@/services/notifications";


const Notifications = (): JSX.Element => {
  const [notifications, setNotifications] = React.useState<INotification[]>([]);

  React.useEffect(() => {
    const sub = ExpoNotification.addNotificationReceivedListener((notification) => {
      const { title, body } = notification.request.content;
      setNotifications((prev) => [
        {
          date: new Date(),
          title: title || "",
          description: body || "",
        },
        ...prev,
      ]);
    });

    return () => {
      sub.remove();
    };
  }, []);

  React.useEffect(() => {
    (async () => {
      const notification = await getAllNotifications();
      setNotifications(notification);
    })
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="white" translucent={false} />
      <View style={styles.notificationContainer}>
        {notifications.map((item, index) => (
          <NotificationItem
            key={index}
            notification={item}
            onDismiss={() => {
              setNotifications((prev) => prev.filter((_, i) => i !== index));
            }}
          />
        ))}
      </View>
    </View>
  );
};

interface NotificationItemProps {
  onDismiss: () => void;
  notification: INotification;
}

const NotificationItem = ({ notification, onDismiss }: NotificationItemProps): JSX.Element => {
  const itemHeight = useSharedValue(70); // Adjust based on your item height
  const isRemoved = useSharedValue(false);
  const notificationSwipePos = useSharedValue(0);

  const date = formatDistance(notification.date, new Date(), { addSuffix: true })

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{
        translateX: notificationSwipePos.value,
      }],
      height: withTiming(isRemoved.value ? 0 : itemHeight.value),
      opacity: withTiming(isRemoved.value ? 0 : 1),
    }
  });

  const pan = Gesture.Pan()
    .minDistance(1)
    .onUpdate((event) => {
      notificationSwipePos.value = event.translationX;
    })
    .onEnd((event) => {
      const shouldDismiss = Math.abs(event.translationX) > 100;

      if (shouldDismiss) {
        notificationSwipePos.value = withSpring(
          event.translationX > 0 ? 400 : -400,
          { damping: 20 }
        );
        isRemoved.value = true;
        runOnJS(onDismiss)();
      } else {
        notificationSwipePos.value = withSpring(0);
      }
    });

  return (
    <View style={styles.notificationParentContainer}>
      <GestureDetector gesture={pan}>
        <Animated.View
          style={[styles.notificationItemContainer, animatedStyle]}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={textStyles.mainText}>{notification.title}</Text>
            <Text style={textStyles.subText}>{date}</Text>
          </View>
          <Text style={textStyles.subText}>{notification.description}</Text>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const textStyles = StyleSheet.create({
  mainText: {
    fontSize: 18,
    fontFamily: "DMSans-SemiBold",
  },
  subText: {
    fontSize: 13.5,
    fontFamily: "DMSans-Light",
  }
})


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notificationContainer: {
    gap: 12,
    marginTop: 12,
    paddingHorizontal: 12,
  },
  notificationParentContainer: {
    overflow: "hidden",
    marginVertical: 4,
  },
  notificationItemContainer: {
    backgroundColor: "hsl(0, 0%, 95%)",
    padding: 16,
    borderRadius: 8,
  }
});


export default Notifications;