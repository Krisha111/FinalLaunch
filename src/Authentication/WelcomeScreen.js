// src/Authentication/WelComeAndLogo.js
// Updated: displays the logo beside the welcome text instead of above it

import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import SignUp from "./SignUpScreen";
import SignIn from "./SignInScreen";

const logoImage = require("../../assets/images/LogoWelCome.png");

export default function WelComeAndLogo() {
  const [isSignUp, setIsSignUp] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Image source={logoImage} style={styles.logo} resizeMode="contain" />
          <Text style={styles.welcomeMsg}>Welcome to ReelChat...!!!</Text>
        </View>

        {/* <View style={styles.toggleRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsSignUp(true)}
            style={[styles.toggleBtn, isSignUp && styles.toggleBtnActive]}
          >
            <Text style={[styles.toggleText, isSignUp && styles.toggleTextActive]}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsSignUp(false)}
            style={[styles.toggleBtn, !isSignUp && styles.toggleBtnActive]}
          >
            <Text style={[styles.toggleText, !isSignUp && styles.toggleTextActive]}>Sign In</Text>
          </TouchableOpacity>
        </View> */}

        <View style={styles.formContainer}>
          {isSignUp ? <SignUp setIsSignUp={setIsSignUp} /> : <SignIn setIsSignUp={setIsSignUp} />}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    justifyContent: "center",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  logo: {
    borderRadius:10,
    width: 60,
    height: 60,
    marginRight: 12,
  },
  welcomeMsg: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  toggleBtn: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#999",
    marginHorizontal: 6,
    backgroundColor: "transparent",
  },
  toggleBtnActive: {
    backgroundColor: "#333",
  },
  toggleText: {
    color: "#333",
    fontWeight: "600",
  },
  toggleTextActive: {
    color: "#fff",
  },
  formContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "stretch",
    flex: 1,
  },
});