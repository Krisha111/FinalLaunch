// ============================================
// ✅ src/navigation/AppLayout.js — FINAL VERSION
// ============================================
import React from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * ✅ AppLayout - Conditionally renders bottom tab
 * - Bottom tab only shows when bottomTab prop is provided
 * - No reserved space when hidden
 * - Now uses flexible layout (80% for content, 20% for bottom tab)
 */
export default function AppLayout({ children, bottomTab }) {
  const insets = useSafeAreaInsets();

  console.log("🔹 AppLayout render - bottomTab prop received:", !!bottomTab);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.container}>
        {/* Main content (80%) */}
        <View style={styles.mainContent}>{children}</View>

        {/* 🔹 CONDITIONALLY render bottom tab (20%) */}
        {bottomTab && (
          <View
            style={[
              styles.bottomTab,
              { paddingBottom: insets.bottom || 0 },
            ]}
          >
            {bottomTab}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    // borderColor:'red',
    // borderWidth:7,
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    // borderColor:'yellow',
    // borderWidth:5,
    flex: 1,
    flexDirection: "column",
  },
  // ⬇️ Main content takes up 80% height
  mainContent: {
    //  borderColor:'magenta',
    // borderWidth:3,
    flex: 1,
    backgroundColor: "#000",
  },
  // ⬇️ Bottom tab takes up 20% height when visible
  bottomTab: {
    //     borderColor:'brown',
    // borderWidth:3,
    flex: 0,
    borderTopColor: "rgba(0,0,0,0.12)",
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white",
  },
});
