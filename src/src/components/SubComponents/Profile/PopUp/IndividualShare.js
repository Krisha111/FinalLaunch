import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function IndividualShare({ username, connectTo }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={connectTo} style={styles.userRow}>
        {/* Avatar */}
        <View style={styles.avatarOuter}>
          <View style={styles.avatarInner} />
        </View>

        {/* Username */}
        <Text style={styles.username} numberOfLines={1}>
          {username}
        </Text>

        {/* Follow/Unfollow Button */}
        <TouchableOpacity style={styles.followButton}>
          <Text style={styles.followButtonText}>UnFollow</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    marginVertical: 5,
    width: '100%',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  avatarOuter: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInner: {
    width: 50,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#ccc',
  },
  username: {
    flex: 0.6,
    fontWeight: 'bold',
    fontSize: 15,
    marginHorizontal: 7,
  },
  followButton: {
    flex: 0.2,
    backgroundColor: 'green',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  followButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});
