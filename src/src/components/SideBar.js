// // src/components/SideBar.js
// import React from "react";
// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import LinearGradient from "react-native-linear-gradient";

// // Example: pass icons from react-native-vector-icons
// // import Icon from "react-native-vector-icons/MaterialIcons";

// export default function SideBar({ color, trending, iconkrisha, OptionText, linkTo }) {
//   const navigation = useNavigation();

//   const onClickSidebarOption = () => {
//     if (linkTo) {
//       navigation.navigate(linkTo);
//     }
//   };

//   return (
//     <View style={styles.sideBar}>
//       <TouchableOpacity style={styles.sideBarOptions} onPress={onClickSidebarOption}>
//         <View style={styles.sideBarOptionsIcon}>
//           {iconkrisha}
//         </View>
//         <Text style={styles.sideBarOptionsText}>{OptionText}</Text>

//         {trending && (
//           <LinearGradient
//             colors={["#68e464", "#fff467"]}
//             style={[styles.sideBarHashTagTrending, { backgroundColor: color }]}
//           >
//             <Text style={styles.trendingText}>{trending}</Text>
//           </LinearGradient>
//         )}
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   sideBar: {
//     width: "100%",
//   },
//   sideBarOptions: {
//     flexDirection: "row",
//     alignItems: "center",
//     margin: 10,
//     paddingVertical: 11,
//     paddingLeft: 25,
//     borderRadius: 30,
//   },
//   sideBarOptionsIcon: {
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   sideBarOptionsText: {
//     fontSize: 18,
//     marginLeft: 18,
//     color: "#000",
//   },
//   sideBarHashTagTrending: {
//     position: "absolute",
//     right: 10,
//     borderRadius: 20,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     maxWidth: 100,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   trendingText: {
//     fontSize: 12,
//     color: "black",
//   },
// });
