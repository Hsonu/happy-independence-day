'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Network, Layers, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useReferralStats } from '@/hooks/useUser';
import StatsCard from '@/components/StatsCard';
import ReferralCard from '@/components/ReferralCard';
import GrowthChart from '@/components/GrowthChart';
import Loader from '@/components/Loader';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { User } from '@/types';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { stats, loading: statsLoading } = useReferralStats();
  const router = useRouter();
  const [recentReferrals, setRecentReferrals] = useState<User[]>([]);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      api.get('/referrals/my?limit=5').then(({ data }) => {
        if (data.success) setRecentReferrals(data.data.referrals);
      }).catch(() => {});
    }
  }, [user]);

  if (authLoading || !user) return <Loader size="lg" text="Loading dashboard..." />;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          🇮🇳 Welcome back, {user.name}!
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Here&apos;s your network overview
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Total Network"
          value={stats?.totalNetwork ?? 0}
          icon={Network}
          color="saffron"
        />
        <StatsCard
          title="Direct Connections"
          value={stats?.directConnections ?? 0}
          icon={Users}
          color="green"
        />
        <StatsCard
          title="Current Level"
          value={user.level}
          icon={Layers}
          color="blue"
        />
        <StatsCard
          title="Growth"
          value={`${stats?.growthPercentage ?? 0}%`}
          icon={TrendingUp}
          change={stats?.growthPercentage}
          color="navy"
        />
      </div>

      {/* Content grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Referral Card */}
        <ReferralCard referralCode={user.referralCode} />

        {/* Recent Connections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Connections</h3>
          {recentReferrals.length > 0 ? (
            <div className="space-y-3">
              {recentReferrals.map((ref) => (
                <div key={ref._id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <div className="w-8 h-8 rounded-full bg-saffron/20 flex items-center justify-center text-saffron text-sm font-bold">
                    {ref.name[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{ref.name}</p>
                    <p className="text-xs text-gray-500">@{ref.username}</p>
                  </div>
                  <span className="text-xs text-green-600 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-lg">
                    Connected
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p>No connections yet</p>
              <p className="text-sm mt-1">Share your referral link to start building your network!</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Growth Chart */}
      <div className="mt-6">
        <GrowthChart data={stats?.growthData ?? []} />
      </div>
    </div>
  );
}
