// Sampleeee.js (React Native)
// NOTE: This file expects your RegularReels component to accept these props:
//   - activeIndex (number)
//   - isPlaying (boolean)    // global play/pause for the room
//   - onTogglePlay(index, newState) // callback when admin toggles play
//   - isAdmin, socket, room, chat, username, onOpenChat
//
// RegularReels should use react-native-video's `paused` prop like:
//   paused={!(index === activeIndex && isPlaying)}
//
// Also ensure your server broadcasts play state with io.to(room).emit(...)

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Animated,
} from "react-native";
import { io } from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllReels } from "../Redux/Slices/Profile/reelNewDrop.js";
import RegularReels from "../../compo/ReelChat/RegularReels.js";
import OnlineUsersSuggestions from "./SubComponents/ReelChat/OnlineUsersSuggestions.js";
import Icon from "react-native-vector-icons/Ionicons";
import { Audio } from "expo-av";
import * as ImagePicker from "expo-image-picker";

const socket = io("http://192.168.2.16:8000");
const { width, height } = Dimensions.get("window");

export default function Sampleeee() {
  const dispatch = useDispatch();

  const signUpUserName = useSelector(
    (state) => state.signUpAuth?.user?.username ?? ""
  );
  const userId = useSelector((state) => state.signUpAuth?.user?._id);
  const profileImage = useSelector(
    (state) => state.profileInformation?.profileImage
  );

  const [whoIsAdmin, setWhoIsAdmin] = useState("");
  const [username, setUsername] = useState(signUpUserName);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [chatWith, setChatWith] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Single source-of-truth for play/pause state in this room
  const [isPlaying, setIsPlaying] = useState(true); // default: play on load

  // refs
  const videoRefs = useRef([]); // optional: store refs if you want to seek
  const reelsScrollRef = useRef(null);
  const chatEndRef = useRef(null);
  const recordingRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(width)).current;

  const reels = useSelector((state) => state.reelNewDrop.mainPageReels || []);

  // Fetch reels on mount
  useEffect(() => {
    dispatch(fetchAllReels());
  }, [dispatch]);

  // Register socket user
  useEffect(() => {
    if (signUpUserName && userId) {
      socket.emit("register", { username: signUpUserName, userId });
      setUsername(signUpUserName);
    }
  }, [signUpUserName, userId]);

  // Receive chat messages
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

  // Handle socket events (index & play state syncing + others)
  useEffect(() => {
    // Active users list
    socket.on("active_users", (users) => setOnlineUsers(users));

    // Invite flow
    socket.on("receive_invite", ({ from }) => {
      // In React Native you probably want Alert.alert; keeping confirm as in your original:
      if (typeof confirm === "function") {
        if (confirm(`Accept chat request from ${from}?`)) {
          socket.emit("accept_invite", { from });
          setChatWith(from);
          setWhoIsAdmin(from);
        }
      } else {
        // fallback auto-accept (or implement RN Alert)
        socket.emit("accept_invite", { from });
        setChatWith(from);
        setWhoIsAdmin(from);
      }
    });

    socket.on("invite_accepted", ({ by, from, room: newRoom, isAdmin: inviterIsAdmin }) => {
      setRoom(newRoom);
      setChatWith(by === username ? from : by);
      // server tells inviter whether they are admin
      setIsAdmin(inviterIsAdmin ?? false);
    });

    socket.on("joined_room", ({ room: newRoom, isAdmin: joinedIsAdmin }) => {
      setRoom(newRoom);
      setIsAdmin(joinedIsAdmin ?? false);
    });

    // admin changed index -> viewers should scroll to it (server also typically emits this)
    socket.on("sync_reel_index", (index) => {
      setActiveIndex(index);
      // make viewer scroll (for non-admin viewers)
      if (!isAdmin && reelsScrollRef.current) {
        try {
          reelsScrollRef.current.scrollTo({ y: index * height, animated: true });
        } catch (err) {
          // ignore if not supported on platform
          console.log("scrollTo error:", err?.message || err);
        }
      }
    });

    // broadcasted play/pause state (server should send to everyone using io.to(room).emit)
    socket.on("reel_play_state", ({ index, isPlaying: playFlag }) => {
      // update remote authoritative state
      setActiveIndex((prevIdx) => {
        // if admin emitted play for a different index, it's OK to update activeIndex
        if (index != null && index !== prevIdx) {
          // scroll non-admins to new index
          if (!isAdmin && reelsScrollRef.current) {
            try {
              reelsScrollRef.current.scrollTo({ y: index * height, animated: true });
            } catch (err) { }
          }
          return index;
        }
        return prevIdx;
      });

      // update playing flag for everyone (single source of truth)
      setIsPlaying(Boolean(playFlag));
    });

    return () => {
      socket.off("active_users");
      socket.off("receive_invite");
      socket.off("invite_accepted");
      socket.off("joined_room");
      socket.off("sync_reel_index");
      socket.off("reel_play_state");
    };
  }, [isAdmin, username]);

  // When a user (admin only) toggles play/pause in the UI,
  // parent handles the single source of truth and emits to server.
  const handleTogglePlay = (index, newState) => {
    // update local state for instant feedback
    setIsPlaying(Boolean(newState));

    // emit authoritative play/pause to server — server should broadcast to everyone
    if (room) {
      socket.emit("reel_play", { room, index, isPlaying: Boolean(newState) });
    }
  };

  // When admin scrolls reels -> change index and ensure playback state is broadcast
  const onScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const newIndex = Math.round(offsetY / height);
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
      if (isAdmin && room) {
        // admin changes index: broadcast index change and ensure everyone plays that reel
        socket.emit("change_reel_index", { room, index: newIndex });
        // set playing true when admin scrolls to a new reel (optional: keep same playing state if you prefer)
        setIsPlaying(true);
        socket.emit("reel_play", { room, index: newIndex, isPlaying: true });
      }
    }
  };

  const sendInvite = (to) => {
    if (!username) return;
    socket.emit("send_invite", { to, from: username });
  };

  const sendMessage = () => {
    if (message.trim() && room) {
      socket.emit("send_message", { room, message, sender: username });
      setMessage("");
    }
  };

  const sendMediaMessage = ({ type, data, name }) => {
    if (!room) return;
    const payload = JSON.stringify({ type, data, name });
    socket.emit("send_message", { room, message: payload, sender: username });
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

  const handleRecording = async () => {
    if (!isRecording) {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) return;
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await recording.startAsync();
      recordingRef.current = recording;
      setIsRecording(true);
    } else {
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      sendMediaMessage({ type: "audio", data: uri, name: "recording.m4a" });
      setIsRecording(false);
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
    if (parsed?.type === "audio") return <Text>[Audio message]</Text>;
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
      toValue: width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setChatVisible(false));
  };

  if (!username) return <Text>Loading...</Text>;

  if (!room) {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>ReelChatt</Text>
        <Text style={styles.subtitle}>Online Users...</Text>
        {onlineUsers
          .filter((u) => u.username !== username)
          .map((u) => (
            <View key={u.username} style={styles.userRow}>
              {u.profileImage ? (
                <Image source={{ uri: u.profileImage }} style={styles.avatar} />
              ) : (
                <Icon name="person-circle" size={40} />
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.username}>{u.username}</Text>
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
        <OnlineUsersSuggestions />
      </ScrollView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={{ flexDirection: "row", flex: 1 }}>
        <View style={{ flex: 1 }}>
          {/* Admin only can scroll & control; viewers are passive */}
          <View style={{ flex: 1 }} pointerEvents={isAdmin ? "auto" : "none"}>
            <ScrollView
              ref={reelsScrollRef}
              pagingEnabled
              onScroll={isAdmin ? onScroll : undefined}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
              style={styles.reelsWrapper}
              scrollEnabled={isAdmin}
            >
              {reels.map((item, idx) => (
                <View key={item._id || idx} style={styles.singleReel}>
                  <RegularReels
                    reel={item}
                    index={idx}
                    activeIndex={activeIndex}
                    isPlaying={isPlaying} // <-- SINGLE SOURCE OF TRUTH
                    onTogglePlay={(index, newState) => handleTogglePlay(index, newState)}
                    setVideoRef={(ref) => (videoRefs.current[idx] = ref)}
                    isAdmin={isAdmin}
                    socket={socket}
                    room={room}
                    chat={chat}
                    username={username}
                    onOpenChat={openChat}
                  />
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Floating Chat Button */}
          <TouchableOpacity style={styles.chatButton} onPress={openChat}>
            <Text style={styles.chatButtonText}>💬</Text>
          </TouchableOpacity>
        </View>

        {chatVisible && (
          <Animated.View
            style={[styles.chatPanel, { transform: [{ translateX: slideAnim }] }]}
          >
            <View style={styles.chatHeader}>
                <TouchableOpacity onPress={closeChat}>
                <Icon name="arrow-back" size={24} />
              </TouchableOpacity>
              <View style={styles.chatHeaderKrishaa}>
                <Text style={styles.chatTitle}>ReelChatt with {chatWith}</Text>
                <Text style={{ fontSize: 14, color: "gray" }}>
                  {isAdmin ? "You are the admin" : `${chatWith} is the admin`}
                </Text>
              </View>
            
            </View>

            <ScrollView
              style={styles.messages}
              ref={chatEndRef}
              onContentSizeChange={() =>
                chatEndRef.current?.scrollToEnd({ animated: true })
              }
            >
              {chat.map((c, i) => (
                <View
                  key={i}
                  style={[
                    styles.bubble,
                    c.sender === username ? styles.sent : styles.received,
                  ]}
                >
                  <Text style={styles.sender}>{c.sender}</Text>
                  {renderMessageContent(c)}
                </View>
              ))}
            </ScrollView>

            <View style={styles.inputRow}>
              <TouchableOpacity onPress={handleRecording}>
                <Icon
                  name="mic"
                  size={28}
                  color={isRecording ? "red" : "black"}
                  style={{ marginHorizontal: 5 }}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={pickImage}>
                <Icon name="image" size={28} style={{ marginHorizontal: 5 }} />
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
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  subtitle: { fontSize: 18, fontWeight: "600", marginTop: 15 },
  userRow: { flexDirection: "row", alignItems: "center", marginVertical: 8 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  username: { fontSize: 16, fontWeight: "600" },
  bio: { fontSize: 14, color: "gray" },
  inviteButton: { backgroundColor: "green", padding: 8, borderRadius: 10 },

  singleReel: {
    height: height - 60,
    justifyContent: "center",
    alignItems: "center",
  },
  reelsWrapper: { flex: 1, height: "100%" },

  chatButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "red",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  chatButtonText: { fontSize: 24, color: "white" },

  chatPanel: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: width,
    backgroundColor: "#fff",
    borderLeftWidth: 1,
    borderColor: "#ccc",
    zIndex: 20,
  },
  chatHeaderKrishaa:{
borderColor:"red",
borderRadius:5,
paddingLeft:25
  },
  chatHeader: {
    flexDirection: "row",
   
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  chatTitle: { fontSize: 20, fontWeight: "bold" },
  messages: { flex: 1, padding: 10 },
  bubble: {
    padding: 10,
    borderRadius: 12,
    marginVertical: 4,
    maxWidth: "75%",
  },
  sent: { backgroundColor: "#dcf8c6", alignSelf: "flex-end" },
  received: { backgroundColor: "#f1f0f0", alignSelf: "flex-start" },
  sender: { fontSize: 12, fontWeight: "bold", marginBottom: 4 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical:10,
    marginHorizontal: 5,
  },
});
