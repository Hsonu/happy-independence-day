'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: number;
  color?: 'saffron' | 'green' | 'blue' | 'navy';
}

export default function StatsCard({ title, value, icon: Icon, change, color = 'saffron' }: StatsCardProps) {
  const colorClasses = {
    saffron: {
      bg: 'bg-saffron/10',
      icon: 'text-saffron',
      glow: 'shadow-saffron/5',
    },
    green: {
      bg: 'bg-green-500/10',
      icon: 'text-green-600',
      glow: 'shadow-green-500/5',
    },
    blue: {
      bg: 'bg-blue-500/10',
      icon: 'text-blue-600',
      glow: 'shadow-blue-500/5',
    },
    navy: {
      bg: 'bg-indigo-500/10',
      icon: 'text-indigo-600',
      glow: 'shadow-indigo-500/5',
    },
  };

  const c = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
      className={`p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm ${c.glow} transition-all`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
          <motion.h3
            key={value}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white"
          >
            {value}
          </motion.h3>
          {change !== undefined && (
            <p className={`text-sm mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% this week
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${c.bg}`}>
          <Icon className={`w-6 h-6 ${c.icon}`} />
        </div>
      </div>
    </motion.div>
  );
}
