// MainPageBirthDayPopUp.js (React Native)
import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { Avatar } from 'react-native-paper'; // or use <Image> for custom avatars

export default function MainPageBirthDayPopUp({ onClose }) {
  const [showPopup, setShowPopup] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Show popup on mount
    setShowPopup(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  const handleClose = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      onClose(); // call parent close function
      setShowPopup(false);
    });
  };

  if (!showPopup) return null;

  return (
    <Modal transparent visible={showPopup} animationType="none">
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={handleClose}>
        <Animated.View style={[styles.popupContent, { opacity: fadeAnim, transform: [{ scale: fadeAnim }] }]}>
          <View style={styles.popUpContainer}>
            <View style={styles.popUpHeader}>
              <Avatar.Image size={50} source={require('../../../assets/defaultAvatar.png')} />
              <Text style={styles.popUpUserName}>UserName</Text>
            </View>

            <Text style={styles.wishTitle}>Wishes</Text>

            <View style={styles.popUpBody}>
              <Text>Krisha</Text>
            </View>

            <View style={styles.popUpFooter}>
              <Text>Krisha</Text>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
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
  popupContent: {
    width: '80%',
    height: '70%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
  },
  popUpContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  popUpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    paddingBottom: 10,
  },
  popUpUserName: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  wishTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    paddingVertical: 10,
  },
  popUpBody: {
    flex: 1,
    paddingVertical: 10,
  },
  popUpFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'lightgray',
    paddingTop: 10,
  },
});
