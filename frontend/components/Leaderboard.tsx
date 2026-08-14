'use client';

import { motion } from 'framer-motion';
import { Trophy, Medal } from 'lucide-react';
import { LeaderboardEntry } from '@/types';
import { getInitials, getAvatarColor, formatDate } from '@/lib/utils';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

export default function Leaderboard({ entries }: LeaderboardProps) {
  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  const medals = ['🥇', '🥈', '🥉'];
  const topColors = [
    'from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/20 border-amber-300 dark:border-amber-700',
    'from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-900/30 border-gray-300 dark:border-gray-600',
    'from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border-orange-300 dark:border-orange-700',
  ];

  return (
    <div>
      {/* Top 3 */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {top3.map((entry, index) => (
          <motion.div
            key={entry._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative p-6 rounded-2xl bg-gradient-to-br ${topColors[index]} border-2 text-center`}
          >
            {index === 0 && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Trophy className="w-6 h-6 text-amber-500" />
              </div>
            )}
            <div className="text-3xl mb-2">{medals[index]}</div>
            <div className="flex justify-center mb-3">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-md"
                style={{ backgroundColor: getAvatarColor(entry.name) }}
              >
                {getInitials(entry.name)}
              </div>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white">{entry.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Level {entry.level}</p>
            <p className="text-lg font-bold text-saffron mt-1">{entry.referralCount} Connections</p>
          </motion.div>
        ))}
      </div>

      {/* Rest */}
      {rest.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 dark:bg-gray-800/50 text-sm font-medium text-gray-500 dark:text-gray-400">
            <div className="col-span-1">#</div>
            <div className="col-span-5">User</div>
            <div className="col-span-2 text-center">Level</div>
            <div className="col-span-2 text-center">Connections</div>
            <div className="col-span-2 text-right">Joined</div>
          </div>
          {rest.map((entry, index) => (
            <motion.div
              key={entry._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className="grid grid-cols-12 gap-4 px-6 py-4 border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors items-center"
            >
              <div className="col-span-1 text-sm font-semibold text-gray-400">{entry.rank}</div>
              <div className="col-span-5 flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: getAvatarColor(entry.name) }}
                >
                  {getInitials(entry.name)}
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-900 dark:text-white">{entry.name}</p>
                  <p className="text-xs text-gray-400">@{entry.username}</p>
                </div>
              </div>
              <div className="col-span-2 text-center text-sm text-gray-600 dark:text-gray-300">{entry.level}</div>
              <div className="col-span-2 text-center text-sm font-semibold text-saffron">{entry.referralCount}</div>
              <div className="col-span-2 text-right text-xs text-gray-400">{formatDate(entry.createdAt)}</div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
