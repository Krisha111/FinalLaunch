
// ============================================
// 4. ALTERNATIVE: Use Context for Global Badge State
// CREATE: src/context/NotificationContext.js
// ============================================

import React, { createContext, useContext, useState , 
  useEffect} from 'react';
import { getSocket } from '../../services/socketService';
import NotificationBadge from './NotificationBadge';
const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notificationCount, setNotificationCount] = 
  useState(0);


  const clearBadge = () => {
    console.log("🔔 Clearing notification badge",notificationCount);
    setNotificationCount(0);
  };

  const updateBadge = (count) => {
   
    setNotificationCount(count);
  };
   const incrementBadge = () => {
    setNotificationCount(prev => {
      const newCount = prev + 1;
      console.log("🔔 Badge incremented from", prev, 
        "to", newCount);
      return newCount;
    });
  };
    const decrementBadge = () => {
    setNotificationCount(prev => {
      const newCount = Math.max(0, prev - 1);
      console.log("🔔 Badge decremented from", prev, "to", newCount);
      return newCount;
    });
  };
  return (
    <NotificationContext.Provider 
      value={{ 
        notificationCount, 
        setNotificationCount, 
        clearBadge, 
        updateBadge,
        incrementBadge,
        decrementBadge
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}