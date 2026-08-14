'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import LeaderboardComponent from '@/components/Leaderboard';
import Loader from '@/components/Loader';
import api from '@/lib/api';
import { LeaderboardEntry } from '@/types';

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/leaderboard?limit=50')
      .then(({ data }) => {
        if (data.success) setEntries(data.data.leaderboard);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          🇮🇳 Unity Champions
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Top network builders on Tiranga Connect
        </p>
      </motion.div>

      {loading ? (
        <Loader size="lg" text="Loading leaderboard..." />
      ) : (
        <LeaderboardComponent entries={entries} />
      )}
    </div>
  );
}
