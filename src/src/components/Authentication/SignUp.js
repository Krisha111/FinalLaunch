// // File: app/screens/SignUp.js

// import React, { useState } from 'react';
// import { 
//   View, 
//   Text, 
//   TextInput, 
//   TouchableOpacity, 
//   ScrollView, 
//   StyleSheet 
// } from 'react-native';
// import { useDispatch } from 'react-redux';
// import { signUpUser, setCredentials } from '../Redux/Slices/Authentication/SignUp';
// import { useNavigation } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// // Icons
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

//       <View style={styles.form}>
//         {/* Username */}
//         <View style={styles.inputWrapper}>
//           <Icon name="user" size={24} style={styles.icon} />
//           <View style={styles.entryArea}>
//             <TextInput
//               value={localUsername}
//               onChangeText={setLocalUsername}
//               placeholder="Username"
//               style={styles.input}
//             />
//             <Text style={styles.labelLine}>Username</Text>
//           </View>
//         </View>

//         {/* Email */}
//         <View style={styles.inputWrapper}>
//           <MaterialIcon name="email" size={24} style={styles.icon} />
//           <View style={styles.entryArea}>
//             <TextInput
//               value={localEmail}
//               onChangeText={setLocalEmail}
//               placeholder="Email"
//               keyboardType="email-address"
//               style={styles.input}
//             />
//             <Text style={styles.labelLine}>Email</Text>
//           </View>
//         </View>

//         {/* Password */}
//         <View style={styles.inputWrapper}>
//           <Icon name="lock" size={24} style={styles.icon} />
//           <View style={styles.entryArea}>
//             <TextInput
//               value={localPassword}
//               onChangeText={setLocalPassword}
//               placeholder="Password"
//               secureTextEntry
//               style={styles.input}
//             />
//             <Text style={styles.labelLine}>Password</Text>
//           </View>
//         </View>

//         {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

//         <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
//           <Text style={styles.signUpButtonText}>Sign Up</Text>
//         </TouchableOpacity>

//         <Text style={styles.agreeToTerms}>
//           By signing in, you agree to the Terms of Service, Privacy Policy, and Cookie Use.
//         </Text>

//         <View style={styles.signUpContainer}>
//           <Text>Already have an account?</Text>
//           <TouchableOpacity onPress={navigateToSignIn}>
//             <Text style={styles.signUpText}>Sign In</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     padding: 40,
//     backgroundColor: '#fff',
//   },
//   header: {
//     flex: 0.1,
//     marginBottom: 20,
//     alignItems: 'center',
//   },
//   headerText: {
//     fontSize: 36,
//     fontWeight: 'bold',
//   },
//   form: {
//     flex: 1,
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
//   entryArea: {
//     flex: 1,
//   },
//   input: {
//     fontSize: 16,
//     paddingVertical: 5,
//   },
//   labelLine: {
//     fontSize: 12,
//     color: '#888',
//   },
//   errorMessage: {
//     color: 'red',
//     marginBottom: 10,
//   },
//   signUpButton: {
//     borderWidth: 2,
//     borderColor: 'green',
//     borderRadius: 15,
//     paddingVertical: 10,
//     paddingHorizontal: 40,
//     alignItems: 'center',
//     marginVertical: 15,
//   },
//   signUpButtonText: {
//     color: 'green',
//     fontWeight: 'bold',
//   },
//   agreeToTerms: {
//     fontSize: 12,
//     marginBottom: 20,
//   },
//   signUpContainer: {
//     alignItems: 'center',
//   },
//   signUpText: {
//     color: 'green',
//     fontWeight: 'bold',
//     marginTop: 5,
//   },
// });
