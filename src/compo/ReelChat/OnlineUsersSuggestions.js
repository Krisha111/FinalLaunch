// OnlineUsersSuggestions.js
import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import axios from "axios";
import { Ionicons } from '@expo/vector-icons'; // Or 'react-native-vector-icons/Ionicons'

const { width } = Dimensions.get('window');

export default function OnlineUsersSuggestions({ navigation }) {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token"); // You may need AsyncStorage in RN

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:8000/auth/getSignedUp", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, [token]);

  const goToProfile = (userId) => {
    navigation.navigate('Profile', { userId }); // Use React Navigation
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userCard}
      onPress={() => goToProfile(item._id)}
    >
      <View style={styles.imageContainer}>
        {item.profileImage ? (
          <Image source={{ uri: item.profileImage }} style={styles.profilePic} />
        ) : (
          <Ionicons name="person" size={60} color="black" style={styles.placeholderIcon} />
        )}
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.username} numberOfLines={1}>
          {item.username}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
      numColumns={2}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  userCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
  },
  imageContainer: {
    flex: 0.3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  placeholderIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  userInfo: {
    flex: 0.7,
    paddingLeft: 10,
  },
  username: {
    fontWeight: '600',
    fontSize: 16,
  },
});
