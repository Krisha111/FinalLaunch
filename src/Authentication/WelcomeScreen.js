// // src/Authentication/WelComeAndLogo.js
// // Simplified: no background image, single centered form container, no spacing between borders

// import React, { useState } from "react";
// import {
//   View,
//   StyleSheet,
//   StatusBar,
//   ScrollView,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import SignUp from "./SignUpScreen";
// import SignIn from "./SignInScreen";

// export default function WelComeAndLogo() {
//   const [isSignUp, setIsSignUp] = useState(true);

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar
//         barStyle="dark-content"
//         backgroundColor="transparent"
//         translucent
//       />

//       <ScrollView
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Center Block: only form container */}
//         <View style={styles.centerBlock}>
//           <View style={styles.formContainer}>
//             {isSignUp ? (
//               <SignUp setIsSignUp={setIsSignUp} />
//             ) : (
//               <SignIn setIsSignUp={setIsSignUp} />
//             )}
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: "#fff",
//     borderColor: "magenta",
//     borderWidth: 4,
//     padding: 0,        // remove default padding
//   },
//   scrollContent: {
//     flexGrow: 1,
//     justifyContent: "center", // vertical center
//     alignItems: "center",     // horizontal center
//     padding: 0,               // remove extra scroll padding
//   },
//   centerBlock: {
//     width: "100%",
//     alignItems: "center",
//     margin: 0,                // remove any margin
//   },
//   formContainer: {
//     borderColor: "red",       // debugging border
//     borderWidth: 3,
//     width: "100%",
//     alignItems: "stretch",
//     margin: 0,                // remove any margin
//     padding: 0,               // remove any padding
//   },
// });
