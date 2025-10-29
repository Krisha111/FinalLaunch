// ============================================
// ✅ src/App.js — FINAL VERSION (with black Android navbar + Push Notifications)
// ============================================

import React, { useEffect, useState } from "react";
import { Provider, useDispatch } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ActivityIndicator, View, LogBox, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { setBackgroundColorAsync } from "expo-navigation-bar";
import * as Notifications from "expo-notifications"; // ✅ NEW

// Redux store and navigation setup
import store, { persistor } from "./Redux/store.js";
import RootStack from "./Navigation/RootStack.js";
import { navigationRef } from "./Navigation/RootNavigation.js"; // ✅ Global ref

// Redux actions / thunks
import { fetchUserById } from "./Redux/Slice/Authentication/SignUp.js";
import { fetchReels } from "./Redux/Slice/Profile/reelNewDrop.js";
import {
  fetchMe,
  restoreSession,
} from "./Redux/Slice/Authentication/authSlice.js";
import { loadProfileFromStorage } from "./Redux/Slice/Profile/ProfileInformationSlice.js";

// ✅ Suppress known non-actionable warnings during dev
LogBox.ignoreLogs([
  "Require cycle:",
  "Non-serializable values were found in the navigation state",
]);

// ============================================
// ✅ PUSH NOTIFICATIONS SETUP (OUTSIDE COMPONENT)
// ============================================
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// ✅ Register for push notifications function
async function registerForPushNotifications() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

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

  console.log("✅ Push notifications enabled");
  return true;
}

// ============================================
// ✅ AppContent (handles session + initial data loading)
// ============================================
function AppContent() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  // ✅ Set Android navigation bar to black
  useEffect(() => {
    setBackgroundColorAsync("#000");
  }, []);

  // ✅ Setup push notifications
  useEffect(() => {
    // Register for push notifications
    registerForPushNotifications();

    // Handle notification received while app is foregrounded
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("🔔 Notification received:", notification);
      }
    );

    // Handle user tapping on notification
    const responseListener = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log("👆 User tapped notification");
        // Navigate to notifications screen when user taps notification
        navigationRef.current?.navigate("Notifications");
      }
    );

    // Cleanup
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // 1️⃣ Load persisted profile data if available
        await dispatch(loadProfileFromStorage()).unwrap?.();

        // 2️⃣ Restore user session from storage (token + user)
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

        // 3️⃣ Fallback to fetchMe if restoreSession didn't find anything
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

        // 4️⃣ Fetch user-dependent data (profile, reels)
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

  // ⏳ Loading indicator while app initializes
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return <RootStack />;
}

// ============================================
// ✅ Root component
// ============================================
export default function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {/* ✅ Set system status bar style & color */}
          <StatusBar style="light" backgroundColor="#000" />

          {/* ✅ Global navigation container */}
          <NavigationContainer ref={navigationRef}>
            <AppContent />
          </NavigationContainer>
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}