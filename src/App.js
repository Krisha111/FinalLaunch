// src/App.js
import React, { useEffect, useState } from "react";
import { Provider, useDispatch } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./Redux/store.js";
import { NavigationContainer } from "@react-navigation/native";
import RootStack from "./Navigation/RootStack.js";
import { ActivityIndicator, View } from "react-native";

// Redux actions
import { fetchUserById } from "./Redux/Slice/Authentication/SignUp.js";
import { fetchReels } from "./Redux/Slice/Profile/reelNewDrop.js";
import { fetchMe } from "./Redux/Slice/Authentication/authSlice.js";
import { loadProfileFromStorage } from "./Redux/Slice/Profile/ProfileInformationSlice.js"; // ✅ import this

function AppContent() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // ✅ Load profile from AsyncStorage first
        await dispatch(loadProfileFromStorage());

        // ✅ Then check authentication
        await dispatch(fetchMe()).unwrap?.();

        const state = store.getState();
        const userId = state.signUpAuth.user?._id;

        if (userId) {
          await dispatch(fetchUserById(userId)).unwrap?.();
          await dispatch(fetchReels()).unwrap?.();
        }
      } catch (err) {
        console.error("Init error:", err);
      } finally {
        setLoading(false);
      }
    };
    initializeApp();
  }, [dispatch]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return <RootStack />;
}

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <AppContent />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
