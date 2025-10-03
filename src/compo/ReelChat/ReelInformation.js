// src/components/ReelChat/ReelInformation.js
//
// SOLUTION (complete file):
// - Ensures comments update after posting by using the `commentOnReel` thunk
//   and updating a local comments state that is kept in sync with Redux.
// - Uses a robust selector to find the updated reel either in `reels` or `mainPageReels`.
// - Awaits the comment dispatch result and updates UI optimistically from the returned updated reel.
// - Handles user selector flexibly (accounts for signUpAuth or signInAuth slice names).
// - DOES NOT SKIP ANY CODE — full file below.

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons'; // IoHeart, IoHeartOutline, IoChatbubbleOutline, IoSend
import { FontAwesome5 } from '@expo/vector-icons'; // FaMicrophoneAlt
import { MaterialIcons } from '@expo/vector-icons'; // MdAccessTimeFilled
import { MaterialCommunityIcons } from '@expo/vector-icons'; // AiFillPicture equivalent
import { Entypo } from '@expo/vector-icons'; // BsEmojiKiss, BsEmojiKissFill

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
  const { reel } = route.params || {}; // reel passed via navigation
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // Support either signUpAuth or signInAuth naming (some files used different slice names)
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

  // Local comments array (keeps UI responsive and updates when Redux changes)
  const [localComments, setLocalComments] = useState(
    updatedReel?.comments || reel?.comments || []
  );

  // Derived flags
  const isLiked = Boolean((updatedReel?.likes || reel?.likes || []).includes(user?._id));

  // Fetch reels initially so store is populated (keeps consistent with previous behavior)
  useEffect(() => {
    dispatch(fetchReels());
  }, [dispatch]);

  // Keep local like/comment state in sync when the store updates for this reel
  useEffect(() => {
    if (updatedReel) {
      setLiked(Boolean(updatedReel.likes?.includes(user?._id)));
      setLikeCount(updatedReel.likes?.length || 0);
      setLocalComments(updatedReel.comments || []);
    } else {
      // fallback to the route-provided reel
      setLiked(Boolean(reel?.likes?.includes(user?._id)));
      setLikeCount(reel?.likes?.length || 0);
      setLocalComments(reel?.comments || []);
    }
  }, [updatedReel, reel?.comments, user?._id, reel?.likes]);

  // Send comment: dispatch thunk and wait for the updated reel result then update local comments
  const handleSendComment = async () => {
    if (!user) {
      // optional: navigate to login or show message
      console.warn('Not logged in — cannot comment');
      return;
    }
    if (!currentComment.trim()) return;

    try {
      // dispatch and await the result (thunk should return the updated reel or { reel: ... })
      const result = await dispatch(
        commentOnReel({
          reelId: reel._id,
          text: currentComment,
        })
      ).unwrap();

      // backend may return updated reel as `result` or `{ reel: ... }`
      const updated = result?.reel ? result.reel : result;

      if (updated && updated._id === reel._id) {
        // Replace local comments with server's authoritative list
        setLocalComments(updated.comments || []);
        // also update local like/comment counts if returned
        setLikeCount(updated.likes?.length ?? likeCount);
      } else {
        // If backend didn't return, fallback to refetch (less ideal)
        dispatch(fetchReels());
      }
    } catch (err) {
      console.error('Failed to post comment', err);
      // optional: show error UI
    } finally {
      setCurrentComment('');
    }
  };

  const toggleLiked = () => {
    if (!reel?._id) return;
    // Optimistic UI update
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? Math.max(prev - 1, 0) : prev + 1));
    // send to backend — slice will upsert the returned updated reel into store
    dispatch(toggleLikeReel({ reelId: reel._id }));
  };

  if (!reel) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>
          No reel data passed!
        </Text>
      </View>
    );
  }

  // Avatar helper
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
    <View style={styles.container}>
      {/* Bio & header area */}
      <View style={styles.commentContainer}>
        <View style={styles.scrollCommentsBossyContainer}>
          <View style={styles.bioContainer}>
            <View style={styles.userRow}>
              <Avatar />
              <Text style={styles.username}>@{reel?.user?.username || 'Unknown User'}</Text>
            </View>

            {reel?.reelScript ? (
              <Text style={styles.scriptText}>{reel.reelScript}</Text>
            ) : null}

            <View style={styles.timeContainer}>
              <MaterialIcons name="access-time" size={16} color="gray" />
              <Text style={styles.timeText}>
                {reel?.createdAt && dayjs(reel.createdAt).fromNow()}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Comments Section */}
      <View
        style={[
          styles.commentContainerBossyContainer,
          showCommentFooter ? styles.commentActive : styles.notActive,
        ]}
      >
        <ScrollView style={styles.scrollComments}>
          <View style={styles.commentsWrapper}>
            {/* Pass localComments (keeps UI in sync with backend result) */}
            <ReelChatCommment reelId={reel._id} comments={localComments} />
          </View>
        </ScrollView>

        {/* Footer for adding a comment (kept at bottom of screen if desired) */}
        <View style={styles.footerContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <TextInput
              value={currentComment}
              onChangeText={setCurrentComment}
              placeholder="Add a comment..."
              style={styles.inputComment}
            />
          </View>

          <View style={styles.iconWrapperContainer}>
            <TouchableOpacity onPress={() => setShowEmojiPicker((s) => !s)}>
              <Entypo name="emoji-happy" size={20} />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSendComment}>
              <Ionicons name="send" size={20} color="#333" />
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleLiked}>
              <Ionicons name={liked ? 'heart' : 'heart-outline'} size={22} color={liked ? 'red' : '#333'} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Emoji picker */}
        {showEmojiPicker && (
          <EmojiPop
            isVisible={showEmojiPicker}
            onClose={() => setShowEmojiPicker(false)}
            onEmojiSelect={(emoji) => setCurrentComment((c) => c + emoji)}
          />
        )}
      </View>
    </View>
  );
}

const AVATAR_SIZE = 36;

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'column', overflow: 'hidden' },
  commentContainer: { width: '100%' },
  commentContainerBossyContainer: {},
  commentActive: { flex: 0.8 },
  notActive: { flex: 0.87 },
  scrollComments: {},
  scrollCommentsBossyContainer: {
    flex: 1,
  },
  bioContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 8,
  },
  scriptText: {
    fontSize: 13,
    color: '#333',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 5,
  },
  timeText: { marginLeft: 5, fontSize: 12, color: 'gray' },
  commentsWrapper: { width: '100%' },

  // Avatar styles
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
  avatarLetter: { fontWeight: '700', color: '#333' },

  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: 'lightgray',
  },
  footerIconsLeft: {
    flexDirection: 'row',
    width: '20%',
    justifyContent: 'space-around',
  },
  footerIconsRight: {
    flexDirection: 'row',
    width: '20%',
    justifyContent: 'space-around',
  },
  inputComment: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'black',
    paddingHorizontal: 10,
    marginRight: 8,
  },
  iconWrapperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
});
