// frontend/src/pages/NotificationsPage.jsx

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router';
import { useNotifications } from '@/context/NotificationProvider';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setUnreadCount } = useNotifications();

  useEffect(() => {
    const fetchAndMarkNotifications = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        // Fetch all notifications
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/notifications`, config);
        setNotifications(res.data.data.notifications);
        setUnreadCount(res.data.data.unreadCount);

        // Mark them all as read
        await axios.put(`${import.meta.env.VITE_API_URL}/api/notifications/mark-all-as-read`, {}, config);
        setUnreadCount(0); // Set count to 0 in the UI immediately

      } catch (error) {
        console.error("Failed to fetch notifications", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndMarkNotifications();
  }, [setUnreadCount]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      {notifications.length === 0 ? (
        <p>You have no notifications.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <Link to={n.actionUrl || "#"} key={n._id} className="block p-4 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <p className="font-semibold">{n.title}</p>
              <p>{n.message}</p>
              <small className="text-gray-500">{new Date(n.createdAt).toLocaleString()}</small>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;