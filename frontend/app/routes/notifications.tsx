import { useState, useEffect } from "react";
import { Bell, X, CheckCircle, Users, FolderOpen, Settings, LogIn, Mail, Calendar, Plus, Trash2, Edit, FolderPlus, MessageCircle, Clock, AlertTriangle, Volume2, VolumeX } from "lucide-react";
import { useNotifications } from "@/context/NotificationProvider";

// Notification interface matching the context
interface SimpleNotification {
  id: string;
  type: 'task' | 'task_created' | 'task_deleted' | 'task_assigned' | 'task_updated' | 'task_completed' | 
        'project' | 'project_created' | 'project_updated' | 'project_deleted' | 
        'workspace' | 'workspace_invite' | 'member_joined' | 
        'comment_added' | 'deadline_reminder' | 'email_notification' |
        'dashboard' | 'dashboard_update' | 'login_welcome' | 'member_invite' | 'email' | 'calendar';
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

// Notification type configurations
const notificationConfig = {
  task: { icon: CheckCircle, color: "text-blue-500", bgColor: "bg-blue-50 dark:bg-blue-950" },
  task_created: { icon: Plus, color: "text-green-500", bgColor: "bg-green-50 dark:bg-green-950" },
  task_deleted: { icon: Trash2, color: "text-red-500", bgColor: "bg-red-50 dark:bg-red-950" },
  task_assigned: { icon: CheckCircle, color: "text-blue-500", bgColor: "bg-blue-50 dark:bg-blue-950" },
  task_updated: { icon: Edit, color: "text-amber-500", bgColor: "bg-amber-50 dark:bg-amber-950" },
  task_completed: { icon: CheckCircle, color: "text-green-600", bgColor: "bg-green-50 dark:bg-green-950" },
  project: { icon: FolderOpen, color: "text-green-500", bgColor: "bg-green-50 dark:bg-green-950" },
  project_created: { icon: FolderPlus, color: "text-green-600", bgColor: "bg-green-50 dark:bg-green-950" },
  project_updated: { icon: Edit, color: "text-orange-500", bgColor: "bg-orange-50 dark:bg-orange-950" },
  project_deleted: { icon: Trash2, color: "text-red-600", bgColor: "bg-red-50 dark:bg-red-950" },
  workspace: { icon: Users, color: "text-purple-500", bgColor: "bg-purple-50 dark:bg-purple-950" },
  workspace_invite: { icon: Mail, color: "text-purple-500", bgColor: "bg-purple-50 dark:bg-purple-950" },
  member_joined: { icon: Users, color: "text-green-500", bgColor: "bg-green-50 dark:bg-green-950" },
  comment_added: { icon: MessageCircle, color: "text-blue-600", bgColor: "bg-blue-50 dark:bg-blue-950" },
  deadline_reminder: { icon: Clock, color: "text-orange-600", bgColor: "bg-orange-50 dark:bg-orange-950" },
  email_notification: { icon: Mail, color: "text-indigo-500", bgColor: "bg-indigo-50 dark:bg-indigo-950" },
  dashboard: { icon: Settings, color: "text-orange-500", bgColor: "bg-orange-50 dark:bg-orange-950" },
  dashboard_update: { icon: Settings, color: "text-orange-500", bgColor: "bg-orange-50 dark:bg-orange-950" },
  login_welcome: { icon: LogIn, color: "text-emerald-500", bgColor: "bg-emerald-50 dark:bg-emerald-950" },
  member_invite: { icon: Mail, color: "text-pink-500", bgColor: "bg-pink-50 dark:bg-pink-950" },
  email: { icon: Mail, color: "text-indigo-500", bgColor: "bg-indigo-50 dark:bg-indigo-950" },
  calendar: { icon: Calendar, color: "text-red-500", bgColor: "bg-red-50 dark:bg-red-950" }
};

// Priority styles
const priorityStyles = {
  low: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  medium: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  high: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  urgent: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
};

export default function NotificationsPage() {
  // Use the real notification context instead of mock data
  const { 
    notifications: contextNotifications, 
    unreadCount: contextUnreadCount,
    markAsRead: contextMarkAsRead,
    markAllAsRead: contextMarkAllAsRead,
    deleteNotification: contextDeleteNotification,
    soundEnabled,
    toggleSound
  } = useNotifications();
  
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // Transform context notifications to match our interface
  const notifications: SimpleNotification[] = contextNotifications.map(notif => ({
    id: notif.id,
    type: notif.type,
    title: notif.title,
    message: notif.message,
    timestamp: notif.timestamp,
    read: notif.read,
    priority: notif.priority,
    actionUrl: notif.actionUrl,
    metadata: notif.metadata
  }));

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return true;
  });

  const unreadCount = contextUnreadCount;

  // Use context functions for actions
  const markAsRead = contextMarkAsRead;
  const markAllAsRead = contextMarkAllAsRead;
  const deleteNotification = contextDeleteNotification;

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Bell className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Notifications</h1>
              <p className="text-muted-foreground">
                {unreadCount > 0 ? `You have ${unreadCount} unread notifications` : 'All caught up!'}
              </p>
            </div>
          </div>
          {/* Controls */}
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 text-sm"
              >
                Mark All Read
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded text-sm font-medium ${
              filter === 'all' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary hover:bg-secondary/80'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded text-sm font-medium ${
              filter === 'unread' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary hover:bg-secondary/80'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="border rounded-lg p-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No notifications</h3>
              <p className="text-muted-foreground">
                {filter === 'unread' 
                  ? "All notifications have been read"
                  : "You're all caught up!"
                }
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => {
              const config = notificationConfig[notification.type] || notificationConfig.dashboard; // Fallback to dashboard config
              const IconComponent = config.icon;
              
              return (
                <div
                  key={notification.id}
                  className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
                    !notification.read ? 'ring-2 ring-primary/20 bg-primary/5' : 'bg-card'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-full ${config.bgColor}`}>
                      <IconComponent className={`h-5 w-5 ${config.color}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">
                            {notification.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded ${priorityStyles[notification.priority]}`}>
                            {notification.priority}
                          </span>
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-1 hover:bg-accent rounded"
                              title="Mark as read"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1 hover:bg-accent rounded text-red-500"
                            title="Delete notification"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
