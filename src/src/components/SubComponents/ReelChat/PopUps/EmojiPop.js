// EmojiPickerPopup.js
import React, { useState } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Modal from 'react-native-modal';
import EmojiSelector, { Categories } from 'react-native-emoji-selector';

export default function EmojiPop({ isVisible, onClose, onEmojiSelect }) {
  const [exiting, setExiting] = useState(false);

  const handleClose = () => {
    setExiting(true);
    setTimeout(() => {
      setExiting(false);
      onClose();
    }, 300); // matches fadeOut duration
  };

  const handleEmojiSelect = (emoji) => {
    onEmojiSelect(emoji);
    handleClose();
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={handleClose}
      backdropOpacity={0.5}
      animationIn="zoomIn"
      animationOut="zoomOut"
      animationInTiming={300}
      animationOutTiming={300}
      style={styles.modal}
    >
      <TouchableWithoutFeedback>
        <View style={styles.popupContent}>
          <EmojiSelector
            category={Categories.all}
            onEmojiSelected={handleEmojiSelect}
            showSearchBar={true}
            showTabs={true}
            showSectionTitles={false}
            columns={8}
          />
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContent: {
    width: '80%',
    height: '70%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    overflow: 'hidden',
  },
});
