// ============================================
// ✅ src/App.js — COMPLETE FINAL WORKING VERSION
// ============================================

import React, { useEffect, useState } from "react";
import { Provider, useDispatch } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ActivityIndicator, View, LogBox, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { setBackgroundColorAsync } from "expo-navigation-bar";
import * as Notifications from "expo-notifications";
import { removeNotificationSubscription } from "expo-notifications"; // ✅ add this helper

import * as Device from "expo-device";
import { NotificationProvider } from "./compo/Notification/NotificationContext.js";
// Redux store and navigation setup
import store, { persistor } from "./Redux/store.js";
import RootStack from "./Navigation/RootStack.js";
import { navigationRef } from "./Navigation/RootNavigation.js";

// Redux actions / thunks
import { fetchUserById } from "./Redux/Slice/Authentication/SignUp.js";
import { fetchReels } from "./Redux/Slice/Profile/reelNewDrop.js";
import {
  fetchMe,
  restoreSession,
} from "./Redux/Slice/Authentication/authSlice.js";
import { loadProfileFromStorage } from "./Redux/Slice/Profile/ProfileInformationSlice.js";
import { useNotifications } from "./compo/Notification/NotificationContext.js";
// ✅ NEW IMPORTS
import { getSocket } from "./services/socketService.js";
import { showLocalNotification } from "./services/Notification/pushNotifications.js";
import InAppNotificationPopup from "./compo/Notification/InAppNotificationPopup.js";

LogBox.ignoreLogs([
  "Require cycle:",
  "Non-serializable values were found in the navigation state",
]);

// ============================================
// ✅ PUSH NOTIFICATIONS SETUP
// ============================================
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function registerForPushNotifications() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
      sound: true,
      enableVibrate: true,
      showBadge: true,
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!");
      return false;
    }

    // Get the token that can be used for push notifications
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("✅ Push Token:", token);
  } else {
    console.log("⚠️ Must use physical device for Push Notifications");
  }

  console.log("✅ Push notifications enabled");
  return token;
}

// ============================================
// ✅ AppContent
// ============================================
function AppContent() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [inAppNotification, setInAppNotification] = useState(null); // ✅ In-app popup state
// ✅ ADD THIS LINE
  const { incrementBadge, updateBadge } = useNotifications();
  useEffect(() => {
    setBackgroundColorAsync("#000");
  }, []);

  // ✅ Setup push notifications
  useEffect(() => {
    let isMounted = true;

    // Register for push notifications
    registerForPushNotifications().then((token) => {
      if (isMounted && token) {
        console.log("✅ Push token obtained:", token);
      }
    });

    // Handle notification received while app is in FOREGROUND
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("🔔 Notification received (foreground):", notification);

        // ✅ Show in-app popup
        const from = notification.request.content.data?.from || "Someone";
        setInAppNotification({
          from: from,
          body: notification.request.content.body,
        });
      }
    );

    // Handle notification received while app is in BACKGROUND/KILLED
    const responseListener = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log("👆 User tapped notification (background/killed):", response);

        // Extract data and navigate
        const from = response.notification.request.content.data?.from;
        console.log("Notification data:", { from });

        // Navigate to notifications screen
        setTimeout(() => {
          navigationRef.current?.navigate("Notifications");
        }, 100);
      }
    );

    return () => {
  isMounted = false;
  try {
    removeNotificationSubscription(notificationListener);
    removeNotificationSubscription(responseListener);
  } catch (err) {
    console.warn("⚠️ Cleanup warning:", err);
  }
};
  }, []);

  // ✅ GLOBAL SOCKET LISTENERS (works on all screens) - FIXED VERSION
  // ✅ UPDATE the global socket listener section:
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      const username = state.signUpAuth?.user?.username;
      const userId = state.signUpAuth?.user?._id;

      if (username && userId && !window.__socketSetupDone) {
        window.__socketSetupDone = true;

        const socket = getSocket();
        console.log("🔌 Setting up global socket listeners for:", username);

        socket.emit("register", { username, userId });

        // ✅ UPDATE this handler
        const handleReceiveInvite = ({ from }) => {
          console.log("📨 GLOBAL: Invite received from:", from);

          // ✅ Increment badge count
          incrementBadge();

          // Show local notification
          showLocalNotification(
            "ReelChatt Invite",
            `${from} wants to watch reels with you!`,
            { from }
          );

          // Show in-app popup
          setInAppNotification({
            from: from,
            body: `${from} wants to watch reels with you!`,
          });
        };

        socket.on("receive_invite", handleReceiveInvite);

        // ✅ ADD this handler to sync badge on app start
        socket.on("pending_invites", (invites) => {
          console.log("📬 Syncing badge count on app start:", invites.length);
          updateBadge(invites.length);
        });

        socket.emit("get_pending_invites", { username });

        console.log("✅ Socket listeners attached successfully");
      }
    });

    return () => {
      unsubscribe();
      window.__socketSetupDone = false;
    };
  }, [incrementBadge, updateBadge]);// ✅ Empty deps - runs once, subscribes to store

  // ✅ Debug Redux state changes
  // ✅ GLOBAL SOCKET LISTENERS (works on all screens) - FIXED VERSION
