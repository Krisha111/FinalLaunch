// ReelTalk.js (React Native)
import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
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
import { useNavigation } from "@react-navigation/native";

import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export default function ReelTalk({ reel, isActive }) {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // current signed in user
  const user = useSelector((state) => state.signUpAuth?.user);

  // find reel in Redux slice if updated
  const updatedReel = useSelector((state) =>
    state.reelNewDrop?.reels?.find((r) => r._id === reel?._id)
  );

  // ---------- Local states ----------
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

  // fetch reels on mount
  useEffect(() => {
    dispatch(fetchReels());
  }, [dispatch]);

  // keep local states in sync with Redux OR fallback reel
  useEffect(() => {
    if (updatedReel || reel) {
      setLiked(
        (updatedReel?.likes || reel?.likes || []).includes(user?._id)
      );
      setLikeCount(updatedReel?.likes?.length ?? reel?.likes?.length ?? 0);
      setCommentCount(
        updatedReel?.commentCount ??
          updatedReel?.comments?.length ??
          reel?.commentCount ??
          reel?.comments?.length ??
          0
      );
    }
  }, [updatedReel, reel, user?._id]);

  // toggle like
  const toggleLiked = () => {
    if (!reel?._id) return;
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? Math.max(prev - 1, 0) : prev + 1));
    dispatch(toggleLikeReel({ reelId: reel._id }));
  };

  // ---------- Display values ----------
  const displayUser = updatedReel?.user || reel?.user || {};
  const displayScript =
    updatedReel?.reelScript ?? reel?.reelScript ?? "@Reel Script";
  const displayLocation =
    updatedReel?.reelLocation ?? reel?.reelLocation ?? "@Reel Location";
  const displayCreatedAt =
    updatedReel?.createdAt || reel?.createdAt
      ? dayjs(updatedReel?.createdAt || reel?.createdAt).fromNow()
      : "@Reel Created At";

  // Avatar renderer
  const Avatar = () => {
    if (displayUser?.profileImage) {
      return (
        <Image
          source={{ uri: displayUser.profileImage }}
          style={styles.avatarImage}
        />
      );
    }
    const letter = displayUser?.username
      ? displayUser.username.charAt(0).toUpperCase()
      : "?";
    return (
      <View style={styles.avatarFallback}>
        <Text style={styles.avatarLetter}>{letter}</Text>
      </View>
    );
  };

  return (
    <View style={styles.reelsContainer}>
      <View style={styles.theReelChatContainerBox}>
        <View style={styles.reelsMaincontainer}>
          <ScrollView
            style={styles.videoWrapper}
            showsVerticalScrollIndicator={false}
            snapToAlignment="start"
            decelerationRate="fast"
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <MainPageRegularReels
              key={reel._id}
              reel={reel}
              isActive={isActive}
            />
          </ScrollView>

          <View style={styles.reelskrishuMainghhcontainer}>
            <View style={styles.reelskrishuMaincontainer}>
              <View style={styles.userRow}>
                <Avatar />
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.usernameText}
                >
                  {displayUser?.username || "Unknown"}
                </Text>
              </View>

              <View>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.displayScript}
                >
                  {displayScript}
                </Text>
              </View>

              {displayLocation && (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <MaterialIcons name="location-on" size={14} color="white" />
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={styles.displayLocation}
                  >
                    {displayLocation}
                  </Text>
                </View>
              )}

              <View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <MaterialIcons name="access-time" size={14} color="white" />
                  <Text style={styles.timeTextSmall}>{displayCreatedAt}</Text>
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
                    <Ionicons
                      style={{ color: "red" }}
                      name="heart"
                      size={28}
                      color="red"
                    />
                  ) : (
                    <Ionicons
                      style={{ color: "white" }}
                      name="heart-outline"
                      size={28}
                      color="black"
                    />
                  )}
                  <Text style={{ color: "white" }}>{likeCount}</Text>
                </TouchableOpacity>
              </View>

              <View>
                <TouchableOpacity
                  style={styles.commentWorkingIcon}
                  onPress={() =>
                    navigation.navigate("ReelInformation", { reel })
                  }
                >
                  <Ionicons
                    name="chatbubble-outline"
                    style={{ color: "white" }}
                    size={28}
                  />
                  <Text style={{ color: "white" }}>{commentCount}</Text>
                </TouchableOpacity>
              </View>

              <View>
                <View style={styles.shareWorkingIcon}>
                  <Image
                    source={require("../../assets/images/LogoWelCome.png")}
                    style={{ width: 35, height: 35, borderRadius: 6 }}
                    resizeMode="contain"
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const { height, width } = Dimensions.get("window");
const AVATAR_SIZE = 32;

const styles = StyleSheet.create({
  universal: { margin: 0, padding: 0 },
  theLikeContainerOfReel: { alignItems: "center", paddingBottom: 10 },
  commentWorkingIcon: { alignItems: "center", paddingBottom: 10 },
  shareWorkingIcon: { alignItems: "center", paddingBottom: 25 },

  displayScript: {
    color: "white",
    marginLeft: 8,
    maxWidth: "100%",
  },
  displayLocation: {
    marginLeft: 8,
    maxWidth: "100%",
    color: "white",
    marginLeft: 6,
  },

  reelsContainer: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  theReelChatContainerBox: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  reelskrishuMainghhcontainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
  },
  reelskrishuMaincontainer: {
    flex: 8,
    padding: 20,
    color: "white",
  },
  reelsIconWorkingcontainer: {
    flex: 2,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  reelsMaincontainer: {
    position: "relative",
    borderRadius: 30,
    height: "98%",
    width: "40%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 22,
    elevation: 10,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  videoWrapper: { height: "100%", width: "100%", position: "relative" },

  usernameText: {
    fontWeight: "bold",
    fontSize: 14,
    color: "white",
    marginLeft: 8,
    maxWidth: "100%",
  },
  timeTextSmall: { marginLeft: 6, fontSize: 12, color: "white" },

  // Avatar styles
  avatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: "#ddd",
  },
  avatarFallback: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: "#cfcfcf",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarLetter: { fontWeight: "700", color: "#333" },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
});
