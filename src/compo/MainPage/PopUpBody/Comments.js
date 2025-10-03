// Comments.js (React Native)
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import CommentsBody from './CommentsBody';
import { BsEmojiKissFill } from 'react-icons/bs'; // For web, you can replace with react-native-vector-icons
import { FaMicrophoneAlt } from 'react-icons/fa';
import { IoSend } from 'react-icons/io5';
import { AiFillPicture } from 'react-icons/ai';
import { Picker } from 'emoji-mart';

export default function Comments({ onClose }) {
  const [showPopup, setShowPopup] = useState(false);
  const [comments, setComments] = useState([]);
  const [currentComment, setCurrentComment] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleOpenPopup = () => setShowPopup(true);

  const handleClosePopup = useCallback(() => {
    setShowPopup(false);
    onClose && onClose();
  }, [onClose]);

  useEffect(() => {
    handleOpenPopup();
  }, []);

  const handleStartRecording = async () => {
    // Note: Recording logic is platform-dependent in React Native
    if (!isRecording) {
      setIsRecording(true);
      // TODO: Use react-native-audio or expo-av for recording
    } else {
      setIsRecording(false);
      // Stop recording logic
    }
  };

  const handleSendComment = () => {
    if (currentComment.trim()) {
      setComments([...comments, currentComment]);
      setCurrentComment('');
    }
  };

  const addEmoji = (emoji) => {
    setCurrentComment(currentComment + emoji.native);
    setShowEmojiPicker(false);
  };

  return (
    <Modal visible={showPopup} transparent animationType="fade" onRequestClose={handleClosePopup}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalContainer}
      >
        <View style={styles.popupContent}>
          <Text style={styles.commentTitle}>Comments</Text>

          <FlatList
            data={comments}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <CommentsBody text={item} />}
            style={styles.popUpBody}
          />

          <View style={styles.commentsFooter}>
            <View style={styles.footerIconsLeft}>
              <TouchableOpacity onPress={() => setShowEmojiPicker(!showEmojiPicker)}>
                <BsEmojiKissFill size={24} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleStartRecording}>
                <FaMicrophoneAlt color={isRecording ? 'red' : 'black'} size={24} />
              </TouchableOpacity>
              {showEmojiPicker && (
                <Picker
                  set="apple"
                  onSelect={addEmoji}
                  style={{
                    position: 'absolute',
                    bottom: 60,
                    left: 10,
                    zIndex: 1001,
                  }}
                />
              )}
            </View>

            <View style={styles.footerInput}>
              <TextInput
                value={currentComment}
                onChangeText={setCurrentComment}
                placeholder="Type a comment..."
                style={styles.inputComment}
              />
            </View>

            <View style={styles.footerIconsRight}>
              <TouchableOpacity>
                <AiFillPicture size={24} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSendComment}>
                <IoSend size={24} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContent: {
    backgroundColor: '#fff',
    width: '90%',
    height: '70%',
    borderRadius: 8,
    padding: 20,
  },
  commentTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  popUpBody: {
    flex: 1,
    marginBottom: 10,
  },
  commentsFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'lightgray',
    paddingTop: 10,
  },
  footerIconsLeft: {
    flexDirection: 'row',
    width: '10%',
    justifyContent: 'space-between',
  },
  footerInput: {
    flex: 0.8,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 30,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  inputComment: {
    height: 40,
  },
  footerIconsRight: {
    flexDirection: 'row',
    width: '10%',
    justifyContent: 'space-between',
  },
});
