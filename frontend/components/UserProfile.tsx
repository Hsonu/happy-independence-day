'use client';

import { motion } from 'framer-motion';
import { User } from '@/types';
import { getInitials, getAvatarColor, formatDate } from '@/lib/utils';
import { Calendar, Link as LinkIcon, Users, Layers, Mail } from 'lucide-react';

interface UserProfileProps {
  user: User;
}

export default function UserProfile({ user }: UserProfileProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg"
          style={{ backgroundColor: getAvatarColor(user.name) }}
        >
          {getInitials(user.name)}
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
          <p className="text-gray-500 dark:text-gray-400">@{user.username}</p>
          {user.role === 'admin' && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mt-1">
              Admin
            </span>
          )}
        </div>
      </div>

      {/* Info grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { icon: Mail, label: 'Email', value: user.email },
          { icon: LinkIcon, label: 'Referral Code', value: user.referralCode, highlight: true },
          { icon: Users, label: 'Direct Connections', value: user.referralCount.toString() },
          { icon: Layers, label: 'Level', value: user.level.toString() },
          { icon: Calendar, label: 'Joined', value: formatDate(user.createdAt) },
          { icon: LinkIcon, label: 'Referred By', value: user.referredBy || 'None (Root)' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
            <item.icon className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
              <p className={`text-sm font-medium ${item.highlight ? 'text-saffron font-mono' : 'text-gray-900 dark:text-white'}`}>
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
