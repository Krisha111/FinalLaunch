// src/components/ReelChat/ReelChatCommment.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { useDispatch, useSelector } from 'react-redux';
import Comments from './Comments';
import EmojiPop from './PopUps/EmojiPop';
import { commentOnReel } from '../../Redux/Slice/Profile/reelNewDrop.js';

export default function ReelChatCommment({ reelId, comments }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.signUpAuth.user); // adjust if your slice name differs

  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [audioUri, setAudioUri] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [currentComment, setCurrentComment] = useState('');

  // ---- 🎙 Audio Recording ----
  const handleStartRecording = async () => {
    try {
      if (!isRecording) {
        setIsRecording(true);
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== 'granted') return;

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const newRecording = new Audio.Recording();
        await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        await newRecording.startAsync();
        setRecording(newRecording);
      } else {
        setIsRecording(false);
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setAudioUri(uri);
        setRecording(null);
      }
    } catch (error) {
      console.log('Recording error:', error);
    }
  };

  // ---- 🔊 Playback ----
  const handlePlayback = async () => {
    try {
      if (audioUri) {
        const sound = new Audio.Sound();
        await sound.loadAsync({ uri: audioUri });
        await sound.playAsync();
      }
    } catch (error) {
      console.log('Playback error:', error);
    }
  };

  // ---- 💬 Send Comment ----
  const handleSendComment = () => {
    if (!currentComment.trim() || !user) return;

    // Dispatch Redux action so backend + store update
    dispatch(
      commentOnReel({
        reelId,
        username: user.username,
        text: currentComment,
      })
    );

    setCurrentComment('');
  };

  // ---- 😀 Add Emoji ----
  const addEmoji = (emoji) => {
    setCurrentComment((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Comments</Text>
      </View>

      {/* New Comment Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a comment..."
          value={currentComment}
          onChangeText={setCurrentComment}
        />
        <TouchableOpacity style={styles.button} onPress={handleSendComment}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setShowEmojiPicker(true)}>
          <Text style={styles.buttonText}>😊</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleStartRecording}>
          <Text style={styles.buttonText}>
            {isRecording ? 'Stop Recording' : 'Record Audio'}
          </Text>
        </TouchableOpacity>
        {audioUri && (
          <TouchableOpacity style={styles.button} onPress={handlePlayback}>
            <Text style={styles.buttonText}>Play Audio</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <EmojiPop
          isVisible={showEmojiPicker}
          onClose={() => setShowEmojiPicker(false)}
          onEmojiSelect={addEmoji}
        />
      )}

      {/* Comments Body */}
      <ScrollView style={styles.commentsBody}>
        {comments
          ?.slice()
          .sort(
            (a, b) =>
              new Date(b.createdAt || b.timestamp) - new Date(a.createdAt || a.timestamp)
          )
          .map((comment, index) => (
            <Comments
              key={comment._id || index}
              profileImage={comment.user?.profileImage}
              username={comment.user?.username}
              text={comment.text}
              createdAt={comment.createdAt}
            />
          ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  header: { paddingVertical: 5 },
  headerText: { fontSize: 16, fontWeight: 'bold' },
  commentsBody: { flex: 1, marginVertical: 5 },
  inputContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 5,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 5,
  },
  button: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: '#ddd',
    borderRadius: 20,
    marginHorizontal: 2,
    marginTop: 5,
  },
  buttonText: { fontSize: 12 },
});
