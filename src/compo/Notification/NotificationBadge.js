// src/components/NotificationBadge.js - NEW FILE
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNotifications } from './NotificationContext';
import { useNavigation } from '@react-navigation/native';

export default function NotificationBadge() {
  const { notificationCount } = useNotifications();
  const navigation = useNavigation();
  const { clearBadge} = useNotifications();
  return (
    <TouchableOpacity 
      onPress={() => {
     console.log("clearBadge,clearBadge",clearBadge)
   navigation.navigate('Notifications')
    
  }

      }
        
     
      style={styles.container}
    >
      <Icon name="notifications-outline" size={28} color="#000" />
      {notificationCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {notificationCount > 9 ? '9+' : notificationCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    padding: 8,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#ff4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 4,
  },
});