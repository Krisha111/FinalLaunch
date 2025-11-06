// ============================================
// src/screens/NotificationsScreen.js - COMPLETE WITH BADGE CLEAR
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
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";
import { getSocket } from "../services/socketService";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useNotifications } from "./Notification/NotificationContext";

const socket = getSocket();

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const username = useSelector((state) => state.signUpAuth?.user?.username);
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { clearBadge, updateBadge, incrementBadge } = useNotifications();
  const [token, setToken] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  // ✅ Fetch token once when screen mounts
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        setToken(storedToken);
      } catch (err) {
        console.error("❌ Error fetching token:", err);
      }
    };
    loadToken();
  }, []);

  useEffect(() => {
    if (username) {
      socket.emit("get_pending_invites", { username });
    }
  }, [username]);

  // ✅ Helper to fetch latest bond/friend requests
  const fetchRequests = async (authToken) => {
    if (!authToken) return;

    try {
      const response = await fetch("https://finallaunchbackend.onrender.com/api/requests/pending", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        console.error("❌ Failed to fetch requests:", response.status);
        return;
      }

      const data = await response.json();
      // console.log("📬 Latest requests:", data);

      // ✅ FIX: Merge requests with existing invites
      setNotifications((prev) => {
        // Keep only ReelChatt invites (those with .from property)
        const invites = prev.filter(item => item.from && !item.sender);

        // Map request data to notification format
        const requestNotifications = data.map(req => ({
          ...req,
          notificationType: 'request',
          // Add an id field for FlatList key
          id: req._id
        }));

        console.log("✅ Merged notifications:", [...requestNotifications, ...invites]);
        return [...requestNotifications, ...invites];
      });
    } catch (error) {
      console.error("⚠️ Error fetching requests:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      console.log("🔔 Notification screen focused - clearing badge");

      // ✅ Clear badge IMMEDIATELY when user views the screen
      clearBadge();

      // Refresh pending invites
      if (username) {
        socket.emit("get_pending_invites", { username });
      }

      // Fetch bond/special friend requests
      if (token) {
        fetchRequests(token);
      }

      return () => {
        console.log("🔔 Notification screen unfocused - keeping badge at 0");
        // ✅ Keep badge at 0 when leaving (this is the key fix)
        clearBadge();
      };
    }, [username, token, clearBadge])
  );

  // ✅ Handle new requests via socket
  // ✅ Handle new requests via socket
  useEffect(() => {
    const socket = getSocket();

    const handleNewRequest = (requestData) => {
      console.log("📨 New request in NotificationsScreen:", requestData);

      // Check if duplicate
      setNotifications((prev) => {
        const isDuplicate = prev.some(n => n._id === requestData.requestId || n.id === requestData.requestId);
        if (isDuplicate) {
          console.log("⚠️ Duplicate request detected, ignoring");
          return prev;
        }

        // Add to notifications list (it will be fetched properly on refresh)
        return prev;
      });

      // Refresh requests to get full data
      if (token) {
        fetchRequests(token);
      }

      // ✅ INCREMENT BADGE if not on notification screen
      const currentRoute = navigation.getState()?.routes[navigation.getState()?.index]?.name;
      if (currentRoute !== 'Notifications') {
        incrementBadge();
      }
    };

    socket.on('new_request', handleNewRequest);

    return () => {
      socket.off('new_request', handleNewRequest);
    };
  }, [token, incrementBadge, navigation]);
  // useEffect(() => {
  //   const socket = getSocket();

  //   const handleNewRequest = (requestData) => {
  //     console.log("📨 New request in NotificationsScreen:", requestData);

  //     // Refresh requests
  //     if (token) {
  //       fetchRequests(token);
  //     }
  //   };
  //   const currentRoute = navigation.getState()?.routes[navigation.getState()?.index]?.name;
  //   if (currentRoute !== 'Notifications') {
  //     incrementBadge();
  //   }
  //   socket.on('new_request', handleNewRequest);

  //   return () => {
  //     socket.off('new_request', handleNewRequest);
  //   };
  // }, [token]);

  // ✅ Handle pending invites with badge sync
  useEffect(() => {
   const handlePendingInvites = (invites) => {
  console.log("📬 Received pending invites:", invites.length);

  setNotifications((prev) => {
    // Keep only request notifications
    const requests = prev.filter(item => item.sender);

    // Map invites to notification format
    const inviteNotifications = invites.map(inv => ({
      ...inv,
      notificationType: 'invite'
    }));

    return [...requests, ...inviteNotifications];
  });
  
  // ✅ REMOVE ALL BADGE UPDATE LOGIC
  // Badge is managed by:
  // - incrementBadge() when new notifications arrive
  // - clearBadge() when user views notification screen (useFocusEffect)
};
    const handleNewInvite = (inviteData) => {
      console.log("📨 New invite received in NotificationScreen:", inviteData);

      // ✅ Check for duplicates before adding
      setNotifications((prev) => {
        const isDuplicate = prev.some(n => n.id === inviteData.id);
        if (isDuplicate) {
          console.log("⚠️ Duplicate invite detected, ignoring");
          return prev;
        }
        return [{ ...inviteData, notificationType: 'invite' }, ...prev];
      });

      // ✅ Only increment if not on notification screen
      const currentRoute = navigation.getState()?.routes[navigation.getState()?.index]?.name;
      if (currentRoute !== 'Notifications') {
        incrementBadge();
      }
    };

    const handleInviteAccepted = () => {
      console.log("✅ Invite accepted, navigating to ReelChatt");
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
  }, [username, navigation, updateBadge, incrementBadge, clearBadge, notifications]);

  const onRefresh = () => {
    console.log("🔄 Refreshing notifications...");
    setRefreshing(true);
    socket.emit("get_pending_invites", { username });
    if (token) {
      fetchRequests(token);
    }
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleAccept = (invite) => {
    console.log("✅ Accepting invite from:", invite.from);
    socket.emit("accept_invite_from_notification", {
      inviteId: invite.id,
      from: invite.from,
      to: username,
    });

    // Remove from local state
    setNotifications((prev) => prev.filter((n) => n.id !== invite.id));

    // ✅ Update badge immediately after accepting
    // clearBadge();

    // Fetch updated count
    // setTimeout(() => {
    //   socket.emit("get_pending_invites", { username });
    // }, 100);
  };

  const handleReject = (invite) => {
    console.log("❌ Rejecting invite from:", invite.from);
    socket.emit("reject_invite", { inviteId: invite.id, username });

    // Remove from local state
    setNotifications((prev) => prev.filter((n) => n.id !== invite.id));

    // ✅ Update badge immediately after rejecting
    // clearBadge();

    // Fetch updated count
    // setTimeout(() => {
    //   socket.emit("get_pending_invites", { username });
    // }, 100);
  };

  const handleAcceptRequest = async (requestId, type) => {
    if (!token) return;
    setProcessingId(requestId);

    try {
      await fetch(`https://finallaunchbackend.onrender.com/api/requests/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ requestId, type }),
      });

      setNotifications(prev => prev.filter(n => n._id !== requestId));
      // clearBadge();
    } catch (err) {
      console.error("Error accepting request:", err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectRequest = async (requestId) => {
    if (!token) return;
    setProcessingId(requestId);

    try {
      await fetch(`https://finallaunchbackend.onrender.com/api/requests/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ requestId }),
      });

      setNotifications(prev => prev.filter(n => n._id !== requestId));
      // clearBadge();
    } catch (err) {
      console.error("Error rejecting request:", err);
    } finally {
      setProcessingId(null);
    }
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

  const renderNotification = ({ item }) => {
    // ✅ Check if it's a bond/special friend request
    if (item.notificationType === 'request' || item.sender) {
      return (
        <View style={styles.notificationCard}>
          <View style={styles.notificationHeader}>
            <Image
              source={{
                uri: item.sender?.profileImage?.replace(/^http:/, "https:") || "https://via.placeholder.com/50",
              }}
              style={styles.avatar}
            />
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>
                {item.type === 'bond' ? '🤝 Bond Request' : '⭐ Special Friend Request'}
              </Text>
              <Text style={styles.notificationMessage}>
                <Text style={styles.username}>{item.sender?.name || item.sender?.username}</Text>
                {' '}wants to be your {item.type === 'bond' ? 'bond' : 'special friend'}
              </Text>
              <Text style={styles.timestamp}>{formatTime(new Date(item.createdAt).getTime())}</Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.acceptButton, processingId === item._id && styles.buttonDisabled]}
              onPress={() => handleAcceptRequest(item._id, item.type)}
              disabled={processingId === item._id}
            >
              {processingId === item._id ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Accept</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.rejectButton, processingId === item._id && styles.buttonDisabled]}
              onPress={() => handleRejectRequest(item._id)}
              disabled={processingId === item._id}
            >
              <Text style={styles.buttonText}>Decline</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    // ✅ ReelChatt invite
    return (
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
  };

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
        keyExtractor={(item) => item.id || item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing}
            onRefresh={onRefresh} />
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
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
  },
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
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
  emptyText: { fontSize: 16, color: "#999", marginTop: 10 },
});