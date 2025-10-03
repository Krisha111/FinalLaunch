// ReelPlayer.js (React Native)

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllReels } from "../Redux/Slice/Profile/reelNewDrop.js";

import ReelSide from "./ReelSide";
import ReelTalk from "./ReelTalk";
import ReelInformation from "../compo/ReelChat/ReelInformation.js";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// Arrow icon
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const { height, width } = Dimensions.get("window");

export default function ReelPlayer() {
  const dispatch = useDispatch();

  const [reelBarOpen, setReelBarOpen] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchAllReels());
 
  }, [dispatch]);

  const reels = useSelector((state) => state.reelNewDrop.mainPageReels || []);

  if (reels.length === 0) {
    return (
      <View style={styles.reelPlayerContainer}>
        <Text>No reels available.</Text>
      </View>
    );
  }

  const toggleReelBar = () => {
    setReelBarOpen(!reelBarOpen);
  };

  const onScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const newIndex = Math.round(offsetY / height);
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  };

  return (
    <View style={styles.reelPlayerContainer}>
      {   console.log("reelsreelsreels",reels)}
      {/* Reels Wrapper */}
      <ScrollView
        pagingEnabled
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        style={styles.reelsWrapper}
      >
        {reels.map((reel, index) => (
          <View key={reel._id || index} 
          style={styles.singleReel}>
            <ReelTalk reel={reel} isActive={index === currentIndex}/>
          </View>
        ))}
      </ScrollView>

    
    </View>
  );
}

const styles = StyleSheet.create({
  // Containers
  reelPlayerContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
  },
  reelsWrapper: {
    flex: 0.65,
    height: "100%",
  },
  singleReel: {
    height: height-60,
    justifyContent: "center",
    alignItems: "center",
  },
  openReelBarContainer: {
    flex: 1,
    height: "100%",
    flexDirection: "column",
  },

  // Sidebar
  reelSideBar: {
    flex: 0.35,
    height: "100%",
    borderLeftWidth: 1,
    borderLeftColor: "lightgray",
    flexDirection: "column",
    transition: "flex 0.5s ease", // RN doesn’t support, but kept as placeholder
  },
  reelSideBarClosed: {
    flex: 0.1,
  },
  reelBarToggleIcon: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  reelBarIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  arrowIconReelProfile: {
    alignSelf: "center",
  },
  theProfilePhotoReelChat: {
    flexDirection: "row",
    alignItems: "center",
  },
  userAvatar: {
    borderRadius: 10,
    width: 40,
    height: 40,
    marginLeft: 5,
    marginRight: 10,
  },

  // User + ticker
  idContainer: {
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
  },
  tickerContainer: {
    marginTop: 3,
    maxWidth: width * 0.15,
    backgroundColor: "white",
    color: "black",
    borderRadius: 20,
    height: 20,
    justifyContent: "center",
    paddingHorizontal: 6,
    marginLeft: 5,
    overflow: "hidden",
  },
  tickerText: {
    fontSize: 10,
    color: "black",
  },

  reelInfoContainer: {
    flex: 0.9,
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
});
