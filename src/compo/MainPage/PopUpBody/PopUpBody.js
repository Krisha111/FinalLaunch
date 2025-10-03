// PopUpBody.js (React Native)
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Avatar } from 'react-native-paper'; // or Image if preferred
import { MaterialIcons } from '@expo/vector-icons'; // For MoreVertIcon

export default function PopUpBody() {
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => setShowPopup(!showPopup);

  return (
    <View style={styles.popUpBodyContainer}>
      <View style={styles.popUpWishAvatar}>
        <Avatar.Image size={40} source={require('../../../assets/defaultAvatar.png')} />
      </View>

      <View style={styles.theWish}>
        <View style={styles.theWishMsg}>
          <Text>
            hii how are your hii how are your hii how are your hii how are your
            hii how are your hii how are your hii how are your hii how are your
            hii how are your hii how are your
          </Text>
        </View>
        <Text style={styles.theWishMsgTime}>Time: 5h ago</Text>
      </View>

      <TouchableOpacity style={styles.threeDotsIcon} onPress={togglePopup}>
        <MaterialIcons name="more-vert" size={24} color="black" />
      </TouchableOpacity>

      {/* Popup Modal */}
      <Modal
        visible={showPopup}
        transparent={true}
        animationType="fade"
        onRequestClose={togglePopup}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={togglePopup}>
          <View style={styles.timePopup}>
            <View style={styles.popUpOptions}>
              <Text style={styles.popUpOptionsText}>Pin</Text>
              <Text style={styles.popUpOptionsText}>Reply</Text>
              <Text style={styles.popUpOptionsText}>Save</Text>
              <Text style={[styles.popUpOptionsText, styles.redColorText]}>Delete Chat</Text>
              <Text style={[styles.popUpOptionsText, styles.redColorText, { borderBottomWidth: 0 }]}>Report</Text>
            </View>
            <Text style={styles.cancelOption} onPress={togglePopup}>Cancel</Text>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  popUpBodyContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  popUpWishAvatar: {
    flex: 0.06,
    justifyContent: 'center',
  },
  theWish: {
    flex: 1,
    paddingLeft: 10,
    flexDirection: 'column',
  },
  theWishMsg: {
    flexDirection: 'column',
  },
  theWishMsgTime: {
    color: 'gray',
    fontSize: 12,
    marginTop: 2,
  },
  threeDotsIcon: {
    flex: 0.02,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timePopup: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
  },
  popUpOptions: {
    marginBottom: 10,
  },
  popUpOptionsText: {
    fontSize: 16,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  redColorText: {
    color: 'red',
  },
  cancelOption: {
    fontSize: 16,
    textAlign: 'center',
    color: '#000',
    paddingVertical: 5,
  },
});
