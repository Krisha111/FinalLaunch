// src/screens/HomeScreen.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "./Redux/Slice/Authentication/authSlice.js";

export default function HomeScreen() {
  const dispatch = useDispatch();
  const auth = useSelector((s) => s.auth);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home (ReelPlayer placeholder)</Text>
      <Text>User: {auth.user ? auth.user.username : "Not logged in"}</Text>
      <TouchableOpacity style={styles.btn} onPress={() => dispatch(logout())}>
        <Text style={{ fontWeight: "700" }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, marginBottom: 12 },
  btn: { marginTop: 20, backgroundColor: "#eee", padding: 10, borderRadius: 8 },
});
