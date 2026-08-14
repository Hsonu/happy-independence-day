'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import ReferralTree from '@/components/ReferralTree';
import Loader from '@/components/Loader';
import api from '@/lib/api';
import { TreeNode } from '@/types';

export default function NetworkPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [treeData, setTreeData] = useState<TreeNode | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      api.get('/referrals/tree?depth=6')
        .then(({ data }) => {
          if (data.success) setTreeData(data.data.tree);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (authLoading || !user) return <Loader size="lg" text="Loading..." />;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          🌳 Network Tree
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Interactive visualization of your referral network
        </p>
      </div>

      {loading ? (
        <Loader size="lg" text="Building your network tree..." />
      ) : (
        <ReferralTree treeData={treeData} />
      )}
    </div>
  );
}
