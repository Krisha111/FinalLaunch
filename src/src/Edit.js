// // components/EditProfile.js
// import React, { useEffect, useRef, useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Image,
//   StyleSheet,
//   ScrollView,
// } from "react-native";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigation } from "@react-navigation/native";
// import * as ImagePicker from "react-native-image-picker";

// import {
//   setSelectedFile,
//   clearOutput,
//   removeBackgroundThunk,
//   setClothingBgColor,
//   setFinalImageWithBackground,
// } from "../Redux/Slices/Profile/BackgroundSlice";

// import { updateProfileImage } from "../Redux/Slices/Authentication/SignUp";
// import {
//   updateProfile,
//   setProfileName,
//   setProfileBio,
//   setProfileImage,
// } from "../Redux/Slices/Profile/ProfileInformationSlice";

// import { logout } from "../Redux/Slices/Authentication/SignUp";
// import AddDrop from "./SubComponents/Profile/NewDropPopUp/AddDrop";

// export default function EditProfile() {
//   const dispatch = useDispatch();
//   const navigation = useNavigation();

//   const loggedInUser = useSelector((state) => state.signInAuth?.user);
//   const username = loggedInUser?.username ?? "";

//   const profile = useSelector((state) => state.profileInformation?.profile);
//   const profileName = useSelector(
//     (state) => state.profileInformation?.profileName ?? ""
//   );
//   const profileBio = useSelector(
//     (state) => state.profileInformation?.profileBio ?? ""
//   );
//   const profileImage = useSelector(
//     (state) => state.profileInformation?.profileImage ?? ""
//   );

//   const { selectedFile, outputImage, loading, error, clothingBgColor } =
//     useSelector((state) => state.background);

//   const [processedImage, setProcessedImage] = useState(null);
//   const [showAddDrop, setShowAddDrop] = useState(false);
//   const [displayError, setDisplayError] = useState(null);

//   useEffect(() => {
//     if (profile) {
//       dispatch(setProfileName(profile.name || ""));
//       dispatch(setProfileBio(profile.bio || ""));
//       dispatch(setProfileImage(profile.profileImage || ""));
//     }
//   }, [profile]);

//   const handlesetShowAddDropClose = () => setShowAddDrop(false);
//   const handlesetShowAddDropOpen = () => setShowAddDrop(true);

//   const handleFileChange = () => {
//     ImagePicker.launchImageLibrary(
//       { mediaType: "photo", includeBase64: true },
//       (response) => {
//         if (response.didCancel || response.errorCode) return;
//         const file = response.assets[0];
//         dispatch(setSelectedFile(file));
//         dispatch(clearOutput());
//         setProcessedImage(null);
//       }
//     );
//   };

//   const handleRemoveBackground = () => {
//     if (selectedFile) {
//       dispatch(removeBackgroundThunk(selectedFile));
//     }
//   };

//   const handleSaveChanges = async () => {
//     if (!username) return;

//     const imageToSave = processedImage
//       ? processedImage
//       : outputImage || profileImage || "";

//     try {
//       await dispatch(
//         updateProfile({
//           username,
//           updates: { name: profileName, bio: profileBio },
//         })
//       ).unwrap?.();

//       if (imageToSave) {
//         await dispatch(updateProfileImage(imageToSave)).unwrap?.();
//         dispatch(setProfileImage(imageToSave));
//       }

//       dispatch(clearOutput());

//       if (loggedInUser?.username) {
//         navigation.navigate("Profile", { username: loggedInUser.username });
//       } else {
//         navigation.navigate("Profile");
//       }
//     } catch (err) {
//       const errorMsg =
//         typeof err === "string"
//           ? err
//           : err?.message || "Failed to save profile. Please try again later.";
//       setDisplayError(errorMsg);
//       setTimeout(() => setDisplayError(null), 4000);
//     }
//   };

