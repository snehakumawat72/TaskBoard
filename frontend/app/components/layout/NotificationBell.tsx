// frontend/src/components/layout/NotificationBell.jsx

import { Bell } from 'lucide-react';
import { useNotifications } from '@/context/NotificationProvider';
import { useNavigate } from 'react-router';

export const NotificationBell = () => {
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate('/notifications')} className="relative">
      <Bell className="h-6 w-6" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
          {unreadCount}
        </span>
      )}
    </button>
  );
};