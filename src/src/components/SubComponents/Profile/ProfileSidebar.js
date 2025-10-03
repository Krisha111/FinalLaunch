// ProfileSidebar.js
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { PiFilmReelFill } from 'react-icons/pi'; // Use a React Native compatible icon, e.g., react-native-vector-icons
import Reels from './Reels';
import {
  clearSelectedContent,
  setSelectedContent,
  toggleSideBarFalse,
  toggleSideBarTrue
} from '../../../Redux/Slices/Profile/ProfileSlice';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProfileSidebar() {
  const [stats, setStats] = useState({
    regularReelCount: 0,
  });
  const token = useSelector(state => state?.signInAuth?.token);
  const selectedContent = useSelector(state => state.profile.selectedContent);
  const sideBarToggle = useSelector(state => state.profile.sideBarToggle);
  const dispatch = useDispatch();

  const sidebarAnim = useRef(new Animated.Value(-SCREEN_WIDTH)).current;

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/profile/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch profile stats", err);
      }
    };
    if (token) fetchStats();
  }, [token]);

  // Animate sidebar
  useEffect(() => {
    Animated.timing(sidebarAnim, {
      toValue: sideBarToggle ? 0 : -SCREEN_WIDTH,
      duration: 500,
      useNativeDriver: false
    }).start();
  }, [sideBarToggle]);

  const handleSidebarClick = (content) => {
    dispatch(setSelectedContent(content));
  };

  const handleBackClick = () => {
    dispatch(clearSelectedContent());
    dispatch(toggleSideBarFalse());
  };

  const renderContent = () => {
    switch (selectedContent) {
      case 'Reels':
        return <Reels />;
      default:
        return <Reels />;
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.sidebar, { left: sidebarAnim }]}>
        <ScrollView horizontal={true} contentContainerStyle={styles.sidebarLinksTop}>
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => handleSidebarClick('Reels')}
          >
            <View style={styles.tabContent}>
              {/* Replace PiFilmReelFill with a React Native icon */}
              <Text style={styles.iconPlaceholder}>🎬</Text>
              <Text style={styles.tabLabel}>Reels</Text>
              <View style={styles.tabCount}>
                <Text>{stats.regularReelCount}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>

      <View style={styles.contentArea}>
        {renderContent()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: SCREEN_WIDTH * 0.3,
    backgroundColor: '#fff',
    zIndex: 10,
    borderRightWidth: 1,
    borderRightColor: 'lightgray',
  },
  sidebarLinksTop: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    height: 100,
    paddingHorizontal: 10,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  tabContent: {
    alignItems: 'center',
  },
  iconPlaceholder: {
    fontSize: 20,
  },
  tabLabel: {
    marginTop: 5,
    fontWeight: 'bold',
  },
  tabCount: {
    marginTop: 2,
    backgroundColor: 'green',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  contentArea: {
    flex: 1,
    marginLeft: SCREEN_WIDTH * 0.3,
    backgroundColor: '#f5f5f5',
  },
});
