// PostComment.js (React Native)
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-paper';
import moment from 'moment';

export default function PostComment({ profileImage, username, text, timestamp }) {
  const renderContent = () => {
    if (!text) return null;

    // If text contains an image tag
    const imgMatch = text.match(/<img.*?src="(.*?)".*?>/);
    if (imgMatch) {
      return <Image source={{ uri: imgMatch[1] }} style={styles.commentImage} />;
    }

    // If text contains audio tag (optional)
    const audioMatch = text.match(/<audio.*?src="(.*?)".*?<\/audio>/);
    if (audioMatch) {
      return <Text>[Audio Comment]</Text>; // Replace with Audio Player if desired
    }

    // Otherwise, normal text
    return <Text style={styles.commentText}>{text}</Text>;
  };

  return (
    <View style={styles.commentContainer}>
      <View style={styles.avatarContainer}>
        {profileImage ? (
          <Avatar.Image size={30} source={{ uri: profileImage }} />
        ) : (
          <Avatar.Text size={30} label={username?.[0]?.toUpperCase() || 'U'} />
        )}
      </View>

      <View style={styles.commentBox}>
        <Text style={styles.username}>{username || 'UserName'}</Text>
        {renderContent()}
        <Text style={styles.timestamp}>
          {timestamp ? moment(timestamp).fromNow() : 'Just now'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  commentContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 5,
  },
  avatarContainer: {
    width: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentBox: {
    marginLeft: 5,
    flex: 1,
    flexDirection: 'column',
  },
  username: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  commentText: {
    fontSize: 14,
    flexWrap: 'wrap',
  },
  commentImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginTop: 4,
  },
  timestamp: {
    fontSize: 11,
    color: 'lightgray',
    textAlign: 'right',
    marginTop: 5,
  },
});
