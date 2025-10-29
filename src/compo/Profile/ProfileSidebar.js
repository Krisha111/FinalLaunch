// src/components/Profile/ProfileSidebar.js
// Updated: removed useNativeDriver:true to avoid "RCTAnimation missing" fallback warning.
// If you prefer native driver (better performance) install RCTAnimation via CocoaPods:
//   cd ios && pod install
// and ensure the native Animated module is available. For now we use JS driver (useNativeDriver: false).

import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // PiFilmReelFill alternative

import {
  clearSelectedContent,
  setSelectedContent,
  toggleSideBarFalse,
} from "../../Redux/Slice/Profile/ProfileSlice.js";

import Reels from "./Reels";
// import API_CONFIG from "../../config/api.js";
const BASE_URL = "https://finallaunchbackend.onrender.com";

export default function ProfileSidebar({ profileUserId }) {
  const [stats, setStats] = useState({
    regularReelCount: 0,
  });

  const token = useSelector((state) => state?.signUpAuth?.token);
  const dispatch = useDispatch();
  const selectedContent = useSelector((state) => state.profile.selectedContent);
  const sideBarToggle = useSelector((state) => state.profile.sideBarToggle);

  // Animation setup
  // start off-screen left; use negative width large enough to hide sidebar
  const slideAnim = useRef(new Animated.Value(-300)).current;

  useEffect(() => {
    // NOTE: useNativeDriver set to false to avoid native Animated module missing warnings.
    // If you install the native module (RCTAnimation) and want native driver, set useNativeDriver: true.
    if (sideBarToggle) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -300,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  }, [sideBarToggle, slideAnim]);

  // Fetch stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get
        (`${BASE_URL}/api/profile/stats/${profileUserId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch profile stats", err);
      }
    };
    fetchStats();
    // if (token) fetchStats();
  }, [token]);

  const handleSidebarClick = (content) => {
    dispatch(setSelectedContent(content));
  };

  const handleBackClick = () => {
    dispatch(clearSelectedContent());
    dispatch(toggleSideBarFalse());
  };

  const renderContent = () => {
    switch (selectedContent) {
      case "Reels":
        return <Reels userId={profileUserId} />;
      default:
        return <Reels userId={profileUserId} />;
    }
  };

  return (
    <View style={styles.sidebarAndContent}>
   

      <View style={styles.flexSevenContainer}>
        {/* Sidebar */}
        <Animated.View
          style={[
            styles.sidebarTopChangeProfile,
            { transform: [{ translateX: slideAnim }] },
          ]}
        >
          <TouchableOpacity
            style={styles.sidebarItem}
            onPress={() => handleSidebarClick("Reels")}
          >
            <View style={styles.postRightBar}>
              <View style={styles.postAndNumberRightBarContainer}>
                <View style={styles.postSymbolAndName}>
                  <View style={styles.postSymbolAndNameSym}>
                    <Icon name="movie-open" size={20} color="#333" />
                    <Text style={styles.postProfileName}>Reels</Text>
                  </View>
                  <Text style={styles.profileNumberPost}>
                   
                    {stats.regularReelCount}
                  </Text>
                </View>
              </View>
            </View>
            {/* {console.log("karanstatsstats",stats,"profileUserIdprofileUserId",profileUserId)} */}
          </TouchableOpacity>
        </Animated.View>

        {/* Content area */}
        <View style={styles.contentArea}>{renderContent()}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebarAndContent: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
  },
  flexSevenContainer: {
    flex: 1,
    flexDirection: "column",
  },
  sidebarTopChangeProfile: {
    width: "100%",
    borderBlockColor: "grey",
    borderTopColor: "grey",

    borderWidth: 4,
    padding: 3,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  sidebarItem: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  postRightBar: {
    flexDirection: "row",
    alignItems: "center",
  },
  postAndNumberRightBarContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  postSymbolAndName: {
    flexDirection: "row",
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    borderWidth: 0,
  },
  postSymbolAndNameSym: {
    display: "flex",
    flexDirection: "row",
  },
  postProfileName: {
    fontSize: 16,
    marginLeft: 8,
  },
  profileNumberPost: {
    marginLeft: 8,
    fontWeight: "600",
    color: "#333",
  },
  contentArea: {
    flex: 1,
    padding: 10,
  },
});
