// ✅ src/screens/Profile.js — FULLY MERGED & FIXED VERSION
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
  FlatList,
} from "react-native";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import ProfileSidebar from "../compo/Profile/ProfileSidebar.js";
import {
  fetchProfileById,
  clearProfile,
} from "../Redux/Slice/Profile/ProfileInformationSlice.js";

export default function Profile() {
  // ------------------ Hooks ------------------
  const navigation = useNavigation();
  const route = useRoute(); // ✅ ensures route is always defined
  const dispatch = useDispatch();
  const contentRef = useRef(null);

  // ------------------ Redux Data ------------------
  const loggedInUserId = useSelector((state) => state.signUpAuth.user?._id);

  // ✅ Safely extract userId from route.params
  const profileUserId = route?.params?.userId ?? loggedInUserId ?? null;

  const { profile, loading, error } = useSelector(
    (state) => state.profileInformation
  );

  // ------------------ Local State ------------------
  const [images, setImages] = useState([]);

  // ------------------ Constants ------------------
  const UNSPLASH_URL = "https://api.unsplash.com/search/photos";
  const ACCESS_KEY = "0b_PBFtOzp79VOLz--Da8Qis4_l8mv1gtw4-Ne-W2Rs";

  // ------------------ Helpers ------------------
  // const getFullImageUrl = (uri) => {
  //   if (!uri) return null;
  //   if (uri.startsWith("http") || uri.startsWith("https")) return uri;
  //   return `https://finallaunchbackend.onrender.com${uri}`;
  // };
const getFullImageUrl = (uri) => {
  if (!uri) return null;
  // ✅ Force HTTPS for Render
  return uri.replace(/^http:/, 'https:');
};

  // ------------------ Effects ------------------
  // ✅ FIX 1: Clear profile and refetch whenever profileUserId changes
  useEffect(() => {
    if (profileUserId) {
      console.log("🔄 Profile userId changed to:", profileUserId);
      dispatch(clearProfile()); // Clear old profile data first
      dispatch(fetchProfileById(profileUserId));
    }
  }, [profileUserId, dispatch]);

  // ✅ FIX 2: Also refetch when screen comes into focus (handles navigation back)
  useFocusEffect(
    React.useCallback(() => {
      if (profileUserId) {

        dispatch(clearProfile());
        dispatch(fetchProfileById(profileUserId));
      }
    }, [profileUserId, dispatch])
  );

  useEffect(() => {
    const getImages = async () => {
      try {
        const result = await axios.get(
          `${UNSPLASH_URL}?page=1&query=nature&per_page=20&client_id=${ACCESS_KEY}`
        );
        setImages(result.data.results || []);
      } catch (err) {
        console.error("Unsplash fetch error:", err);
      }
    };
    getImages();
  }, []);

  // ------------------ Navigation ------------------
  const navigateToEdit = () => {
    navigation.navigate("EditProfile");
  };

  // ------------------ Render Logic ------------------
  const listData = [{ key: "sidebar" }];

  const renderHeader = () => (
    <>
      {/* Header */}
      <View style={styles.headerContainer}>
       
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        {profileUserId === loggedInUserId && (
          <TouchableOpacity onPress={navigateToEdit} style={styles.editButton}>
            <MaterialCommunityIcons name="pencil" size={18} color="#fff" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        )}

        {/* Profile Image */}
        <View style={styles.profileImageSection}>


          <View style={styles.profileImageWrapper}>
            <View style={styles.profileImageContainer}>
              {console.log(profile?.profileImage,"profile?.profileImage")}
              {profile?.profileImage ? (
                <Image
                  source={{ uri: getFullImageUrl(profile?.profileImage) }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <MaterialCommunityIcons
                    name="account-circle"
                    size={100}
                    color="#e0e0e0"
                  />
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Profile Info */}
        <View style={styles.profileInfoSection}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#63e25e" />
              <Text style={styles.loadingText}>Loading profile...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <MaterialCommunityIcons
                name="alert-circle"
                size={40}
                color="#ff6b6b"
              />
              <Text style={styles.errorText}>
                {typeof error === "string"
                  ? error
                  : error?.message || "Something went wrong"}
              </Text>
            </View>
          ) : (
            <>
              <Text style={styles.username}>
                @{profile?.username || "username_placeholder"}
              </Text>
              <Text style={styles.fullName}>{profile?.name || "Name"}</Text>

              {profile?.bio && (
                <View style={styles.bioContainer}>
                  <Text style={styles.bioText}>{profile?.bio}</Text>
                </View>
              )}
            </>
          )}
        </View>
      </View>
    </>
  );

  return (
    <FlatList
      ref={contentRef}
      data={listData}
      keyExtractor={(item) => item.key}
      ListHeaderComponent={renderHeader}
      renderItem={() => (
        <View style={styles.sidebarContainer}>
          <ProfileSidebar profileUserId={profileUserId} />
        </View>
      )}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.profileContainer}
    />
  );
}

// ------------------ Styles ------------------
const styles = StyleSheet.create({
  profileContainer: {
    flexGrow: 1,
    backgroundColor: "#f5f5f5",
    paddingBottom: 30,
  },
  headerContainer: {
    backgroundColor: "#fff",
    paddingTop: 20,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      default: {
        boxShadow: "0px 2px 3px rgba(0,0,0,0.05)",
      },
    }),
    elevation: 3,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
    textAlign: "center",
  },
  profileCard: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginTop: 20,
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      default: {
        boxShadow: "0px 4px 8px rgba(0,0,0,0.08)",
      },
    }),
    elevation: 5,
  },
  editButton: {
    position: "absolute",
    top: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#63e25e",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 25,
    ...Platform.select({
      ios: {
        shadowColor: "#63e25e",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      default: {
        boxShadow: "0px 2px 4px rgba(99,226,94,0.25)",
      },
    }),
    elevation: 3,
    zIndex: 10,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 6,
  },
  profileImageSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImageWrapper: {
    position: "relative",
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "white",
    borderWidth: 4,
    borderColor: "white",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#63e25e",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      default: {
        boxShadow: "0px 4px 8px rgba(99,226,94,0.12)",
      },
    }),
    elevation: 5,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  profileImagePlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fafafa",
  },
  profileInfoSection: {
    alignItems: "center",
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 15,
    fontSize: 14,
    color: "#666",
  },
  errorContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  errorText: {
    marginTop: 15,
    fontSize: 14,
    color: "#ff6b6b",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
    color: "black",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  fullName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 15,
  },
  bioContainer: {
    backgroundColor: "#f9f9f9",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
    width: "100%",
  },
  bioText: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    lineHeight: 20,
  },
  sidebarContainer: {
    marginTop: 20,
    paddingBottom: 30,
  },
});
