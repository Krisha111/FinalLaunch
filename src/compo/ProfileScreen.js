// src/screens/Profile.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import ProfileSidebar from "../compo/Profile/ProfileSidebar.js";
import { fetchProfileById } from "../Redux/Slice/Profile/ProfileInformationSlice.js";

export default function Profile({ route }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const loggedInUserId = useSelector((state) => state.signUpAuth.user?._id);
  const profileUserId = route.params?.userId || loggedInUserId;

  const { profile, loading, error } = useSelector(
    (state) => state.profileInformation
  );

  const [images, setImages] = useState([]);

  const UNSPLASH_URL = "https://api.unsplash.com/search/photos";
  const ACCESS_KEY = "0b_PBFtOzp79VOLz--Da8Qis4_l8mv1gtw4-Ne-W2Rs";

  // ------------------ Convert profile image URL ------------------
  const getFullImageUrl = (uri) => {
    if (!uri) return null;
    // Absolute URL
    if (uri.startsWith("http") || uri.startsWith("https")) return uri;
    // Backend relative path
    return `http://192.168.2.16:8000${uri}`;
  };

  // ------------------ Fetch profile ------------------
  useEffect(() => {
    if (profileUserId) {
      dispatch(fetchProfileById(profileUserId));
    }
  }, [profileUserId, dispatch]);

  // ------------------ Fetch demo images from Unsplash ------------------
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

  // ------------------ Navigate to Edit Profile ------------------
  const navigateToEdit = () => {
    navigation.navigate("EditProfile");
  };

  return (
    <ScrollView style={styles.profileContainer}>
      <View style={styles.profileTopContainer}>
        <View style={styles.profileTopLeftContainer}>
          {profileUserId === loggedInUserId && (
            <View style={styles.profileEditBoxxy}>
              <TouchableOpacity
                onPress={navigateToEdit}
                style={styles.profileEditClick}
              >
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Profile info */}
          <View style={styles.profileNameContainerMePage}>
            <View style={styles.profilePhotoBoxContainer}>
              <View style={styles.profilePhotoBoxInnerContainer}>
                {profile?.profileImage ? (
                  <Image
                    source={{ uri: profile?.profileImage }}
                    style={styles.profilePhoto}
                  />


                ) : (
                  <MaterialCommunityIcons
                    name="account-circle"
                    size={80}
                    color="#555"
                  />
                )}
              </View>
            </View>

            <View style={styles.mePageInfoContainerOfBio}>
              <View style={styles.profilefollowersAndMePageFollowings}>
                <Text style={styles.profileUserNameMePagey}>
                  {profile?.username || "username_placeholder"}
                </Text>
              </View>

              <View style={styles.profileInformationMePageContaniner}>
                {loading ? (
                  <ActivityIndicator size="small" color="gray" />
                ) : error ? (
                  <Text style={{ color: "red" }}>
                    {typeof error === "string"
                      ? error
                      : error?.message || "Something went wrong"}
                  </Text>
                ) : (
                  <>
                    <Text style={styles.profileNameMePage}>
                      {profile?.name || "Name"}
                    </Text>
                    <Text style={styles.profileBioMePage}>
                      {profile?.bio || "Bio"}
                    </Text>
                  </>
                )}
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Sidebar */}
      <ProfileSidebar profileUserId={profileUserId} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
  },
  profileTopContainer: {
   display:"flex",
    flexDirection: "row",
 
  },
  profileTopLeftContainer: {
    flex: 1,
    flexDirection: "column",
  },
  profileEditBoxxy: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: 15,
    width: "100%",
  },
  profileEditClick: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#63e25e",
    borderRadius: 20,
    marginRight: 20,
  },
  editText: {
    color: "white",
    fontWeight: "600",
  },
  profileNameContainerMePage: {
    flexDirection: "row",
    padding: 20,
  },
  profilePhotoBoxContainer: {
   
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
  profilePhotoBoxInnerContainer: {
    width: 300,
    height: 300,
    borderRadius: 500,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  profilePhoto: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 75,
  },
  mePageInfoContainerOfBio: {
    flex: 0.7,
    paddingLeft: 20,
    flexDirection: "column",
  },
  profilefollowersAndMePageFollowings: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  profileUserNameMePagey: {
    fontSize: 20,
    fontWeight: "500",
  },
  profileInformationMePageContaniner: {
    flexDirection: "column",
  },
  profileNameMePage: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  profileBioMePage: {
    fontSize: 14,
    color: "#555",
  },
});
