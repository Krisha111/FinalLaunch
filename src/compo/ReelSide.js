// // src/components/ReelSide.js
// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import Entypo from 'react-native-vector-icons/Entypo';

// // You would later rebuild ReelInformation, ThreeDotsOption, MoreOptionPopUp as RN screens/components
// // import ReelInformation from './SubComponents/ReelChat/ReelInformation';

// export default function ReelSide({ setReelBarOpen, isSidebarOpen }) {
//   const [liked, setLiked] = useState(false);
//   const [saved, setSaved] = useState(false);
//   const [showShare, setShowShare] = useState(false);
//   const [showMore, setShowMore] = useState(false);

//   const handlecloseReelBarComment = () => {
//     setReelBarOpen(true);
//   };

//   return (
//     <View style={styles.reelbar}>
//       <View style={styles.menuIcon}>
//         {isSidebarOpen ? (
//           <View style={styles.sidebarContent}>
//             {/* Replace with actual ReelInformation RN component */}
//             <Text style={{ color: 'black' }}>Sidebar Content</Text>
//           </View>
//         ) : (
//           <View style={styles.iconColumn}>
//             {/* Like */}
//             <TouchableOpacity style={styles.iconWrapper} onPress={() => setLiked(!liked)}>
//               <Ionicons
//                 name={liked ? 'heart' : 'heart-outline'}
//                 size={30}
//                 color={liked ? 'red' : 'black'}
//               />
//               <Text style={styles.tooltip}>Love</Text>
//             </TouchableOpacity>

//             {/* Comment */}
//             <TouchableOpacity style={styles.iconWrapper} onPress={handlecloseReelBarComment}>
//               <Ionicons name="chatbubble-outline" size={30} color="black" />
//               <Text style={styles.tooltip}>Comment</Text>
//             </TouchableOpacity>

//             {/* Share */}
//             <TouchableOpacity style={styles.iconWrapper} onPress={() => setShowShare(true)}>
//               <Ionicons name="paper-plane-outline" size={30} color="black" />
//               <Text style={styles.tooltip}>Share</Text>
//             </TouchableOpacity>

//             {/* Save */}
//             <TouchableOpacity style={styles.iconWrapper} onPress={() => setSaved(!saved)}>
//               <FontAwesome
//                 name={saved ? 'bookmark' : 'bookmark-o'}
//                 size={28}
//                 color="black"
//               />
//               <Text style={styles.tooltip}>Save</Text>
//             </TouchableOpacity>

//             {/* More */}
//             <TouchableOpacity style={styles.iconWrapper} onPress={() => setShowMore(true)}>
//               <Entypo name="dots-three-horizontal" size={28} color="black" />
//               <Text style={styles.tooltip}>More</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </View>

//       {/* Share Popup */}
//       <Modal visible={showShare} transparent={true} animationType="slide">
//         <View style={styles.modalBox}>
//           <Text>Share Options Here</Text>
//           <TouchableOpacity onPress={() => setShowShare(false)}>
//             <Text style={{ color: 'blue' }}>Close</Text>
//           </TouchableOpacity>
//         </View>
//       </Modal>

//       {/* More Options Popup */}
//       <Modal visible={showMore} transparent={true} animationType="slide">
//         <View style={styles.modalBox}>
//           <Text>More Options Here</Text>
//           <TouchableOpacity onPress={() => setShowMore(false)}>
//             <Text style={{ color: 'blue' }}>Close</Text>
//           </TouchableOpacity>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   reelbar: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   menuIcon: {
//     height: 500,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   iconColumn: {
//     flexDirection: 'column',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 20,
//   },
//   iconWrapper: {
//     alignItems: 'center',
//     marginVertical: 15,
//   },
//   tooltip: {
//     fontSize: 12,
//     color: 'black',
//     marginTop: 5,
//   },
//   sidebarContent: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalBox: {
//     flex: 1,
//     backgroundColor: '#fff',
//     margin: 40,
//     borderRadius: 10,
//     padding: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });
