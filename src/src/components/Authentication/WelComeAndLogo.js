// // File: app/screens/WelComeAndLogo.js

// import React, { useState } from 'react';
// import { View, Text, Image, StyleSheet, Dimensions, ScrollView } from 'react-native';
// import SignUp from './SignUp';
// import SignIn from './SignIn';

// const { width, height } = Dimensions.get('window');

// export default function WelComeAndLogo() {
//   const [isSignUp, setIsSignUp] = useState(true);

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       {/* Left side: Logo & Welcome */}
//       <View style={styles.logoContainer}>
//         <Image
//           source={require('../../LogoWelCome.png')} // Place your image in app/assets/
//           style={styles.logo}
//           resizeMode="cover"
//         />
//         <View style={styles.welcomeOverlay}>
//           <Text style={styles.welcomeText}>Welcome to ReelChat...!!!</Text>
//         </View>
//       </View>

//       {/* Right side: SignIn/SignUp form */}
//       <View style={styles.formContainer}>
//         {isSignUp ? (
//           <SignUp setIsSignUp={setIsSignUp} />
//         ) : (
//           <SignIn setIsSignUp={setIsSignUp} />
//         )}
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     flexDirection: width > 768 ? 'row' : 'column', // Responsive: row for large screens, column for small
//     height: height,
//     width: width,
//     backgroundColor: '#fff',
//   },
//   logoContainer: {
//     flex: 1,
//     position: 'relative',
//     overflow: 'hidden',
//   },
//   logo: {
//     width: '100%',
//     height: '100%',
//   },
//   welcomeOverlay: {
//     position: 'absolute',
//     bottom: 30,
//     left: 30,
//     zIndex: 10,
//   },
//   welcomeText: {
//     fontSize: width > 768 ? 50 : 28,
//     fontWeight: 'bold',
//     color: '#000',
//     textShadowColor: 'rgba(0,0,0,0.7)',
//     textShadowOffset: { width: 2, height: 2 },
//     textShadowRadius: 8,
//   },
//   formContainer: {
//     width: width > 768 ? '30%' : '100%',
//     height: width > 768 ? '85%' : 'auto',
//     backgroundColor: '#fff',
//     borderRadius: 30,
//     padding: 40,
//     shadowColor: '#000',
//     shadowOffset: { width: -5, height: 0 },
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     elevation: 5, // For Android shadow
//     alignSelf: 'center',
//     position: width > 768 ? 'absolute' : 'relative',
//     right: width > 768 ? 100 : 0,
//     top: width > 768 ? height * 0.075 : 0,
//   },
// });
