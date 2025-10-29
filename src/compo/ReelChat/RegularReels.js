// src/components/RegularReels.js
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Text,
  Dimensions,
} from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";

// Get exact device window height
const { height: WINDOW_HEIGHT } = Dimensions.get("window");

export default function RegularReels({
  reel,
  index,
  activeIndex,
  chat = [],
  username = "",
  isAdmin = false,
  isPlaying,
  onTogglePlay,
}) {
 
  const videoUrl = reel?.videoUrl || reel?.photoReelImages?.[0] || "";

  const player = useVideoPlayer(videoUrl, (player) => {
    player.loop = true;
    player.muted = true;
    player.volume = 0;
  });

  const mountedRef = useRef(true);
  const hasPlayedRef = useRef(false);
  const [loading, setLoading] = useState(true);
  const [buffering, setBuffering] = useState(false);
  const [ready, setReady] = useState(false);

  const isActive = index === activeIndex;

  // -----------------------------
  // Lifecycle cleanup
  // -----------------------------
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      try {
        player.pause();
        player.muted = true;
        player.volume = 0;
      } catch {}
    };
  }, [player]);

  // -----------------------------
  // Detect readiness manually
  // -----------------------------
  useEffect(() => {
    let interval;
    if (player && !ready && videoUrl) {
      interval = setInterval(() => {
        if (!mountedRef.current) return clearInterval(interval);
        if (player.duration && player.duration > 0) {
          setReady(true);
          setLoading(false);
          clearInterval(interval);
        }
      }, 200);
    }
    return () => clearInterval(interval);
  }, [player, videoUrl, ready]);

  // -----------------------------
  // Auto-play / pause logic
  // -----------------------------
  useEffect(() => {
    if (!player || !mountedRef.current || !videoUrl) return;

    // Pause inactive reels
    if (!isActive) {
      try {
        player.pause();
        player.muted = true;
        player.volume = 0;
        // console.log(`⏸ Reel ${index} is inactive and paused`);
      } catch {}
      return;
    }

    // Active reel logic
    const timeout = setTimeout(() => {
      if (!mountedRef.current || !isActive) return;

      try {
        if (!hasPlayedRef.current) {
          player.currentTime = 0;
          hasPlayedRef.current = true;
        }

        player.muted = false;
        player.volume = 1.0;

        if (isPlaying) {
          player.play();
          // console.log(`▶️ Reel ${index} is playing`);
        } else {
          player.pause();
          // console.log(`⏸ Reel ${index} is paused`);
        }
      } catch (e) {
        console.warn("Video control error:", e);
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [isActive, isPlaying, player, videoUrl]);
   useEffect(() => {
  console.log(`Reel ${index}: activeIndex=${activeIndex}, isActive=${isActive}`);
  

}, [activeIndex, index, isActive]);

  // -----------------------------
  // Ensure play on mount for active reel
  // -----------------------------
  useEffect(() => {
    if (player && isActive) {
      const playTimeout = setTimeout(() => {
        try {
          player.muted = false;
          player.volume = 1.0;
          if (isPlaying) player.play();
          console.log(`▶️ Reel ${index} ensured play after mount`);
        } catch {}
      }, 150);
      return () => clearTimeout(playTimeout);
    }
  }, [isActive, isPlaying, player]);

  // -----------------------------
  // Admin play/pause toggle
  // -----------------------------
  const handleTogglePlay = () => {
    if (!isAdmin || !player || !mountedRef.current || !isActive) return;

    try {
      if (isPlaying) {
        player.pause();
        console.log(`⏸ Admin paused reel ${index}`);
        onTogglePlay?.(index, false);
      } else {
        player.muted = false;
        player.volume = 1.0;
        player.play();
        console.log(`▶️ Admin played reel ${index}`);
        onTogglePlay?.(index, true);
      }
    } catch (e) {
      console.warn("Admin toggle error:", e);
    }
  };

  // -----------------------------
  // Guard for missing video
  // -----------------------------
  if (!videoUrl)
    return <View style={[styles.reelWrapper, styles.emptyReel]} />;

  // -----------------------------
  // Render UI
  // -----------------------------
  return (
    <View style={styles.reelWrapper}>
      <VideoView
        key={videoUrl}
        player={player}
        style={styles.video}
        contentFit="cover"
        nativeControls={false}
        onLoadStart={() => {
          if (!ready) setLoading(true);
          setBuffering(false);
        }}
        onLoaded={() => {
          setReady(true);
          setLoading(false);
          setBuffering(false);
        }}
        onBuffering={(b) => {
          setBuffering(b);
          if (!b) setLoading(false);
        }}
        onError={(e) => {
          console.warn("Video load error:", e);
          setLoading(false);
          setReady(true);
        }}
      />

      {/* Chat overlay */}
      <View style={styles.overlayChat}>
        {chat.slice(-3).map((c, i) => (
          <View
            key={i}
            style={[
              styles.overlayBubble,
              c.sender === username
                ? styles.overlaySent
                : styles.overlayReceived,
            ]}
          >
            <Text style={styles.overlaySender}>{c.sender}</Text>
            <Text style={styles.overlayText}>
              {typeof c.message === "string"
                ? c.message
                : JSON.stringify(c.message)}
            </Text>
          </View>
        ))}
      </View>

      {/* Loading overlay */}
      {(loading || buffering) && !ready && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>
            {buffering ? "Buffering..." : "Loading..."}
          </Text>
        </View>
      )}

      {/* Touchable overlay (admin only) */}
      <TouchableOpacity
        style={styles.touchable}
        activeOpacity={1}
        onPress={isAdmin ? handleTogglePlay : undefined}
      />
    </View>
  );
}

// -----------------------------
// Styles
// -----------------------------
const styles = StyleSheet.create({
  reelWrapper: {
    width: "100%",
    height: WINDOW_HEIGHT,
    position: "relative",
    backgroundColor: "#000",
  },
  video: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  touchable: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  loadingText: { marginTop: 8, color: "#fff" },
  overlayChat: {
    position: "absolute",
    bottom: 90,
    left: 10,
    right: 10,
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
  overlaySender: { fontSize: 10, fontWeight: "bold", color: "#333" },
  overlayText: { fontSize: 14, color: "#000" },
  emptyReel: { backgroundColor: "#111" },
});
