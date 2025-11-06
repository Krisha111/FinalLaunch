// src/screens/ChosenListScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getSocket } from '../../services/socketService';

export default function ChosenListScreen({onNavigateToProfile}) {
  const route = useRoute();
  const navigation = useNavigation();
  const { userId } = route.params || {};

  const [chosenList, setChosenList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Socket listener for real-time updates
  useEffect(() => {
    const socket = getSocket();

    const handleChosenAccepted = () => {
      console.log('🔄 Chosen accepted, refreshing list...');
      if (userId) fetchChosenList();
    };

    socket.on('chosen_accepted', handleChosenAccepted);

    return () => {
      socket.off('chosen_accepted', handleChosenAccepted);
    };
  }, [userId]);

  // ✅ Initial fetch
  useEffect(() => {
    if (userId) fetchChosenList();
  }, [userId]);

  // ✅ Fetch chosen list
  const fetchChosenList = async () => {
  try {
    const token = await AsyncStorage.getItem('token');

    const response = await axios.get(
      `https://finallaunchbackend.onrender.com/api/profileInformation/${userId}/chosen`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const chosenUsers = response.data || [];

    if (chosenUsers.length === 0) {
      setChosenList([]);
      setError(null);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    console.log('📋 Chosen users:', chosenUsers.map(u => ({ id: u._id, name: u.name })));

    // ✅ Fetch BOTH sent AND received accepted requests
    const [sentResponse, receivedResponse] = await Promise.all([
      axios.get(
        'https://finallaunchbackend.onrender.com/api/requests/sent',
        { headers: { Authorization: `Bearer ${token}` } }
      ),
      axios.get(
        'https://finallaunchbackend.onrender.com/api/requests/received-accepted',
        { headers: { Authorization: `Bearer ${token}` } }
      )
    ]);

    console.log('📤 Sent requests:', sentResponse.data.requests?.length);
    console.log('📥 Received requests:', receivedResponse.data.requests?.length);

    const requestMap = {};

    // ✅ Map requests YOU sent (you are sender, they are recipient)
    sentResponse.data.requests?.forEach((req) => {
      if (req.type === 'special_friend' && req.status === 'accepted') {
        console.log('✅ Adding sent request for recipient:', req.recipient._id, {
          hasImage: !!req.image,
          hasCaption: !!req.caption
        });
        requestMap[req.recipient._id] = req;
      }
    });

    // ✅ Map requests THEY sent to you (they are sender, you are recipient)
    receivedResponse.data.requests?.forEach((req) => {
      if (!requestMap[req.sender._id]) {
        console.log('✅ Adding received request from sender:', req.sender._id, {
          hasImage: !!req.image,
          hasCaption: !!req.caption
        });
        requestMap[req.sender._id] = req;
      }
    });

    console.log('🗂️ Request map keys:', Object.keys(requestMap));

    // ✅ Merge chosen users with request data
    const enrichedChosenList = chosenUsers.map((user) => {
      const requestData = requestMap[user._id];
      console.log(`Matching user ${user._id}:`, {
        found: !!requestData,
        hasImage: !!requestData?.image,
        hasCaption: !!requestData?.caption
      });
      
      return {
        ...user,
        requestData: requestData || null,
      };
    });

    console.log("✅ Enriched Chosen List:", JSON.stringify(enrichedChosenList, null, 2));
    setChosenList(enrichedChosenList);
    setError(null);
  } catch (err) {
    console.error('Error fetching chosen list:', err);
    setError(err.message || 'Failed to load chosen list');
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};
  // const fetchChosenList = async () => {
  //   try {
  //     const token = await AsyncStorage.getItem('token');

  //     const response = await axios.get(
  //       `https://finallaunchbackend.onrender.com/api/profileInformation/${userId}/chosen`,
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );

  //     const chosenUsers = response.data || [];

  //     if (chosenUsers.length === 0) {
  //       setChosenList([]);
  //       setError(null);
  //       setLoading(false);
  //       setRefreshing(false);
  //       return;
  //     }

  //     // ✅ Fetch sent requests
  //     const requestsResponse = await axios.get(
  //       'https://finallaunchbackend.onrender.com/api/requests/sent',
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );

  //     // ✅ Map request data
  //     const requestMap = {};
  //     requestsResponse.data.requests?.forEach((req) => {
  //       if (req.type === 'special_friend' && req.status === 'accepted') {
  //         requestMap[req.recipient._id] = req;
  //       }
  //     });

  //     // ✅ Merge chosen users with request data
  //     const enrichedChosenList = chosenUsers.map((user) => ({
  //       ...user,
  //       requestData: requestMap[user._id] || null,
  //     }));
      
 
  //     setChosenList(enrichedChosenList);
  //     {console.log("✅ Enriched Chosen List:", JSON.stringify(enrichedChosenList, null, 2))}

  //     setError(null);
  //   } catch (err) {
  //     console.error('Error fetching chosen list:', err);
  //     setError(err.message || 'Failed to load chosen list');
  //   } finally {
  //     setLoading(false);
  //     setRefreshing(false);
  //   }
  // };

  const onRefresh = () => {
    setRefreshing(true);
    fetchChosenList();
  };

  // ✅ Navigate to request details
  const viewRequestDetails = (requestId) => {
    if (requestId) {
      navigation.navigate('ViewRequestDetails', { requestId });
    }
  };

  // ✅ Navigate to profile
const goToProfile = (userId) => {
  if (onNavigateToProfile) {
    // ✅ Preferred: use the callback provided from MainTabs or RootStack
    onNavigateToProfile(userId);
  } else {
    // ✅ Fallback if this screen is opened standalone (optional)
    navigation.navigate('MainTabs', {
      screen: 'ProfileTab',
      params: { userId },
    });
  }
};



  // ✅ Render chosen friend
  const [unchoosing, setUnchoosing] = useState(null);

const handleUnchose = async (userId) => {
  setUnchoosing(userId);
  try {
    const token = await AsyncStorage.getItem('token');
    await axios.post(
      'https://finallaunchbackend.onrender.com/api/requests/unchose',
      { userId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    Alert.alert('Success', 'Unchosen successfully!');
    fetchChosenList(); // Refresh list
  } catch (err) {
    Alert.alert('Error', 'Failed to unchose');
  } finally {
    setUnchoosing(null);
  }
};
  const renderItem = ({ item }) => {
    const request = item?.requestData;
    const hasRequestData = request && (request.image || request.caption);

    return (
      <View style={styles.card}>
        {/* User Header */}
        <TouchableOpacity
          style={styles.cardHeader}
          onPress={() => goToProfile(item._id)}
          activeOpacity={0.7}
        >
          {item.profileImage ? (
            <Image
              source={{ uri: item.profileImage.replace(/^http:/, 'https:') }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Ionicons name="person" 
              size={30} color="#fff" />
            </View>
          )}
          <View style={styles.headerInfo}>
            <Text style={styles.name}>{item.name || 'User'}</Text>
            <Text style={styles.username}>@{item.username || 'username'}</Text>
          </View>
          <Ionicons name="chevron-forward" 
          size={24} color="#999" />
        </TouchableOpacity>

        {/* ✅ Only show if request data exists */}
        {hasRequestData && (
          <>
            {request.image && (
              <Image
                source={{ uri: request.image }}
                style={styles.requestImage}
                resizeMode="cover"
              />
            )}

            {request.caption && (
              <Text style={styles.caption} numberOfLines={2}>
                {request.caption}
              </Text>
            )}
<TouchableOpacity
  style={styles.unchoseButton}
  onPress={() => handleUnchose(item._id)}
  disabled={unchoosing === item._id}
>
  {unchoosing === item._id ? (
    <ActivityIndicator size="small" color="#fff" />
  ) : (
    <Text style={styles.unchoseText}>Unchose</Text>
  )}
</TouchableOpacity>
            <TouchableOpacity
              style={styles.viewButton}
              onPress={() => viewRequestDetails(request._id)}
            >
              <Text style={styles.viewButtonText}>View Full Request</Text>
              <Ionicons name="arrow-forward" size={16} color="#FF6B6B" />
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  };

  // ✅ Loading
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
       
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.topHeader}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <MaterialCommunityIcons name="arrow-left" size={26} color="#1a1a1a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Chosen Friends</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>Loading Chosen Friends...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ✅ Error
  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.topHeader}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <MaterialCommunityIcons name="arrow-left" size={26} color="#1a1a1a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Chosen Friends</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.centered}>
          <MaterialCommunityIcons name="alert-circle" size={40} color="#ff6b6b" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setLoading(true);
              setError(null);
              fetchChosenList();
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ✅ Main
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content"
       backgroundColor="#fff" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.topHeader}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <MaterialCommunityIcons name="arrow-left" size={26} color="#1a1a1a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Chosen Friends</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Empty State */}
        {chosenList.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-outline" size={60} color="#ccc" />
            <Text style={styles.emptyTitle}>No Chosen Friends Yet</Text>
            <Text style={styles.emptySubtitle}>
              Send special friend requests to build your chosen circle
            </Text>
          </View>
        ) : (
          <FlatList
            data={chosenList}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#FF6B6B"
                colors={['#FF6B6B']}
              />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

// ✅ Styles
const styles = StyleSheet.create({
  safeArea: { 
    

    flex: 1, backgroundColor: '#fff' },
  container: {

    flex: 1, backgroundColor: '#fff' },
  topHeader: {
  
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
  },
  backButton: { padding: 4, width: 40 },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
    flex: 1,
  },
  placeholder: { width: 40 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#666', fontSize: 14 },
  errorText: { marginTop: 10, color: '#ff6b6b', textAlign: 'center' },
  retryButton: {
    marginTop: 15,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: { color: '#fff', fontWeight: '600' },
  listContent: { paddingHorizontal: 16, paddingVertical: 8 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  profileImage: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
  },
  profileImagePlaceholder: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: '#666',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unchoseButton: {
  backgroundColor: '#f44336',
  paddingVertical: 10,
  borderRadius: 8,
  alignItems: 'center',
  marginTop: 10,
},
unchoseText: {
  color: '#fff',
  fontSize: 14,
  fontWeight: '600',
},
  headerInfo: { flex: 1, marginLeft: 12 },
  name: { fontSize: 16, fontWeight: '600', color: '#1a1a1a' },
  username: { fontSize: 14, color: '#777' },
  requestImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  caption: { fontSize: 14, color: '#333', lineHeight: 20, marginBottom: 12 },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 6,
  },
  viewButtonText: { fontSize: 14, fontWeight: '600', color: '#FF6B6B' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginTop: 15 },
  emptySubtitle: { fontSize: 14, color: '#999', textAlign: 'center' },
});
