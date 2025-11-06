// src/navigation/ReelStack.js - COMPLETE WORKING VERSION
// This file receives onNavigateToProfile from MainTabs and passes it to ReelPlayer

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ReelTalk from "../compo/ReelTalk";
import ReelInformation from "../compo/ReelChat/ReelInformation";
import ReelPlayer from "../compo/ReelScreen";
import ChatScreen from "../compo/ReelChat/ChatScreen";

const Stack = createNativeStackNavigator();

// ✅ Receives onNavigateToProfile, onBackPress, and setHideBottomNav props from MainTabs
export default function ReelStack({ onNavigateToProfile, onBackPress, setHideBottomNav }) {
  console.log("ReelStack: Received props:", {
    onNavigateToProfile: !!onNavigateToProfile,
    onBackPress: !!onBackPress,
    setHideBottomNav: !!setHideBottomNav,
  });
  
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* ✅ CRITICAL: Use children function to pass props to ReelPlayer */}
      <Stack.Screen name="ReelScreen">
        {(props) => {
          console.log("ReelStack: Passing props to ReelPlayer");
          return (
            <ReelPlayer
              {...props}
              onNavigateToProfile={onNavigateToProfile}
              onBackPress={onBackPress}
              setHideBottomNav={setHideBottomNav}
            />
          );
        }}
      </Stack.Screen>
      
      {/* ✅ ReelTalk screen - only used if navigated directly (unlikely) */}
      <Stack.Screen name="ReelTalk">
        {(props) => <ReelTalk {...props}
         onNavigateToProfile={onNavigateToProfile} />}
      </Stack.Screen>
      
      <Stack.Screen name="ChatScreen" component={ChatScreen} />

      <Stack.Screen 
        name="ReelInformation" 
        component={ReelInformation}
        options={{ 
          headerShown: true,
          title: "Reel Information",
        }} 
      />
    </Stack.Navigator>
  );
}