// ✅ UPDATE the global socket listener section:
useEffect(() => {
  const unsubscribe = store.subscribe(() => {
    const state = store.getState();
    const username = state.signUpAuth?.user?.username;
    const userId = state.signUpAuth?.user?._id;

    if (username && userId && !window.__socketSetupDone) {
      window.__socketSetupDone = true;

      const socket = getSocket();
      console.log("🔌 Setting up global socket listeners for:", username);

      socket.emit("register", { username, userId });

      // ✅ UPDATE this handler
      const handleReceiveInvite = ({ from }) => {
        console.log("📨 GLOBAL: Invite received from:", from);

        // ✅ Increment badge count
        incrementBadge();

        // Show local notification
        showLocalNotification(
          "ReelChatt Invite",
          `${from} wants to watch reels with you!`,
          { from }
        );

        // Show in-app popup
        setInAppNotification({
          from: from,
          body: `${from} wants to watch reels with you!`,
        });
      };

      // ✅ ADD THIS NEW HANDLER HERE (after handleReceiveInvite)
      const handleNewRequest = ({ type, from, message,senderId  }) => {
        console.log("📨 GLOBAL: New request received:", { type, from });
        // ✅ Prevent duplicate notifications - check if already showing
  if (inAppNotification?.from === from && inAppNotification?.body === message) {
    console.log("⚠️ Duplicate notification prevented");
    return;
  }
        // Increment badge count
        incrementBadge();
        
        // Show local notification
        showLocalNotification(
          type === 'bond_request' ? 'Bond Request' : 'Special Friend Request',
          message,
          { from, type }
        );
        
        // Show in-app popup
        setInAppNotification({
          from: from,
          body: message,
        });
      };

      socket.on("receive_invite", handleReceiveInvite);
      socket.on('new_request', handleNewRequest); // ✅ ADD THIS LINE

      // ✅ ADD this handler to sync badge on app start
      socket.on("pending_invites", (invites) => {
        console.log("📬 Syncing badge count on app start:", invites.length);
        updateBadge(invites.length);
      });

      socket.emit("get_pending_invites", { username });

      console.log("✅ Socket listeners attached successfully");
    }
  });

  return () => {
    unsubscribe();
    window.__socketSetupDone = false;
  };
}, [incrementBadge, updateBadge]);

  // ✅ Initialize app data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await dispatch(loadProfileFromStorage()).unwrap?.();

        let restored = false;
        try {
          const r = await dispatch(restoreSession()).unwrap();
          if (r && r.token) {
            restored = true;
            try {
              await dispatch(fetchMe()).unwrap();
            } catch (err) {
              console.warn("fetchMe after restoreSession failed:", err);
            }
          }
        } catch (err) {
          console.info(
            "No persisted session found or restore failed:",
            err?.message || err
          );
        }

        if (!restored) {
          try {
            await dispatch(fetchMe()).unwrap();
          } catch (err) {
            console.info(
              "fetchMe fallback failed (no valid saved token):",
              err?.message || err
            );
          }
        }

        const state = store.getState();
        const userId = state.signUpAuth?.user?._id;
        if (userId) {
          try {
            await dispatch(fetchUserById(userId)).unwrap();
          } catch (err) {
            console.warn("fetchUserById warning:", err);
          }

          try {
            await dispatch(fetchReels()).unwrap();
          } catch (err) {
            console.warn("fetchReels warning:", err);
          }
        }
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, [dispatch]);
  useEffect(() => {
  // Listen for navigation state changes
  const unsubscribe = navigationRef.current?.addListener('state', () => {
    const currentRoute = navigationRef.current?.getCurrentRoute();
    
    // If user is on Notifications screen, clear badge
    if (currentRoute?.name === 'Notifications') {
      console.log("📍 User on Notifications screen - badge should be 0");
    }
  });

  return () => {
    if (unsubscribe) {
      unsubscribe();
    }
  };
}, []);

  // ✅ Popup handlers
  const handleInAppNotificationPress = () => {
    console.log("👆 In-app notification tapped");
    setInAppNotification(null);
    navigationRef.current?.navigate("Notifications");
  };

  const handleInAppNotificationDismiss = () => {
    console.log("❌ In-app notification dismissed");
    setInAppNotification(null);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  console.log("🎨 Rendering AppContent, inAppNotification:", inAppNotification);

  return (
    <>
      <RootStack />

      {/* ✅ IN-APP NOTIFICATION POPUP (renders on top of everything) */}
      <InAppNotificationPopup
        notification={inAppNotification}
        onPress={handleInAppNotificationPress}
        onDismiss={handleInAppNotificationDismiss}
      />
    </>
  );
}

// ============================================
// ✅ Root component
// ============================================
export default function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <StatusBar style="light" backgroundColor="#000" />
         <NotificationProvider>
          <NavigationContainer ref={navigationRef}>
            <AppContent />
          </NavigationContainer>
          </NotificationProvider>
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}