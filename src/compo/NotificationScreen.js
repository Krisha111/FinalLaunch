// ============================================
// 1. CREATE: src/screens/NotificationsScreen.js
// ============================================
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
} from "react-native";
import { useSelector } from "react-redux";
import { getSocket } from "../../services/socketService.js";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const socket = getSocket();

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const username = useSelector((state) => state.signUpAuth?.user?.username);
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (username) {
      socket.emit("get_pending_invites", { username });
    }
  }, [username]);

  useEffect(() => {
    const handlePendingInvites = (invites) => {
      setNotifications(invites);
    };

    const handleNewInvite = (inviteData) => {
      setNotifications((prev) => [inviteData, ...prev]);
    };

    const handleInviteAccepted = () => {
      navigation.navigate("ReelChatt");
    };

    socket.on("pending_invites", handlePendingInvites);
    socket.on("receive_invite", handleNewInvite);
    socket.on("joined_room", handleInviteAccepted);

    return () => {
      socket.off("pending_invites", handlePendingInvites);
      socket.off("receive_invite", handleNewInvite);
      socket.off("joined_room", handleInviteAccepted);
    };
  }, [username, navigation]);

  const onRefresh = () => {
    setRefreshing(true);
    socket.emit("get_pending_invites", { username });
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleAccept = (invite) => {
    socket.emit("accept_invite_from_notification", {
      inviteId: invite.id,
      from: invite.from,
      to: username,
    });
    setNotifications((prev) => prev.filter((n) => n.id !== invite.id));
  };

  const handleReject = (invite) => {
    socket.emit("reject_invite", { inviteId: invite.id, username });
    setNotifications((prev) => prev.filter((n) => n.id !== invite.id));
  };

  const formatTime = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const renderNotification = ({ item }) => (
    <View style={styles.notificationCard}>
      <View style={styles.notificationHeader}>
        <Icon name="videocam" size={24} color="#ff4444" />
        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>ReelChatt Invite</Text>
          <Text style={styles.notificationMessage}>
            <Text style={styles.username}>{item.from}</Text> wants to watch
            reels with you!
          </Text>
          <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => handleAccept(item)}
        >
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rejectButton}
          onPress={() => handleReject(item)}
        >
          <Text style={styles.buttonText}>Decline</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="notifications-off-outline" size={80} color="#ccc" />
            <Text style={styles.emptyText}>No notifications</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: { fontSize: 20, fontWeight: "700" },
  listContent: { padding: 15 },
  notificationCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationHeader: { flexDirection: "row", alignItems: "flex-start" },
  notificationContent: { flex: 1, marginLeft: 12 },
  notificationTitle: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  notificationMessage: { fontSize: 14, color: "#666", marginBottom: 4 },
  username: { fontWeight: "700", color: "#000" },
  timestamp: { fontSize: 12, color: "#999", marginTop: 4 },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 12,
    gap: 10,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  rejectButton: {
    flex: 1,
    backgroundColor: "#f44336",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
  emptyText: { fontSize: 16, color: "#999", marginTop: 10 },
});