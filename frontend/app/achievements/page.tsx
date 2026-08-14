'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import AchievementCard from '@/components/AchievementCard';
import Loader from '@/components/Loader';
import api from '@/lib/api';
import { Achievement } from '@/types';

export default function AchievementsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      api.get('/achievements')
        .then(({ data }) => {
          if (data.success) setAchievements(data.data.achievements);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (authLoading || !user) return <Loader size="lg" text="Loading..." />;

  const unlocked = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          🏆 Achievements
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {unlocked} of {achievements.length} unlocked • Keep growing your network!
        </p>
      </motion.div>

      {loading ? (
        <Loader size="lg" text="Loading achievements..." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement, i) => (
            <motion.div
              key={achievement.achievementId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <AchievementCard achievement={achievement} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
