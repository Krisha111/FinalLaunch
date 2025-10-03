// import React, { useState } from "react";
// import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
// import * as ImagePicker from "expo-image-picker";

// const { width } = Dimensions.get("window");

// const Samplee = () => {
//   const [images, setImages] = useState([]);
//   const [index, setIndex] = useState(0);

//   const prevSlide = () => {
//     setIndex(index === 0 ? images.length - 1 : index - 1);
//   };

//   const nextSlide = () => {
//     setIndex(index === images.length - 1 ? 0 : index + 1);
//   };

//   const handleMultipleUpload = async () => {
//     // Request permission
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== "granted") {
//       alert("Permission to access gallery is required!");
//       return;
//     }

//     // Allow multiple selection
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsMultipleSelection: true,
//       quality: 1,
//     });

//     if (!result.canceled) {
//       const newUris = result.assets.map((asset) => asset.uri);
//       setImages((prev) => [...prev, ...newUris]);
//       setIndex(images.length); // go to first newly added image
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {images.length > 0 ? (
//         <>
//           <Image
//             source={{ uri: images[index] }}
//             style={styles.image}
//             resizeMode="cover"
//           />
//           <TouchableOpacity onPress={prevSlide} style={[styles.button, styles.left]}>
//             <Text style={styles.buttonText}>❮</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={nextSlide} style={[styles.button, styles.right]}>
//             <Text style={styles.buttonText}>❯</Text>
//           </TouchableOpacity>
//         </>
//       ) : (
//         <Text style={styles.noImageText}>No images uploaded</Text>
//       )}

//       <TouchableOpacity style={styles.uploadButton} onPress={handleMultipleUpload}>
//         <Text style={styles.uploadText}>Upload Images</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default Samplee;

// const styles = StyleSheet.create({
//   container: {
//     position: "relative",
//     width: width * 0.85,
//     height: 350,
//     marginVertical: 20,
//     alignSelf: "center",
//     overflow: "hidden",
//     borderRadius: 12,
//     shadowColor: "#000",
//     shadowOpacity: 0.2,
//     shadowOffset: { width: 0, height: 4 },
//     shadowRadius: 12,
//     elevation: 5,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#fff",
//   },
//   image: {
//     width: "100%",
//     height: "100%",
//     borderRadius: 12,
//   },
//   button: {
//     position: "absolute",
//     top: "50%",
//     transform: [{ translateY: -20 }],
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     padding: 10,
//     borderRadius: 50,
//     zIndex: 1,
//   },
//   left: {
//     left: 10,
//   },
//   right: {
//     right: 10,
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 24,
//   },
//   noImageText: {
//     textAlign: "center",
//     fontSize: 16,
//     color: "#888",
//   },
//   uploadButton: {
//     marginTop: 15,
//     padding: 12,
//     backgroundColor: "#f9f9f9",
//     borderRadius: 6,
//     borderWidth: 1,
//     borderColor: "#ccc",
//   },
//   uploadText: {
//     fontSize: 16,
//     color: "#333",
//   },
// });
