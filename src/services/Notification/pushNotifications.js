// ============================================
// ✅ src/services/Notification/pushNotifications.js - COMPLETE VERSION
// ============================================

import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

// ✅ Configure notification behavior globally
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Register for push notifications and get push token
 * @returns {Promise<string|null>} Push token or null if registration failed
 */
export async function registerForPushNotificationsAsync() {
  let token = null;

  // ✅ Configure Android notification channel
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
      sound: true,
      enableVibrate: true,
      showBadge: true,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: false,
    });
  }

  // ✅ Only works on physical devices
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // ✅ Request permission if not granted
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("❌ Failed to get push notification permissions!");
      return null;
    }

    // ✅ Get the push token
    try {
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log("✅ Push Token obtained:", token);
    } catch (error) {
      console.error("❌ Error getting push token:", error);
    }
  } else {
    console.log("⚠️ Must use physical device for Push Notifications");
  }

  return token;
}

/**
 * Show a local notification immediately
 * @param {string} title - Notification title
 * @param {string} body - Notification body text
 * @param {object} data - Additional data to pass with notification
 * @returns {Promise<string>} Notification identifier
 */
export async function showLocalNotification(title, body, data = {}) {
  console.log("📤 Sending notification:", { title, body, data });

  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.MAX,
        data: { type: "invite", ...data },
        badge: 1,
        vibrate: [0, 250, 250, 250],
        autoDismiss: false,
        sticky: false,
        // ✅ Android specific
        ...(Platform.OS === "android" && {
          channelId: "default",
          color: "#ff4444",
        }),
        // ✅ iOS specific
        ...(Platform.OS === "ios" && {
          sound: "default",
        }),
      },
      trigger: null, // Show immediately
    });

    console.log("✅ Notification scheduled successfully, ID:", notificationId);
    return notificationId;
  } catch (error) {
    console.error("❌ Failed to schedule notification:", error);
    throw error;
  }
}

/**
 * Schedule a notification for a future time
 * @param {string} title - Notification title
 * @param {string} body - Notification body text
 * @param {number} seconds - Seconds from now to trigger notification
 * @param {object} data - Additional data to pass with notification
 * @returns {Promise<string>} Notification identifier
 */
export async function scheduleNotification(title, body, seconds, data = {}) {
  console.log(`📅 Scheduling notification for ${seconds} seconds from now`);

  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: { type: "scheduled", ...data },
        badge: 1,
      },
      trigger: {
        seconds: seconds,
      },
    });

    console.log("✅ Notification scheduled, ID:", notificationId);
    return notificationId;
  } catch (error) {
    console.error("❌ Failed to schedule notification:", error);
    throw error;
  }
}

/**
 * Cancel a scheduled notification
 * @param {string} notificationId - Notification identifier to cancel
 */
export async function cancelNotification(notificationId) {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    console.log("✅ Notification cancelled:", notificationId);
  } catch (error) {
    console.error("❌ Failed to cancel notification:", error);
  }
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log("✅ All notifications cancelled");
  } catch (error) {
    console.error("❌ Failed to cancel all notifications:", error);
  }
}

/**
 * Get all scheduled notifications
 * @returns {Promise<Array>} Array of scheduled notifications
 */
export async function getAllScheduledNotifications() {
  try {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    console.log("📋 Scheduled notifications:", notifications.length);
    return notifications;
  } catch (error) {
    console.error("❌ Failed to get scheduled notifications:", error);
    return [];
  }
}

/**
 * Dismiss a notification from the notification tray
 * @param {string} notificationId - Notification identifier to dismiss
 */
export async function dismissNotification(notificationId) {
  try {
    await Notifications.dismissNotificationAsync(notificationId);
    console.log("✅ Notification dismissed:", notificationId);
  } catch (error) {
    console.error("❌ Failed to dismiss notification:", error);
  }
}

/**
 * Dismiss all notifications from the notification tray
 */
export async function dismissAllNotifications() {
  try {
    await Notifications.dismissAllNotificationsAsync();
    console.log("✅ All notifications dismissed");
  } catch (error) {
    console.error("❌ Failed to dismiss all notifications:", error);
  }
}

/**
 * Get badge count (iOS only)
 * @returns {Promise<number>} Current badge count
 */
export async function getBadgeCount() {
  if (Platform.OS === "ios") {
    try {
      const count = await Notifications.getBadgeCountAsync();
      console.log("📛 Badge count:", count);
      return count;
    } catch (error) {
      console.error("❌ Failed to get badge count:", error);
      return 0;
    }
  }
  return 0;
}

/**
 * Set badge count (iOS only)
 * @param {number} count - Badge count to set
 */
export async function setBadgeCount(count) {
  if (Platform.OS === "ios") {
    try {
      await Notifications.setBadgeCountAsync(count);
      console.log("📛 Badge count set to:", count);
    } catch (error) {
      console.error("❌ Failed to set badge count:", error);
    }
  }
}

/**
 * Clear badge (iOS only)
 */
export async function clearBadge() {
  await setBadgeCount(0);
}

// ✅ Export default object with all functions
export default {
  registerForPushNotificationsAsync,
  showLocalNotification,
  scheduleNotification,
  cancelNotification,
  cancelAllNotifications,
  getAllScheduledNotifications,
  dismissNotification,
  dismissAllNotifications,
  getBadgeCount,
  setBadgeCount,
  clearBadge,
};