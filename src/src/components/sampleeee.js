// src/screens/Sampleeee.js - FULL FIXED VERSION (Admin Scroll & Sync + Scroll Lock + Room Closed Modal)
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Animated,
  FlatList,
  Modal,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { showLocalNotification } from '../../services/Notification/pushNotifications.js';
import { io } from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllReels } from "../../Redux/Slice/Profile/reelNewDrop.js";
import RegularReels from "../../compo/ReelChat/RegularReels.js";
import OnlineUsersSuggestions from "../../compo/ReelChat/OnlineUsersSuggestions.js";
import Icon from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import NotificationBadge from "../../compo/Notification/NotificationBadge.js";
import { getSocket } from '../../services/socketService.js';

const socket = getSocket(); // ✅ Use centralized socket
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function Sampleeee({ onNavigateToProfile, setHideBottomNav }) {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const signUpUserName = useSelector(
    (state) => state.signUpAuth?.user?.username ?? ""
  );
  const userId = useSelector((state) => state.signUpAuth?.user?._id);

  const [username, setUsername] = useState(signUpUserName);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [chatWith, setChatWith] = useState("");
  const [room, setRoom] = useState(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRefs = useRef([]);
  const reelsScrollRef = useRef(null);
  const chatEndRef = useRef(null);
  const [chatVisible, setChatVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const lastSyncedIndex = useRef(0);
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [incomingInviteFrom, setIncomingInviteFrom] = useState(null);
  const currentReel = useSelector(
    (state) => state.reelNewDrop?.reels?.[activeIndex]
  );

  const [roomClosedMessage, setRoomClosedMessage] = useState(null);
// ADD THIS STATE:
const [notificationCount, setNotificationCount] = useState(0);
  const reels = useSelector((state) => state.reelNewDrop.mainPageReels || []);
  const [searchQuery, setSearchQuery] = useState("");
  const filteredUsers = onlineUsers.filter(
    (u) =>
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
      u.username !== username
  );


  // ------------------- FETCH REELS -------------------
  useEffect(() => {
    dispatch(fetchAllReels());
  }, [dispatch]);

  // ------------------- REGISTER USER -------------------
  useEffect(() => {
    if (signUpUserName && userId) {
      socket.emit("register", { username: signUpUserName, userId });
      setUsername(signUpUserName);
    }
  }, [signUpUserName, userId]);

  // ------------------- VIDEO CONTROL -------------------
  const playActiveVideo = (index) => {
    videoRefs.current.forEach((ref, idx) => {
      if (!ref) return;
      try {
        if (idx === index && isPlaying) ref.playAsync?.();
        else ref.pauseAsync?.();
      } catch (e) {
        console.log("Video play/pause error:", e.message);
      }
    });
  };

  // ✅ UPDATED: Navigate to user's profile using onNavigateToProfile callback
  const goToProfile = async (userId) => {
    if (!userId) return;

    // reset local UI state so previous reels don't persist
    setActiveIndex(0);
    videoRefs.current = [];

    // fetch reels for selected user (this will replace existing reels in Redux)
    await dispatch(fetchAllReels(userId));

    // navigate (or call callback) after reels are updated
    if (onNavigateToProfile) onNavigateToProfile(userId);
  };



  useEffect(() => {
    playActiveVideo(activeIndex);
  }, [activeIndex, isPlaying, videoRefs.current]);

  // ------------------- CHAT SOCKET -------------------
  useEffect(() => {
    const handleReceiveMessage = ({ sender, message }) => {
      let parsed = null;
      try {
        const obj = JSON.parse(message);
        if (obj?.type) parsed = obj;
      } catch { }
      setChat((prev) => [...prev, { sender, message, parsed }]);
    };
    socket.on("receive_message", handleReceiveMessage);
    return () => socket.off("receive_message", handleReceiveMessage);
  }, []);

  // ------------------- SOCKET EVENTS -------------------
  useEffect(() => {
    socket.on("active_users", (users) => setOnlineUsers(users));

  //   socket.on("receive_invite", ({ from }) => {
  //     setIncomingInviteFrom(from);
  //     setInviteModalVisible(true);
  //      // Show local notification
  // showLocalNotification(
  //   "ReelChatt Invite",
  //   `${from} wants to watch reels with you!`
  // );
  //   });
    // ✅ ADD THIS INSTEAD - Just update badge count
  socket.on("receive_invite", ({ from }) => {
    setNotificationCount((prev) => prev + 1);
    showLocalNotification(
      "ReelChatt Invite",
      `${from} wants to watch reels with you!`
    );
  });
   socket.on("pending_invites", (invites) => {
    setNotificationCount(invites.length);
  });

    socket.on(
      "invite_accepted",
      ({ by, from, room: newRoom, isAdmin: inviterIsAdmin, currentReelIndex }) => {
        setRoom(newRoom);
        setChatWith(by === username ? from : by);
        setIsAdmin(inviterIsAdmin ?? false);

        if (inviterIsAdmin) {
          lastSyncedIndex.current = activeIndex;
          setTimeout(() => {
            socket.emit("sync_reel_index", { room: newRoom, index: activeIndex });
            socket.emit("reel_play", {
              room: newRoom,
              index: activeIndex,
              isPlaying: true,
            });
          }, 100);
        } else if (currentReelIndex != null) {
          lastSyncedIndex.current = currentReelIndex;
          setActiveIndex(currentReelIndex);
          setIsPlaying(true);
          setTimeout(() => scrollToIndex(currentReelIndex), 50);
        }
      }
    );

    socket.on(
      "joined_room",
      ({ room: newRoom, isAdmin: joinedIsAdmin, currentReelIndex }) => {
        setRoom(newRoom);
        setIsAdmin(joinedIsAdmin ?? false);

        if (!joinedIsAdmin && currentReelIndex != null) {
          lastSyncedIndex.current = currentReelIndex;
          setActiveIndex(currentReelIndex);
          setIsPlaying(true);
          setTimeout(() => scrollToIndex(currentReelIndex), 50);
        }
      }
    );

    socket.on("sync_reel_index", ({ index }) => {
      if (!isAdmin && index !== lastSyncedIndex.current) {
        lastSyncedIndex.current = index;
        setActiveIndex(index);
        setIsPlaying(true);
        setTimeout(() => scrollToIndex(index), 50);
      }
    });

    socket.on("reel_play_state", ({ index, isPlaying: playFlag }) => {
      if (!isAdmin) {
        setActiveIndex(index);
        setIsPlaying(Boolean(playFlag));
        setTimeout(() => scrollToIndex(index), 50);
      }
    });

    // ---------- ADMIN LEFT EVENT ----------
    socket.on("admin_left", ({ adminName }) => {
      if (!isAdmin) {
        setRoomClosedMessage("Admin closed the room");
      } else {
        setRoomClosedMessage("You left the room");
      }

      setTimeout(() => {
        setRoom(null);
        setIsAdmin(false);
        setChatWith("");
        setChat([]);
        setActiveIndex(0);
        setRoomClosedMessage(null);
        navigation.goBack?.();
      }, 1500);
    });

    return () => {
      socket.off("active_users");
      socket.off("receive_invite");
      socket.off("invite_accepted");
      socket.off("joined_room");
      socket.off("sync_reel_index");
      socket.off("reel_play_state");
      socket.off("admin_left");
    };
  }, [isAdmin, username, activeIndex, navigation]);
// ADD THIS TO FETCH NOTIFICATION COUNT ON SCREEN FOCUS:
useFocusEffect(
  React.useCallback(() => {
    if (username) {
      socket.emit("get_pending_invites", { username });
    }
  }, [username])
);
  // ------------------- SCROLL TO INDEX -------------------
  const scrollToIndex = (index) => {
    if (!reelsScrollRef.current || reels.length === 0) return;
    const safeIndex = Math.min(Math.max(0, index), reels.length - 1);
    try {
      reelsScrollRef.current.scrollToIndex({
        index: safeIndex,
        animated: true,
        viewPosition: 0.5,
      });
    } catch {
      setTimeout(() => {
        try {
          reelsScrollRef.current.scrollToIndex({
            index: safeIndex,
            animated: true,
            viewPosition: 0.5,
          });
        } catch (e) {
          console.log("Scroll retry failed:", e.message);
        }
      }, 100);
    }
  };

  // ------------------- AUTO SCROLL NON-ADMINS -------------------
  useEffect(() => {
    if (!isAdmin) scrollToIndex(activeIndex);
  }, [activeIndex, isAdmin]);

  // ------------------- TOGGLE PLAY -------------------
  const handleTogglePlay = (index, newState) => {
    if (!isAdmin) return;
    const playState = Boolean(newState);
    setIsPlaying(playState);
    if (room) {
      socket.emit("reel_play", { room, index, isPlaying: playState });
    }
  };

  // ------------------- VIEWABLE ITEMS -------------------
  // const onViewableItemsChanged = 
  // useRef(({ viewableItems }) => {
  //   if (!viewableItems.length) return;
  //   const newIndex = viewableItems[0].index;
  //   setActiveIndex(newIndex);
  //   setIsPlaying(true);
  //   if (isAdmin && room) {
  //     socket.emit("sync_reel_index", { room, index: newIndex });
  //     socket.emit("reel_play", { room, index: newIndex, isPlaying: true });
  //   }
  // }).current;

  // const viewabilityConfig = useRef({
  //   itemVisiblePercentThreshold: 50,
  //   minimumViewTime: 50,
  // }).current;

  // ------------------- VIEWABLE ITEMS -------------------
  // ------------------- VIEWABLE ITEMS -------------------
  // ------------------- VIEWABLE ITEMS -------------------
  // ------------------- VIEWABLE ITEMS -------------------
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (!viewableItems.length) return;
    const newIndex = viewableItems[0].index;

    // Always update local state
    setActiveIndex(newIndex);
    setIsPlaying(true);
  }).current;

  // ✅ SEPARATE useEffect to handle admin sync when activeIndex changes
  useEffect(() => {
    // Only sync if we're admin, in a room, and index actually changed
    if (isAdmin && room && activeIndex !== lastSyncedIndex.current) {
      lastSyncedIndex.current = activeIndex;

      console.log(`🔄 Admin scrolled to index ${activeIndex}, syncing to room ${room}`);

      // Sync the new index
      socket.emit("sync_reel_index", { room, index: activeIndex });

      // Auto-play the new reel
      socket.emit("reel_play", { room, index: activeIndex, isPlaying: true });
    }
  }, [activeIndex, isAdmin, room]); // ✅ Dependencies ensure we always have current values

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 50,
  }).current;

  // ------------------- INVITE & CHAT -------------------
  const sendInvite = (to) => {
    if (!username) return;
    socket.emit("send_invite", { to, from: username });
  };
  const acceptInvite = () => {
    if (!incomingInviteFrom) return;
    socket.emit("accept_invite", { from: incomingInviteFrom });
    setChatWith(incomingInviteFrom);
    setInviteModalVisible(false);
    setIncomingInviteFrom(null);
  };
  const declineInvite = () => {
    setInviteModalVisible(false);
    setIncomingInviteFrom(null);
  };
  const sendMessage = () => {
    if (message.trim() && room) {
      socket.emit("send_message", {
        room,
        message,
        sender: username,
      });
      setMessage("");
    }
  };
  const sendMediaMessage = ({ type, data, name }) => {
    if (!room) return;
    socket.emit("send_message", {
      room,
      message: JSON.stringify({ type, data, name }),
      sender: username,
    });
  };
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
    });
    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      sendMediaMessage({
        type: "image",
        data: `data:image/jpeg;base64,${asset.base64}`,
        name: asset.fileName || "image.jpg",
      });
    }
  };

  const renderMessageContent = (item) => {
    const { parsed, message } = item;
    if (parsed?.type === "image")
      return (
        <Image
          source={{ uri: parsed.data }}
          style={{ width: 200, height: 200, borderRadius: 8 }}
        />
      );
    return <Text>{message}</Text>;
  };

  const openChat = () => {
    setChatVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  const closeChat = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setChatVisible(false));
  };

  // ------------------- LEAVE ROOM (ADMIN) -------------------
  const handleLeaveRoom = () => {
    setChatVisible(false)
    if (room && isAdmin) socket.emit("admin_left_room",
      { room });
  };

  // ------------------- HIDE BOTTOM NAV -------------------
  useEffect(() => {
    if (setHideBottomNav) setHideBottomNav(!!room);
  }, [room, setHideBottomNav]);

  // ------------------- LOADING -------------------
  if (!username)
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );

  // ------------------- NO ROOM VIEW -------------------
  if (!room) {
    return (
      <>
        <FlatList
          style={{ backgroundColor: "#fff" }}
          data={[]}
          ListHeaderComponent={
            <>
              <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>ReelChatt</Text>
               {/* <View style={styles.notificationBadgeContainer}>
    <NotificationBadge />
  </View>*/}
  <TouchableOpacity
    style={styles.notificationButton}
    onPress={() => navigation.navigate("Notifications")}
  >
    <Icon name="notifications" size={28} color="#000" />
    {notificationCount > 0 && (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>
          {notificationCount > 9 ? "9+" : notificationCount}
        </Text>
      </View>
    )}
  </TouchableOpacity>
              </View>
              <View style={styles.bodyContainer}>
                {/* <Text style={styles.subtitle}>Online Users...</Text> */}

                {/* ----------------------------------------------------------- */}

                <View style={styles.bodyContainer}>
                  <Text style={styles.subtitle}>Online Users...</Text>

                  {/* 🔍 Search Bar */}
                  <View style={styles.searchContainer}>
                    <Icon name="search" size={20} color="#555" style={{ marginRight: 8 }} />
                    <TextInput
                      placeholder="Search users..."
                      placeholderTextColor="#888"
                      style={styles.searchInput}
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                    />
                  </View>

                  {filteredUsers.map((u) => (
                    <View key={u.username} style={styles.userRow}>
                      {u.profileImage ? (
                        <Image source={{ uri: u.profileImage }} style={styles.avatar} />
                      ) : (
                        <Icon style={styles.avatar} name="person-circle" size={80} />
                      )}
                      <View style={styles.userTextContainer}>
                        <Text style={styles.username} numberOfLines={1}>
                          {u.username}
                        </Text>
                        <Text style={styles.bio}>{u.bio || "Bio"}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.inviteButton}
                        onPress={() => sendInvite(u.username)}
                      >
                        <Text style={{ color: "white" }}>Invite</Text>
                      </TouchableOpacity>
                    </View>
                  ))}

                  <Text style={styles.subtitle}>Suggestions...</Text>
                  <OnlineUsersSuggestions goToProfile={goToProfile} />
                </View>


                {/* --------------------------------------------------------------------- */}
                {/* {onlineUsers
                  .filter((u) => u.username !== username)
                  .map((u) => (
                    <View key={u.username} style={styles.userRow}>
                      {u.profileImage ? (
                        <Image
                          source={{ uri: u.profileImage }}
                          style={styles.avatar}
                        />
                      ) : (
                        <Icon
                          style={styles.avatar}
                          name="person-circle"
                          size={80}
                        />
                      )}
                      <View style={styles.userTextContainer}>
                        <Text
                          style={styles.username}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {u.username}
                        </Text>
                        <Text style={styles.bio}>{u.bio || "Bio"}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.inviteButton}
                        onPress={() => sendInvite(u.username)}
                      >
                        <Text style={{ color: "white" }}>Invite</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                <Text style={styles.subtitle}>Suggestions...</Text>
                <OnlineUsersSuggestions goToProfile={goToProfile} /> */}
              </View>
            </>
          }
          keyExtractor={() => "dummy"}
          showsVerticalScrollIndicator={false}
        />

      {/*  <Modal transparent visible={inviteModalVisible} animationType="fade">
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>
                {incomingInviteFrom} invited you to join a reel chat!
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={acceptInvite}
                >
                  <Text style={styles.modalButtonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.declineButton}
                  onPress={declineInvite}
                >
                  <Text style={styles.modalButtonText}>Decline</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>*/}
      </>
    );
  }

  // ------------------- ROOM VIEW -------------------
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* ROOM CLOSED MESSAGE MODAL */}
      <Modal transparent visible={!!roomClosedMessage} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.roomClosedModal}>
            <Text style={{ fontSize: 16, fontWeight: "600", textAlign: "center" }}>
              {roomClosedMessage}
            </Text>
          </View>
        </View>
      </Modal>

      {/* Leave Room Button */}
      {isAdmin && (
        <TouchableOpacity
          style={styles.leaveButton}
          onPress={handleLeaveRoom}
        >
          <Text style={styles.leaveButtonText}>Leave Room</Text>
        </TouchableOpacity>
      )}

      <FlatList
        key={isAdmin ? "admin" : "viewer"}
        ref={reelsScrollRef}
        data={reels}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        scrollEnabled={isAdmin}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        keyExtractor={(item, index) => item._id || index.toString()}
        getItemLayout={(data, index) => ({
          length: SCREEN_HEIGHT,
          offset: SCREEN_HEIGHT * index,
          index,
        })}
        snapToInterval={SCREEN_HEIGHT}
        decelerationRate="fast"
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        windowSize={3}
        removeClippedSubviews={false}
        onLayout={() => playActiveVideo(activeIndex)}
        renderItem={({ item, index }) => (
          <View style={styles.singleReel}>
            <RegularReels
              reel={item}
              index={index}
              activeIndex={activeIndex}
              isPlaying={index === activeIndex && isPlaying}
              onTogglePlay={handleTogglePlay}
              setVideoRef={(ref) => (videoRefs.current[index] = ref)}
              isAdmin={isAdmin}
              socket={socket}
              room={room}
              chat={chat}
              username={username}
              onOpenChat={openChat}
            />
          </View>
        )}
      />

      {!isAdmin && <View style={styles.touchBlocker} />}

      {/* <TouchableOpacity
        // style={[styles.chatButton, 
        //   { zIndex: 30, elevation: 30 }]}
        style={[styles.chatButton]}
        onPress={openChat}
      >
        <Text style={styles.chatButtonText}>💬</Text>
      </TouchableOpacity> */}
     {!chatVisible && (
  <TouchableOpacity
    style={[styles.chatButton, styles.chatButtonAbove]}
    onPress={openChat}
    pointerEvents="auto"
  >
    <Text style={styles.chatButtonText}>💬</Text>
  </TouchableOpacity>
)}



      {chatVisible && (
        <Animated.View
          style={[styles.chatPanel, { transform: [{ translateX: slideAnim }] }]}
        >
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={closeChat}>
              <Icon name="arrow-back" size={24} />
            </TouchableOpacity>
            <View style={styles.chatHeaderContent}>
              <Text numberOfLines={1}
  ellipsizeMode="tail" style={styles.chatTitle}>ReelChatt with {chatWith}</Text>
              <Text style={styles.chatSubtitle}>
                {isAdmin ? "You are the admin" : `${chatWith} is the admin`}
              </Text>
            </View>
          </View>
          <FlatList
            data={chat}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.bubble,
                  item.sender === username ? styles.sent : styles.received,
                ]}
              >
                <Text style={styles.sender}>{item.sender}</Text>
                {renderMessageContent(item)}
              
              </View>
            )}
            contentContainerStyle={{ padding: 10 }}
            ref={chatEndRef}
            onContentSizeChange={() =>
              chatEndRef.current?.scrollToEnd({ animated: true })
            }
          />
          <View style={styles.inputRow}>
            <TouchableOpacity onPress={pickImage}>
              <Icon name="image" size={28} 
              style={{ marginHorizontal: 5 }} />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder="Type a message..."
              onSubmitEditing={sendMessage}
            />
            <TouchableOpacity onPress={sendMessage}>
              <Icon
                name="send"
                size={28}
                color="red"
                style={{ marginHorizontal: 5 }}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </KeyboardAvoidingView>
  );
}

