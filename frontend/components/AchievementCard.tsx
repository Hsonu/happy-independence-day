'use client';

import { motion } from 'framer-motion';
import { Achievement } from '@/types';
import { Lock, CheckCircle } from 'lucide-react';

interface AchievementCardProps {
  achievement: Achievement;
}

export default function AchievementCard({ achievement }: AchievementCardProps) {
  const progressPercent = Math.min((achievement.progress / achievement.threshold) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className={`relative p-6 rounded-2xl border-2 transition-all ${
        achievement.unlocked
          ? 'bg-gradient-to-br from-saffron/5 to-green-500/5 border-saffron/30 dark:from-saffron/10 dark:to-green-500/10 dark:border-saffron/40'
          : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 opacity-70'
      }`}
    >
      {achievement.unlocked && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3"
        >
          <CheckCircle className="w-5 h-5 text-green-500" />
        </motion.div>
      )}
      {!achievement.unlocked && (
        <div className="absolute top-3 right-3">
          <Lock className="w-4 h-4 text-gray-400" />
        </div>
      )}

      <div className="text-3xl mb-3">{achievement.icon}</div>
      <h3 className="font-bold text-gray-900 dark:text-white mb-1">{achievement.title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{achievement.description}</p>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">{achievement.progress}/{achievement.threshold}</span>
          <span className="text-gray-500">{Math.round(progressPercent)}%</span>
        </div>
        <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, delay: 0.3 }}
            className={`h-full rounded-full ${
              achievement.unlocked
                ? 'bg-gradient-to-r from-saffron to-green-500'
                : 'bg-gray-400'
            }`}
          />
        </div>
      </div>

      {achievement.unlocked && achievement.unlockedAt && (
        <p className="text-xs text-green-600 dark:text-green-400 mt-2">
          Unlocked {new Date(achievement.unlockedAt).toLocaleDateString('en-IN')}
        </p>
      )}
    </motion.div>
  );
}
