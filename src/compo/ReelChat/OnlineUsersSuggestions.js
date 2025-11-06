// src/components/Explore/OnlineUsersSuggestions.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useSelector } from 'react-redux';

import { Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setSelectedProfileId } from '../../Redux/Slice/Profile/ProfileSlice.js';

const { width } = Dimensions.get('window');

export default function OnlineUsersSuggestions({onNavigateToProfile,goToProfile}) {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [users, setUsers] = useState([]);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestStatus, setRequestStatus] = useState({});
  const [requestLoading, setRequestLoading] = useState({});
const loggedInUserId = useSelector((state) => state.signUpAuth.user?._id);

  // ✅ Send Bond Request Function
  const sendBondRequest = async (recipientId) => {
    if (!token) return;
    
    const hasSentRequest = requestStatus[recipientId];
    
    // ✅ If already sent, cancel it
    if (hasSentRequest === 'bond') {
      setRequestLoading(prev => ({ ...prev, [recipientId]: 'bond' }));
      
      try {
        // Find the request ID from sent requests
        const sentResponse = await axios.get(
          "https://finallaunchbackend.onrender.com/api/requests/sent",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        const request = sentResponse.data.requests?.find(
          req => req.recipient._id === recipientId && req.type === 'bond'
        );
        
        if (request) {
          await axios.post(
            `https://finallaunchbackend.onrender.com/api/requests/cancel`,
            { requestId: request._id },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          Alert.alert("Success", "Bond request cancelled!");
          setRequestStatus(prev => {
            const newStatus = { ...prev };
            delete newStatus[recipientId];
            return newStatus;
          });
        }
      } catch (err) {
        Alert.alert("Error", err.response?.data?.message || "Failed to cancel request");
      } finally {
        setRequestLoading(prev => ({ ...prev, [recipientId]: null }));
      }
      return;
    }
    
    // ✅ Otherwise, send new request
    setRequestLoading(prev => ({ ...prev, [recipientId]: 'bond' }));
    
    try {
      await axios.post(
        `https://finallaunchbackend.onrender.com/api/requests/send-bond`,
        { recipientId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert("Success", "Bond request sent!");
      setRequestStatus(prev => ({ ...prev, [recipientId]: 'bond' }));
    } catch (err) {
      Alert.alert("Error", err.response?.data?.message || "Failed to send bond request");
    } finally {
      setRequestLoading(prev => ({ ...prev, [recipientId]: null }));
    }
  };

  // ✅ Fetch Sent Requests Function
  // ✅ Fetch Sent Requests + Accepted Bonds/Chosen
const fetchSentRequests = async () => {
  if (!token) return;
  
  try {
    const response = await axios.get(
      "https://finallaunchbackend.onrender.com/api/requests/sent",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    // Create a map of recipientId -> request status
    const statusMap = {};
    response.data.requests?.forEach(req => {
      if (req.status === 'pending') {
        statusMap[req.recipient._id] = req.type; // 'bond' or 'special_friend'
      } else if (req.status === 'accepted') {
        statusMap[req.recipient._id] = req.type === 'bond' ? 'bonded' : 'chosen';
      }
    });
    setRequestStatus(statusMap);
  } catch (err) {
    console.error("Error fetching sent requests:", err);
  }
};

// ✅ NEW: Unbond function
const handleUnbond = async (recipientId) => {
  if (!token) return;
  setRequestLoading(prev => ({ ...prev, [recipientId]: 'bond' }));
  
  try {
    await axios.post(
      `https://finallaunchbackend.onrender.com/api/requests/unbond`,
      { userId: recipientId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    Alert.alert("Success", "Unbonded successfully!");
    setRequestStatus(prev => {
      const newStatus = { ...prev };
      delete newStatus[recipientId];
      return newStatus;
    });
  } catch (err) {
    Alert.alert("Error", err.response?.data?.message || "Failed to unbond");
  } finally {
    setRequestLoading(prev => ({ ...prev, [recipientId]: null }));
  }
};

// ✅ NEW: Unchose function
const handleUnchose = async (recipientId) => {
  if (!token) return;
  setRequestLoading(prev => ({ ...prev, [recipientId]: 'special' }));
  
  try {
    await axios.post(
      `https://finallaunchbackend.onrender.com/api/requests/unchose`,
      { userId: recipientId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    Alert.alert("Success", "Unchosen successfully!");
    setRequestStatus(prev => {
      const newStatus = { ...prev };
      delete newStatus[recipientId];
      return newStatus;
    });
  } catch (err) {
    Alert.alert("Error", err.response?.data?.message || "Failed to unchose");
  } finally {
    setRequestLoading(prev => ({ ...prev, [recipientId]: null }));
  }
};
  // const fetchSentRequests = async () => {
  //   if (!token) return;
    
  //   try {
  //     const response = await axios.get(
  //       "https://finallaunchbackend.onrender.com/api/requests/sent",
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );
      
  //     // Create a map of recipientId -> request type
  //     const statusMap = {};
  //     response.data.requests?.forEach(req => {
  //       statusMap[req.recipient._id] = req.type; // 'bond' or 'special_friend'
  //     });
  //     setRequestStatus(statusMap);
  //   } catch (err) {
  //     console.error("Error fetching sent requests:", err);
  //   }
  // };

  // ✅ NEW: Navigate to SendSpecialFriendRequestScreen instead of sending directly
  const navigateToSpecialFriendRequest = (recipientId, recipientName) => {
    const hasSentRequest = requestStatus[recipientId];
    
    // If already sent, cancel it
    if (hasSentRequest === 'special_friend') {
      cancelSpecialFriendRequest(recipientId);
      return;
    }
    
    // Navigate to the request creation screen
    navigation.navigate('SendSpecialFriendRequest', {
      recipientId,
      recipientName
    });
  };

  // ✅ NEW: Function to cancel special friend request
  const cancelSpecialFriendRequest = async (recipientId) => {
    if (!token) return;
    
    setRequestLoading(prev => ({ ...prev, [recipientId]: 'special' }));
    
    try {
      const sentResponse = await axios.get(
        "https://finallaunchbackend.onrender.com/api/requests/sent",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const request = sentResponse.data.requests?.find(
        req => req.recipient._id === recipientId && req.type === 'special_friend'
      );
      
      if (request) {
        await axios.post(
          `https://finallaunchbackend.onrender.com/api/requests/cancel`,
          { requestId: request._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        Alert.alert("Success", "Chosen request cancelled!");
        setRequestStatus(prev => {
          const newStatus = { ...prev };
          delete newStatus[recipientId];
          return newStatus;
        });
      }
    } catch (err) {
      Alert.alert("Error", err.response?.data?.message || "Failed to cancel request");
    } finally {
      setRequestLoading(prev => ({ ...prev, [recipientId]: null }));
    }
  };

  // ✅ Load token from AsyncStorage
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) setToken(storedToken);
      } catch (err) {
        console.error("Failed to load token:", err);
      }
    };
    loadToken();
  }, []);

  // ✅ Fetch users after token is loaded
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get("https://finallaunchbackend.onrender.com/auth/getSignedUp", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!cancelled) {
          setUsers(Array.isArray(res.data) ? res.data : []);
          fetchSentRequests(); // ✅ Fetch sent requests status
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        if (!cancelled) setUsers([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchUsers();

    return () => {
      cancelled = true;
    };
  }, [token]);

  // ✅ Render Item Function
  const renderItem = ({ item }) => {
  const status = requestStatus[item._id];
  const hasSentBond = status === 'bond';
  const hasSentSpecial = status === 'special_friend';
  const isBonded = status === 'bonded';
  const isChosen = status === 'chosen';
  
  return (
    <View style={styles.itemWrapper}>
      <TouchableOpacity
        style={styles.touchableInner}
        onPress={() => goToProfile(item._id)}
        activeOpacity={0.8}
      >
        <View style={styles.userCard}>
          <View style={styles.imageContainer}>
            {item.profileImage ? (
              <Image source={{ uri: item.profileImage }} style={styles.profilePic} />
            ) : (
              <View style={styles.placeholderWrap}>
                <Ionicons name="person" size={40} color="white" />
              </View>
            )}
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.username} numberOfLines={1}>
              {item.username || item.name || "Unknown"}
            </Text>
            {item._id !== loggedInUserId && (
            <View style={styles.buttonContainer}>
              {/* Bond Button */}
              <TouchableOpacity
                style={[
                  styles.requestButton,
                  isBonded ? styles.bondedButton : 
                  hasSentBond ? styles.bondButtonRequested : 
                  styles.bondButton,
                  (hasSentSpecial || isChosen) && styles.buttonDisabled
                ]}
                onPress={() => {
                  if (isBonded) handleUnbond(item._id);
                  else sendBondRequest(item._id);
                }}
                disabled={(hasSentSpecial || isChosen) && !isBonded || !!requestLoading[item._id]}
              >
                {requestLoading[item._id] === 'bond' ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>
                    {isBonded ? 'Unbond' : hasSentBond ? 'Bond Requested' : 'Bond'}
                  </Text>
                )}
              </TouchableOpacity>
              
              {/* Chosen Button */}
              <TouchableOpacity
                style={[
                  styles.requestButton,
                  isChosen ? styles.chosenButton : 
                  hasSentSpecial ? styles.specialButtonRequested : 
                  styles.specialButton,
                  (hasSentBond || isBonded) && styles.buttonDisabled
                ]}
                onPress={() => {
                  if (isChosen) handleUnchose(item._id);
                  else navigateToSpecialFriendRequest(item._id, item.username || item.name);
                }}
                disabled={(hasSentBond || isBonded) && !isChosen || !!requestLoading[item._id]}
              >
                {requestLoading[item._id] === 'special' ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>
                    {isChosen ? 'Unchose' : hasSentSpecial ? 'Chosen Requested' : 'Chosen'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};
  // const renderItem = ({ item }) => {
  //   const hasSentRequest = requestStatus[item._id];
  //   const hasSentBond = hasSentRequest === 'bond';
  //   const hasSentSpecial = hasSentRequest === 'special_friend';
    
  //   return (
  //     <View style={styles.itemWrapper}>
  //       <TouchableOpacity
  //         style={styles.touchableInner}
  //         onPress={() => goToProfile(item._id)}
  //         activeOpacity={0.8}
  //       >
  //         <View style={styles.userCard}>
  //           <View style={styles.imageContainer}>
  //             {item.profileImage ? (
  //               <Image source={{ uri: item.profileImage }} style={styles.profilePic} />
  //             ) : (
  //               <View style={styles.placeholderWrap}>
  //                 <Ionicons name="person" size={40} color="white" />
  //               </View>
  //             )}
  //           </View>
  //           <View style={styles.userInfo}>
  //             <Text style={styles.username} numberOfLines={1}>
  //               {item.username || item.name || "Unknown"}
  //             </Text>
              
  //             <View style={styles.buttonContainer}>
  //               <TouchableOpacity
  //                 style={[
  //                   styles.requestButton,
  //                   hasSentBond ? styles.bondButtonRequested : styles.bondButton,
  //                   hasSentSpecial && styles.buttonDisabled
  //                 ]}
  //                 onPress={() => sendBondRequest(item._id)}
  //                 disabled={hasSentSpecial || !!requestLoading[item._id]}
  //               >
  //                 {requestLoading[item._id] === 'bond' ? (
  //                   <ActivityIndicator size="small" color="#fff" />
  //                 ) : (
  //                   <Text style={styles.buttonText}>
  //                     {hasSentBond ? 'Bond Requested' : 'Bond'}
  //                   </Text>
  //                 )}
  //               </TouchableOpacity>
                
  //               <TouchableOpacity
  //                 style={[
  //                   styles.requestButton,
  //                   hasSentSpecial ? styles.specialButtonRequested : styles.specialButton,
  //                   hasSentBond && styles.buttonDisabled
  //                 ]}
  //                 onPress={() => navigateToSpecialFriendRequest(item._id, item.username || item.name)}
  //                 disabled={hasSentBond || !!requestLoading[item._id]}
  //               >
  //                 {requestLoading[item._id] === 'special' ? (
  //                   <ActivityIndicator size="small" color="#fff" />
  //                 ) : (
  //                   <Text style={styles.buttonText}>
  //                     {hasSentSpecial ? 'Chosen Requested' : 'Chosen'}
  //                   </Text>
  //                 )}
  //               </TouchableOpacity>
  //             </View>
  //           </View>
  //         </View>
  //       </TouchableOpacity>
  //     </View>
  //   );
  // };

  // ✅ Loading State
  if (loading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  // ✅ Empty State
  if (!users || users.length === 0) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyText}>No users found</Text>
      </View>
    );
  }

  // ✅ Main Render
  return (
    <FlatList
      key={"one-column"}
      data={users}
      keyExtractor={(item) => item._id || item.id || Math.random().toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
      numColumns={1}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false} // ✅ disable scrolling inside nested FlatList
    />
  );
}

// ✅ Styles
const styles = StyleSheet.create({
  bondedButton: {
  backgroundColor: '#2e7d32', // Dark green for bonded
},
chosenButton: {
  backgroundColor: '#c62828', // Dark red for chosen
},
  bondButtonRequested: {
    backgroundColor: '#45a049', // Darker green to show it's active
  },
  specialButtonRequested: {
    backgroundColor: '#e85d5d', // Darker red to show it's active
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  requestButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 36,
  },
  bondButton: {
    backgroundColor: '#4CAF50',
  },
  specialButton: {
    backgroundColor: '#FF6B6B',
  },
  buttonDisabled: {
    opacity: 0.6,
    backgroundColor: '#cccccc', // ✅ Grey color for disabled state
  },
  buttonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  container: {
    paddingHorizontal: 10, // horizontal padding for the whole list
    paddingVertical: 8,
  },
  // Each item wrapper takes full width inside contentContainer (so paddingHorizontal is respected)
  itemWrapper: {
    width: '100%',
    alignSelf: 'center',
    marginVertical: 6,
    borderRadius: 12,
    // shadow for iOS
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    // elevation for Android
    elevation: 3,
    backgroundColor: 'transparent',
  },
  // Touchable area to keep ripple/touch consistent
  touchableInner: {
    width: '100%',
    borderRadius: 12,
    overflow: 'visible', // allow shadow from wrapper; inner has overflow hidden to clip children
  },
  // Inner card has the visible border and background.
  // Use 100% width so it matches the wrapper exactly.
  userCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    overflow: 'hidden', // clip children to borderRadius
    padding: 12,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  placeholderWrap: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#666',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  userInfo: {
    flex: 1,
    paddingLeft: 15,
  },
  username: {
    fontWeight: '600',
    fontSize: 16,
    maxWidth: '100%',
    overflow: 'hidden', // ✅ important for ellipsis
    textOverflow: 'ellipsis',
  },
  loadingWrap: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyWrap: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#666',
  },
});