// ------------------- STYLES -------------------
const styles = StyleSheet.create({
  
chatButtonAbove: {
  zIndex: 999,
  elevation: 999, // Android
},

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
notificationBadgeContainer: {
  position: "absolute",
  top: 20,
  right: 20,
},
 notificationButton: {
    position: "absolute",
    right: 20,
    top: 20,
  },
  badge: {
    position: "absolute",
    right: -6,
    top: -3,
    backgroundColor: "#ff4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  headerContainer: {
    backgroundColor: "#fff",
    paddingTop: 20,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    elevation: 3,
    position: "relative", // ADD THIS
  },
  container: { flex: 1, backgroundColor: "#000" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  headerContainer: { backgroundColor: "#fff", paddingTop: 20, paddingBottom: 15, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: "#e0e0e0", elevation: 3 },
  headerTitle: { fontSize: 28, fontWeight: "700", color: "#1a1a1a", textAlign: "center" },
  subtitle: { fontSize: 18, fontWeight: "600", marginTop: 15 },
  userRow: { flexDirection: "row", alignItems: "center", marginVertical: 8 },
  avatar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    width: 80, height: 80, borderRadius: 10
  },
  userTextContainer: { flex: 1, paddingLeft: 10, minWidth: 0 },
  username: { fontSize: 16, fontWeight: "600", flexShrink: 1 },
  bio: { fontSize: 14, color: "gray" },
  inviteButton: { backgroundColor: "green", padding: 8, borderRadius: 10, marginLeft: 10 },
  singleReel: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT },
  bodyContainer: { paddingHorizontal: 15, paddingBottom: 15, width: "100%" },
  chatButton: { position: "absolute", bottom: 20, right: 20, backgroundColor: "red", width: 60, height: 60, borderRadius: 30, alignItems: "center", justifyContent: "center", elevation: 5 },
  chatButtonText: { fontSize: 24, color: "white" },
  chatPanel: { 
    // borderColor:"red",
    // borderWidth:5,
    // paddingVertical:10,
    position: "absolute", 
    top: 0, right: 0, bottom: 0, 
    width: SCREEN_WIDTH, borderLeftWidth: 1,
     borderColor: "#ccc", zIndex: 20, 
     backgroundColor: "#fff"
     },
  chatHeaderContent: 
  { paddingHorizontal: 25,
    paddingVertical:10
   },
  chatHeader: { flexDirection: "row", alignItems: "center", padding: 10, borderBottomWidth: 1, borderColor: "#ccc" },
  chatTitle: { fontSize: 20, fontWeight:450 },
  chatSubtitle: { fontSize: 14, color: "gray" },
  bubble: { padding: 10, borderRadius: 12, marginVertical: 4, maxWidth: "75%" },
  sent: { backgroundColor: "#dcf8c6", alignSelf: "flex-end" },
  received: { backgroundColor: "#f1f0f0", alignSelf: "flex-start" },
  sender: { fontSize: 12, fontWeight: "bold", marginBottom: 4 },
  inputRow: { 
    flexDirection: "row", alignItems: "center", 
    borderTopWidth: 1, borderColor: "#ddd", 
    paddingVertical: 15,
  paddingHorizontal:10
  },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 10, marginHorizontal: 5 },
  modalBackground: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContainer: { backgroundColor: "#fff", padding: 25, borderRadius: 15, width: "80%", alignItems: "center" },
  modalTitle: { fontSize: 18, fontWeight: "600", textAlign: "center", marginBottom: 20 },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
  acceptButton: { backgroundColor: "green", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10, flex: 1, marginRight: 10 },
  declineButton: { backgroundColor: "red", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10, flex: 1 },
  modalButtonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  leaveButton: { position: "absolute", top: Platform.OS === "ios" ? 50 : 40, right: 20, backgroundColor: "red", paddingVertical: 10, paddingHorizontal: 15, borderRadius: 10, zIndex: 35 },
  leaveButtonText: { color: "white", fontWeight: "bold", fontSize: 16 },
  touchBlocker: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "transparent", zIndex: 10 },
  roomClosedModal: { backgroundColor: "#fff", padding: 20, borderRadius: 15, minWidth: 250, alignItems: "center" },
});
