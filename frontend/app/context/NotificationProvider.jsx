// frontend/src/context/NotificationProvider.jsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'sonner';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // IMPORTANT: Make sure you store your token in localStorage after login
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.log("No token found, socket not connecting.");
      return;
    }

    const socket = io(import.meta.env.VITE_API_URL, { auth: { token } });

    socket.on('connect', () => console.log('Socket.IO connected successfully.'));
    socket.on('connect_error', (err) => console.error('Socket.IO connection error:', err.message));
    
    socket.on('new_notification', (data) => {
      setUnreadCount(data.unreadCount);
      toast.info(data.notification.message);
    });

    socket.on('unread_count_updated', (data) => {
      setUnreadCount(data.unreadCount);
    });

    return () => socket.disconnect();
  }, []); // This effect runs once on app load

  return (
    <NotificationContext.Provider value={{ unreadCount, setUnreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};