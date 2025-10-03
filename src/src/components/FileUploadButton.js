// import React from "react";
// import { View, TouchableOpacity, StyleSheet } from "react-native";
// import Icon from "react-native-vector-icons/FontAwesome";
// import * as ImagePicker from "react-native-image-picker";

// export default function File({ onFileSelect }) {
//   const handleIconClick = () => {
//     ImagePicker.launchImageLibrary({ mediaType: "photo" }, (res) => {
//       if (res.didCancel) return;
//       if (res.errorCode) {
//         console.log("ImagePicker Error: ", res.errorMessage);
//         return;
//       }
//       if (res.assets && res.assets[0]) {
//         const file = res.assets[0]; // { uri, fileName, type, etc. }
//         if (onFileSelect) onFileSelect(file);
//       }
//     });
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity
//         style={styles.uploadButton}
//         onPress={handleIconClick}
//         activeOpacity={0.7}
//       >
//         <Icon name="upload" size={24} color="#fff" />
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   uploadButton: {
//     backgroundColor: "#4caf50",
//     padding: 12,
//     borderRadius: 50,
//     elevation: 3,
//   },
// });
