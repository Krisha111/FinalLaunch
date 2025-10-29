// ✅ src/Authentication/SignIn.js — FINAL UNIFIED VERSION WITH SIGNUP STYLING & PASSWORD FIX
// Matches SignUp styling 100%: background, shadows, spacing, input rows, and icons.
// Fixes placeholder + password visibility issues in Play Store builds.

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  ScrollView,
  Platform,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { setCredentials } from "../Redux/Slice/Authentication/SignUp.js";

const logoImage = require("../../assets/images/LogoWelCome.png");
const backgroundImage = require("../../assets/images/FinalBack.png");

export default function SignIn({ setIsSignUp }) {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignIn = async () => {
    try {
      const response = await axios.post("http://192.168.2.16:8000/signIn", {
        username,
        email,
        password,
      });

      if (response.status === 200) {
        const { user, token } = response.data;
        dispatch(setCredentials({ user, token }));
        navigation.replace("Sampleeee"); // Navigate to main screen
      } else {
        setErrorMessage("Sign in failed. Please try again.");
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message || "Login failed.");
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
      console.error("SignIn error:", error);
    }
  };

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.centerBlock}>
            {/* Sign-in Card */}
            <View style={styles.container}>
              <View style={styles.headerRow}>
                <Image source={logoImage} style={styles.logo} resizeMode="contain" />
                <Text style={styles.welcomeMsg}>Welcome to ReelChat...!!!</Text>
              </View>

              <Text style={styles.headerTitle}>Sign In</Text>

              {/* Username */}
              <View style={styles.inputRow}>
                <Icon name="user" size={20} color="#444" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  placeholderTextColor="#888"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>

              {/* Email */}
              <View style={styles.inputRow}>
                <MaterialIcon name="email" size={20} color="#444" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#888"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Password */}
              <View style={styles.inputRow}>
                <Icon name="lock" size={20} color="#444" style={styles.icon} />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Password"
                  placeholderTextColor="#888"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <MaterialIcon
                    name={showPassword ? "visibility" : "visibility-off"}
                    size={20}
                    color="#444"
                  />
                </TouchableOpacity>
              </View>

              {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

              <TouchableOpacity style={styles.button} onPress={handleSignIn}>
                <Text style={styles.buttonText}>Sign In</Text>
              </TouchableOpacity>

              {/* Policy links */}
              <Text style={styles.termsText}>
                By signing in, you agree to our{" "}
                <Text
                  style={styles.linkText}
                  onPress={() => navigation.navigate("TermsOfService")}
                >
                  Terms of Service
                </Text>
                ,{" "}
                <Text
                  style={styles.linkText}
                  onPress={() => navigation.navigate("CookiesPolicy")}
                >
                  Cookies Policy
                </Text>{" "}
                and{" "}
                <Text
                  style={styles.linkText}
                  onPress={() => navigation.navigate("PrivacyPolicy")}
                >
                  Privacy Policy
                </Text>
                .
              </Text>

              <View style={styles.signInRow}>
                <Text style={styles.signInText}>Don't have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                  <Text style={styles.signInButton}> Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  centerBlock: {
    width: "100%",
    alignItems: "center",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  logo: {
    borderRadius: 10,
    width: 60,
    height: 60,
    marginRight: 12,
  },
  welcomeMsg: {
    fontSize: 22,
    fontWeight: "700",
    color: "black",
    textAlign: "center",
  },
  container: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    boxShadow: "0px 2px 6px rgba(0,0,0,0.15)",
    elevation: 5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#333",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 20,
    paddingBottom: 5,
    backgroundColor: "#fff",
    boxShadow: "0px 1px 1.41px rgba(0,0,0,0.2)",
    elevation: 2,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  icon: {
    width: 30,
    textAlign: "center",
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 5,
    textAlignVertical: "center",
    fontFamily: Platform.OS === "android" ? "sans-serif" : undefined,
  },
  errorText: {
    color: "red",
    marginBottom: 15,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
    boxShadow: "0px 2px 3.84px rgba(0,0,0,0.25)",
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  termsText: {
    fontSize: 12,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  linkText: {
    color: "#007bff",
    textDecorationLine: "underline",
  },
  signInRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  signInText: {
    fontSize: 14,
    color: "#555",
  },
  signInButton: {
    fontSize: 14,
    color: "#007bff",
    fontWeight: "bold",
  },
});
