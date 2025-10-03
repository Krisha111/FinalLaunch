import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, ActivityIndicator } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../Redux/Slice/Authentication/authSlice.js";

import WelcomeScreen from "../../src/Authentication/WelcomeScreen.js";
import SignInScreen from "../../src/Authentication/SignInScreen.js";
import SignUpScreen from "../../src/Authentication/SignUpScreen.js";
import MainTabs from "./MainTab.js";
import EditProfile from "../compo/Edit.js";

const Stack = createNativeStackNavigator();

export default function RootStack() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.signUpAuth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync("token");
        const storedUser = await SecureStore.getItemAsync("user");

        if (storedToken && storedUser) {
          dispatch(
            setCredentials({
              token: storedToken,
              user: JSON.parse(storedUser),
            })
          );
        }
      } catch (err) {
        console.warn("Error loading stored user:", err);
      } finally {
        setLoading(false); // finish loading only after checking storage
      }
    };

    loadUser();
  }, [dispatch]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }
{console.log(user,token,"token")}
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
       {/* <Stack.Screen name="MainTabs" component={MainTabs} />
         <Stack.Screen name="EditProfile" component={EditProfile} /> */}
      {user && token ? (
        <>
        <Stack.Screen name="Home" component={MainTabs} />
       
        </>
      ) : (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
