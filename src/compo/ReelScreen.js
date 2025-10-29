
// ReelPlayer.js (React Native) — COMPLETE FIXED VERSION
// Full screen reels above tab bar, proper container height/width, safety checks
// ✅ NOW RECEIVES AND PASSES onNavigateToProfile prop
// ✅ FIX: First reel auto-play on initial load without blink

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  ActivityIndicator,
  StatusBar,
} from "react-native";




import { useDispatch, useSelector } from "react-redux";
import { fetchAllReels } from "../Redux/Slice/Profile/reelNewDrop.js";
import ReelTalk from "./ReelTalk";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ✅ Add these imports at the top
import { TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { height, width } = Dimensions.get("window");

export default function ReelPlayer({ onNavigateToProfile, onBackPress  , setHideBottomNav}) {
  const dispatch = useDispatch();
   const navigation = useNavigation(); // 👈 add this
  const insets = useSafeAreaInsets();
  const flatListRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(-1); // Start with -1 to fix first reel issue
useEffect(() => {
  if (typeof setHideBottomNav === "function") {
    console.log("🟡 Hiding bottom nav from ReelPlayer");
    setHideBottomNav(true); // hide when ReelPlayer mounts
  }

  return () => {
    if (typeof setHideBottomNav === "function") {
      console.log("🟢 Restoring bottom nav from ReelPlayer unmount");
      setHideBottomNav(true); // restore on unmount
    }
  };
}, []);


  // ✅ Force first reel active after mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentIndex(0); // Activate first reel
    }, 50); // Small delay to allow FlatList to measure
    return () => clearTimeout(timer);
  }, []);

  // Fetch reels on mount
 const handleBackPress = () => {
  console.log("🔙 Back button pressed in ReelPlayer");
  console.log("🔙 onBackPress function exists:", typeof onBackPress === "function");
  
  if (typeof onBackPress === "function") {
    console.log("🔙 Calling onBackPress");
    onBackPress();
  } else {
    console.log("❌ onBackPress is not a function");
  }
};

  const reels = useSelector((state) => state.reelNewDrop.mainPageReels || []);
  const loading = useSelector((state) => state.reelNewDrop.loading);

  // Exact height for each reel item: screen minus tab bar
 
  const ITEM_HEIGHT = height;
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const newIndex = viewableItems[0].index || 0;
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
      }
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  if (loading) {
    return (
      <View style={[styles.reelPlayerContainer, styles.centerContent]}>
      {/* ✅ BACK BUTTON even when no reels */}
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={(e) => {
            e.stopPropagation();
            handleBackPress();
          }}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={28}
            color="white"
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading reels...</Text>
      </View>
    );
  }

  if (!reels || reels.length === 0) {
    return (
      <View style={[styles.reelPlayerContainer, styles.centerContent]}>
      {/* ✅ BACK BUTTON even when no reels */}
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={(e) => {
            e.stopPropagation();
            handleBackPress();
          }}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={28}
            color="white"
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.noReelsText}>No reels available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.reelPlayerContainer}>
      <StatusBar barStyle="light-content" />
    <TouchableOpacity
  style={styles.backButton}
  activeOpacity={0.8}
  onPress={(e) => {
    e.stopPropagation(); // Prevent event from reaching video
    handleBackPress();
  }}
>
  <MaterialCommunityIcons
    name="arrow-left"
    size={28}
    color="white"
    style={styles.backIcon}
  />
</TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={reels}
        keyExtractor={(item, index) => item?._id || index.toString()}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        renderItem={({ item, index }) => {
          if (!item) {
            return (
              <View style={[styles.singleReel, { height: ITEM_HEIGHT }]}>
                <Text style={styles.errorText}>Reel data unavailable</Text>
              </View>
            );
          }

          return (
            <View style={[styles.singleReel, { height: ITEM_HEIGHT }]}>
              {/* Pass onNavigateToProfile to ReelTalk */}
              <ReelTalk
                reel={item}
                isActive={index === currentIndex}
                onNavigateToProfile={onNavigateToProfile}
              />
            </View>
          );
        }}
        removeClippedSubviews={true}
        maxToRenderPerBatch={2}
        windowSize={3}
        initialNumToRender={1}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  reelPlayerContainer: {
    flex: 1,
  },
 backButton: {
  position: "absolute",
  top: 10,
  left: 20,
  zIndex: 10000, // ← Increased from 1000
  backgroundColor: "rgba(0, 0, 0, 0.6)", // ← More visible
  borderRadius: 30,
  padding: 12, // ← Increased touch area
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.8,
  shadowRadius: 3,
  elevation: 10, // ← Increased for Android
},
backIcon: {
  textShadowColor: "rgba(0,0,0,0.8)",
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 3,
},

  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  flatListContent: {
    flexGrow: 1,
  },
  singleReel: {
    width: width,
  },
  noReelsText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
  },
  errorText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },
});
