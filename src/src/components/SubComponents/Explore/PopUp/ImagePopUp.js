// ImagePopUp.js (React Native)
import React, { useState, useEffect } from 'react';
import { View, Modal, TouchableWithoutFeedback, Animated, StyleSheet, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Reel from './Reel';
import { showPopupFalse } from '../../../../Redux/Slices/Explore/ImagePopUp/ImagePopUpExplore';
import { setShareButtonClicked } from '../../../../Redux/CommonIcons';

const { width, height } = Dimensions.get('window');

export default function ImagePopUp() {
  const dispatch = useDispatch();
  const showPopup = useSelector((state) => state.imagePopUpExplore.showPopup);
  const selectedPost = useSelector((state) => state.imagePopUpExplore.selectedPost);

  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (showPopup) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [showPopup]);

  const handleClosePopup = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      dispatch(showPopupFalse());
      dispatch(setShareButtonClicked(false));
    });
  };

  if (!showPopup || !selectedPost) return null;

  const renderPopupContent = () => {
    switch (selectedPost.contentType) {
      case 'reel':
        return <Reel post={selectedPost} />;
      default:
        return <Reel post={selectedPost} />;
    }
  };

  return (
    <Modal transparent visible={showPopup} animationType="none">
      <TouchableWithoutFeedback onPress={handleClosePopup}>
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: fadeAnim,
              transform: [
                {
                  scale: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableWithoutFeedback>
            <View style={styles.content}>{renderPopupContent()}</View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: width * 0.7,
    height: height * 0.8,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    overflow: 'hidden',
  },
});
