2. 
import React, { useEffect, useState, useCallback } from "react";
import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";

import AppLayout from "./AppLayout.js";
import ReelStack from "./ReelStack.js";
import Sampleeee from "../src/components/sampleeee.js";
import ProfileStack from "./ProfileStack.js";

export default function MainTabs() {
  const [currentTab, setCurrentTab] = useState("HomeTab");
 const [hideBottomNav, setHideBottomNav] = React.useState(false);

// ✅ Prevent reset on re-render
useEffect(() => {
  console.log("🔹 MainTabs mounted - hideBottomNav:", hideBottomNav);
}, []); // no reset here

useEffect(() => {
  console.log("🔹 hideBottomNav changed to:", hideBottomNav);
}, [hideBottomNav]);

  const [profileUserId, setProfileUserId] = useState(null);
  const route = useRoute();
  // Add right after your state declarations
useEffect(() => {
  console.log("🔹 MainTabs mounted - hideBottomNav:", hideBottomNav);
  console.log("🔹 CurrentTab:", currentTab);
}, []);

useEffect(() => {
  console.log("🔹 hideBottomNav changed to:", hideBottomNav);
}, [hideBottomNav]);

  // 🔹 GLOBAL FIX: Force bottom nav to be visible on mount and after hot reload
 // 🔹 Only reset bottom nav when switching AWAY from Sampleeee tab
 // Re-run when tab changes

  // Switch tab if navigated from RootStack with params
  useEffect(() => {
    if (route.params?.screen === "ProfileTab") {
      setCurrentTab("ProfileTab");
      if (route.params?.params?.userId) {
        setProfileUserId(route.params.params.userId);
      }
    }
  }, [route.params]);

  // Load last selected tab from SecureStore
  useEffect(() => {
    const loadLastTab = async () => {
      try {
        const savedTab = await SecureStore.getItemAsync("lastTab");
        if (savedTab) setCurrentTab(savedTab);
      } catch (err) {
        console.warn("Error loading lastTab:", err);
      }
    };
    loadLastTab();
  }, []);

  const handleTabChange = async (tabName, userId = null) => {
    setCurrentTab(tabName);
    
    if (tabName === "ProfileTab" && userId) {
      setProfileUserId(userId);
    } else if (tabName === "ProfileTab" && !userId) {
      setProfileUserId(null);
    }
    
    // 🔹 Always show bottom nav when switching tabs
    setHideBottomNav(false);
    
    try {
      await SecureStore.setItemAsync("lastTab", tabName);
    } catch (err) {
      console.warn("Error saving lastTab:", err);
    }
  };

  const handleNavigateToProfile = (userId) => {
    console.log("MainTabs: Navigating to profile with userId:", userId);
    handleTabChange("ProfileTab", userId);
  };
  const handleBackFromReels = () => {
     console.log("🔙 handleBackFromReels called");
  handleTabChange("Sampleeee");
};

// REPLACE the useEffect that handles currentTab !== "Sampleeee" with:

useEffect(() => {
  if (currentTab === "HomeTab") {
    setHideBottomNav(true);
  } else {
    setHideBottomNav(false);
  }
}, [currentTab]);

  // 🔹 Wrapped setHideBottomNav to always log and prevent unwanted hiding
  const safeSetHideBottomNav = useCallback((value) => {
    console.log("🔹 Bottom nav visibility change requested:", value);
    setHideBottomNav(value);
  }, []);

  // ------------------- Determine which content to render -------------------
  let content;

  switch (currentTab) {
    case "HomeTab":
      content = <ReelStack
      onBackPress={handleBackFromReels}
         setHideBottomNav={safeSetHideBottomNav} // ✅ added
       onNavigateToProfile={handleNavigateToProfile} 
       />;
      break;
    case "Sampleeee":
      content = <Sampleeee onNavigateToProfile={handleNavigateToProfile} setHideBottomNav={safeSetHideBottomNav} />;
      break;
    case "ProfileTab":
      content = <ProfileStack 
 onNavigateToProfile={handleNavigateToProfile}
      initialUserId={profileUserId} />;
      break;
    default:
      content = <ReelStack 
      onNavigateToProfile={handleNavigateToProfile}
       setHideBottomNav={safeSetHideBottomNav}
           onBackPress={handleBackFromReels}
      />;
      break;
  }

  // ------------------- Bottom navigation component -------------------
  const BottomNav = (
    <View style={styles.navContainer}>
      <TouchableOpacity onPress={() => handleTabChange("HomeTab")} style={styles.navItem}>
        <MaterialCommunityIcons
          name="motion-play"
          color={currentTab === "HomeTab" ? "black" : "gray"}
          size={30}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleTabChange("Sampleeee")} style={styles.navItem}>
        <MaterialCommunityIcons
          name="movie-roll"
          color={currentTab === "Sampleeee" ? "black" : "gray"}
          size={30}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleTabChange("ProfileTab", null)} style={styles.navItem}>
        <MaterialCommunityIcons
          name="account"
          color={currentTab === "ProfileTab" ? "black" : "gray"}
          size={30}
        />
      </TouchableOpacity>
    </View>
  );

  return <AppLayout
   key={currentTab}
   children={content}
    bottomTab={!hideBottomNav ? BottomNav : null} />;
}

const styles = StyleSheet.create({
  navContainer: {
    width: "100%",
    height:"100%",
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "space-around",
    // borderColor:"blue",
    // borderWidth:4,
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? 8 : 12,
    borderTopColor: "rgba(0,0,0,0.12)",
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
  },
});