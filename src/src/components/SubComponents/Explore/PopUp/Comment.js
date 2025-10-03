// Comment.js (React Native)
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { useSelector } from 'react-redux';
import PostComment from './PostComment'; // convert your web PostComment to RN

export default function Comment({ postId, contentType, onCommentSend }) {
  const [currentComment, setCurrentComment] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioPath, setAudioPath] = useState('');
  const audioRecorderPlayer = new AudioRecorderPlayer();

  const posts = useSelector((state) => state.postNewDrop.posts);
  const post = posts.find((p) => p._id === postId);
  const comments = post?.comments || [];

  const handleSendComment = async () => {
    if (!currentComment.trim() && !imagePreview && !audioPath) return;

    let payload = '';
    if (audioPath) payload = `<audio src="${audioPath}" />`;
    else if (imagePreview) payload = `<img src="${imagePreview}" />`;
    else payload = currentComment;

    onCommentSend({ postId, text: payload, contentType });
    setCurrentComment('');
    setImagePreview(null);
    setAudioPath('');
    setIsRecording(false);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: true,
    });
    if (!result.canceled) setImagePreview(result.assets[0].uri);
  };

  const toggleRecording = async () => {
    if (!isRecording) {
      const uri = await audioRecorderPlayer.startRecorder();
      setAudioPath(uri);
      setIsRecording(true);
    } else {
      await audioRecorderPlayer.stopRecorder();
      setIsRecording(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.topContainer}>
        {post?.vibeScript && <Text style={styles.vibeScript}>{post.vibeScript}</Text>}
        <Text style={styles.timestamp}>5hrs ago</Text>

        <FlatList
          data={[...comments].reverse()}
          keyExtractor={(item, index) => item._id || index.toString()}
          renderItem={({ item }) => (
            <PostComment
              username={item.username}
              text={item.text}
              timestamp={item.timestamp}
            />
          )}
        />
      </View>

      <View style={styles.footer}>
        {/* 🎤 Microphone */}
        <TouchableOpacity onPress={toggleRecording} style={styles.iconButton}>
          <FontAwesome name="microphone" size={24} color={isRecording ? 'red' : 'black'} />
        </TouchableOpacity>

        {/* Text Input / Image Preview */}
        <View style={styles.inputWrapper}>
          {imagePreview ? (
            <Image source={{ uri: imagePreview }} style={styles.imagePreview} />
          ) : (
            <TextInput
              style={styles.input}
              value={currentComment}
              onChangeText={setCurrentComment}
              placeholder={isRecording ? 'Recording...' : 'Write a comment...'}
              editable={!isRecording}
              onSubmitEditing={handleSendComment}
            />
          )}
        </View>

        {/* 📷 Image Picker */}
        <TouchableOpacity onPress={pickImage} style={styles.iconButton}>
          <MaterialIcons name="image" size={24} color="black" />
        </TouchableOpacity>

        {/* 📤 Send */}
        <TouchableOpacity onPress={handleSendComment} style={styles.iconButton}>
          <Ionicons name="send" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topContainer: { flex: 0.85, padding: 10 },
  vibeScript: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  timestamp: { fontSize: 12, color: 'gray', marginBottom: 10, textAlign: 'right' },
  footer: {
    flex: 0.15,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: 'lightgray',
    paddingHorizontal: 5,
  },
  iconButton: { padding: 5 },
  inputWrapper: {
    flex: 1,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 20,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  input: { height: 40 },
  imagePreview: { height: 40, width: 40, borderRadius: 5 },
});
