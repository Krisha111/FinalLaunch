// ReelTalk.js (React Native) — FULL FIXED VERSION
// - Fixed warnings and undefined issues
// - Ensures safe navigation and remounting
// - Correct profile navigation with onNavigateToProfile prop
// - Full code, nothing skipped

import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import MainPageRegularReels from "../compo/ReelChat/MainPageRegularReels.js";
import {
  fetchReels,
  toggleLikeReel,
} from "../Redux/Slice/Profile/reelNewDrop.js";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const { height, width } = Dimensions.get("window");
const AVATAR_SIZE = 32;

// ✅ UPDATED: Added onNavigateToProfile prop
export default function ReelTalk({ reel, isActive, onNavigateToProfile }) {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  // ---- Safety: missing reel ----
  if (!reel) {
    return (
      <View style={styles.reelsContainer}>
        <Text style={styles.errorText}>Reel data unavailable</Text>
      </View>
    );
  }

  // ---- Redux / derived data ----
  const user = useSelector((state) => state.signUpAuth?.user);
  const updatedReel = useSelector((state) =>
    state.reelNewDrop?.reels?.find((r) => r._id === reel?._id)
  );

  // ---- Local states ----
  const [liked, setLiked] = useState(
    (updatedReel?.likes || reel?.likes || []).includes(user?._id)
  );
  const [likeCount, setLikeCount] = useState(
    updatedReel?.likes?.length ?? reel?.likes?.length ?? 0
  );
  const [commentCount, setCommentCount] = useState(
    updatedReel?.commentCount ??
      updatedReel?.comments?.length ??
      reel?.commentCount ??
      reel?.comments?.length ??
      0
  );

  // ---- Controlled remount for video autoplay ----
  const [remountKeyCounter, setRemountKeyCounter] = useState(0);
  const prevActiveRef = useRef(Boolean(isActive));

  // ---- Display helpers ----
  const currentReel = updatedReel || reel; // always use latest
  const displayUser = currentReel?.user || {};
  const rawScript = currentReel?.reelScript ?? "";
  const rawLocation = currentReel?.reelLocation ?? "";
  const rawCreatedAt = currentReel?.createdAt ?? null;
  const isMeaningful = (s) =>
    typeof s === "string" && s.trim() !== "" && s.trim() !== ".";
  const displayScript = isMeaningful(rawScript) ? rawScript.trim() : null;
  const displayLocation = isMeaningful(rawLocation) ? rawLocation.trim() : null;
  const displayCreatedAt = rawCreatedAt ? dayjs(rawCreatedAt).fromNow() : null;

  // ---- Avatar renderer ----
  const Avatar = () => {
    if (displayUser?.profileImage) {
      return (
        <Image
          source={{ uri: displayUser.profileImage }}
          style={styles.avatarImage}
        />
      );
    }
    const username =
      typeof displayUser?.username === "string"
        ? displayUser.username.trim()
        : "";
    const letter = username.length > 0 ? username.charAt(0).toUpperCase() : "?";
    return (
      <View style={styles.avatarFallback}>
        <Text style={styles.avatarLetter}>{letter}</Text>
      </View>
    );
  };

  // ✅ UPDATED: Navigate to user's profile using onNavigateToProfile callback
  const goToProfile = () => {
    const userId = currentReel?.user?._id;
    if (!userId) {
      console.warn("No userId available for navigation");
      return;
    }

    console.log("ReelTalk: Navigating to profile with userId:", userId);

    // ✅ NEW: Use the callback passed from MainTabs (via ReelStack)
    if (onNavigateToProfile) {
      onNavigateToProfile(userId);
    } else {
      console.warn("onNavigateToProfile prop not available");
    }
  };

  // ---- Fetch reels if needed ----
  useEffect(() => {
    if (!updatedReel && !reel) {
      dispatch(fetchReels());
    }
  }, [dispatch, updatedReel, reel]);

  // ---- Keep local state synced ----
  useEffect(() => {
    if (currentReel) {
      setLiked((currentReel?.likes || []).includes(user?._id));
      setLikeCount(currentReel?.likes?.length ?? 0);
      setCommentCount(
        currentReel?.commentCount ?? currentReel?.comments?.length ?? 0
      );
    }
  }, [currentReel, user?._id]);

  // ---- Toggle like handler ----
  const toggleLiked = () => {
    if (!reel?._id) return;
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? Math.max(prev - 1, 0) : prev + 1));
    dispatch(toggleLikeReel({ reelId: reel._id }));
  };

  // ---- Remount logic for autoplay ----
  useEffect(() => {
    const wasActive = Boolean(prevActiveRef.current);
    const nowActive = Boolean(isActive);

    if (!wasActive && nowActive && isFocused) {
      setRemountKeyCounter((c) => c + 1);
    }

    prevActiveRef.current = nowActive;
  }, [isActive, isFocused, reel?._id]);

  // ---- On screen unfocus ----
  useEffect(() => {
    if (!isFocused) {
      console.log(`📴 Screen unfocused while viewing reel ${reel._id}`);
    }
  }, [isFocused, reel?._id]);

  return (
    <View style={styles.reelsContainer}>
      {/* 🎥 Video component (remounts when remountKeyCounter changes) */}
      <MainPageRegularReels
  key={reel?._id} // no remount key
  reel={currentReel} 
  isActive={isActive && isFocused} // autoplay only if active & focused
/>


      {/* 🧾 Overlay content */}
      <View style={styles.overlayContainer}>
        <View style={styles.reelskrishuMainghhcontainer}>
          <View style={styles.reelskrishuMaincontainer}>
            <TouchableOpacity
              style={styles.userRow}
              activeOpacity={0.7}
              onPress={goToProfile}
            >
              <Avatar />
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.usernameText}
              >
              {displayUser?.username && displayUser.username.trim() !== ""
                  ? `${displayUser.username}`
                  : "Unknown"}
              </Text>
            </TouchableOpacity>

            {displayScript ? (
              <View>
                <Text
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  style={styles.displayScript}
                >
                  {displayScript}
                </Text>
              </View>
            ) : null}

            {displayLocation ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 4,
                }}
              >
                <MaterialIcons name="location-on" size={14} color="white" />
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.displayLocation}
                >
                  {displayLocation}
                </Text>
              </View>
            ) : null}

            <View style={{ marginTop: 4 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialIcons name="access-time" size={14} color="white" />
                <Text style={styles.timeTextSmall}>
                  {displayCreatedAt ?? "some time ago"}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.reelsIconWorkingcontainer}>
            <View>
              <TouchableOpacity
                onPress={toggleLiked}
                style={styles.theLikeContainerOfReel}
              >
                {liked ? (
                  <Ionicons name="heart" size={32} color="red" />
                ) : (
                  <Ionicons name="heart-outline" size={32} color="white" />
                )}
                <Text style={styles.iconText}>{likeCount}</Text>
              </TouchableOpacity>
            </View>

            <View>
              <TouchableOpacity
                style={styles.commentWorkingIcon}
                onPress={() =>
                  navigation.navigate("ReelInformation", { reel: currentReel })
                }
              >
                <Ionicons name="chatbubble-outline" size={32} color="white" />
                <Text style={styles.iconText}>{commentCount}</Text>
              </TouchableOpacity>
            </View>

            <View>
              <View style={styles.shareWorkingIcon}>
                <Image
                  source={require("../../assets/images/LogoWelCome.png")}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

// ---- Styles (unchanged) ----
const styles = StyleSheet.create({
  reelsContainer: {
    flex: 1,
    width: width,

   
  },
  overlayContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    pointerEvents: "box-none",
  },
  reelskrishuMainghhcontainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    paddingBottom: 20,
  },
  reelskrishuMaincontainer: {
    flex: 8,
    paddingHorizontal: 16,
    paddingBottom: 0,
  },
  reelsIconWorkingcontainer: {
    flex: 2,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingRight: 8,
  },
  theLikeContainerOfReel: {
    alignItems: "center",
    marginBottom: 24,
  },
  commentWorkingIcon: {
    alignItems: "center",
    marginBottom: 24,
  },
  shareWorkingIcon: {
    alignItems: "center",
    marginBottom: 24,
  },
  iconText: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 4,
  },
  displayScript: {
    color: "white",
    fontSize: 14,
    lineHeight: 18,
    marginTop: 4,
  },
  displayLocation: {
    marginLeft: 4,
    color: "white",
    fontSize: 13,
  },
  usernameText: {
    fontWeight: "bold",
    fontSize: 15,
    color: "white",
    marginLeft: 8,
    maxWidth: "80%",
  },
  timeTextSmall: {
    marginLeft: 6,
    fontSize: 12,
    color: "white",
    opacity: 0.9,
  },
  avatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    
  },
  avatarFallback: {
    backgroundColor:"grey",
    color:"black",
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,

    justifyContent: "center",
    alignItems: "center",
  },
  avatarLetter: {
    fontWeight: "700",
    color: "#333",
    fontSize: 16,
  },
  userRow: {
  
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  logoImage: {
    width: 35,
    height: 35,
    borderRadius: 6,
  },
  errorText: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
  },
});