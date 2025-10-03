// // File: app/screens/SignUp.js

// import React, { useState } from 'react';
// import { 
//   View, 
//   Text, 
//   TextInput, 
//   TouchableOpacity, 
//   ScrollView, 
//   StyleSheet, 
//   Alert 
// } from 'react-native';
// import { useDispatch } from 'react-redux';
// import { signUpUser, setCredentials } from '../Redux/Slices/Authentication/SignUp';
// import { useNavigation } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// // For icons
// import Icon from 'react-native-vector-icons/FontAwesome';
// import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

// export default function SignUp({ setIsSignUp }) {
//   const dispatch = useDispatch();
//   const navigation = useNavigation();

//   const [localUsername, setLocalUsername] = useState('');
//   const [localEmail, setLocalEmail] = useState('');
//   const [localPassword, setLocalPassword] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');

//   const handleSignUp = async () => {
//     const resultAction = await dispatch(
//       signUpUser({ username: localUsername, email: localEmail, password: localPassword })
//     );

//     if (signUpUser.fulfilled.match(resultAction)) {
//       const { user, token } = resultAction.payload;

//       dispatch(setCredentials({ user, token }));
//       await AsyncStorage.setItem('token', token);
//       await AsyncStorage.setItem('user', JSON.stringify(user));

//       navigation.navigate('Home'); // Replace 'Home' with your home screen
//     } else {
//       setErrorMessage(resultAction.payload?.message || 'Signup failed');
//     }
//   };

//   const navigateToSignIn = () => setIsSignUp(false);

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerText}>Sign Up</Text>
//       </View>

//       <View style={styles.inputContainer}>
//         {/* Username */}
//         <View style={styles.inputWrapper}>
//           <Icon name="user" size={24} style={styles.icon} />
//           <TextInput
//             placeholder="Username"
//             value={localUsername}
//             onChangeText={setLocalUsername}
//             style={styles.input}
//           />
//         </View>

//         {/* Email */}
//         <View style={styles.inputWrapper}>
//           <MaterialIcon name="email" size={24} style={styles.icon} />
//           <TextInput
//             placeholder="Email"
//             value={localEmail}
//             onChangeText={setLocalEmail}
//             keyboardType="email-address"
//             style={styles.input}
//           />
//         </View>

//         {/* Password */}
//         <View style={styles.inputWrapper}>
//           <Icon name="lock" size={24} style={styles.icon} />
//           <TextInput
//             placeholder="Password"
//             value={localPassword}
//             onChangeText={setLocalPassword}
//             secureTextEntry
//             style={styles.input}
//           />
//         </View>

//         {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

//         <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
//           <Text style={styles.signUpButtonText}>Sign Up</Text>
//         </TouchableOpacity>

//         <Text style={styles.termsText}>
//           By signing in, you agree to the Terms of Service and Privacy Policy, including Cookie Use.
//         </Text>

//         <View style={styles.signInTextWrapper}>
//           <Text>Already have an account? </Text>
//           <TouchableOpacity onPress={navigateToSignIn}>
//             <Text style={styles.signInText}>Sign In</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   header: {
//     marginBottom: 30,
//     alignItems: 'center',
//   },
//   headerText: {
//     fontSize: 28,
//     fontWeight: 'bold',
//   },
//   inputContainer: {
//     marginBottom: 20,
//   },
//   inputWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//     paddingVertical: 5,
//   },
//   icon: {
//     marginRight: 10,
//     color: '#000',
//   },
//   input: {
//     flex: 1,
//     fontSize: 16,
//     paddingVertical: 5,
//   },
//   errorText: {
//     color: 'red',
//     marginBottom: 10,
//   },
//   signUpButton: {
//     backgroundColor: '#007bff',
//     padding: 12,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   signUpButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   termsText: {
//     marginBottom: 20,
//     fontSize: 12,
//     color: '#555',
//   },
//   signInTextWrapper: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   signInText: {
//     color: '#007bff',
//     fontWeight: 'bold',
//   },
// });
