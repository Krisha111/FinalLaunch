import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Animated, StyleSheet, Alert } from 'react-native';
import IndividualShare from '../../Profile/PopUp/IndividualShare';
import { FontAwesome } from '@expo/vector-icons';

const fakeDataShare = [
  { username: 'krishaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
  { username: 'akshar' }, { username: 'raju' }, { username: 'chutki' },
  { username: 'jaggu' }, { username: 'bheem' }
];

export default function FollowerPopUp({ onClose }) {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Fade in popup
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
    Alert.alert('Share', 'Sharing is not implemented in React Native.');
  };

  const copyLinkToClipboard = () => {
    Alert.alert('Clipboard', 'Copying link is not implemented in React Native.');
  };

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
      <View style={styles.popupContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Friends List...</Text>
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

        {/* Footer / Actions */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.button} onPress={handleShare}>
            <Text>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={copyLinkToClipboard}>
            <Text>Copy Link</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleClose}>
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
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    paddingBottom: 5,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: 'black',
  },
  listContainer: {
    flex: 1,
  },
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
