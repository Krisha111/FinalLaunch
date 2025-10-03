// src/screens/ChatScreen.js
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default function ChatScreen({ route, navigation }) {
  const { room, chat = [], username } = route.params || {};

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(chat);
  const scrollRef = useRef(null);

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMsg = { sender: username, message };
    setMessages((prev) => [...prev, newMsg]);
    setMessage("");

    // scroll to bottom
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderMessageContent = (item) => {
    return <Text style={styles.msgText}>{item.message}</Text>;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Chat Room: {room}</Text>
      <Text style={styles.subHeader}>You are {username}</Text>

      {/* Chat messages */}
      <ScrollView
        style={styles.chatBox}
        ref={scrollRef}
        onContentSizeChange={() =>
          scrollRef.current?.scrollToEnd({ animated: true })
        }
      >
        {messages.length === 0 ? (
          <Text style={styles.empty}>No messages yet...</Text>
        ) : (
          messages.map((msg, i) => (
            <View
              key={i}
              style={[
                styles.message,
                msg.sender === username ? styles.sent : styles.received,
              ]}
            >
              <Text style={styles.sender}>{msg.sender}</Text>
              {renderMessageContent(msg)}
            </View>
          ))
        )}
      </ScrollView>

      {/* Input Row */}
      <View style={styles.inputRow}>
        <TouchableOpacity>
          <Icon name="mic" size={26} color="black" style={{ marginHorizontal: 5 }} />
        </TouchableOpacity>

        <TouchableOpacity>
          <Icon name="image" size={26} color="black" style={{ marginHorizontal: 5 }} />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          onSubmitEditing={sendMessage}
        />

        <TouchableOpacity onPress={sendMessage}>
          <Icon name="send" size={26} color="red" style={{ marginHorizontal: 5 }} />
        </TouchableOpacity>
      </View>

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>⬅ Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 15 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 5 },
  subHeader: { fontSize: 16, color: "gray", marginBottom: 10 },
  chatBox: { flex: 1 },
  empty: { textAlign: "center", marginTop: 20, color: "gray" },

  message: {
    padding: 10,
    borderRadius: 12,
    marginVertical: 5,
    maxWidth: "75%",
  },
  sent: { backgroundColor: "#dcf8c6", alignSelf: "flex-end" },
  received: { backgroundColor: "#f1f0f0", alignSelf: "flex-start" },
  sender: { fontWeight: "bold", marginBottom: 4, fontSize: 12 },
  msgText: { fontSize: 14 },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 6,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 12,
    marginHorizontal: 5,
  },

  backButton: {
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  backText: { color: "white", fontWeight: "bold" },
});
