// src/components/Explore/PopUp/ImagePopUp.js
import React, { useRef, useEffect, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
  Dimensions,
  ScrollView,
  Text,
  StyleSheet as RNStyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { showPopupFalse } from '../../../Redux/Slice/Explore/ImagePopUp/ImagePopUpExplore.js';
import Reel from './Reel.js';
import { setShareButtonClicked } from '../../../Redux/CommonIcons.js';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export default function ImagePopUpScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const selectedPost = useSelector(
    (state) => state.imagePopUpExplore?.selectedPost
  );

  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleClosePopup = useCallback(() => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      try {
        dispatch(showPopupFalse());
      } catch (err) {
        console.warn('Error dispatching showPopupFalse:', err);
      }
      try {
        dispatch(setShareButtonClicked(false));
      } catch (err) {}
      try {
        if (navigation && typeof navigation.canGoBack === 'function' && navigation.canGoBack()) {
          navigation.goBack();
        }
      } catch (err) {}
    });
  }, [dispatch, navigation, opacity]);

  if (!selectedPost) {
    return (
      <View style={styles.container}>
        <Text style={styles.noPostText}>No post selected</Text>
        <TouchableOpacity onPress={handleClosePopup} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderPopupContent = () => {
    switch (selectedPost.contentType) {
      case 'reel':
        return <Reel post={selectedPost} />;
      default:
        return <Reel post={selectedPost} />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClosePopup} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>POST</Text>
      </View>

      {/* Full-screen ScrollView */}
      <ScrollView style={styles.bodyContainer}>
        {/* Tappable backdrop */}
        <TouchableOpacity
          activeOpacity={1}
          style={RNStyleSheet.absoluteFill}
          onPress={handleClosePopup}
        />

        <TouchableWithoutFeedback>
          <Animated.View
            style={[
              styles.fullScreen,
              { opacity },
            ]}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.contentWrapper}>{renderPopupContent()}</View>
            </ScrollView>
          </Animated.View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    
  },
  bodyContainer:{
   flex: 1,
    backgroundColor: 'white',
    
    padding:20
  },
  header: {
    height: 60,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e4e8',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  fullScreen: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  noPostText: {
    color: '#000',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
  closeButton: {
    marginTop: 16,
    alignSelf: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: '#000',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
