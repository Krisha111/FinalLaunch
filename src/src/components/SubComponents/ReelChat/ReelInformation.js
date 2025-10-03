// src/components/ReelChat/ReelInformation.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { IoHeart, IoHeartOutline, IoChatbubbleOutline, IoSend } from 'react-icons/io5';
import { BsEmojiKiss, BsEmojiKissFill } from 'react-icons/bs';
import { FaMicrophoneAlt } from 'react-icons/fa';
import { AiFillPicture } from 'react-icons/ai';
import { MdAccessTimeFilled } from 'react-icons/md';
import ReactTimeAgo from 'react-timeago';

import ReelChatCommment from './ReelChatCommment';
import EmojiPop from './PopUps/EmojiPop';
import UserNameEntering from './ConnectingReelChat/UserNameEntering';
import ThreeDotsOption from '../MainPage/PopUpBody/ThreeDotsOption';
import MoreOptionPopUp from './PopUps/MoreOptionPopUp';
import SwitchPopUp from './PopUps/SwitchPopUp';

import { fetchReels, toggleLikeReel, commentOnReel } from '../../../Redux/Slices/Profile/reelNewDrop';

export default function ReelInformation({ reel }) {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const user = useSelector((state) => state.signInAuth?.user);
  const updatedReel = useSelector(
    (state) => state.reelNewDrop.reels.find(r => r._id === reel._id)
  );

  const [showCommentFooter, setShowCommentFooter] = useState(false);
  const [likeCount, setLikeCount] = useState(updatedReel?.likes?.length || 0);
  const [saved, setSaved] = useState(false);
  const [showThreeDotsOption, setThreeDotsOption] = useState(false);
  const [showSwitchPopUp, setSwitchPopUp] = useState(false);
  const [showUserNameEntering, setUserNameEntering] = useState(false);
  const [showMoreOptionPopUp, setMoreOptionPopUp] = useState(false);
  const [tooltipText, setTooltipText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [currentComment, setCurrentComment] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [liked, setLiked] = useState(false);

  const isLiked = updatedReel?.likes?.includes(user?._id);
  const comments = updatedReel?.comments || [];

  useEffect(() => {
    dispatch(fetchReels());
  }, [dispatch]);

  useEffect(() => {
    if (updatedReel) {
      setLiked(updatedReel.likes?.includes(user?._id));
      setLikeCount(updatedReel.likes?.length || 0);
    }
  }, [updatedReel, user?._id]);

  const handleSendComment = () => {
    if (!user || !currentComment.trim()) return;
    dispatch(commentOnReel({ reelId: reel._id, username: user.username, text: currentComment }));
    setCurrentComment('');
  };

  const toggleLiked = () => {
    if (!reel?._id) return;
    setLiked(prev => !prev);
    setLikeCount(prev => (liked ? prev - 1 : prev + 1));
    dispatch(toggleLikeReel({ reelId: reel._id }));
  };

  return (
    <View style={styles.container}>
      {/* Bio & Comments */}
      <View style={[styles.commentContainer, showCommentFooter ? styles.commentActive : styles.notActive]}>
        <ScrollView style={styles.scrollComments}>
          <View style={styles.bioContainer}>
            <Text style={styles.username}>@{reel?.user?.username || 'Unknown User'}</Text>
            {reel?.reelScript && <Text>{reel.reelScript}</Text>}
            <View style={styles.timeContainer}>
              <MdAccessTimeFilled />
              <Text style={styles.timeText}>
                {reel?.createdAt && <ReactTimeAgo date={new Date(reel.createdAt)} />}
              </Text>
            </View>
          </View>

          <View style={styles.commentsWrapper}>
            <ReelChatCommment comments={comments} />
          </View>
        </ScrollView>
      </View>

      {/* Bottom Footer */}
      {showCommentFooter && (
        <View style={styles.footerContainer}>
          <View style={styles.footerIconsLeft}>
            <TouchableOpacity onPress={() => setShowEmojiPicker(!showEmojiPicker)}>
              <BsEmojiKissFill size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity>
              <FaMicrophoneAlt size={24} color={isRecording ? 'red' : 'black'} />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.inputComment}
            placeholder="Add a comment..."
            value={currentComment}
            onChangeText={setCurrentComment}
            onSubmitEditing={handleSendComment}
          />

          <View style={styles.footerIconsRight}>
            <TouchableOpacity>
              <AiFillPicture size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSendComment}>
              <IoSend size={24} color="red" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Icon buttons */}
      <View style={styles.iconWrapperContainer}>
        <TouchableOpacity onPress={() => { setUserNameEntering(true); navigation.navigate('Sample'); }}>
          <BsEmojiKiss size={28} color="black" />
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleLiked}>
          {isLiked ? <IoHeart size={28} color="red" /> : <IoHeartOutline size={28} color="black" />}
          <Text>{likeCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowCommentFooter(prev => !prev)}>
          <IoChatbubbleOutline size={28} color="black" />
        </TouchableOpacity>
      </View>

      {/* Popups */}
      {showThreeDotsOption && <ThreeDotsOption onClose={() => setThreeDotsOption(false)} />}
      {showSwitchPopUp && <SwitchPopUp onClose={() => setSwitchPopUp(false)} />}
      {showMoreOptionPopUp && <MoreOptionPopUp onClose={() => setMoreOptionPopUp(false)} />}
      {showUserNameEntering && <UserNameEntering onClose={() => setUserNameEntering(false)} />}
      {showEmojiPicker && <EmojiPop onClose={() => setShowEmojiPicker(false)} onEmojiSelect={(e) => setCurrentComment(currentComment + e)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'column', overflow: 'hidden' },
  commentContainer: { flex: 0.8, width: '100%' },
  commentActive: { flex: 0.8 },
  notActive: { flex: 0.87 },
  scrollComments: { flex: 1 },
  bioContainer: { padding: 10, borderBottomWidth: 1, borderBottomColor: 'lightgray' },
  username: { fontWeight: 'bold', fontSize: 14 },
  timeContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 5 },
  timeText: { marginLeft: 5, fontSize: 12 },
  commentsWrapper: { width: '100%' },
  footerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 5, borderTopWidth: 1, borderTopColor: 'lightgray' },
  footerIconsLeft: { flexDirection: 'row', width: '20%', justifyContent: 'space-around' },
  footerIconsRight: { flexDirection: 'row', width: '20%', justifyContent: 'space-around' },
  inputComment: { flex: 0.6, height: 40, borderRadius: 20, borderWidth: 1, borderColor: 'black', paddingHorizontal: 10 },
  iconWrapperContainer: { flexDirection: 'row', justifyContent: 'space-evenly', paddingVertical: 5, borderTopWidth: 1, borderTopColor: 'lightgray' },
});
