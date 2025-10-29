// src/components/Explore/OnlineUsersSuggestions.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setSelectedProfileId } from '../../Redux/Slice/Profile/ProfileSlice.js';

const { width } = Dimensions.get('window');

export default function OnlineUsersSuggestions({goToProfile}) {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [users, setUsers] = useState([]);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load token from AsyncStorage
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) setToken(storedToken);
      } catch (err) {
        console.error("Failed to load token:", err);
      }
    };
    loadToken();
  }, []);

  // Fetch users after token is loaded
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get("https://finallaunchbackend.onrender.com/auth/getSignedUp", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!cancelled) {
          setUsers(Array.isArray(res.data) ? res.data : []);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        if (!cancelled) setUsers([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchUsers();

    return () => {
      cancelled = true;
    };
  }, [token]);

  // const goToProfile = (userId) => {
  //   console.log("🟢 goToProfile called with userId:", userId);

  //   try {
  //     dispatch(setSelectedProfileId(userId));
  //     console.log("✅ setSelectedProfileId dispatched successfully");
  //   } catch (err) {
  //     console.error("❌ Failed to dispatch selected profile id:", err);
  //   }

  //   try {
  //     console.log("➡️ Navigating to ProfileTab > ProfileScreen...");

  //     navigation.navigate("Home", {
  //       screen: "ProfileTab",
  //       params: {
  //         screen: "ProfileScreen",
  //         params: { userId },
  //       },
  //     });

  //     console.log("✅ navigation.navigate('Home') executed");
  //   } catch (err) {
  //     console.error("❌ Navigation to Home failed:", err);
  //   }
  // };

  const renderItem = ({ item }) => (
    // outer wrapper: full width (respects FlatList padding), holds shadow
    <View style={styles.itemWrapper}>
      <TouchableOpacity
        style={styles.touchableInner}
    onPress={() => goToProfile(item._id)}
        activeOpacity={0.8}
      >
        <View style={styles.userCard} onPress={goToProfile}>
          <View style={styles.imageContainer}>
            {item.profileImage ? (
              <Image source={{ uri: item.profileImage }} 
              style={styles.profilePic} />
            ) : (
              <View style={styles.placeholderWrap}>
                <Ionicons name="person" size={40} color="white" />
              </View>
            )}
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.username} numberOfLines={1}>
              {item.username || item.name || "Unknown"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  if (!users || users.length === 0) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyText}>No users found</Text>
      </View>
    );
  }

  return (
    <FlatList
      key={"one-column"}
      data={users}
      keyExtractor={(item) => item._id || item.id || Math.random().toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
      numColumns={1}
      showsVerticalScrollIndicator={false}
        scrollEnabled={false} // ✅ disable scrolling inside nested FlatList
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10, // horizontal padding for the whole list
    paddingVertical: 8,
  },

  // Each item wrapper takes full width inside contentContainer (so paddingHorizontal is respected)
  itemWrapper: {
    width: '100%',
    alignSelf: 'center',
    marginVertical: 6,
    borderRadius: 12,
    // shadow for iOS
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    // elevation for Android
    elevation: 3,
    backgroundColor: 'transparent',
  },

  // Touchable area to keep ripple/touch consistent
  touchableInner: {
    width: '100%',
    borderRadius: 12,
    overflow: 'visible', // allow shadow from wrapper; inner has overflow hidden to clip children
  },

  // Inner card has the visible border and background.
  // Use 100% width so it matches the wrapper exactly.
  userCard: {
    width: '100%',
  
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    overflow: 'hidden', // clip children to borderRadius
    padding: 12,
  },

  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  placeholderWrap: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#666',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  userInfo: {
    flex: 1,
    paddingLeft: 15,
  },
  username: {
    fontWeight: '600',
    fontSize: 16,
     maxWidth: '100%',
  overflow: 'hidden', // ✅ important for ellipsis
  textOverflow: 'ellipsis',
  },
  loadingWrap: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyWrap: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#666',
  },
});
