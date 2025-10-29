// MainPageRegularReels.js
// ✅ Auto-plays when reel becomes active (Instagram behavior)
// ✅ Tap to pause/play
// ✅ ALWAYS auto-plays when you return to any reel
// ✅ Safe cleanup on unmount
// ✅ Handles videoUrl fallback
// ✅ COMPLETE FIX: Properly mutes ALL inactive reels (forward AND backward scroll)
// ✅ Works perfectly with FlatList windowSize

import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';

export default function MainPageRegularReels({ reel, isActive }) {
  const videoUrl = reel?.videoUrl || reel?.photoReelImages?.[0] || null;

  // Create player with initial muted state
  const player = useVideoPlayer(videoUrl, (player) => {
    // Configure player on creation - start muted and paused
    player.loop = true;
    player.muted = true;
    player.volume = 0;
  });

  // Track if component is mounted
  const mountedRef = useRef(true);

  // Track current playing state
  const [isPlaying, setIsPlaying] = useState(false);

  // Track if we've started playing at least once
  const hasPlayedRef = useRef(false);

  // Track mount/unmount
  useEffect(() => {
    mountedRef.current = true;

    return () => {
  mountedRef.current = false;
  try {
    if (player) {
      console.log(`🧹 [${reel?._id?.slice(-4)}] Safe unmount cleanup`);
      player.pause();
      player.muted = true;
      player.volume = 0;
      
      // ✅ Correct way to release resources — prevents "shared object released" error
      if (typeof player.unload === "function") {
        player.unload(); // built-in in expo-video
      } else if (typeof player.destroy === "function") {
        player.destroy();
      }

      // Avoid using player.replace(null)
      // That line caused your “Cannot set prop 'player'” crash
    }
  } catch (err) {
    console.warn("Video cleanup error on unmount:", err);
  }
};

  }, [player, reel]);

  // CRITICAL: This effect runs on EVERY render to catch edge cases
  // It ensures inactive reels are ALWAYS muted, even when scrolling backwards
  useEffect(() => {
    if (!player || !mountedRef.current) return;

    if (!isActive) {
      // If we're not active, force mute immediately
      try {
        const wasMuted = player.muted;
        const wasVolume = player.volume;
        
        if (!wasMuted || wasVolume > 0) {
          console.log(`🔇 [${reel?._id?.slice(-4)}] Force muting (was muted=${wasMuted}, vol=${wasVolume})`);
          player.pause();
          player.muted = true;
          player.volume = 0;
          setIsPlaying(false);
        }
      } catch (err) {
        // Ignore errors in safety check
      }
    }
  }); // No dependencies - runs on every render for maximum safety

  // Auto play/pause when isActive changes
  useEffect(() => {
    if (!player || !mountedRef.current || !videoUrl) return;

    console.log(`[${reel?._id?.slice(-4)}] isActive changed to: ${isActive}`);

    if (isActive) {
      // ✅ Reel became active - ALWAYS auto-play (like Instagram)
      console.log(`▶️ [${reel?._id?.slice(-4)}] Activating and playing`);
      
      // Small delay to ensure other videos are stopped first
      const playTimeout = setTimeout(() => {
        if (!mountedRef.current || !isActive) return;
        
        try {
          // Reset to beginning on first play
          if (!hasPlayedRef.current) {
            player.currentTime = 0;
            hasPlayedRef.current = true;
          }
          
          // Unmute and set full volume
          player.muted = false;
          player.volume = 1.0;
          
          // Play the video
          player.play();
          setIsPlaying(true);
          
          console.log(`✅ [${reel?._id?.slice(-4)}] Now playing (muted=false, vol=1.0)`);
        } catch (err) {
          console.warn(`❌ [${reel?._id?.slice(-4)}] Play error:`, err);
        }
      }, 100); // Slightly longer delay for more reliable switching

      return () => clearTimeout(playTimeout);
    } else {
      // ⏸️ Reel became inactive - IMMEDIATELY mute and pause
      console.log(`⏸️ [${reel?._id?.slice(-4)}] Deactivating - muting and pausing`);
      
      try {
        // IMMEDIATE stop
        player.pause();
        
        // IMMEDIATE mute with both methods
        player.muted = true;
        player.volume = 0;
        
        // Update state
        setIsPlaying(false);
        
        console.log(`✅ [${reel?._id?.slice(-4)}] Now stopped (muted=true, vol=0)`);
      } catch (err) {
        console.warn(`❌ [${reel?._id?.slice(-4)}] Pause error:`, err);
      }
    }
  }, [isActive, player, videoUrl, reel]);

  // Handle user tap to toggle play/pause
  const handlePress = () => {
    if (!player || !mountedRef.current || !isActive) {
      console.log(`👆 [${reel?._id?.slice(-4)}] Tap ignored (not active or no player)`);
      return;
    }

    console.log(`👆 [${reel?._id?.slice(-4)}] User tap - isPlaying=${isPlaying}`);

    try {
      if (isPlaying) {
        // User wants to pause
        player.pause();
        setIsPlaying(false);
        console.log(`⏸️ [${reel?._id?.slice(-4)}] User paused`);
      } else {
        // User wants to play
        player.muted = false;
        player.volume = 1.0;
        player.play();
        setIsPlaying(true);
        console.log(`▶️ [${reel?._id?.slice(-4)}] User played`);
      }
    } catch (err) {
      console.warn(`❌ [${reel?._id?.slice(-4)}] Toggle error:`, err);
    }
  };

  // If no video URL, render empty container
  if (!videoUrl) {
    return <View style={styles.videoContainer} />;
  }

  return (
    <View style={styles.videoContainer}>
      <VideoView
        player={player}
        style={styles.video}
        contentFit="cover"
        nativeControls={false}
      />
      <TouchableOpacity
        onPress={handlePress}
        style={styles.touchOverlay}
        activeOpacity={1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  videoContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: 'transparent',
    position: 'relative',
  },
  video: {
    flex: 1,
    width: '100%',
  },
  touchOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});