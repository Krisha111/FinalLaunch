// IndividualShare.js (React Native)
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function IndividualShare({ username, connectTo }) {
  return (
    <View style={styles.individualShare}>
      <View style={styles.shareToSingleUser}>
        <TouchableOpacity onPress={connectTo} style={styles.singleUser}>
          <View style={styles.shareAvatar} />
          <Text numberOfLines={1} style={styles.shareUserName}>
            {username}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  individualShare: {
    // If needed, you can add padding/margin
  },
  shareToSingleUser: {
    marginRight: 10,
    height: 80,
    width: 90,
  },
  singleUser: {
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    overflow: 'hidden', // Text truncation handled by numberOfLines
  },
  shareAvatar: {
    height: 50,
    width: 50,
    borderWidth: 1,
    borderColor: 'black',
    alignSelf: 'center',
    borderRadius: 10,
    backgroundColor: '#fff', // optional placeholder color
  },
  shareUserName: {
    marginTop: 5,
    fontSize: 11,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
});
