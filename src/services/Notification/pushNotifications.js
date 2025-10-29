import * as Notifications from "expo-notifications";

export async function showLocalNotification(title, body) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
      data: { type: "invite" },
    },
    trigger: null, // Show immediately
  });
}