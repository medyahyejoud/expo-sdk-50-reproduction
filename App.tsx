import "expo-dev-client";

import "intl";
import "intl/locale-data/jsonp/de-DE";

import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { useEffect, useRef } from "react";
import { Alert, Platform, Text, View } from "react-native";
import { openSettings } from "expo-linking";
import Constants from "expo-constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const responseListener = useRef<Notifications.Subscription | undefined>();
  const notificationListener = useRef<Notifications.Subscription | undefined>();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => console.log({ token }));

    notificationListener.current =
      Notifications.addNotificationReceivedListener(notification => {
        console.log("notification", JSON.stringify(notification, null, 2));
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );

      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <View style={{ flex: 1, alignSelf: "center", justifyContent: "center" }}>
      <Text style={{ fontFamily: "Metropolis-Bold" }}>
        Minimal reproducible example
      </Text>
    </View>
  );
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      Alert.alert(
        "Error",
        "Sorry, we need your permission to enable Push Notifications. Please enable it in your privacy settings.",
        [
          {
            text: "OK",
          },
          {
            text: "Open Settings",
            onPress: async () => openSettings(),
          },
        ]
      );

      return undefined;
    }

    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas.projectId,
    });

    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token?.data;
}
