// src/navigation/ProfileStack.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../compo/ProfileScreen";
import EditProfile from "../compo/Edit"; // <-- make sure this path is correct
import AddDrop from "../compo/Profile/NewDropPopUp/AddDrop.js";
import ReelNewDrop from "../compo/ReelChat/NewPhotoPosting/ReelNewDrop.js";
import ImagePopUp from "../compo/Explore/PopUp/ImagePopUp.js";

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ headerShown: false }} // Hide header if you want
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{ title: "PROFILE SETTINGS" }}
      />
      {/* <Stack.Screen
  name="Sample"
  component={Sample}
  options={{ title: "Sample Screen" }}
/> */}
      <Stack.Screen 
      name="AddDrop"
       component={AddDrop} 
        options={{ title: "New Drop" }}/>
         <Stack.Screen 
        name="ReelNewDropScreen" 
        component={ReelNewDrop} 
        options={{ title: "New Reel" }} // <-- name MUST match navigation.navigate("ReelNewDrop")
      />
    

      <Stack.Screen
  name="ImagePopUpScreen"
  component={ImagePopUp}
  options={{ headerShown: false }}
/>

    </Stack.Navigator>
  );
}
