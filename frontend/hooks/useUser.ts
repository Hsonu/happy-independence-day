'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { User, ReferralStats, Notification } from '@/types';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/me');
      if (data.success) {
        setUser(data.data.user);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, loading, refetch: fetchUser };
}

export function useReferralStats() {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await api.get('/referrals/stats');
      if (data.success) {
        setStats(data.data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, refetch: fetchStats };
}

export function useNotificationCount() {
  const [count, setCount] = useState(0);

  const fetchCount = useCallback(async () => {
    try {
      const { data } = await api.get('/notifications?limit=1');
      if (data.success) {
        setCount(data.data.unreadCount);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [fetchCount]);

  return { count, refetch: fetchCount };
}
