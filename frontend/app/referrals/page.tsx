'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useReferralStats } from '@/hooks/useUser';
import ReferralCard from '@/components/ReferralCard';
import NetworkChart from '@/components/NetworkChart';
import GrowthChart from '@/components/GrowthChart';
import Loader from '@/components/Loader';
import EmptyState from '@/components/EmptyState';
import api from '@/lib/api';
import { User, AnalyticsData } from '@/types';

export default function ReferralsPage() {
  const { user, loading: authLoading } = useAuth();
  const { stats } = useReferralStats();
  const router = useRouter();
  const [referrals, setReferrals] = useState<User[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [period, setPeriod] = useState('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      Promise.all([
        api.get('/referrals/my'),
        api.get(`/referrals/analytics?period=${period}`),
      ]).then(([refRes, analyticsRes]) => {
        if (refRes.data.success) setReferrals(refRes.data.data.referrals);
        if (analyticsRes.data.success) setAnalytics(analyticsRes.data.data);
      }).catch(() => {}).finally(() => setLoading(false));
    }
  }, [user, period]);

  if (authLoading || !user) return <Loader size="lg" text="Loading..." />;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          🔗 Referrals & Analytics
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage your referral link and track your network growth
        </p>
      </div>

      {/* Referral card */}
      <div className="mb-8">
        <ReferralCard referralCode={user.referralCode} />
      </div>

      {/* Period filter */}
      <div className="flex gap-2 mb-6">
        {[
          { label: '7 Days', value: '7d' },
          { label: '30 Days', value: '30d' },
          { label: 'All Time', value: 'all' },
        ].map((f) => (
          <motion.button
            key={f.value}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPeriod(f.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              period === f.value
                ? 'bg-saffron text-white shadow-sm'
                : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            {f.label}
          </motion.button>
        ))}
      </div>

      {/* Charts */}
      {analytics && (
        <>
          <GrowthChart data={analytics.growthData} title="Network Growth" />
          <div className="mt-6">
            <NetworkChart
              monthlyData={analytics.monthlyData}
              directConnections={stats?.directConnections ?? 0}
              totalNetwork={stats?.totalNetwork ?? 0}
            />
          </div>
        </>
      )}

      {/* Direct referrals list */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Direct Connections ({referrals.length})
        </h3>
        {referrals.length > 0 ? (
          <div className="space-y-3">
            {referrals.map((ref, i) => (
              <motion.div
                key={ref._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-saffron/20 flex items-center justify-center text-saffron font-bold">
                  {ref.name[0]}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-900 dark:text-white">{ref.name}</p>
                  <p className="text-xs text-gray-500">@{ref.username} • Level {ref.level}</p>
                </div>
                <span className="text-xs text-gray-400 font-mono">{ref.referralCode}</span>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon="🔗"
            title="No connections yet"
            description="Share your referral link to start building your network."
          />
        )}
      </motion.div>
    </div>
  );
}
