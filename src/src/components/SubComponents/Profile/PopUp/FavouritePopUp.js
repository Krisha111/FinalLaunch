// src/components/SubComponents/Profile/PopUp/FavouritePopUp.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Animated, StyleSheet, Alert } from 'react-native';
import { Avatar } from 'react-native-paper'; // Or any avatar library
import IndividualShare from '../../Profile/PopUp/IndividualShare';
import { FontAwesome } from '@expo/vector-icons'; // FaMicrophone equivalent

const fakeDataShare = [
  { username: 'krisha' }, { username: 'akshar' }, { username: 'raju' }, { username: 'chutki' },
  { username: 'jaggu' }, { username: 'bheem' }
];

export default function FavouritePopUp({ onClose }) {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleClose = () => {
    // Fade out before closing
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  const handleShare = () => {
    Alert.alert('Share', 'Sharing is not implemented in React Native example.');
  };

  const copyLinkToClipboard = () => {
    Alert.alert('Clipboard', 'Copying link not implemented in example.');
  };

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
      <View style={styles.popupContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Favourite's List...</Text>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="black"
          />
          <TouchableOpacity>
            <FontAwesome name="microphone" size={20} color="black" />
          </TouchableOpacity>
        </View>

        {/* List */}
        <ScrollView style={styles.listContainer}>
          {fakeDataShare.map((user, index) => (
            <IndividualShare key={index} username={user.username} />
          ))}
        </ScrollView>

        {/* Footer / Buttons */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={handleShare} style={styles.button}>
            <Text>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={copyLinkToClipboard} style={styles.button}>
            <Text>Copy Link</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleClose} style={styles.button}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContent: {
    width: '80%',
    height: '75%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
  },
  header: {
    flex: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    paddingBottom: 5,
  },
  title: { fontSize: 25, fontWeight: 'bold' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 10,
  },
  searchInput: { flex: 1, height: 40, color: 'black' },
  listContainer: { flex: 1 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'lightgray',
  },
  button: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
  },
});
