// Reel.js (React Native)
import React, { useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Dimensions } from 'react-native';
import Video from 'react-native-video';
import { useDispatch, useSelector } from 'react-redux';
import { toggleLikeReel } from '../../../../Redux/Slices/Profile/reelNewDrop';
import CommentReel from './Comment/CommentReel';

import { IoHeartOutline, IoHeart, IoChatbubbleOutline } from 'react-icons/io5'; // optional icons
import { FaLocationDot } from 'react-icons/fa6';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function Reel({ post }) {
  const dispatch = useDispatch();
  const updatedReel = useSelector((state) =>
    state.reelNewDrop.reels.find((r) => r._id === post._id)
  ) || post;

  const currentUserId = useSelector((state) => state.signInAuth.user?._id);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef(null);

  const likeCount =
    updatedReel?.likeCount ?? updatedReel?.likes?.length ?? 0;

  const isLiked =
    updatedReel?.isLiked ??
    Boolean(
      updatedReel?.likes &&
        (updatedReel.likes.some
          ? updatedReel.likes.some((id) => id === currentUserId)
          : updatedReel.likes.includes(currentUserId))
    );

  const toggleLike = () => dispatch(toggleLikeReel({ reelId: post._id }));

  const mediaItems =
    (updatedReel.photoReelImages && updatedReel.photoReelImages.length > 0)
      ? updatedReel.photoReelImages
      : updatedReel.posterImage
      ? [updatedReel.posterImage]
      : ['https://via.placeholder.com/800x600'];

  const location = updatedReel.reelLocation || 'No Location';
  const currentMedia = mediaItems[currentIndex];

  const isVideoUrl = (url) => {
    if (!url) return false;
    const lower = url.split('?')[0].toLowerCase();
    return (
      lower.startsWith('data:video') ||
      lower.endsWith('.mp4') ||
      lower.endsWith('.webm') ||
      lower.endsWith('.ogg') ||
      lower.endsWith('.mov')
    );
  };

  const handleVideoPress = () => {
    if (videoRef.current) {
      videoRef.current.paused = !videoRef.current.paused;
    }
  };

  return (
    <View style={styles.container}>
      {/* Comments */}
      <View style={styles.commentSection}>
        <CommentReel post={post} reelId={post._id} contentType="reels" />
      </View>

      {/* Media */}
      <View style={styles.mediaSection}>
        {isVideoUrl(currentMedia) ? (
          <TouchableOpacity onPress={handleVideoPress} activeOpacity={0.9}>
            <Video
              ref={videoRef}
              source={{ uri: currentMedia }}
              style={styles.media}
              resizeMode="cover"
              repeat
              muted
            />
          </TouchableOpacity>
        ) : (
          <Image source={{ uri: currentMedia }} style={styles.media} />
        )}

        {/* Simple media navigation */}
        {mediaItems.length > 1 && (
          <View style={styles.sliderButtons}>
            <TouchableOpacity
              onPress={() => setCurrentIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length)}
              style={styles.sliderButton}
            >
              <Text style={{ color: 'white' }}>❮</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setCurrentIndex((prev) => (prev + 1) % mediaItems.length)}
              style={styles.sliderButton}
            >
              <Text style={{ color: 'white' }}>❯</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Actions */}
      <View style={styles.actionsSection}>
        <TouchableOpacity onPress={toggleLike} style={styles.actionButton}>
          <Text style={{ color: isLiked ? 'red' : 'black', fontSize: 25 }}>
            {isLiked ? '❤️' : '🤍'}
          </Text>
          <Text>{likeCount}</Text>
        </TouchableOpacity>

        <View style={styles.actionButton}>
          <Text style={{ fontSize: 25 }}>💬</Text>
          <Text>{updatedReel?.commentCount || 0}</Text>
        </View>
      </View>

      {/* User info + location ticker */}
      <View style={styles.userInfo}>
        <Text style={styles.username}>{updatedReel.user?.username || 'UnknownUser'}</Text>
        <Text style={styles.location}>📍 {location}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', height: '100%', width: '100%' },
  commentSection: { flex: 0.45, borderRightWidth: 1, borderRightColor: 'lightgrey' },
  mediaSection: { flex: 0.55, position: 'relative', justifyContent: 'center', alignItems: 'center' },
  media: { width: SCREEN_WIDTH * 0.55, height: '75%', borderRadius: 20 },
  sliderButtons: { position: 'absolute', top: '45%', width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 },
  sliderButton: { backgroundColor: 'rgba(0,0,0,0.4)', padding: 10, borderRadius: 20 },
  actionsSection: { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingTop: 10 },
  actionButton: { flexDirection: 'row', alignItems: 'center', marginRight: 15 },
  userInfo: { position: 'absolute', top: 10, left: 10 },
  username: { fontWeight: 'bold', fontSize: 14 },
  location: { fontSize: 12, color: 'gray' },
});
