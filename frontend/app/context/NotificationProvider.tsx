// frontend/src/context/NotificationProvider.tsx

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import type { ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';

interface EnhancedNotification {
  id: string;
  type: 'task' | 'project' | 'workspace' | 'dashboard' | 'login_welcome' | 'member_invite' | 'email' | 'calendar';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  metadata?: {
    taskId?: string;
    projectId?: string;
    workspaceId?: string;
    inviteId?: string;
    userId?: string;
  };
}

interface NotificationContextType {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  notifications: EnhancedNotification[];
  addNotification: (notification: EnhancedNotification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
}

interface NotificationProviderProps {
  children: ReactNode;
}

interface NotificationData {
  unreadCount: number;
  notification: EnhancedNotification;
}

interface UnreadCountData {
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [notifications, setNotifications] = useState<EnhancedNotification[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize notification sound
  useEffect(() => {
    audioRef.current = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvWcfCEOZ3Oyv");
    
    return () => {
      if (audioRef.current) {
        audioRef.current = null;
      }
    };
  }, []);

  // Define which notification types should have sound (green highlighted ones)
  const greenHighlightedTypes = [
    'task_created', 
    'task_completed', 
    'project', 
    'project_created', 
    'member_joined'
  ];

  const playNotificationSound = (notificationType: string) => {
    // Only play sound for green highlighted notifications and if sound is enabled
    if (audioRef.current && soundEnabled && greenHighlightedTypes.includes(notificationType)) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(console.error);
      console.log('🔊 Sound played for green highlighted notification:', notificationType);
    } else if (greenHighlightedTypes.includes(notificationType) && !soundEnabled) {
      console.log('🔇 Sound muted for green highlighted notification:', notificationType);
    }
  };

  const addNotification = (notification: EnhancedNotification) => {
    console.log('🆕 Adding notification to frontend:', notification);
    setNotifications(prev => {
      const updated = [notification, ...prev];
      console.log('📝 Updated notifications list:', updated.length, 'total');
      return updated;
    });
    if (!notification.read) {
      setUnreadCount(prev => {
        const newCount = prev + 1;
        console.log('🔢 Updated unread count:', newCount);
        return newCount;
      });
      // Play sound only for green highlighted notification types
      playNotificationSound(notification.type);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  };

  const deleteNotification = (id: string) => {
    const notification = notifications.find(n => n.id === id);
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
  };

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // IMPORTANT: Make sure you store your token in localStorage after login
    const token = localStorage.getItem('token');
    console.log('🔑 Token found in localStorage:', token ? 'YES' : 'NO');
    console.log('🔑 Token length:', token ? token.length : 0);
    
    if (!token) {
      console.log("❌ No token found, socket not connecting.");
      console.log("💡 Make sure to login first and check if token is saved properly");
      return;
    }

    console.log('🔌 Attempting to connect Socket.IO to:', import.meta.env.VITE_API_URL?.replace('/api-v1', '') || 'http://localhost:5000');
    
    const socket: Socket = io(import.meta.env.VITE_API_URL?.replace('/api-v1', '') || 'http://localhost:5000', { 
      auth: { token },
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });

    socket.on('connect', () => {
      console.log('🎯 Socket.IO connected successfully!');
      console.log('Socket ID:', socket.id);
      console.log('🏠 Joining user room for real-time notifications...');
      // Fetch initial notifications and unread count when connected
      fetchNotifications();
      fetchUnreadCount();
    });
    
    socket.on('connect_error', (err: Error) => {
      console.error('❌ Socket.IO connection error:', err.message);
      console.error('❌ Full error:', err);
      // Check if it's an authentication error
      if (err.message === 'Authentication failed') {
        console.log('🔑 JWT token might be invalid. Please log in again.');
        // Optionally clear invalid token
        localStorage.removeItem('token');
      }
    });
    
    // Enhanced notification handling
    socket.on('new_notification', (data: any) => {
      console.log('🔄 Received new_notification event:', data);
      console.log('📨 Raw notification data:', JSON.stringify(data, null, 2));
      
      // Check if data structure is correct
      if (!data || !data.notification) {
        console.error('❌ Invalid notification data structure:', data);
        return;
      }
      
      // Transform backend notification to frontend format
      const frontendNotification: EnhancedNotification = {
        id: data.notification._id || `temp-${Date.now()}`,
        type: data.notification.type || 'task',
        title: data.notification.title || 'New Notification',
        message: data.notification.message || 'You have a new notification',
        timestamp: data.notification.createdAt || new Date().toISOString(),
        read: data.notification.isRead || false,
        priority: 'medium', // Default priority
        actionUrl: data.notification.actionUrl,
        metadata: {
          taskId: data.notification.taskId,
          projectId: data.notification.projectId,
          workspaceId: data.notification.workspaceId,
          inviteId: data.notification.inviteId,
          userId: data.notification.userId
        }
      };
      
      console.log('🔄 Transformed notification:', frontendNotification);
      
      addNotification(frontendNotification);
      
      // Update unread count if provided
      if (data.unreadCount !== undefined) {
        console.log('🔢 Updating unread count to:', data.unreadCount);
        setUnreadCount(data.unreadCount);
      }
      
      // Show toast notification
      const toastOptions = {
        duration: 5000,
        action: frontendNotification.actionUrl ? {
          label: 'View',
          onClick: () => window.location.href = frontendNotification.actionUrl!
        } : undefined
      };

      switch (frontendNotification.priority) {
        case 'urgent':
          toast.error(frontendNotification.message, toastOptions);
          break;
        case 'high':
          toast.warning(frontendNotification.message, toastOptions);
          break;
        case 'medium':
          toast.info(frontendNotification.message, toastOptions);
          break;
        default:
          toast(frontendNotification.message, toastOptions);
      }
      
      console.log('🎉 Notification processing completed');
    });

    socket.on('unread_count_updated', (data: UnreadCountData) => {
      setUnreadCount(data.unreadCount);
    });

    // Listen for specific notification types
    socket.on('task_notification', (data: any) => {
      const notification = {
        id: `task-${Date.now()}`,
        type: 'task' as const,
        title: 'Task Update',
        message: data.message,
        timestamp: new Date().toISOString(),
        read: false,
        priority: data.priority || 'medium' as const,
        metadata: { taskId: data.taskId }
      };
      addNotification(notification);
    });

    socket.on('project_notification', (data: any) => {
      const notification = {
        id: `project-${Date.now()}`,
        type: 'project' as const,
        title: 'Project Update',
        message: data.message,
        timestamp: new Date().toISOString(),
        read: false,
        priority: data.priority || 'medium' as const,
        metadata: { projectId: data.projectId }
      };
      addNotification(notification);
    });

    socket.on('workspace_notification', (data: any) => {
      const notification = {
        id: `workspace-${Date.now()}`,
        type: 'workspace' as const,
        title: 'Workspace Update',
        message: data.message,
        timestamp: new Date().toISOString(),
        read: false,
        priority: data.priority || 'medium' as const,
        metadata: { workspaceId: data.workspaceId }
      };
      addNotification(notification);
    });

    socket.on('member_invite_notification', (data: any) => {
      const notification = {
        id: `invite-${Date.now()}`,
        type: 'member_invite' as const,
        title: 'Team Invitation',
        message: data.message,
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'urgent' as const,
        metadata: { inviteId: data.inviteId }
      };
      addNotification(notification);
    });

    socket.on('login_welcome_notification', (data: any) => {
      const notification = {
        id: `welcome-${Date.now()}`,
        type: 'login_welcome' as const,
        title: 'Welcome Back!',
        message: data.message,
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'medium' as const
      };
      addNotification(notification);
    });

    // Function to fetch notifications
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api-v1'}/notifications`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched notifications data:', data); // Debug log
          // Backend returns { success: true, data: { notifications: [...], unreadCount: 5 } }
          const notificationsArray = data.data?.notifications || [];
          console.log('Setting notifications:', notificationsArray); // Debug log
          setNotifications(notificationsArray.map((notif: any) => ({
            id: notif._id,
            type: notif.type,
            title: notif.title,
            message: notif.message,
            timestamp: notif.createdAt,
            read: notif.isRead,
            priority: 'medium', // Default priority
            actionUrl: notif.actionUrl,
            metadata: {
              workspaceId: notif.workspaceId,
              projectId: notif.projectId,
              taskId: notif.taskId
            }
          })));
        }
      } catch (error) {
        console.log('Could not fetch notifications:', error);
      }
    };

    // Function to fetch initial unread count
    const fetchUnreadCount = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api-v1'}/notifications/unread-count`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched unread count data:', data); // Debug log
          setUnreadCount(data.count || 0);
        }
      } catch (error) {
        console.log('Could not fetch unread count:', error);
      }
    };

    // Fetch data immediately
    fetchNotifications();
    fetchUnreadCount();

    return () => {
      socket.disconnect();
    };
  }, []); // This effect runs once on app load

  return (
    <NotificationContext.Provider value={{ 
      unreadCount, 
      setUnreadCount,
      notifications,
      addNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      soundEnabled,
      toggleSound
    }}>
      {children}
    </NotificationContext.Provider>
  );
};