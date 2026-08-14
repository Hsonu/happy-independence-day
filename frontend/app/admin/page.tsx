'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Users, UserCheck, Network, UserPlus, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import StatsCard from '@/components/StatsCard';
import Loader from '@/components/Loader';
import { useToast } from '@/components/Toast';
import api from '@/lib/api';
import { AdminStats, User, PaginationData } from '@/types';
import { formatDate } from '@/lib/utils';

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({ page: 1, limit: 20, total: 0, pages: 0 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchData();
    }
  }, [user, pagination.page, search, statusFilter]);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get(`/admin/users?page=${pagination.page}&search=${search}&status=${statusFilter}`),
      ]);
      if (statsRes.data.success) setStats(statsRes.data.data);
      if (usersRes.data.success) {
        setUsers(usersRes.data.data.users);
        setPagination(usersRes.data.data.pagination);
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string) => {
    try {
      const { data } = await api.put(`/admin/users/${userId}/status`);
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, isActive: data.data.user.isActive } : u))
        );
        showToast(`User ${data.data.user.isActive ? 'activated' : 'deactivated'}`, 'success');
      }
    } catch {
      showToast('Failed to update status', 'error');
    }
  };

  if (authLoading || !user || user.role !== 'admin') return <Loader size="lg" text="Loading..." />;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          🛡️ Admin Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">System overview and user management</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard title="Total Users" value={stats.totalUsers} icon={Users} color="saffron" />
          <StatsCard title="Active Users" value={stats.activeUsers} icon={UserCheck} color="green" />
          <StatsCard title="Total Connections" value={stats.totalConnections} icon={Network} color="blue" />
          <StatsCard title="New Today" value={stats.newUsersToday} icon={UserPlus} color="navy" />
        </div>
      )}

      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-saffron/50"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-saffron/50"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Users table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Name</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Email</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Code</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Referred By</th>
              <th className="text-center px-4 py-3 text-sm font-medium text-gray-500">Level</th>
              <th className="text-center px-4 py-3 text-sm font-medium text-gray-500">Status</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Joined</th>
              <th className="text-center px-4 py-3 text-sm font-medium text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{u.name}</p>
                    <p className="text-xs text-gray-400">@{u.username}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{u.email}</td>
                <td className="px-4 py-3 text-sm font-mono text-saffron">{u.referralCode}</td>
                <td className="px-4 py-3 text-sm font-mono text-gray-500">{u.referredBy || '—'}</td>
                <td className="px-4 py-3 text-sm text-center text-gray-600 dark:text-gray-300">{u.level}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                    u.isActive
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                  }`}>
                    {u.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-400">{formatDate(u.createdAt)}</td>
                <td className="px-4 py-3 text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleUserStatus(u._id)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      u.isActive
                        ? 'bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100'
                        : 'bg-green-50 dark:bg-green-900/20 text-green-600 hover:bg-green-100'
                    }`}
                  >
                    {u.isActive ? 'Deactivate' : 'Activate'}
                  </motion.button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-800">
            <p className="text-sm text-gray-500">
              Page {pagination.page} of {pagination.pages} ({pagination.total} users)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                disabled={pagination.page === 1}
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                disabled={pagination.page === pagination.pages}
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
