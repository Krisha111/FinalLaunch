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
  Platform,
  Text,
  StyleSheet as RNStyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { showPopupFalse } from '../../../Redux/Slice/Explore/ImagePopUp/ImagePopUpExplore.js';
import Reel from './Reel.js';
import { setShareButtonClicked } from '../../../Redux/CommonIcons.js';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

/**
 * Full-screen ImagePopUp screen
 * - Removes the "box" look (no borderRadius, no shadow).
 * - Content fills the entire screen.
 * - Removes the dim gray inset — uses a full-screen background (black) so media looks correct.
 * - Animates opacity on mount / close.
 * - Attempts to close via navigation.goBack() when available, otherwise just dispatches redux hide actions.
 */

export default function ImagePopUpScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const selectedPost = useSelector(
    (state) => state.imagePopUpExplore?.selectedPost
  );

  // animate opacity for entrance/exit
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // fade in on mount
    Animated.timing(opacity, {
      toValue: 1,
      duration: 180,
      useNativeDriver: true,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // close handler: fade out then dispatch + navigate back (if possible)
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
      } catch (err) {
        // ignore if not available
      }

      try {
        if (navigation && typeof navigation.canGoBack === 'function' && navigation.canGoBack()) {
          navigation.goBack();
        }
      } catch (err) {
        // fail silently if navigation isn't available
      }
    });
  }, [dispatch, navigation, opacity]);

  // fallback: if no post selected show a clear message + allow closing
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
    <ScrollView style={styles.container}>
      {/* Tappable backdrop: closes popup. remains full-screen but transparent so content behind isn't visible. */}
      <TouchableOpacity
        activeOpacity={1}
        style={RNStyleSheet.absoluteFill}
        onPress={handleClosePopup}
      />

      {/* Full-screen animated content (no box, fills entire screen) */}
      <TouchableWithoutFeedback>
        <Animated.View
          style={[
            styles.fullScreen,
            {
              opacity: opacity,
            },
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
  );
}

const styles = StyleSheet.create({
  // full-screen container; background set to black so media (images/videos) appear correctly
  container: {
    padding:"30px",
    flex: 1,
    backgroundColor: 'white', 
    
    // remove the gray overlay; black is common for media viewers
  },
  // full-screen content (no rounded corners, no shadow)
  fullScreen: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: 'transparent', // let the content decide its own background
  },
  // ensure the ScrollView fills the screen
  scrollContent: {
    flexGrow: 1,
  },
  // content wrapper that contains the Reel component; takes full space
  contentWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  noPostText: {
    color: '#fff',
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
    backgroundColor: '#fff',
  },
  closeButtonText: {
    color: '#000',
    fontWeight: '600',
  },
});
