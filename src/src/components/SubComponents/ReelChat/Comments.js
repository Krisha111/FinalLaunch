// Comments.js
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Avatar } from 'react-native-paper'; // optional
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

export default function Comments({ profileImage, username, text, createdAt }) {
  const fallbackLetter = username ? username[0].toUpperCase() : 'U';

  // normalize text
  let content = text ?? '';
  if (typeof content === 'object' && content !== null) {
    if (typeof content.text === 'string') {
      content = content.text;
    } else {
      try {
        content = JSON.stringify(content);
      } catch {
        content = String(content);
      }
    }
  }

  const date = createdAt ? new Date(createdAt) : null;

  return (
    <View style={styles.commentContainer}>
      <View style={styles.profileContainer}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <Text style={styles.avatarFallbackText}>{fallbackLetter}</Text>
          </View>
        )}
      </View>

      <View style={styles.commentBox}>
        <View style={styles.header}>
          <Text style={styles.username}>{username || 'Unknown'}</Text>
          <Text style={styles.timeAgo}>
            {date ? timeAgo.format(date) : 'Just now'}
          </Text>
        </View>

        <Text style={styles.commentText}>{content}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  commentContainer: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 10,
    marginBottom: 25,
  },
  profileContainer: {
    width: '10%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  avatarFallback: {
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarFallbackText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  commentBox: {
    flex: 1,
    marginLeft: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  username: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  timeAgo: {
    fontSize: 11,
    color: 'gray',
  },
  commentText: {
    fontSize: 14,
    flexWrap: 'wrap',
  },
});
