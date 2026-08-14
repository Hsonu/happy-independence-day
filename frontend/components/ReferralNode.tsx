'use client';

import { motion } from 'framer-motion';
import { getInitials, getAvatarColor } from '@/lib/utils';

interface ReferralNodeProps {
  data: {
    name: string;
    username: string;
    referralCode: string;
    referralCount: number;
    level: number;
    avatar: string;
    isRoot?: boolean;
  };
}

export default function ReferralNode({ data }: ReferralNodeProps) {
  const { name, username, referralCount, level, avatar, isRoot } = data;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`px-4 py-3 rounded-xl border-2 min-w-[140px] text-center cursor-pointer transition-all ${
        isRoot
          ? 'bg-gradient-to-br from-saffron/10 to-orange-50 dark:from-saffron/20 dark:to-orange-950/30 border-saffron/50 shadow-lg shadow-saffron/10'
          : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-saffron/30 shadow-sm'
      }`}
    >
      {/* Avatar */}
      <div className="flex justify-center mb-2">
        {avatar ? (
          <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
            style={{ backgroundColor: getAvatarColor(name) }}
          >
            {getInitials(name)}
          </div>
        )}
      </div>

      {/* Info */}
      <p className="font-semibold text-sm text-gray-900 dark:text-white">
        {isRoot && '🇮🇳 '}{name}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">Level {level}</p>
      <p className="text-xs text-saffron font-medium">{referralCount} Connections</p>
    </motion.div>
  );
}
