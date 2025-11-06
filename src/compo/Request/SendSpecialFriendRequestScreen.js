// src/screens/SendSpecialFriendRequestScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SendSpecialFriendRequestScreen({ route, navigation }) {
  const { recipientId, recipientName } = route.params;

  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please allow access to your photos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7, // Reduced quality for smaller file size
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        // Create proper base64 image string
        const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
        console.log('✅ Image selected, size:', base64Image.length);
        setImage(base64Image);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const sendRequest = async () => {
    // Validate inputs
    if (!image) {
      Alert.alert('Image Required', 'Please select an image for your request');
      return;
    }

    if (!caption.trim()) {
      Alert.alert('Caption Required', 'Please write a caption for your request');
      return;
    }

    if (caption.trim().length > 500) {
      Alert.alert('Caption Too Long', 'Caption must be 500 characters or less');
      return;
    }

    if (!recipientId) {
      Alert.alert('Error', 'Recipient information is missing');
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        Alert.alert('Error', 'Authentication token not found');
        setLoading(false);
        return;
      }

      console.log('📤 Sending request to:', recipientId);
      console.log('📝 Caption length:', caption.trim().length);
      console.log('🖼️ Image size:', image.length);

      const requestData = {
        recipientId: recipientId,
        image: image,
        caption: caption.trim()
      };

      const response = await axios.post(
        'https://finallaunchbackend.onrender.com/api/requests/send-special-friend',
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000 // 30 second timeout
        }
      );

      console.log('✅ Request sent successfully:', response.data);

      // ✅ Always clear loading first before alert/navigation
setLoading(false);

// ✅ Use platform-specific handling (alerts don't always work on web)
if (Platform.OS === 'web') {
  console.log('✅ Navigating to Sampleeee (web platform)...');
  navigation.navigate('MainTabs', { screen: 'Sampleeee' });
} else {
  Alert.alert(
    'Success',
    'Special friend request sent!',
    [
      {
        text: 'OK',
        onPress: () => {
          console.log("✅ Navigating to Sampleeee tab...");
          navigation.navigate('MainTabs', { screen: 'Sampleeee' });
        },
      },
    ]
  );
}
    } catch (err) {
      console.error('❌ Error sending request:', err);
      console.error('❌ Error response:', err.response?.data);
      console.error('❌ Error status:', err.response?.status);

      let errorMessage = 'Failed to send request';

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Send Chosen Request</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Recipient Info */}
        <View style={styles.recipientInfo}>
          <Text style={styles.recipientLabel}>Sending to:</Text>
          <Text style={styles.recipientName}>{recipientName || 'User'}</Text>
        </View>

        {/* Image Picker */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose an Image *</Text>
          <TouchableOpacity
            style={styles.imagePicker}
            onPress={pickImage}
            disabled={loading}
          >
            {image ? (
              <Image source={{ uri: image }} style={styles.previewImage} />
            ) : (
              <View style={styles.placeholderContainer}>
                <Ionicons name="image-outline" size={60} color="#999" />
                <Text style={styles.placeholderText}>Tap to select image</Text>
              </View>
            )}
          </TouchableOpacity>
          {image && (
            <TouchableOpacity
              style={styles.changeImageButton}
              onPress={pickImage}
              disabled={loading}
            >
              <Ionicons name="camera-outline" size={18} color="#FF6B6B" />
              <Text style={styles.changeImageText}>Change Image</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Caption Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Write a Caption *</Text>
          <TextInput
            style={styles.captionInput}
            placeholder="Why do you want them as your chosen friend?"
            placeholderTextColor="#999"
            multiline
            maxLength={500}
            value={caption}
            onChangeText={setCaption}
            editable={!loading}
          />
          <Text style={[
            styles.charCount,
            caption.length > 450 && styles.charCountWarning
          ]}>
            {caption.length}/500
          </Text>
        </View>

        {/* Send Button */}
        <TouchableOpacity
          style={[styles.sendButton, loading && styles.sendButtonDisabled]}
          onPress={sendRequest}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small"
              color="#fff" />
          ) : (
            <>
              <Ionicons name="send" size={20}
                color="#fff" />
              <Text style={styles.sendButtonText}>
                Send Request</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  recipientInfo: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  recipientLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  recipientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  imagePicker: {
    width: '100%',
    aspectRatio: 4 / 3,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    marginTop: 10,
    fontSize: 14,
    color: '#999',
  },
  changeImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    gap: 6,
  },
  changeImageText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '500',
  },
  captionInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 15,
    minHeight: 120,
    textAlignVertical: 'top',
    backgroundColor: '#f9f9f9',
  },
  charCount: {
    textAlign: 'right',
    marginTop: 5,
    fontSize: 12,
    color: '#999',
  },
  charCountWarning: {
    color: '#ff9800',
  },
  sendButton: {
    backgroundColor: '#FF6B6B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
    gap: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.7,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});