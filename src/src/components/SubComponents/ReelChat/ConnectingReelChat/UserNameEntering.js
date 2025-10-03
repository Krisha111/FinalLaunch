// UserNameEntering.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import SwitchPopUp from '../PopUps/SwitchPopUp.js';

export default function UserNameEntering() {
  const [registereddd, setRegistereddd] = useState(false);
  const [room, setRoom] = useState('');
  const [partner, setPartner] = useState(null);

  const signUpUserName = useSelector(
    (state) => state.signInAuth?.signUpUserName ?? 'Krisha'
  );

  return (
    <View style={styles.container}>
      {!registereddd ? (
        <View style={styles.userNameContainerBox}>
          <Text style={styles.heading}>Enter your username:</Text>
          <Text style={styles.username}>{signUpUserName}</Text>

          {/* If you want user to edit, use TextInput instead */}
          {/* <TextInput
            style={styles.input}
            value={signUpUserName}
            onChangeText={(text) => setSignUpUserName(text)}
          /> */}

          <Button title="Join" onPress={() => setRegistereddd(true)} />
        </View>
      ) : (
        <View style={styles.userNameContainerBoxx}>
          <SwitchPopUp username={signUpUserName} room={room} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  userNameContainerBox: {
    flex: 1,
    borderWidth: 2,
    borderColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  userNameContainerBoxx: {
    flex: 1,
    borderWidth: 2,
    borderColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 18,
    marginBottom: 10,
  },
  username: {
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    width: '100%',
    marginBottom: 20,
  },
});
