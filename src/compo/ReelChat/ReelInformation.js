
// src/components/ReelChat/ReelInformation.js
//
// PREMIUM UI SOLUTION (complete file):
// - Modern, clean design with smooth animations
// - Enhanced visual hierarchy and spacing
// - Premium color scheme and typography
// - Improved user experience with better interactions
// - All functionality preserved from original

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  StatusBar,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import ReelChatCommment from './ReelChatCommment';
import EmojiPop from './PopUps/EmojiPop';

import {
  fetchReels,
  toggleLikeReel,
  commentOnReel,
} from '../../Redux/Slice/Profile/reelNewDrop.js';

dayjs.extend(relativeTime);

export default function ReelInformation() {
  const route = useRoute();
  const { reel } = route.params || {};
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  // Support either signUpAuth or signInAuth naming
  const user = useSelector(
    (state) => state.signUpAuth?.user || state.signInAuth?.user || null
  );

  const updatedReel = useSelector((state) => {
    if (!reel?._id) return undefined;
    const fromReels = state.reelNewDrop?.reels?.find((r) => r._id === reel._id);
    if (fromReels) return fromReels;
    const fromMain = state.reelNewDrop?.mainPageReels?.find((r) => r._id === reel._id);
    return fromMain || undefined;
  });

  // Local UI state
  const [showCommentFooter, setShowCommentFooter] = useState(false);
  const [likeCount, setLikeCount] = useState(updatedReel?.likes?.length || reel?.likes?.length || 0);
  const [saved, setSaved] = useState(false);
  const [userNameEntering, setUserNameEntering] = useState(false);
  const [tooltipText, setTooltipText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [currentComment, setCurrentComment] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [liked, setLiked] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  // Local comments array
  const [localComments, setLocalComments] = useState(
    updatedReel?.comments || reel?.comments || []
  );

  // Derived flags
  const isLiked = Boolean((updatedReel?.likes || reel?.likes || []).includes(user?._id));

  // Fetch reels initially
  useEffect(() => {
    dispatch(fetchReels());
  }, [dispatch]);

  // Entrance animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Keep local state in sync
  useEffect(() => {
    if (updatedReel) {
      setLiked(Boolean(updatedReel.likes?.includes(user?._id)));
      setLikeCount(updatedReel.likes?.length || 0);
      setLocalComments(updatedReel.comments || []);
    } else {
      setLiked(Boolean(reel?.likes?.includes(user?._id)));
      setLikeCount(reel?.likes?.length || 0);
      setLocalComments(reel?.comments || []);
    }
  }, [updatedReel, reel?.comments, user?._id, reel?.likes]);

  // Send comment handler
  const handleSendComment = async () => {
    if (!user) {
      console.warn('Not logged in — cannot comment');
      return;
    }
    if (!currentComment.trim()) return;

    try {
      const result = await dispatch(
        commentOnReel({
          reelId: reel._id,
          text: currentComment,
        })
      ).unwrap();

      const updated = result?.reel ? result.reel : result;

      if (updated && updated._id === reel._id) {
        setLocalComments(updated.comments || []);
        setLikeCount(updated.likes?.length ?? likeCount);
      } else {
        dispatch(fetchReels());
      }
    } catch (err) {
      console.error('Failed to post comment', err);
    } finally {
      setCurrentComment('');
    }
  };

  const toggleLiked = () => {
    if (!reel?._id) return;
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? Math.max(prev - 1, 0) : prev + 1));
    dispatch(toggleLikeReel({ reelId: reel._id }));
  };

  if (!reel) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#FF6B6B" />
          <Text style={styles.errorText}>No reel data available</Text>
        </View>
      </View>
    );
  }

  // Avatar component
  const Avatar = () => {
    const sourceImage = updatedReel?.user?.profileImage || reel?.user?.profileImage;
    if (sourceImage) {
      return <Image source={{ uri: sourceImage }} style={styles.avatarImage} />;
    }
    const letter = reel?.user?.username ? reel.user.username.charAt(0).toUpperCase() : '?';
    return (
      <View style={styles.avatarFallback}>
        <Text style={styles.avatarLetter}>{letter}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.userInfoContainer}>
            <Avatar />
            <View style={styles.userDetails}>
              <Text style={styles.displayName}>Krisha</Text>
              <Text style={styles.username}>@{reel?.user?.username || 'Unknown User'}</Text>
            </View>
          </View>

          {reel?.reelScript ? (
            <View style={styles.scriptContainer}>
              <Text style={styles.scriptText}>{reel.reelScript}</Text>
            </View>
          ) : null}

          <View style={styles.metaInfo}>
            <View style={styles.timeContainer}>
              <MaterialIcons name="access-time" size={14} color="#8E8E93" />
              <Text style={styles.timeText}>
                {reel?.createdAt && dayjs(reel.createdAt).fromNow()}
              </Text>
            </View>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Ionicons
                  name={liked ? 'heart' : 'heart-outline'}
                  size={16}
                  color={liked ? '#FF3B30' : '#8E8E93'}
                />
                <Text style={styles.statText}>{likeCount}</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="chatbubble-outline" size={16} color="#8E8E93" />
                <Text style={styles.statText}>{localComments.length}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Comments Section */}
        <View style={styles.commentsSection}>
          <View style={styles.commentsSectionHeader}>
            <Text style={styles.commentsTitle}>Comments</Text>
            <Text style={styles.commentsCount}>{localComments.length}</Text>
          </View>
          
          <ScrollView
            style={styles.scrollComments}
            contentContainerStyle={styles.scrollContentContainer}
            showsVerticalScrollIndicator={false}
          >
            <ReelChatCommment reelId={reel._id} comments={localComments} />
          </ScrollView>
        </View>

        {/* Comment Input Footer */}
        <View style={[styles.footerContainer, inputFocused && styles.footerFocused]}>
          <View style={styles.footerInner}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setShowEmojiPicker(true)}
            >
              <Ionicons name="happy-outline" size={24} 
              color="black" />
            </TouchableOpacity>

            <View style={[styles.inputWrapper, inputFocused && styles.inputWrapperFocused]}>
              <TextInput
                style={styles.inputComment}
                placeholder="Add a comment..."
                placeholderTextColor="grey"
                value={currentComment}
                onChangeText={setCurrentComment}
                multiline
                maxLength={500}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.sendButton,
                currentComment.trim().length > 0 && styles.sendButtonActive,
              ]}
              onPress={handleSendComment}
              disabled={!currentComment.trim()}
            >
              <Ionicons
                name="send"
                size={20}
                color={currentComment.trim().length > 0 ? '#FFFFFF' : '#C7C7CC'}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.likeButtonFooter}
            onPress={toggleLiked}
            activeOpacity={0.7}
          >
            <Ionicons
              name={liked ? 'heart' : 'heart-outline'}
              size={28}
              color={liked ? '#FF3B30' : '#8E8E93'}
            />
          </TouchableOpacity>
        </View>

        {/* Emoji picker */}
        {showEmojiPicker && (
          <EmojiPop
            isVisible={showEmojiPicker}
            onClose={() => setShowEmojiPicker(false)}
            onEmojiSelect={(emoji) => setCurrentComment((c) => c + emoji)}
          />
        )}
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const AVATAR_SIZE = 48;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#FF6B6B',
    fontWeight: '600',
  },

  // Header Section
  headerSection: {
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: '#E5E5EA',
    borderWidth: 2,
    borderColor: '#F8F9FA',
  },
  avatarFallback: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: '#8ce474ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F8F9FA',
  },
  avatarLetter: {
    fontWeight: '700',
    fontSize: 20,
    color: '#FFFFFF',
  },
  userDetails: {
    marginLeft: 12,
    flex: 1,
  },
  displayName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 2,
  },
  username: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
  },
  scriptContainer: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#8ce474ff',
  },
  scriptText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#1C1C1E',
    fontWeight: '400',
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    marginLeft: 6,
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
  },

  // Comments Section
  commentsSection: {
    flex: 1,
    marginTop: 16,
    paddingHorizontal: 20,
  },
  commentsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  commentsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  commentsCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scrollComments: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 20,
  },

  // Footer
  footerContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 5,
  },
  footerFocused: {
    borderTopColor: '#8ce474ff',
    borderTopWidth: 2,
  },
  footerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 40,
    maxHeight: 100,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputWrapperFocused: {
    backgroundColor: '#FFFFFF',
    borderColor: '#8ce474ff',
  },
  inputComment: {
    fontSize: 15,
    color: '#000000',
    fontWeight: '400',
  },
  sendButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#E5E5EA',
  },
  sendButtonActive: {
    backgroundColor: '#8ce474ff',
  },
  likeButtonFooter: {
    position: 'absolute',
    right: 16,
    bottom: 60,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
});