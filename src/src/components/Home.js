// import React from "react";
// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import { useNavigation } from "@react-navigation/native";

// export default function Home() {
//   const navigation = useNavigation();

//   const NavItem = ({ label, route }) => (
//     <TouchableOpacity
//       style={styles.link}
//       onPress={() => navigation.navigate(route)}
//     >
//       <Text style={styles.linkText}>{label}</Text>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <View style={styles.sidebarContainer}>
//         <NavItem label="ReelSide" route="ReelSide" />
//         <NavItem label="Chat" route="Chat" />
//         <NavItem label="Sample" route="Sample" />
//         <NavItem label="Unprofile" route="Unprofile" />
//         <NavItem label="Camera" route="Camera" />
//         <NavItem label="Profile" route="Profile" />
//         <NavItem label="Notification" route="Notification" />
//         <NavItem label="Story" route="Story" />
//         <NavItem label="Explore" route="Explore" />
//         <NavItem label="Notes" route="Notes" />
//         <NavItem label="MainPage" route="MainPage" />
//         <NavItem label="ReelTalk" route="ReelTalk" />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   sidebarContainer: {
//     padding: 20,
//   },
//   link: {
//     paddingVertical: 10,
//   },
//   linkText: {
//     fontSize: 16,
//     color: "#007AFF",
//   },
// });
