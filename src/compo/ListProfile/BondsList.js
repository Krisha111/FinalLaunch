// ✅ src/screens/BondsList.js
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
} from "react-native";
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "axios";
import { useRoute, useNavigation } from "@react-navigation/native";
import { getSocket } from "../../services/socketService";
export default function BondsList() {
  const route = useRoute();
  const navigation = useNavigation();
  const { userId } = route.params || {};

  const [loading, setLoading] = useState(true);
  const [bondsList, setBondsList] = useState([]);
  const [error, setError] = useState(null);
useEffect(() => {
  const socket = getSocket();
  
  const handleBondAccepted = () => {
    console.log("🔄 Bond accepted, refreshing list...");
    if (userId) {
      fetchBonds();
    }
  };
  
  socket.on('bond_accepted', handleBondAccepted);
  
  return () => {
    socket.off('bond_accepted', handleBondAccepted);
  };
}, [userId]);

const fetchBonds = async () => {
      try {
        // Make sure this endpoint exists on your backend:
        // GET /api/profileInformation/:userId/bonds
        const response = await axios.get(
          `https://finallaunchbackend.onrender.com/api/profileInformation/${userId}/bonds`
        );
        setBondsList(response.data || []);
      } catch (err) {
        // Capture axios error message (404, network, etc.)
        setError(
          err?.response?.data?.message || err.message || "Failed to load bonds"
        );
      } finally {
        setLoading(false);
      }
    };
  useEffect(() => {
    

    if (userId) fetchBonds();
  }, [userId]);
  const [unbonding, setUnbonding] = useState(null);

const handleUnbond = async (userId) => {
  setUnbonding(userId);
  try {
    const token = await AsyncStorage.getItem('token');
    await axios.post(
      'https://finallaunchbackend.onrender.com/api/requests/unbond',
      { userId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    Alert.alert('Success', 'Unbonded successfully!');
    fetchBonds(); // Refresh list
  } catch (err) {
    Alert.alert('Error', 'Failed to unbond');
  } finally {
    setUnbonding(null);
  }
};

const renderItem = ({ item }) => (
  <View style={styles.card}>
    <TouchableOpacity
      style={styles.userInfo}
      onPress={() => navigation.navigate("Profile", { userId: item._id })}
    >
      <Image
        source={{
          uri: item.profileImage?.replace(/^http:/, "https:") || "https://via.placeholder.com/100",
        }}
        style={styles.avatar}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name || "User"}</Text>
        <Text style={styles.username}>@{item.username || "username"}</Text>
      </View>
    </TouchableOpacity>
    
    <TouchableOpacity
      style={styles.unbondButton}
      onPress={() => handleUnbond(item._id)}
      disabled={unbonding === item._id}
    >
      {unbonding === item._id ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text style={styles.unbondText}>Unbond</Text>
      )}
    </TouchableOpacity>
  </View>
);

  // const renderItem = ({ item }) => (
  //   <TouchableOpacity
  //     style={styles.card}
  //     onPress={() => navigation.navigate("Profile", { userId: item._id })}
  //   >
  //     <Image
  //       source={{
  //         uri: item.profileImage?.replace(/^http:/, "https:") || "https://via.placeholder.com/100",
  //       }}
  //       style={styles.avatar}
  //     />
  //     <View style={styles.info}>
  //       <Text style={styles.name}>{item.name || "User"}</Text>
  //       <Text style={styles.username}>@{item.username || "username"}</Text>
  //     </View>
  //   </TouchableOpacity>
  // );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.topHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={26} color="#1a1a1a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bonds</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#63e25e" />
          <Text style={styles.loadingText}>Loading Bonds...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.topHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={26} color="#1a1a1a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bonds</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.centered}>
          <MaterialCommunityIcons name="alert-circle" size={40} color="#ff6b6b" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        {/* Top Header with Back Arrow */}
        <View style={styles.topHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={26} color="#1a1a1a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bonds</Text>
          <View style={styles.placeholder} />
        </View>

        {/* List Content */}
        {bondsList.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No bonds yet.</Text>
          </View>
        ) : (
          <FlatList
            data={bondsList}
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
  card: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between", // ✅ Add this
  backgroundColor: "#fff",
  paddingVertical: 12,
  paddingHorizontal: 8,
  borderBottomWidth: 0.5,
  borderBottomColor: "#efefef",
},
userInfo: {
  flexDirection: "row",
  alignItems: "center",
  flex: 1,
},
unbondButton: {
  backgroundColor: '#f44336',
  paddingHorizontal: 16,
  paddingVertical: 8,
  borderRadius: 6,
},
unbondText: {
  color: '#fff',
  fontSize: 14,
  fontWeight: '600',
},
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
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#efefef",
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: "#f0f0f0",
  },
  info: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  username: {
    fontSize: 14,
    color: "#777",
    marginTop: 2,
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
  errorText: {
    marginTop: 10,
    color: "#ff6b6b",
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
  },
});
