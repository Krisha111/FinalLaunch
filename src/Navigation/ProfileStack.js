// src/navigation/ProfileStack.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../compo/ProfileScreen";
import EditProfile from "../compo/Edit";
import AddDrop from "../compo/Profile/NewDropPopUp/AddDrop.js";
import ReelNewDrop from "../compo/ReelChat/NewPhotoPosting/ReelNewDrop.js";
import ImagePopUp from "../compo/Explore/PopUp/ImagePopUp.js";

const Stack = createNativeStackNavigator();

// ✅ UPDATED: Receives initialUserId prop from MainTabs
export default function ProfileStack({ initialUserId }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        // ✅ NEW: Pass userId as initialParams to ProfileScreen
        initialParams={{ userId: initialUserId }}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{ title: "PROFILE SETTINGS" }}
      />
      <Stack.Screen 
        name="AddDrop"
        component={AddDrop} 
        options={{ title: "New Drop" }}
      />
      <Stack.Screen 
        name="ReelNewDropScreen" 
        component={ReelNewDrop} 
        options={{ title: "New Reel" }}
      />
      <Stack.Screen
        name="ImagePopUpScreen"
        component={ImagePopUp}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}