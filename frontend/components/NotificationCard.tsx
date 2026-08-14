'use client';

import { motion } from 'framer-motion';
import { Notification } from '@/types';
import { Bell, Award, Users, Zap, Check } from 'lucide-react';
import { timeAgo } from '@/lib/utils';

interface NotificationCardProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const typeIcons = {
  referral: Users,
  achievement: Award,
  milestone: Zap,
  system: Bell,
};

const typeColors = {
  referral: 'bg-saffron/10 text-saffron',
  achievement: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600',
  milestone: 'bg-green-100 dark:bg-green-900/30 text-green-600',
  system: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600',
};

export default function NotificationCard({ notification, onMarkRead, onDelete }: NotificationCardProps) {
  const Icon = typeIcons[notification.type] || Bell;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className={`flex items-start gap-4 p-4 rounded-xl border transition-all hover:shadow-sm ${
        notification.isRead
          ? 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800'
          : 'bg-saffron/5 dark:bg-saffron/10 border-saffron/20'
      }`}
    >
      <div className={`p-2.5 rounded-xl ${typeColors[notification.type]}`}>
        <Icon className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm text-gray-900 dark:text-white">{notification.title}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{notification.message}</p>
        <p className="text-xs text-gray-400 mt-1">{timeAgo(notification.createdAt)}</p>
      </div>

      <div className="flex items-center gap-1">
        {!notification.isRead && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onMarkRead(notification._id)}
            className="p-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 text-gray-400 hover:text-green-500 transition-colors"
            title="Mark as read"
          >
            <Check className="w-4 h-4" />
          </motion.button>
        )}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDelete(notification._id)}
          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
          title="Delete"
        >
          ×
        </motion.button>
      </div>
    </motion.div>
  );
}