//   useEffect(() => {
//     if (error) {
//       setDisplayError(error);
//       const timer = setTimeout(() => setDisplayError(null), 4000);
//       return () => clearTimeout(timer);
//     }
//   }, [error]);

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <View style={styles.headerContainer}>
//         <Text style={styles.headerText}>PROFILE SETTINGS</Text>
//       </View>

//       <View style={styles.profilePicContainer}>
//         <Text style={styles.label}>PROFILE PHOTO</Text>

//         <TouchableOpacity style={styles.button} onPress={handleFileChange}>
//           <Text style={styles.buttonText}>Select Image</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.button, loading && styles.disabledButton]}
//           onPress={handleRemoveBackground}
//           disabled={!selectedFile || loading}
//         >
//           <Text style={styles.buttonText}>
//             {loading ? "Processing..." : "Remove Background"}
//           </Text>
//         </TouchableOpacity>

//         {outputImage && (
//           <Image
//             source={{ uri: processedImage || outputImage }}
//             style={[
//               styles.previewImage,
//               { borderColor: clothingBgColor || "red" },
//             ]}
//           />
//         )}

//         {displayError && (
//           <Text style={styles.errorText}>{displayError}</Text>
//         )}
//       </View>

//       <View style={styles.inputContainer}>
//         <Text style={styles.label}>NAME</Text>
//         <TextInput
//           style={styles.input}
//           value={profileName}
//           onChangeText={(text) => dispatch(setProfileName(text))}
//         />

//         <Text style={styles.label}>BIO</Text>
//         <TextInput
//           style={styles.input}
//           value={profileBio}
//           onChangeText={(text) => dispatch(setProfileBio(text))}
//         />
//       </View>

//       <View style={styles.buttonsContainer}>
//         <TouchableOpacity
//           style={styles.saveButton}
//           onPress={handleSaveChanges}
//         >
//           <Text style={styles.buttonText}>MAKE IT OFFICIAL</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.newDropButton}
//           onPress={handlesetShowAddDropOpen}
//         >
//           <Text style={styles.buttonText}>NEW DROP</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.logoutContainer}>
//         {username ? (
//           <TouchableOpacity onPress={() => dispatch(logout())}>
//             <Text style={styles.logoutText}>Logout</Text>
//           </TouchableOpacity>
//         ) : (
//           <Text style={styles.logoutText}>Not logged in</Text>
//         )}
//       </View>

//       {showAddDrop && <AddDrop onClose={handlesetShowAddDropClose} />}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//     backgroundColor: "#fff",
//   },
//   headerContainer: {
//     marginBottom: 16,
//   },
//   headerText: {
//     fontSize: 22,
//     fontWeight: "bold",
//   },
//   profilePicContainer: {
//     marginBottom: 24,
//   },
//   label: {
//     fontWeight: "bold",
//     marginBottom: 8,
//   },
//   button: {
//     backgroundColor: "#007bff",
//     padding: 12,
//     marginBottom: 12,
//     borderRadius: 8,
//   },
//   disabledButton: {
//     opacity: 0.6,
//   },
//   buttonText: {
//     color: "#fff",
//     textAlign: "center",
//   },
//   previewImage: {
//     width: "100%",
//     height: 250,
//     borderWidth: 4,
//     borderRadius: 12,
//     marginTop: 16,
//   },
//   inputContainer: {
//     marginBottom: 24,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     padding: 8,
//     borderRadius: 8,
//     marginBottom: 16,
//   },
//   buttonsContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 24,
//   },
//   saveButton: {
//     flex: 1,
//     backgroundColor: "#28a745",
//     padding: 12,
//     borderRadius: 8,
//     marginRight: 8,
//   },
//   newDropButton: {
//     flex: 1,
//     backgroundColor: "#ffc107",
//     padding: 12,
//     borderRadius: 8,
//     marginLeft: 8,
//   },
//   logoutContainer: {
//     alignItems: "center",
//     marginBottom: 24,
//   },
//   logoutText: {
//     fontWeight: "bold",
//     color: "#dc3545",
//   },
//   errorText: {
//     color: "red",
//     fontWeight: "bold",
//     marginTop: 8,
//   },
// });
