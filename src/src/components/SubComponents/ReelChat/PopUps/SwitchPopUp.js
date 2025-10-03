// SwitchPopUp.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome, MaterialCommunityIcons } from 'react-native-vector-icons';
import ReelTalk from './SwitchOption/ReelTalk';
import ReelChatConnectingOptions from './SwitchOption/ReelChatConnectingOptions';

export default function SwitchPopUp({ username, room }) {
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  return (
    <View style={styles.container}>
      {selectedOption === '' ? (
        <View style={styles.popupContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Switch To..</Text>
          </View>

          <View style={styles.options}>
            <TouchableOpacity
              style={styles.option}
              onPress={() => handleOptionClick('ReelTalk')}
            >
              <FontAwesome name="bomb" size={24} />
              <Text style={styles.optionText}>ReelTalk</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={() => handleOptionClick('ReelChat')}
            >
              <MaterialCommunityIcons name="chat-heart" size={24} />
              <Text style={styles.optionText}>ReelChat</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : selectedOption === 'ReelTalk' ? (
        <ReelTalk username={username} room={room} />
      ) : (
        <ReelChatConnectingOptions username={username} room={room} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 2,
    borderColor: 'brown',
  },
  popupContainer: {
    flex: 1,
    borderWidth: 2,
    borderColor: 'red',
  },
  header: {
    flex: 0,
    paddingLeft: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  options: {
    paddingTop: 18,
    flex: 1,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 30,
    backgroundColor: '#e0ffe0', // Optional light highlight
  },
  optionText: {
    fontSize: 20,
    marginLeft: 10,
  },
});
