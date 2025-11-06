// ✅ src/Authentication/SignUp.js — FINAL MERGED VERSION WITH BACKGROUND IMAGE
// Includes logo + welcome text, centered signup form, in-app policy links,
// secure store handling, navigation, and boxShadow styles.

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  StatusBar,
  ScrollView,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { signUpUser, setCredentials } from "../Redux/Slice/Authentication/SignUp.js";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

const logoImage = require("../../assets/images/LogoWelCome.png");
const backgroundImage = require("../../assets/images/FinalBack.png"); // Add your background image

export default function SignUp({ setIsSignUp }) {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);

  const [localUsername, setLocalUsername] = useState("");
  const [localEmail, setLocalEmail] = useState("");
  const [localPassword, setLocalPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const saveSecureItem = async (key, value) => {
    try {
      if (Platform.OS === "web") {
        localStorage.setItem(key, value);
      } else {
        await SecureStore.setItemAsync(key, value);
      }
    } catch (e) {
      console.error("Error saving secure item", e);
    }
  };

  const getSecureItem = async (key) => {
    try {
      if (Platform.OS === "web") {
        return localStorage.getItem(key);
      } else {
        return await SecureStore.getItemAsync(key);
      }
    } catch (e) {
      console.error("Error reading secure item", e);
    }
  };

  const deleteSecureItem = async (key) => {
    try {
      if (Platform.OS === "web") {
        localStorage.removeItem(key);
      } else {
        await SecureStore.deleteItemAsync(key);
      }
    } catch (e) {
      console.error("Error deleting secure item", e);
    }
  };

  const handleSignUp = async () => {
    const resultAction = await dispatch(
      signUpUser({
        username: localUsername,
        email: localEmail,
        password: localPassword,
      })
    );

    if (signUpUser.fulfilled.match(resultAction)) {
      const backendData = resultAction.payload;

      const user = backendData.user
        ? backendData.user
        : {
          username: backendData.username,
          email: backendData.email,
          _id: backendData._id,
        };

      const token = backendData.token;

      dispatch(setCredentials({ user, token }));

      await saveSecureItem("token", token);
      await saveSecureItem("user", JSON.stringify(user));

      navigation.replace("MainTab");
    } else {
      setErrorMessage(resultAction.payload?.message || "Signup failed");
    }
  };

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = await getSecureItem("token");
      const user = await getSecureItem("user");
      if (token && user) {
        dispatch(setCredentials({ token, user: JSON.parse(user) }));
        navigation.replace("MainTab");
      }
    };
    checkLoggedIn();
  }, []);

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
          {/* Centered block: header + form */}
          <View style={styles.centerBlock}>
            {/* Signup Form */}
            <View style={styles.container}>
              <View style={styles.headerRow}>
                <Image source={logoImage} style={styles.logo} resizeMode="contain" />
                <Text style={styles.welcomeMsg}>Weocome to ReelChat...!!!</Text>
              </View>
              <Text style={styles.headerTitle}>Sign Up</Text>

              {/* Username */}
              <View style={styles.inputRow}>
                <Icon name="user" size={20} color="#444" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  placeholderTextColor="#888"   // add this
                  value={localUsername}
                  onChangeText={setLocalUsername}
                />
              </View>

              {/* Email */}
              <View style={styles.inputRow}>
                <MaterialIcon name="email" size={20} color="#444" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"

                  placeholderTextColor="#888"
                  value={localEmail}
                  onChangeText={setLocalEmail}
                />
              </View>

              {/* Password */}
             <View style={styles.passwordRow}>
  <Icon name="lock" size={20} color="#444" style={styles.icon} />
  <TextInput
    style={styles.passwordInput}
    placeholder="Password"
    placeholderTextColor="#888"
    secureTextEntry={!showPassword}
    value={localPassword}
    onChangeText={setLocalPassword}
    autoCapitalize="none"
    autoCorrect={false}
    underlineColorAndroid="transparent"
    textContentType="password"
  />
  <TouchableOpacity
    onPress={() => setShowPassword(prev => !prev)}
    style={{ padding: 5 }}
  >
    <MaterialIcon
      name={showPassword ? "visibility" : "visibility-off"}
      size={22}
      color="#666"
    />
  </TouchableOpacity>
</View>


              {/* <View style={styles.inputRow}>
                <Icon name="lock" size={20} color="#444" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  secureTextEntry

                  placeholderTextColor="#888"
                  value={localPassword}
                  onChangeText={setLocalPassword}
                />
              </View> */}
              {/* Password */}
{/* Password */}
{/* <View style={styles.inputRow}>
  <Icon name="lock" size={20} color="#444" style={styles.icon} />
  <TextInput
    style={[styles.input, { flex: 1, paddingRight: 10 }]}
    placeholder="Password"
    secureTextEntry={!showPassword}
    placeholderTextColor="#888"
    value={localPassword}
    onChangeText={setLocalPassword}
    autoCapitalize="none"
    autoCorrect={false}
  />
  <TouchableOpacity 
    onPress={() => setShowPassword(prev => !prev)}
    style={{ padding: 5 }}
    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
  >
    <MaterialIcon
      name={showPassword ? "visibility" : "visibility-off"}
      size={22}
      color="#666"
    />
  </TouchableOpacity>
</View> */}


              {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

              <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>

              <Text style={styles.termsText}>
                By signing up, you agree to our{" "}
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
                <Text style={styles.signInText}>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
                  <Text style={styles.signInButton}> Sign In</Text>
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
  passwordRow: {
  flexDirection: "row",
  alignItems: "center",
  borderBottomWidth: 1,
  borderBottomColor: "#ccc",
  marginBottom: 20,
  paddingHorizontal: 10,
  borderRadius: 5,
  backgroundColor: "#fff",
  // ❌ IMPORTANT: No elevation, no shadow
  elevation: 0,
  shadowColor: "transparent",
},

passwordInput: {
  flex: 1,
  fontSize: 16,
  paddingVertical: 10,
  color: "#000",
  fontFamily: Platform.OS === "android" ? undefined : "System",
},

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
    boxShadow: "0px 2px 6px rgba(0,0,0,0.15)", // original box shadow
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
    boxShadow: "0px 1px 1.41px rgba(0,0,0,0.2)", // original box shadow
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
    boxShadow: "0px 2px 3.84px rgba(0,0,0,0.25)", // original box shadow
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
