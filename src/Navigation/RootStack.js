import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, ActivityIndicator, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../Redux/Slice/Authentication/SignUp.js"; // ← FIX PATH


import SignInScreen from "../../src/Authentication/SignInScreen.js";
import SignUpScreen from "../../src/Authentication/SignUpScreen.js";
import MainTabs from "./MainTab.js";
import EditProfile from "../compo/Edit.js";
import Notifications from "../compo/NotificationScreen.js";
import TermsOfServicePage from '../compo/RulesPage/TermsOfServices.js'
import CookieeSession from '../compo/RulesPage/CookieeSession.js'
import PrivacyPage from '../compo/RulesPage/PrivacyPage.js'
import CookiesPolicyPage from "../compo/RulesPage/CookieeSession.js";
import NotificationsScreen from "../compo/NotificationScreen.js";
import ChosenList from "../compo/ListProfile/ChosenList.js";
import BondsList from "../compo/ListProfile/BondsList.js";
import SendSpecialFriendRequestScreen from "../compo/Request/SendSpecialFriendRequestScreen.js";
import ViewRequestDetailsScreen from "../compo/Request/ViewRequestDetailsScreen.js";

const Stack = createNativeStackNavigator();

export default function RootStack() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.signUpAuth || {});
  const [loading, setLoading] = useState(true);

  // 🔹 Log auth state changes for debugging
  useEffect(() => {
    console.log("🔄 RootStack: Auth state changed", {
      hasUser: !!user,
      hasToken: !!token,
    });
  }, [user, token]);

  // 🔹 Load auth from AsyncStorage / localStorage
  useEffect(() => {
    const loadAuthFromStorage = async () => {
      try {
        let storedToken = null;
        let storedUser = null;

        if (Platform.OS === "web") {
          storedToken = localStorage.getItem("token");
          storedUser = localStorage.getItem("user");
        } else {
          storedToken = await AsyncStorage.getItem("token");
          storedUser = await AsyncStorage.getItem("user");
        }

        console.log("📦 Loaded from storage:", {
          hasToken: !!storedToken,
          hasUser: !!storedUser,
        });

        if (storedToken && storedUser) {
          dispatch(
            setCredentials({
              token: storedToken,
              user: JSON.parse(storedUser),
            })
          );
        }
      } catch (err) {
        console.warn("❌ RootStack: error loading auth from storage:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAuthFromStorage();
  }, [dispatch]);

  // 🔹 Show loading indicator while checking auth
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  // 🔹 Conditionally render stacks based on auth state
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user && token ? (
        // ✅ Authenticated stack
        <>
        
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen 
  name="Notifications" 
  component={NotificationsScreen}
  options={{ headerShown: false }}
/>
<Stack.Screen name="ChosenList">
  {(props) => (
    <ChosenList
      {...props}
      onNavigateToProfile={(userId) => {
        // Navigate to MainTabs and tell it to open ProfileTab
        props.navigation.navigate('MainTabs', {
          screen: 'ProfileTab',
          params: { userId },
        });
      }}
    />
  )}
</Stack.Screen>

<Stack.Screen name="BondsList" component={BondsList} />
<Stack.Screen name="SendSpecialFriendRequest" 
component={SendSpecialFriendRequestScreen} />
<Stack.Screen name="ViewRequestDetails" 
component={ViewRequestDetailsScreen} />
        </>
      ) : (
        // ✅ Unauthenticated stack
        <>
   <Stack.Screen name="SignUp" component={SignUpScreen} />
          {/* <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} /> */}
          <Stack.Screen name="SignIn" component={SignInScreen} />
       
          <Stack.Screen name="TermsOfService" component={TermsOfServicePage} />
<Stack.Screen name="PrivacyPolicy" component={PrivacyPage} />
<Stack.Screen name="CookiesPolicy" component={CookiesPolicyPage} />

        </>
      )}
    </Stack.Navigator>
  );
}
