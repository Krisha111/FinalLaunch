import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ReelTalk from "../compo/ReelTalk";
import ReelInformation from "../compo/ReelChat/ReelInformation";
import ReelPlayer from "../compo/ReelScreen";
import ChatScreen from "../compo/ReelChat/ChatScreen";
// 👈 comments/details

const Stack = createNativeStackNavigator();

export default function ReelStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ReelScreen" component={ReelPlayer} /> 
      <Stack.Screen name="ReelTalk" component={ReelTalk} /> 
      <Stack.Screen name="ChatScreen" component={ChatScreen} />

      <Stack.Screen name="ReelInformation" 
      component={ReelInformation}
      options={{ 
          headerShown: true, // 👈 show header
          title: "Reel Information",
        }} 
       />
    </Stack.Navigator>
  );
}
