// src/components/SubComponents/ReelChat/NewPhotoPosting/AddDrop.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Modal, Animated, TouchableWithoutFeedback, StyleSheet, Dimensions } from 'react-native';
import NewDropProfile from '../NewDropProfile';

const { width, height } = Dimensions.get('window');

export default function AddDrop({ onClose }) {
  const [showPopup, setShowPopup] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    setShowPopup(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowPopup(false);
      onClose && onClose();
    });
  };

  return (
    <Modal
      visible={showPopup}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <TouchableWithoutFeedback>
            <Animated.View style={[styles.content, { transform: [{ scale: scaleAnim }] }]}>
              <NewDropProfile />
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: width * 0.8, // 40% of web width is roughly 80% of mobile width
    height: height * 0.75,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
  },
});
