// src/screens/ViewRequestDetailsScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ViewRequestDetailsScreen({ route, navigation }) {
  const { requestId } = route.params;
  
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequestDetails();
  }, []);

  const fetchRequestDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      const response = await axios.get(
        `https://finallaunchbackend.onrender.com/api/requests/${requestId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setRequest(response.data.request);
    } catch (err) {
      console.error('Error fetching request:', err);
      Alert.alert('Error', 'Failed to load request details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  if (!request) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Request not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chosen Request</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Sender Info */}
        <View style={styles.senderInfo}>
          {request.sender.profileImage ? (
            <Image
              source={{ uri: request.sender.profileImage }}
              style={styles.senderImage}
            />
          ) : (
            <View style={styles.senderImagePlaceholder}>
              <Ionicons name="person" size={30} color="#fff" />
            </View>
          )}
          <View style={styles.senderDetails}>
            <Text style={styles.senderLabel}>From:</Text>
            <Text style={styles.senderName}>
              {request.sender.name || request.sender.username}
            </Text>
          </View>
        </View>

        {/* Request Image */}
        {request.image && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: request.image }}
              style={styles.requestImage}
              resizeMode="cover"
            />
          </View>
        )}

        {/* Caption */}
        {request.caption && (
          <View style={styles.captionContainer}>
            <Text style={styles.captionLabel}>Message:</Text>
            <Text style={styles.captionText}>{request.caption}</Text>
          </View>
        )}

        {/* Status Badge */}
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusBadge,
            request.status === 'accepted' && styles.statusAccepted,
            request.status === 'pending' && styles.statusPending,
            request.status === 'rejected' && styles.statusRejected
          ]}>
            <Text style={styles.statusText}>
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </Text>
          </View>
        </View>

        {/* Date */}
        <Text style={styles.dateText}>
          Sent {new Date(request.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#999',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 20,
  },
  senderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  senderImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  senderImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#666',
    alignItems: 'center',
    justifyContent: 'center',
  },
  senderDetails: {
    marginLeft: 15,
    flex: 1,
  },
  senderLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  senderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  imageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  requestImage: {
    width: '100%',
    aspectRatio: 4 / 3,
  },
  captionContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  captionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  captionText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  statusBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusAccepted: {
    backgroundColor: '#4CAF50',
  },
  statusPending: {
    backgroundColor: '#FF9800',
  },
  statusRejected: {
    backgroundColor: '#f44336',
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  dateText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
  },
});