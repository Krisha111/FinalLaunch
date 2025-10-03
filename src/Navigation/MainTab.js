import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as SecureStore from "expo-secure-store";

import HomeScreen from "../HomeScreen.js";
import ReelScreen from "../compo/ReelScreen.js";
import ProfileScreen from "../compo/ProfileScreen.js";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ProfileStack from "./ProfileStack.js";
import Sampleeee from "../src/components/sampleeee.js";
import ReelStack from "./ReelStack.js";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  const [initialTab, setInitialTab] = useState("HomeTab");

  useEffect(() => {
    const loadLastTab = async () => {
      const savedTab = await SecureStore.getItemAsync("lastTab");
      if (savedTab) {
        setInitialTab(savedTab);
      }
    };
    loadLastTab();
  }, []);

  const handleTabChange = async (routeName) => {
    await SecureStore.setItemAsync("lastTab", routeName);
  };

  return (
    <Tab.Navigator
      initialRouteName={initialTab}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "black",
        tabBarStyle: { height: 60 },
      }}
      // @ts-ignore
      screenListeners={{
        state: (e) => {
          const index = e.data.state.index;
          const routeName = e.data.state.routeNames[index];
          handleTabChange(routeName);
        },
      }}
    >
      {/* <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      /> */}
    

      <Tab.Screen
        name="HomeTab"
        component={ReelStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="motion-play" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
  name="Sampleeee"
  component={Sampleeee}
  options={{
    tabBarIcon: ({ color, size }) => (
      <MaterialCommunityIcons name="movie-roll" color={color} size={size} />
    ),
  }}
/>
      
     <Tab.Screen
  name="ProfileTab"
  component={ProfileStack}   // <-- use stack instead of ProfileScreen
  options={{
    tabBarIcon: ({ color, size }) => (
      <MaterialCommunityIcons name="account" color={color} size={size} />
    ),
  }}
/>
      
      
    </Tab.Navigator>
  );
}
