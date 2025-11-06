import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RequestsScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [token, setToken] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    loadToken();
  }, []);

  const loadToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        fetchRequests(storedToken);
      }
    } catch (err) {
      console.error("Failed to load token:", err);
      setLoading(false);
    }
  };

  const fetchRequests = async (authToken) => {
    try {
      const response = await axios.get(
        "https://finallaunchbackend.onrender.com/api/requests/pending",
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setRequests(response.data || []);
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId, type) => {
    if (!token) return;
    setProcessingId(requestId);

    try {
      await axios.post(
        `https://finallaunchbackend.onrender.com/api/requests/accept`,
        { requestId, type },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      Alert.alert("Success", `${type === 'bond' ? 'Bond' : 'Special friend'} request accepted!`);
      setRequests(prev => prev.filter(req => req._id !== requestId));
    } catch (err) {
      Alert.alert("Error", err.response?.data?.message || "Failed to accept request");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId) => {
    if (!token) return;
    setProcessingId(requestId);

    try {
      await axios.post(
        `https://finallaunchbackend.onrender.com/api/requests/reject`,
        { requestId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setRequests(prev => prev.filter(req => req._id !== requestId));
    } catch (err) {
      Alert.alert("Error", "Failed to reject request");
    } finally {
      setProcessingId(null);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{
          uri: item.sender?.profileImage?.replace(/^http:/, "https:") || "https://via.placeholder.com/100",
        }}
        style={styles.avatar}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{item.sender?.name || "User"}</Text>
        <Text style={styles.requestType}>
          {item.type === 'bond' ? '🤝 Bond Request' : '⭐ Special Friend Request'}
        </Text>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.acceptButton, processingId === item._id && styles.buttonDisabled]}
            onPress={() => handleAccept(item._id, item.type)}
            disabled={processingId === item._id}
          >
            {processingId === item._id ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.acceptText}>Accept</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.rejectButton, processingId === item._id && styles.buttonDisabled]}
            onPress={() => handleReject(item._id)}
            disabled={processingId === item._id}
          >
            <Text style={styles.rejectText}>Decline</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.topHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={26} color="#1a1a1a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Requests</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#63e25e" />
          <Text style={styles.loadingText}>Loading Requests...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        <View style={styles.topHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={26} color="#1a1a1a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Requests</Text>
          <View style={styles.placeholder} />
        </View>

        {requests.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="inbox" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No pending requests</Text>
          </View>
        ) : (
          <FlatList
            data={requests}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  backButton: {
    padding: 4,
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    textAlign: "center",
    flex: 1,
  },
  placeholder: {
    width: 40,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f0f0f0",
  },
  info: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  requestType: {
    fontSize: 13,
    color: "#666",
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  rejectButton: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  acceptText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  rejectText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "600",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyText: {
    textAlign: "center",
    color: "#777",
    fontSize: 15,
    marginTop: 16,
  },
});