// MoreOptionPopUp.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FontAwesome5, FontAwesome, AntDesign, Entypo } from 'react-native-vector-icons';

export default function MoreOptionPopUp({ isVisible, onClose }) {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      backdropOpacity={0.5}
      animationIn="zoomIn"
      animationOut="zoomOut"
      animationInTiming={300}
      animationOutTiming={300}
      style={styles.modal}
    >
      <View style={styles.popupContent}>
        <View style={styles.header}>
          <Text style={styles.title}>More</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity style={styles.option}>
            <Icon name="bell" size={24} />
            <Text style={styles.optionText}>Show similar content</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option}>
            <AntDesign name="stop" size={24} />
            <Text style={styles.optionText}>Not interested in this type of content</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option}>
            <Entypo name="block" size={24} />
            <Text style={styles.optionText}>Block content</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option}>
            <FontAwesome name="flag" size={24} />
            <Text style={styles.optionText}>Report the content</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option}>
            <FontAwesome5 name="user-plus" size={24} />
            <FontAwesome5 name="user-minus" size={24} style={{ marginLeft: 10 }} />
            <Text style={styles.optionText}>Follow/Unfollow the user</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option}>
            <FontAwesome5 name="user-lock" size={24} />
            <Text style={styles.optionText}>Block the user</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option}>
            <FontAwesome5 name="coins" size={24} />
            <Text style={styles.optionText}>Tip for the creator</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option}>
            <FontAwesome5 name="shopping-bag" size={24} />
            <Text style={styles.optionText}>Buy now if applicable</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option}>
            <FontAwesome5 name="map-pin" size={24} />
            <Text style={styles.optionText}>Pin it to the top of your profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option}>
            <FontAwesome name="copy" size={24} />
            <Text style={styles.optionText}>Copy link</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
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
  header: {
    flex: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    padding: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  scrollContainer: {
    paddingVertical: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 30,
    marginBottom: 8,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
    flex: 1,
    flexWrap: 'wrap',
  },
});
