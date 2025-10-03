// // File: app/navigation/AppContent.js

// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useSelector, useDispatch } from 'react-redux';
// import axios from 'axios';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';

// // Screens
// import WelComeAndLogo from '../screens/Authentication/WelComeAndLogo';
// import SignIn from '../screens/Authentication/SignIn';
// import SignUp from '../screens/Authentication/SignUp';
// import Profile from '../screens/Profile';
// import ReelPlayer from '../screens/ReelPlayer';
// import ReelSide from '../screens/ReelSide';
// import ReelTalk from '../screens/ReelTalk';
// import EditProfile from '../screens/Edit';
// import NewDropProfile from '../screens/SubComponents/Profile/NewDropProfile';
// import ReelChattModeOn from '../screens/SubComponents/ReelChat/ReelChattModeOn';
// import PrivacyPage from '../screens/SubComponents/RulesPage/PrivacyPage';
// import CookiesPolicyPage from '../screens/SubComponents/RulesPage/CookieeSession';
// import TermsOfServicePage from '../screens/SubComponents/RulesPage/TermsOfServices';

// // Assets
// import krishaa from '../../assets/reelchat_logo.png'; // rename & put in /app/assets

// // Socket
// import socket from '../screens/socket';

// const Stack = createStackNavigator();
// const { width, height } = Dimensions.get('window');

// export default function AppContent() {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);

//   const dispatch = useDispatch();
//   const signUpUserName = useSelector((state) => state.signInAuth.signUpUserName);
//   const reduxToken = useSelector((state) => state.signInAuth.token);
//   const loggedInUser = useSelector((state) => state.signInAuth?.user);

//   // restore from Redux
//   useEffect(() => {
//     if (reduxToken) {
//       setToken(reduxToken);
//     }
//   }, [reduxToken]);

//   useEffect(() => {
//     if (loggedInUser) {
//       setUser(loggedInUser);
//     }
//   }, [loggedInUser]);

//   // 🔑 Fetch user from backend
//   const getUser = async () => {
//     try {
//       if (!token) return;
//       const url = `http://localhost:8000/auth/me`;
//       const { data } = await axios.get(url, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUser(data.user);
//     } catch (err) {
//       console.log('❌ Auth fetch failed:', err);
//       await AsyncStorage.removeItem('token');
//       setUser(null);
//       setToken(null);
//     }
//   };

//   useEffect(() => {
//     getUser();
//   }, [token]);

//   // 🔌 Socket setup
//   useEffect(() => {
//     if (!socket.connected) {
//       socket.connect();
//     }
//     socket.on('connect', () => {
//       console.log('✅ Socket connected with ID:', socket.id);
//     });
//   }, []);

//   useEffect(() => {
//     if (signUpUserName && socket.connected) {
//       socket.emit('register_user', signUpUserName);
//       console.log('📨 Registered user', signUpUserName);
//     }
//   }, [signUpUserName]);

//   const isAuthenticated = !!user && !!token;

//   return (
//     <NavigationContainer>
//       <Stack.Navigator
//         initialRouteName={isAuthenticated ? 'ReelPlayer' : 'Welcome'}
//         screenOptions={{ headerShown: false }}
//       >
//         {/* Public */}
//         <Stack.Screen name="Welcome" component={WelComeAndLogo} />
//         <Stack.Screen name="SignIn" component={SignIn} />
//         <Stack.Screen name="SignUp" component={SignUp} />
//         <Stack.Screen name="CookiesPolicy" component={CookiesPolicyPage} />
//         <Stack.Screen name="TermsOfService" component={TermsOfServicePage} />
//         <Stack.Screen name="PrivacyPage" component={PrivacyPage} />

//         {/* Protected */}
//         <Stack.Screen name="ReelPlayer" component={ReelPlayer} />
//         <Stack.Screen name="ReelSide" component={ReelSide} />
//         <Stack.Screen name="Profile" component={Profile} />
//         <Stack.Screen name="ReelTalk" component={ReelTalk} />
//         <Stack.Screen name="EditProfile" component={EditProfile} />
//         <Stack.Screen name="NewDropProfile" component={NewDropProfile} />
//         <Stack.Screen name="ReelChattModeOn" component={ReelChattModeOn} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// const styles = StyleSheet.create({
//   sidebarContainer: {
//     width: width * 0.25,
//     borderRightWidth: 1,
//     borderColor: '#dee2e6',
//     alignItems: 'center',
//     paddingVertical: 20,
//   },
//   reelChatContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 30,
//   },
//   appTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#333',
//     marginLeft: 10,
//   },
//   reelChatIcon: {
//     height: 50,
//     width: 50,
//     borderRadius: 10,
//     overflow: 'hidden',
//   },
//   reelChatIconImg: {
//     width: '100%',
//     height: '100%',
//   },
// });
