// // src/screens/Profile.js
// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   ScrollView,
//   ActivityIndicator,
// } from "react-native";
// import { useNavigation, useRoute } from "@react-navigation/native";
// import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";
// import { RxAvatar } from "react-icons/rx"; // ⚠️ Replace with react-native-vector-icons if needed
// import FollowerPopUp from "../components/SubComponents/Profile/PopUp/FollowerPopUp";
// import FavouritePopUp from "../components/SubComponents/Profile/PopUp/FavouritePopUp";
// import ProfileSidebar from "../components/SubComponents/Profile/ProfileSidebar";
// import { fetchProfileById } from "../Redux/Slices/Profile/ProfileInformationSlice";

// export default function Profile() {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const dispatch = useDispatch();

//   const { id } = route.params || {}; // instead of useParams()
//   const loggedInUserId = useSelector((state) => state.signInAuth.user?._id);
//   const { profile, profileName, profileBio, profileImage, loading, error } =
//     useSelector((state) => state.profileInformation);

//   const { finalImageWithBackground, outputImage } = useSelector(
//     (state) => state.background
//   );

//   const [images, setImages] = useState([]);
//   const [favouritePopUp, setFavouritePopUp] = useState(false);
//   const [followerPopUp, setFollowerPopUp] = useState(false);

//   const URL = "https://api.unsplash.com/search/photos";
//   const Access_key = "0b_PBFtOzp79VOLz--Da8Qis4_l8mv1gtw4-Ne-W2Rs";

//   // Fetch demo images from Unsplash
//   useEffect(() => {
//     const getImage = async () => {
//       try {
//         const result = await axios.get(
//           `${URL}?page=1&query=nature&per_page=20&client_id=${Access_key}`
//         );
//         setImages(result.data.results);
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     getImage();
//   }, []);

//   // Fetch user profile by ID
//   useEffect(() => {
//     if (id) {
//       dispatch(fetchProfileById(id));
//     }
//   }, [id, dispatch]);

//   // Navigation
//   const navigateToEdit = () => {
//     navigation.navigate("EditProfile");
//   };

//   return (
//     <View style={styles.profileContainer}>
//       <View style={styles.profileTopContainer}>
//         <View style={styles.profileTopLeftContainer}>
//           {/* Edit button */}
//           {profile?._id === loggedInUserId && (
//             <View style={styles.profileEditBoxxy}>
//               <TouchableOpacity
//                 onPress={navigateToEdit}
//                 style={styles.profileEditClick}
//               >
//                 <Text style={styles.editText}>Edit</Text>
//               </TouchableOpacity>
//             </View>
//           )}

//           {/* Profile info */}
//           <View style={styles.profileNameContainerMePage}>
//             <View style={styles.profilePhotoBoxContainer}>
//               <View style={styles.profilePhotoBoxInnerContainer}>
//                 {outputImage || profileImage ? (
//                   <Image
//                     source={{
//                       uri:
//                         finalImageWithBackground ||
//                         outputImage ||
//                         profileImage,
//                     }}
//                     style={styles.profilePhoto}
//                   />
//                 ) : (
//                   <Text>👤</Text> // replace RxAvatar with native icon
//                 )}
//               </View>
//             </View>

//             <View style={styles.mePageInfoContainerOfBio}>
//               <View style={styles.profilefollowersAndMePageFollowings}>
//                 <Text style={styles.profileUserNameMePagey}>
//                   {profile?.username || "username_placeholder"}
//                 </Text>
//               </View>

//               <View style={styles.profileInformationMePageContaniner}>
//                 {loading ? (
//                   <ActivityIndicator size="small" color="gray" />
//                 ) : error ? (
//                   <Text style={{ color: "red" }}>
//                     {typeof error === "string"
//                       ? error
//                       : error?.message || "Something went wrong"}
//                   </Text>
//                 ) : (
//                   <>
//                     <Text style={styles.profileNameMePage}>
//                       {profile?.name || "Name"}
//                     </Text>
//                     <Text style={styles.profileBioMePage}>
//                       {profile?.bio || "Bio"}
//                     </Text>
//                   </>
//                 )}
//               </View>
//             </View>
//           </View>
//         </View>
//       </View>

//       {/* Sidebar */}
//       <ProfileSidebar />

//       {/* Favourite popup */}
//       {favouritePopUp && (
//         <FavouritePopUp onClose={() => setFavouritePopUp(false)} />
//       )}

//       {/* Follower popup */}
//       {followerPopUp && (
//         <FollowerPopUp onClose={() => setFollowerPopUp(false)} />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   profileContainer: {
//     flex: 1,
//     flexDirection: "column",
//     backgroundColor: "#fff",
//   },
//   profileTopContainer: {
//     flex: 0.6,
//     flexDirection: "row",
//     borderBottomWidth: 1,
//     borderBottomColor: "grey",
//   },
//   profileTopLeftContainer: {
//     flex: 1,
//     flexDirection: "column",
//   },
//   profileEditBoxxy: {
//     flexDirection: "row",
//     justifyContent: "flex-end",
//     paddingTop: 15,
//     width: "100%",
//   },
//   profileEditClick: {
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     backgroundColor: "#63e25e",
//     borderRadius: 20,
//     marginRight: 20,
//   },
//   editText: {
//     color: "white",
//     fontWeight: "600",
//   },
//   profileNameContainerMePage: {
//     flexDirection: "row",
//     padding: 20,
//   },
//   profilePhotoBoxContainer: {
//     flex: 0.3,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   profilePhotoBoxInnerContainer: {
//     width: 150,
//     height: 150,
//     borderRadius: 75,
//     overflow: "hidden",
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#f0f0f0",
//   },
//   profilePhoto: {
//     width: "100%",
//     height: "100%",
//     resizeMode: "cover",
//     borderRadius: 75,
//   },
//   mePageInfoContainerOfBio: {
//     flex: 0.7,
//     paddingLeft: 20,
//     flexDirection: "column",
//   },
//   profilefollowersAndMePageFollowings: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 5,
//   },
//   profileUserNameMePagey: {
//     fontSize: 20,
//     fontWeight: "500",
//   },
//   profileInformationMePageContaniner: {
//     flexDirection: "column",
//   },
//   profileNameMePage: {
//     fontSize: 16,
//     fontWeight: "600",
//     marginBottom: 5,
//   },
//   profileBioMePage: {
//     fontSize: 14,
//     color: "#555",
//   },
// });
