// import React, { useEffect, useState } from "react";
// import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
// import { useSelector } from "react-redux";
// import { getSocket } from "../../services/socketService";
// import Icon from "react-native-vector-icons/Ionicons";
// import { useNavigation } from "@react-navigation/native";

// export default function NotificationBadge() {
//   const navigation = useNavigation();
//   const username = useSelector((state) => state.signUpAuth?.user?.username);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const socket = getSocket(); // ✅ Use centralized socket

//   useEffect(() => {
//     if (!username) return;

//     console.log(`🔔 NotificationBadge: Setting up for ${username}`);

//     // Request pending invites
//     socket.emit("get_pending_invites", { username });

//     // Handle real-time invites
//     const handleReceiveInvite = (inviteData) => {
//       console.log(`📨 NotificationBadge: Received invite from ${inviteData.from}`);
//       setUnreadCount((prev) => prev + 1);
//     };

//     // Handle pending invites response
//     const handlePendingInvites = (invites) => {
//       console.log(`📬 NotificationBadge: Got ${invites.length} pending invites`);
//       setUnreadCount(invites.length);
//     };

//     // Handle invite accepted (from another screen)
//     const handleInviteRejected = () => {
//       setUnreadCount((prev) => Math.max(0, prev - 1));
//     };

//     const handleJoinedRoom = () => {
//       // When user accepts invite, decrement count
//       setUnreadCount((prev) => Math.max(0, prev - 1));
//     };

//     socket.on("receive_invite", handleReceiveInvite);
//     socket.on("pending_invites", handlePendingInvites);
//     socket.on("invite_rejected", handleInviteRejected);
//     socket.on("joined_room", handleJoinedRoom);

//     return () => {
//       socket.off("receive_invite", handleReceiveInvite);
//       socket.off("pending_invites", handlePendingInvites);
//       socket.off("invite_rejected", handleInviteRejected);
//       socket.off("joined_room", handleJoinedRoom);
//     };
//   }, [username]);

//   return (
//     <TouchableOpacity
//       style={styles.container}
//       onPress={() => {
//         navigation.navigate("Notifications");
//       }}
//     >
//       <Icon name="notifications" size={28} color="#000" />
//       {unreadCount > 0 && (
//         <View style={styles.badge}>
//           <Text style={styles.badgeText}>
//             {unreadCount > 9 ? "9+" : unreadCount}
//           </Text>
//         </View>
//       )}
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     position: "relative",
//     padding: 8,
//   },
//   badge: {
//     position: "absolute",
//     top: 4,
//     right: 4,
//     backgroundColor: "#FF3B30",
//     borderRadius: 10,
//     minWidth: 20,
//     height: 20,
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 2,
//     borderColor: "white",
//   },
//   badgeText: {
//     color: "white",
//     fontSize: 11,
//     fontWeight: "700",
//   },
// });