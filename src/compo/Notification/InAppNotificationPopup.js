// ============================================
// CREATE: src/components/InAppNotificationPopup.js
// ============================================
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default function InAppNotificationPopup({ notification, onPress, onDismiss }) {
  const [slideAnim] = useState(new Animated.Value(-100));

  useEffect(() => {
    if (notification) {
      console.log("🎨 Showing in-app popup:", notification);
      
      // Slide down
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();

      // Auto dismiss after 5 seconds
      const timer = setTimeout(() => {
        handleDismiss();
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      // Hide immediately
      slideAnim.setValue(-100);
    }
  }, [notification]);

  const handleDismiss = () => {
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      if (onDismiss) onDismiss();
    });
  };

  if (!notification) {
    console.log("⚠️ No notification to show");
    return null;
  }

  console.log("✅ Rendering popup with notification:", notification);

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY: slideAnim }] },
      ]}
    >
      <TouchableOpacity
        style={styles.popup}
        onPress={() => {
          console.log("👆 Popup pressed");
          if (onPress) onPress();
        }}
        activeOpacity={0.9}
      >
        <View style={styles.iconContainer}>
          <Icon name="videocam" size={24} color="#ff4444" />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>ReelChatt Invite</Text>
          <Text style={styles.message} numberOfLines={2}>
            {notification.body || `${notification.from} wants to watch reels with you!`}
          </Text>
        </View>
        <TouchableOpacity onPress={handleDismiss} style={styles.closeButton}>
          <Icon name="close" size={20} color="#666" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    left: 10,
    right: 10,
    zIndex: 9999,
    elevation: 9999,
  },
  popup: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ffe5e5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000",
    marginBottom: 2,
  },
  message: {
    fontSize: 13,
    color: "#666",
  },
  closeButton: {
    padding: 4,
  },
});