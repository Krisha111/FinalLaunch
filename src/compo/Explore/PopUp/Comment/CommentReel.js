// src/components/SubComponents/Explore/PopUp/Comment/CommentReel.js
//
// WARNING:
// - This file dispatches commentOnReel to persist comments to the server (Redux thunk).
// - It NO LONGER only updates local state — the UI reads comments from Redux so comments
//   persist after refresh (assuming your backend returns the updated reel and your
//   redux slice upserts it, as in your slice).
// - If your backend returns a different shape, adapt the thunk/slice accordingly.
// - Make sure `react-native-vector-icons` (or @expo/vector-icons) is installed.
// - If testing on a physical device, audio/image permissions must be granted.

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import { commentOnReel } from '../../../../Redux/Slice/Profile/reelNewDrop.js';
import PostComment from '../PostComment.js';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // <-- Material Icons

export default function CommentReel({ post, reelId, contentType }) {
  const dispatch = useDispatch();
  const [currentComment, setCurrentComment] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [audioUri, setAudioUri] = useState(null);
  const [sending, setSending] = useState(false);

  // read reel + comments from Redux so UI reflects persisted data
  const reel = useSelector((state) =>
    state.reelNewDrop.reels.find((r) => r._id === reelId)
  );
  const comments = reel?.comments || [];

  // createdAt for the post header; guard if post is missing
  const createdAt = post?.createdAt ? new Date(post.createdAt).toLocaleString() : '';

  // Send comment to server (via thunk). We await the dispatch to ensure redux state updates.
  const handleSendComment = async () => {
    if (!currentComment.trim() && !imagePreview && !audioUri) return;

    let text = '';

    if (audioUri) {
      text = `<audio src="${audioUri}" controls />`;
    } else if (imagePreview) {
      text = `<img src="${imagePreview}" alt="comment image" />`;
    } else {
      text = currentComment.trim();
    }

    try {
      setSending(true);
      // dispatch thunk; thunk should return updated reel (and slice should upsert it)
      await dispatch(commentOnReel({ reelId, text })).unwrap();

      // clear local inputs only after successful send
      setCurrentComment('');
      setImagePreview(null);
      setAudioUri(null);
    } catch (err) {
      console.error('Failed to send comment', err);
      Alert.alert('Error', 'Failed to send comment. Please try again.');
    } finally {
      setSending(false);
    }
  };

  // 🎤 Toggle audio recording with Expo AV
  const toggleRecording = async () => {
    try {
      if (!isRecording) {
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission required', 'Please grant audio recording permission.');
          return;
        }

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording: newRecording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );

        setRecording(newRecording);
        setIsRecording(true);
      } else {
        // stop recording
        setIsRecording(false);
        if (recording) {
          await recording.stopAndUnloadAsync();
          const uri = recording.getURI();
          setAudioUri(uri);
          setRecording(null);
        }
      }
    } catch (err) {
      console.error('Audio recording failed:', err);
      Alert.alert('Recording error', 'Unable to record audio.');
      setIsRecording(false);
      setRecording(null);
    }
  };

  // 🖼 Pick image
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      // new expo returns { canceled: boolean, assets: [...] }
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImagePreview(result.assets[0].uri);
      }
    } catch (err) {
      console.error('Image pick error', err);
      Alert.alert('Image error', 'Could not pick image.');
    }
  };

  const renderItem = ({ item }) => (
    <PostComment
      profileImage={item.user?.profileImage}
      username={item.user?.username}
      text={item.text}
      // pass both fields so PostComment/Comments components can handle either prop name
      createdAt={item.createdAt ?? item.timestamp}
      timestamp={item.timestamp ?? item.createdAt}
    />
  );

  return (
    <View style={styles.container}>
      {/* Post Info */}
      <View style={styles.header}>
        <Text style={styles.script}>{reel?.reelScript ?? 'No Script'}</Text>
        <Text style={styles.time}>{createdAt}</Text>
      </View>

      {/* Input Box */}
      <View style={styles.inputBox}>
        {/* Mic */}
        <TouchableOpacity onPress={toggleRecording} style={styles.iconBtn}>
          <MaterialIcons
            name="keyboard-voice"
            size={28}
            color={isRecording ? 'red' : 'black'}
          />
        </TouchableOpacity>

        {/* Image Preview or Text Input */}
        <View style={styles.inputWrapper}>
          {imagePreview ? (
            <Image
              source={{ uri: imagePreview }}
              style={{ width: 40, height: 40, borderRadius: 5 }}
            />
          ) : (
            <TextInput
              style={styles.input}
              value={currentComment}
              onChangeText={setCurrentComment}
              placeholder={isRecording ? 'Recording...' : 'Write a comment...'}
              editable={!isRecording && !sending}
              onSubmitEditing={handleSendComment}
              returnKeyType="send"
            />
          )}
        </View>

        {/* Upload Image */}
        <TouchableOpacity onPress={pickImage} style={styles.iconBtn}>
          <MaterialIcons name="image" size={28} color="black" />
        </TouchableOpacity>

        {/* Send */}
        <TouchableOpacity
          onPress={handleSendComment}
          style={styles.iconBtn}
          disabled={sending || isRecording}
        >
          <MaterialIcons name="send" size={28} color={sending ? '#999' : '#000'} />
        </TouchableOpacity>
      </View>

      {/* Comments List */}
      <FlatList
        data={[...comments].reverse()}
        keyExtractor={(item, idx) => item._id ?? item.id ?? String(idx)}
        renderItem={renderItem}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingVertical: 8 }}
        ListEmptyComponent={<Text style={{ color: '#777', padding: 8 }}>No comments yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 8 },
  header: {
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 10,
    alignItems: 'center',
    marginBottom: 8,
  },
  script: { fontSize: 14, fontWeight: '500', color: '#222', flex: 1 },
  time: { fontSize: 12, color: 'gray', marginLeft: 8 },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  iconBtn: { paddingHorizontal: 6 },
  inputWrapper: { flex: 1 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 40,
  },
});
