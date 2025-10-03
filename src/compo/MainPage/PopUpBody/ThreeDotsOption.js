// src/compo/MainPage/PopUpBody/ThreeDotsOption.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  Animated,
  Easing,
  Alert,
} from 'react-native';
import { Ionicons, FontAwesome, MaterialIcons, Entypo } from '@expo/vector-icons';

const fakeDataShare = [
  { username: 'krisha' },
  { username: 'akshar' },
  { username: 'raju' },
  { username: 'chutki' },
  { username: 'jaggu' },
  { username: 'bheem' },
];

export default function ThreeDotsOption({ onClose }) {
  const [showPopup, setShowPopup] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    setShowPopup(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  const handleClose = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setShowPopup(false);
      onClose();
    });
  };

  const copyLinkToClipboard = () => {
    Alert.alert('Link copied to clipboard!');
  };

  const renderUserItem = ({ item }) => (
    <View style={styles.userItem}>
      {/* Custom Avatar */}
      <View style={styles.avatarCircle}>
        <Text style={styles.avatarText}>{item.username[0].toUpperCase()}</Text>
      </View>
      <Text style={styles.userName}>{item.username}</Text>
    </View>
  );

  if (!showPopup) return null;

  return (
    <Modal transparent visible={showPopup} animationType="none">
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={handleClose}>
        <Animated.View
          style={[styles.popupContent, { opacity: fadeAnim, transform: [{ scale: fadeAnim }] }]}
        >
          <View style={styles.container}>
            <Text style={styles.title}>Share To...</Text>

            <View style={styles.searchContainer}>
              <View style={styles.avatarPlaceholder} />
              <View style={styles.inputContainer}>
                <TextInput placeholder="Search" style={styles.searchInput} />
                <Ionicons name="mic" size={24} color="black" />
              </View>
            </View>

            <FlatList
              data={fakeDataShare}
              renderItem={renderUserItem}
              keyExtractor={(item, index) => index.toString()}
              numColumns={3}
              style={styles.userList}
            />

            <View style={styles.shareApps}>
              <TouchableOpacity onPress={copyLinkToClipboard}>
                <Ionicons name="link" size={28} />
              </TouchableOpacity>
              <TouchableOpacity>
                <FontAwesome name="whatsapp" size={28} />
              </TouchableOpacity>
              <TouchableOpacity>
                <FontAwesome name="snapchat-ghost" size={28} />
              </TouchableOpacity>
              <TouchableOpacity>
                <Entypo name="instagram" size={28} />
              </TouchableOpacity>
              <TouchableOpacity>
                <FontAwesome name="twitter" size={28} />
              </TouchableOpacity>
              <TouchableOpacity>
                <MaterialIcons name="sms" size={28} />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContent: {
    width: '80%',
    height: '75%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
  },
  container: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'lightgray',
    marginRight: 10,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 30,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  userList: {
    flex: 1,
  },
  userItem: {
    flex: 1 / 3,
    alignItems: 'center',
    marginVertical: 10,
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  userName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 5,
  },
  shareApps: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
});
