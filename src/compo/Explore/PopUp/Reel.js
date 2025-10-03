// src/components/SubComponents/Explore/PopUp/Reel.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView
} from 'react-native';
import Video from 'react-native-video';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { toggleLikeReel } from '../../../Redux/Slice/Profile/reelNewDrop.js';
import CommentReel from './Comment/CommentReel.js';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export default function Reel({ post }) {
  const dispatch = useDispatch();
  const updatedReel =
    useSelector((state) =>
      state.reelNewDrop.reels.find((r) => r._id === post._id)
    ) || post;
  const currentUserId = useSelector((state) => state.signUpAuth.user?._id);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const likeCount =
    updatedReel?.likeCount ?? updatedReel?.likes?.length ?? 0;
const commentCount =
  updatedReel?.commentCount ?? updatedReel?.comments?.length ?? 0;

  const isLiked =
    updatedReel?.isLiked ??
    Boolean(updatedReel?.likes && updatedReel.likes.some(id => id === currentUserId));

  const toggleLike = async () => {
    try {
      await dispatch(toggleLikeReel({ reelId: post._id })).unwrap();
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  if (!post) return <Text>Reel not found</Text>;

  const mediaItems =
    updatedReel.photoReelImages && updatedReel.photoReelImages.length > 0
      ? updatedReel.photoReelImages
      : updatedReel.posterImage
        ? [updatedReel.posterImage]
        : ['https://via.placeholder.com/800x600'];

  const location = updatedReel.reelLocation || 'No Location';

  const nextSlide = () =>
    setCurrentIndex((prevIndex) => (prevIndex + 1) % mediaItems.length);
  const prevSlide = () =>
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + mediaItems.length) % mediaItems.length
    );

  const isVideoUrl = (url) => {
    if (!url) return false;
    const lower = url.split('?')[0].toLowerCase();
    return (
      lower.endsWith('.mp4') ||
      lower.endsWith('.webm') ||
      lower.endsWith('.ogg') ||
      lower.endsWith('.mov')
    );
  };

  const currentMedia = mediaItems[currentIndex];

  const handleVideoClick = () => {
    setPaused(prev => !prev);
  };

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 20 }} style={styles.container}>
      <View style={styles.mediaBox}>
{console.log("updatedReelupdatedReel",updatedReel.likes?.length || 0)}
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity>
            {updatedReel.user?.profileImage || post.user?.profileImage ? (
              <Image
                source={{ uri: updatedReel.user?.profileImage || post.user?.profileImage }}
                style={styles.avatar}
              />
            ) : (
              <MaterialIcons
                name="person"
                size={40}
                color="gray"
                style={styles.avatarIcon}
              />
            )}
          </TouchableOpacity>

          <View>
            <Text style={styles.username}>
              {updatedReel.user?.username || post.user?.username || "UnknownUser"}
            </Text>
            <Text style={styles.location}>{location}</Text>
          </View>
        </View>

        {/* Media */}
        <View style={styles.mediaWrapper}>
          {isVideoUrl(currentMedia) ? (
            <TouchableOpacity
              style={styles.mediaKaran}
              onPress={handleVideoClick}
              activeOpacity={1}
            >
              <Video
                source={{ uri: currentMedia }}
                style={styles.media}
                resizeMode="contain"
                repeat={true} // loop video
                paused={paused} // pause/play
              />
            </TouchableOpacity>
          ) : (
            <Image
              source={{ uri: currentMedia }}
              resizeMode="contain"
              style={styles.media}
            />
          )}

          {mediaItems.length > 1 && (
            <>
              <TouchableOpacity onPress={prevSlide} style={styles.leftButton}>
                <Text style={styles.arrow}>❮</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={nextSlide} style={styles.rightButton}>
                <Text style={styles.arrow}>❯</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={toggleLike} style={styles.actionBtn}>
            <MaterialIcons
              name="favorite"
              size={24}
              color={isLiked ? 'red' : 'black'}
              style={{ marginRight: 6 }}
            />
            <Text>{likeCount}</Text>
          </TouchableOpacity>

          <View style={styles.actionBtn}>
            <MaterialIcons
              name="chat-bubble-outline"
              size={24}
              color="black"
              style={{ marginRight: 6 }}
            />
            {console.log("updatedReel?.commentCount || 0)",
              commentCount)}
            <Text>{commentCount}</Text>
          
          </View>
        </View>

        {/* Comments */}
        <View style={styles.commentsBox}>
          <CommentReel post={post} reelId={post._id} contentType="reels" />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  commentsBox: { borderBottomWidth: 1, borderColor: '#ddd' },
  mediaBox: { width: "100%" },
  mediaKaran: { height: "100%", width: "100%", alignItems: "center", justifyContent: "center" },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  avatarIcon: { marginRight: 10 },
  username: { fontWeight: 'bold', fontSize: 16 },
  location: { fontSize: 12, color: 'gray' },
  mediaWrapper: {
    height: SCREEN_H * 0.5,
    width: "100%",
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  media: { height: "100%", width: "100%", borderRadius: 8 },
  leftButton: { position: 'absolute', left: 10, top: '50%' },
  rightButton: { position: 'absolute', right: 10, top: '50%' },
  arrow: { fontSize: 24, color: 'white' },
  footer: { flexDirection: 'row', marginTop: 10 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
});
