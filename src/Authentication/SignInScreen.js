import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image 
} from 'react-native';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
     // ❌ Not supported in RN
// Instead, use react-native-vector-icons
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import {  
  setSignInReelChatUserName,
  setSignInReelChatPassWord,
  setSignInReelChatEmail,
  saveSignInReelChatUserName 
} from '../Redux/Slice/Authentication/SignIn.js';

import { setCredentials } from '../Redux/Slice/Authentication/SignUp.js';

export default function SignIn({ setIsSignUp }) {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const signInReelChatUserName = useSelector(
    (state) => state.signInReelChat.signInReelChatUserName
  );
  const signInReelChatPassWord = useSelector(
    (state) => state.signInReelChat.signInReelChatPassWord
  );
  const signInReelChatEmail = useSelector(
    (state) => state.signInReelChat.signInReelChatEmail
  );

  const [username, setUsername] = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignIn = async () => {
    try {
      const response = await axios.post('http://localhost:8000/signIn', {
        username,
        email,
        password,
      });

      if (response.status === 200) {
        const { user, token } = response.data;
        dispatch(setCredentials({ user, token }));
        navigation.navigate('Home'); // Navigate to Home screen
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message || 'Login failed.');
      } else {
        setErrorMessage('An error occurred. Please try again.');
      }
    }
  };

  const googleAuth = () => {
    // On mobile, you’d integrate Google Sign-In SDK (expo-auth-session or react-native-google-signin)
    console.log('Google Auth not implemented in React Native');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Sign In</Text>

      {/* Username */}
      <View style={styles.inputRow}>
        <Icon name="user" size={24} color="#555" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
      </View>

      {/* Email */}
      <View style={styles.inputRow}>
        <MaterialIcon name="email" size={24} color="#555" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      {/* Password */}
      <View style={styles.inputRow}>
        <Icon name="lock" size={24} color="#555" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      {/* Sign In Button */}
      <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
        <Text style={styles.signInButtonText}>Sign In</Text>
      </TouchableOpacity>

      {/* Google Sign-In (placeholder) */}
      {/* 
      <TouchableOpacity style={styles.googleButton} onPress={googleAuth}>
        <Image
          source={{ uri: "https://pixy.org/src/476/4766956.png" }}
          style={styles.googleIcon}
        />
        <Text style={styles.googleText}>Sign in with Google</Text>
      </TouchableOpacity>
      */}

      {/* Terms */}
      <Text style={styles.terms}>
        By signing in, you agree to the Terms of Service and Privacy Policy,
        including Cookie Use.
      </Text>

      {/* Switch to Sign Up */}
      <View style={styles.signUpRow}>
        <Text style={styles.signUpText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => setIsSignUp(true)}>
          <Text style={styles.signUpButton}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  signInButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  signInButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
  terms: {
    fontSize: 12,
    color: '#666',
    marginTop: 20,
    textAlign: 'center',
  },
  signUpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  signUpText: {
    fontSize: 14,
    marginRight: 5,
  },
  signUpButton: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007bff',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    justifyContent: 'center',
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleText: {
    fontSize: 16,
    color: '#333',
  },
});
