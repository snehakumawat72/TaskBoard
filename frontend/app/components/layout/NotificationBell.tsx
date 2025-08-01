import { Bell, BellRing } from 'lucide-react';
import { Link } from 'react-router';
import { useEffect, useState } from 'react';

// Simple cn utility function to avoid import issues
const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
};

export const NotificationBell: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);

  // Mock unread count for now
  const unreadCount = 3;

  // All hooks must be called before any early returns
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Animate bell when new notifications arrive
  useEffect(() => {
    if (unreadCount > 0) {
      setHasNewNotifications(true);
      const timer = setTimeout(() => setHasNewNotifications(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [unreadCount]);

  // Simple SSR-safe render without early return
  return (
    <Link 
      to="/notifications" 
      className={cn(
        "relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200",
        isClient && hasNewNotifications && "animate-pulse"
      )}
      aria-label={`View notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
    >
      {isClient && unreadCount > 0 ? (
        <BellRing className={cn(
          "h-6 w-6 text-primary",
          hasNewNotifications && "animate-bounce"
        )} />
      ) : (
        <Bell className="h-6 w-6" />
      )}
      
      {isClient && unreadCount > 0 && (
        <span className={cn(
          "absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white font-medium animate-pulse",
          unreadCount > 99 && "h-6 w-6 text-[10px]"
        )}>
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
      
      {/* Notification pulse effect */}
      {isClient && hasNewNotifications && (
        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 animate-ping" />
      )}
    </Link>
  );
};