// src/compo/Profile/NewDropPopUp/AddDrop.js
import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import NewDropProfile from "../NewDropProfile"; // 👈 adjust path if needed

export default function AddDrop() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Drop</Text>
      </View> */}

      {/* Main content */}
      <ScrollView contentContainerStyle={styles.content}>
        <NewDropProfile />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f8f8f8",
  },
  backButton: {
    marginRight: 10,
    padding: 5,
  },
  backText: {
    fontSize: 16,
    color: "#007AFF",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    flexGrow: 1,
    padding: 20,
  },
});
