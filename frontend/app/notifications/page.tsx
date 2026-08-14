'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCheck, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import NotificationCard from '@/components/NotificationCard';
import Loader from '@/components/Loader';
import EmptyState from '@/components/EmptyState';
import { useToast } from '@/components/Toast';
import api from '@/lib/api';
import { Notification } from '@/types';

export default function NotificationsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications?limit=50');
      if (data.success) setNotifications(data.data.notifications);
    } catch {} finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch {
      showToast('Failed to mark as read', 'error');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      showToast('All notifications marked as read', 'success');
    } catch {
      showToast('Failed to mark all as read', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      showToast('Notification deleted', 'success');
    } catch {
      showToast('Failed to delete', 'error');
    }
  };

  if (authLoading || !user) return <Loader size="lg" text="Loading..." />;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            🔔 Notifications
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleMarkAllRead}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-saffron bg-saffron/10 hover:bg-saffron/20 transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </motion.button>
        )}
      </div>

      {loading ? (
        <Loader size="lg" text="Loading notifications..." />
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          <AnimatePresence>
            {notifications.map((notification) => (
              <NotificationCard
                key={notification._id}
                notification={notification}
                onMarkRead={handleMarkRead}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <EmptyState
          icon="🔔"
          title="No notifications"
          description="You'll see notifications here when someone joins through your referral link or you unlock achievements."
        />
      )}
    </div>
  );
}
