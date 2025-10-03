// CommentsBody.js (React Native)
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { PiDotsThreeBold } from 'react-icons/pi'; // For web, or use react-native-vector-icons for RN
import { Avatar } from 'react-native-paper'; // Optional: react-native-paper avatar

export default function CommentsBody({ text }) {
  return (
    <View style={styles.commentsBodyContainer}>
      <View style={styles.commentsBodyProfile}>
        {/* You can replace Avatar with Image if needed */}
        <Avatar.Image 
        size={40} 
        source={require('../../../assets/defaultAvatar.png')} />
      </View>
      <View style={styles.commentsBody}>
        <View style={styles.commentsUserName}>
          <Text style={styles.userNameText}>UserName</Text>
          <PiDotsThreeBold color="black" size={20} />
        </View>
        <View style={styles.body}>
          <Text>{text}</Text>
        </View>
        <Text style={styles.reactTimeAgo}>5h ago</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  commentsBodyContainer: {
    width: '100%',
    flexDirection: 'row',
    padding: 10,
  },
  commentsBodyProfile: {
    flex: 0.08,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentsBody: {
    flex: 0.92,
    flexDirection: 'column',
    overflow: 'hidden',
  },
  commentsUserName: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  userNameText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  body: {
    fontSize: 14,
  },
  reactTimeAgo: {
    marginTop: 5,
    fontSize: 12,
    color: 'lightgray',
  },
});
