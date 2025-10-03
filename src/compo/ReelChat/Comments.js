// src/compo/ReelChat/Comments.js
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function Comments({ profileImage, username, text, createdAt }) {
  const fallbackLetter = username ? username[0].toUpperCase() : 'U';

  // Normalize text
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

  // Simple time-ago function
  const timeAgo = (date) => {
    if (!date) return 'Just now';
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString(); // fallback to date string
  };

  const date = createdAt ? new Date(createdAt) : null;

  return (
    <View style={styles.commentContainer}>
      {/* Avatar */}
      <View style={styles.profileContainer}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <Text style={styles.avatarFallbackText}>{fallbackLetter}</Text>
          </View>
        )}
      </View>

      {/* Comment Box */}
      <View style={styles.commentBox}>
        <View style={styles.header}>
          <Text style={styles.username}>{username || 'Unknown'}</Text>
          <Text style={styles.timeAgo}>{timeAgo(date)}</Text>
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
