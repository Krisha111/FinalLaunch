// src/components/SubComponents/Explore/PopUp/PostComment.native.js
// React Native version of your PostComment component.
// Handles HTML-like content for images and audio (basic parsing).
// WARNING: This file uses dynamic import for expo-av when playing audio so your bundler won't fail
// if expo-av isn't installed. If you have expo-av installed, audio playback will use it.
// If not, tapping the audio play button will attempt to open the URL via Linking as a fallback.

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import moment from 'moment';

export default function PostComment({
  email,
  profileImage,
  username,
  text,
  timestamp,
}) {
  const [imageSrcs, setImageSrcs] = useState([]);
  const [audioSrcs, setAudioSrcs] = useState([]);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const soundRef = useRef(null);
  const [isPlayingIndex, setIsPlayingIndex] = useState(null);

  // simple HTML-parsing helpers (robust enough for <img src="..."> and <audio src="..."></audio> and <source src="...">)
  const extractImageSrcs = (htmlString = '') => {
    const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
    const results = [];
    let match;
    while ((match = imgRegex.exec(htmlString))) {
      results.push(match[1]);
    }
    return results;
  };

  const extractAudioSrcs = (htmlString = '') => {
    const audioRegex = /<audio[^>]*src=["']([^"']+)["'][^>]*>.*?<\/audio>/gi;
    const sourceRegex = /<source[^>]+src=["']([^"']+)["'][^>]*>/gi;
    const results = [];
    let match;
    while ((match = audioRegex.exec(htmlString))) {
      results.push(match[1]);
    }
    while ((match = sourceRegex.exec(htmlString))) {
      results.push(match[1]);
    }
    return results;
  };

  // Strip remaining HTML tags for simple text rendering fallback
  const stripHtmlTags = (htmlString = '') => {
    return htmlString.replace(/<[^>]*>/g, '').trim();
  };

  useEffect(() => {
    setImageSrcs(extractImageSrcs(text));
    setAudioSrcs(extractAudioSrcs(text));
    // cleanup on unmount: unload audio if playing
    return () => {
      if (soundRef.current && soundRef.current.unloadAsync) {
        try {
          soundRef.current.unloadAsync();
        } catch (e) {
          // ignore
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  // Play audio: tries to dynamically import expo-av. If not available, falls back to Linking.openURL
  const handlePlayAudio = async (src, index) => {
    if (!src) {
      Alert.alert('No audio source');
      return;
    }

    // if currently playing same index -> stop
    if (isPlayingIndex === index) {
      // stop/unload
      if (soundRef.current && soundRef.current.stopAsync) {
        try {
          await soundRef.current.stopAsync();
          await soundRef.current.unloadAsync();
        } catch (e) {
          // ignore
        }
      }
      soundRef.current = null;
      setIsPlayingIndex(null);
      return;
    }

    setIsLoadingAudio(true);
    try {
      // attempt dynamic import of expo-av (so file won't break if not installed)
      const AV = await import('expo-av').catch(() => null);
      if (AV && AV.Audio) {
        const { Sound } = AV;
        const { Audio } = AV; // prefer using Audio namespace if available
        const soundObject = new AV.Audio.Sound();
        soundRef.current = soundObject;
        await soundObject.loadAsync({ uri: src }, { shouldPlay: true });
        setIsPlayingIndex(index);
        // when playback finishes, reset state
        soundObject.setOnPlaybackStatusUpdate((status) => {
          if (!status) return;
          if (status.didJustFinish || status.isLoaded === false) {
            // finished or unloaded
            setIsPlayingIndex(null);
            setIsLoadingAudio(false);
            try {
              if (soundRef.current && soundRef.current.unloadAsync) {
                soundRef.current.unloadAsync().catch(() => {});
              }
            } catch (e) {}
            soundRef.current = null;
          }
        });
      } else {
        // fallback: try to open the uri in external player
        await Linking.openURL(src);
        setTimeout(() => setIsLoadingAudio(false), 400);
      }
    } catch (err) {
      console.warn('Audio play failed:', err);
      Alert.alert('Playback failed', 'Could not play audio.');
      setIsLoadingAudio(false);
      setIsPlayingIndex(null);
    } finally {
      // If using expo-av we keep playing state until playback finish/stop.
      if (!soundRef.current) setIsLoadingAudio(false);
    }
  };

  const handleOpenLink = async (uri) => {
    try {
      const supported = await Linking.canOpenURL(uri);
      if (supported) {
        await Linking.openURL(uri);
      } else {
        Alert.alert('Cannot open link', uri);
      }
    } catch (err) {
      console.warn('Link open error', err);
      Alert.alert('Error', 'Unable to open link');
    }
  };

  // Avatar rendering
  const Avatar = () => {
    if (profileImage) {
      return <Image source={{ uri: profileImage }} style={styles.avatarImage} />;
    }

    // fallback letter avatar
    const letter = username ? username.charAt(0).toUpperCase() : '?';
    return (
      <View style={styles.avatarFallback}>
        <Text style={styles.avatarLetter}>{letter}</Text>
      </View>
    );
  };

  // Compose display content: if there are images or audio render them, else plain text
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Avatar />
      </View>

      <View style={styles.right}>
        <View style={styles.headerRow}>
          <Text style={styles.usernameText}>{username || 'UserName'}</Text>
        </View>

        {/* Render HTML-aware content */}
        <View style={styles.contentArea}>
          {/* Images (if any) */}
          {imageSrcs.length > 0 &&
            imageSrcs.map((src, idx) => (
              <TouchableOpacity
                key={`img-${idx}`}
                activeOpacity={0.9}
                onPress={() => handleOpenLink(src)}
              >
                <Image
                  source={{ uri: src }}
                  style={styles.commentImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}

          {/* Audio controls (if any) */}
          {audioSrcs.length > 0 &&
            audioSrcs.map((src, idx) => {
              const isPlaying = isPlayingIndex === idx;
              return (
                <View style={styles.audioRow} key={`audio-${idx}`}>
                  <TouchableOpacity
                    style={styles.audioButton}
                    onPress={() => handlePlayAudio(src, idx)}
                    disabled={isLoadingAudio && !isPlaying}
                  >
                    {isLoadingAudio && isPlaying ? (
                      <ActivityIndicator size="small" />
                    ) : (
                      <Text style={styles.audioButtonText}>
                        {isPlaying ? 'Stop audio' : 'Play audio'}
                      </Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.openLinkButton}
                    onPress={() => handleOpenLink(src)}
                  >
                    <Text style={styles.openLinkText}>Open</Text>
                  </TouchableOpacity>
                </View>
              );
            })}

          {/* If no images/audio, show stripped text */}
          {imageSrcs.length === 0 && audioSrcs.length === 0 && (
            <Text style={styles.commentText}>
              {stripHtmlTags(text) || ''}
            </Text>
          )}
        </View>

        <Text style={styles.timeText}>
          {timestamp ? moment(timestamp).fromNow() : 'Just now'}
        </Text>
      </View>
    </View>
  );
}

const AVATAR_SIZE = 36;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'flex-start',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e3e3e3',
    backgroundColor: '#fff',
  },
  left: {
    marginRight: 10,
    width: AVATAR_SIZE,
    alignItems: 'center',
  },
  avatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: '#ddd',
  },
  avatarFallback: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: '#cfcfcf',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetter: {
    fontWeight: '700',
    color: '#333',
  },
  right: {
    flex: 1,
    flexDirection: 'column',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  usernameText: {
    fontWeight: '600',
    fontSize: 14,
    color: '#111',
  },
  contentArea: {
    marginBottom: 6,
  },
  commentText: {
    fontSize: 14,
    color: '#222',
    lineHeight: 18,
  },
  commentImage: {
    width: 220,
    height: 120,
    borderRadius: 8,
    marginTop: 6,
    marginBottom: 6,
    backgroundColor: '#eee',
  },
  timeText: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
  audioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  audioButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#007bff',
    marginRight: 8,
  },
  audioButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  openLinkButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#efefef',
  },
  openLinkText: {
    color: '#333',
  },
});
