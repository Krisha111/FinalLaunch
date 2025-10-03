// src/Authentication/SignUp.js
// Updated: added box shadow to the main container and input rows for a subtle elevation effect

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { useDispatch } from "react-redux";
import { signUpUser, setCredentials } from "../Redux/Slice/Authentication/SignUp.js";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

export default function SignUp({ setIsSignUp }) {
  const dispatch = useDispatch();
  const navigation = useNavigation();

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
        : { username: backendData.username, email: backendData.email, _id: backendData._id };

      const token = backendData.token;

      dispatch(setCredentials({ user, token }));

      await saveSecureItem("token", token);
      await saveSecureItem("user", JSON.stringify(user));

      navigation.replace("Home");
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
        navigation.replace("Home");
      }
    };

    checkLoggedIn();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Sign Up</Text>

      <View style={styles.inputRow}>
        <Icon name="user" size={20} color="#444" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={localUsername}
          onChangeText={setLocalUsername}
        />
      </View>

      <View style={styles.inputRow}>
        <MaterialIcon name="email" size={20} color="#444" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={localEmail}
          onChangeText={setLocalEmail}
        />
      </View>

      <View style={styles.inputRow}>
        <Icon name="lock" size={20} color="#444" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={localPassword}
          onChangeText={setLocalPassword}
        />
      </View>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <Text style={styles.termsText}>
        By signing up, you agree to our Terms of Service and Privacy Policy.
      </Text>

      <View style={styles.signInRow}>
        <Text style={styles.signInText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => setIsSignUp(false)}>
          <Text style={styles.signInButton}> Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
    // Box shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Box shadow for Android
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
    // Shadow for input rows
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 5,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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