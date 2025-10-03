// RegularReels.js
// Single-file solution using react-native-video only.
// Usage: parent must pass activeIndex, isPlaying (global play flag for the room),
//        onTogglePlay(index, newState) callback, isAdmin, socket, room, chat, username.

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Text,
  Dimensions,
  Platform,
} from "react-native";
import Video from "react-native-video";
import { useNavigation } from "@react-navigation/native";

const { height: WINDOW_HEIGHT, width: WINDOW_WIDTH } = Dimensions.get("window");

export default function RegularReels({
  reel,
  index,
  activeIndex,
  isPlaying,         // boolean - global play/pause flag from parent for the room
  onTogglePlay,      // function(index, newState) -> parent toggles state & emits socket
  isAdmin = false,
  socket,
  room,
  chat = [],
  username = "",
  onOpenChat,        // open chat callback
}) {
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [buffering, setBuffering] = useState(false);
  const navigation = useNavigation();

  // Local optimistic playing state to make UI snappy — will follow `isPlaying` from parent.
  const [localPlaying, setLocalPlaying] = useState(Boolean(isPlaying));

  // Keep localPlaying in sync with parent `isPlaying` when it changes.
  useEffect(() => {
    setLocalPlaying(Boolean(isPlaying));
  }, [isPlaying]);

  const mediaUrl = reel?.videoUrl || reel?.photoReelImages?.[0] || null;

  useEffect(() => {
    // If this reel is no longer the active one, ensure it's paused locally too.
    if (index !== activeIndex && localPlaying) {
      setLocalPlaying(false);
    }
    // No deps to control only on activeIndex/localPlaying changes; eslint ignored purposely
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  if (!mediaUrl) {
    return <View style={[styles.reelItem, styles.emptyReel]} />;
  }

  // decide whether this video should be playing now
  // shouldPlay is true only when this reel is the active one AND the global/local playing state is true
  const shouldPlay = index === activeIndex && Boolean(localPlaying);

  // Admin toggles play/pause:
  const handleTogglePlay = () => {
    // Only admin controls global playback in your contract
    if (!isAdmin) return;
    if (index !== activeIndex) return; // only toggle current active reel

    const newState = !Boolean(localPlaying);
    // Optimistically update local UI immediately
    setLocalPlaying(newState);

    // Delegate to parent, which should update the single source of truth and emit socket
    if (typeof onTogglePlay === "function") {
      try {
        onTogglePlay(index, newState);
      } catch (err) {
        console.warn("onTogglePlay threw:", err);
      }
    } else {
      // fallback — no parent handler: attempt to emit directly (not ideal; prefer parent)
      if (socket && room) {
        socket.emit("reel_play", { room, index, isPlaying: newState });
      }
    }
  };

  const handleLoadStart = () => {
    setLoading(true);
    setBuffering(false);
  };

  const handleOnLoad = (data) => {
    setLoading(false);
    setBuffering(false);
  };

  const handleOnBuffer = ({ isBuffering }) => {
    setBuffering(Boolean(isBuffering));
  };

  const handleError = (err) => {
    console.log("Video error:", err);
    setLoading(false);
    setBuffering(false);
  };

  // Render
  return (
    <View style={styles.reelWrapper}>
      <View style={styles.reelsMaincontainer}>
        <View style={styles.videoWrapper}>
          <TouchableOpacity
            activeOpacity={0.95}
            style={styles.touchable}
            onPress={handleTogglePlay}
          >
            <Video
              ref={videoRef}
              source={{ uri: mediaUrl }}
              style={styles.video}
              resizeMode="cover"
              repeat={true}
              paused={!shouldPlay}       // <-- key: react-native-video controlled playback
              onLoadStart={handleLoadStart}
              onLoad={handleOnLoad}
              onBuffer={handleOnBuffer}
              onError={handleError}
              playWhenInactive={false}
              playInBackground={false}
              ignoreSilentSwitch={"ignore"}
              // onProgress can be used if you want to sync timestamps between admin/viewers
              // onProgress={({ currentTime }) => { /* optional */ }}
            />

            {/* Overlay messages */}
            <View style={styles.overlayChat}>
              {chat.slice(-3).map((c, i) => (
                <View
                  key={i}
                  style={[
                    styles.overlayBubble,
                    c.sender === username ? styles.overlaySent : styles.overlayReceived,
                  ]}
                >
                  <Text style={styles.overlaySender}>{c.sender}</Text>
                  <Text style={styles.overlayText}>
                    {typeof c.message === "string" ? c.message : JSON.stringify(c.message)}
                  </Text>
                </View>
              ))}
            </View>

            {/* Floating Chat Button */}
            {/* <TouchableOpacity
              style={styles.chatButton}
              onPress={() => {
                if (typeof onOpenChat === "function") onOpenChat();
                else navigation.navigate("ChatScreen", { room, chat, username });
              }}
            >
              <Text style={styles.chatButtonText}>💬</Text>
            </TouchableOpacity> */}

            {/* Loading / Buffering overlay */}
            {(loading || buffering) && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={styles.loadingText}>
                  {buffering ? "Buffering..." : "Loading..."}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  reelWrapper: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  reelsMaincontainer: {
    position: "relative",
    borderRadius: 14,
    height: "98%",
    width: Platform.OS === "web" ? "60%" : "100%", // adjust as needed
    maxWidth: 700,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
    backgroundColor: "#000",
    overflow: "hidden",
  },
  videoWrapper: {
    height: "100%",
    width: "100%",
    position: "relative",
  },
  touchable: {
    width: "100%",
    height: "100%",
  },
  video: {
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
  },
  loadingOverlay: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  loadingText: {
    marginTop: 8,
    color: "#fff",
  },

  overlayChat: {
    position: "absolute",
    bottom: 90,
    left: 10,
    right: 80,
    flexDirection: "column",
  },
  overlayBubble: {
    padding: 8,
    borderRadius: 10,
    marginVertical: 3,
    maxWidth: "70%",
  },
  overlaySent: {
    backgroundColor: "rgba(220,248,198,0.95)",
    alignSelf: "flex-end",
  },
  overlayReceived: {
    backgroundColor: "rgba(240,240,240,0.95)",
    alignSelf: "flex-start",
  },
  overlaySender: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#333",
  },
  overlayText: {
    fontSize: 14,
    color: "#000",
  },

  chatButton: {
    position: "absolute",
    bottom: 25,
    right: 15,
    backgroundColor: "#ff4081",
    borderRadius: 30,
    padding: 12,
    zIndex: 20,
    elevation: 20,
  },
  chatButtonText: {
    fontSize: 20,
    color: "#fff",
  },

  emptyReel: {
    backgroundColor: "#111",
  },
});
