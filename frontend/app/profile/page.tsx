'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Save, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import UserProfile from '@/components/UserProfile';
import Loader from '@/components/Loader';
import Modal from '@/components/Modal';
import { useToast } from '@/components/Toast';
import api from '@/lib/api';

export default function ProfilePage() {
  const { user, loading: authLoading, refreshUser } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const [editModal, setEditModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', username: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) setEditForm({ name: user.name, username: user.username });
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/users/profile', editForm);
      await refreshUser();
      showToast('Profile updated successfully!', 'success');
      setEditModal(false);
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Update failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    setSaving(true);
    try {
      await api.put('/users/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      showToast('Password changed successfully!', 'success');
      setPasswordModal(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to change password', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || !user) return <Loader size="lg" text="Loading..." />;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          👤 Profile
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage your account settings
        </p>
      </div>

      <UserProfile user={user} />

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 mt-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setEditModal(true)}
          className="px-6 py-2.5 bg-gradient-to-r from-saffron to-orange-500 text-white rounded-xl font-medium shadow-sm"
        >
          Edit Profile
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setPasswordModal(true)}
          className="px-6 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium"
        >
          <Lock className="w-4 h-4 inline mr-2" />
          Change Password
        </motion.button>
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={editModal} onClose={() => setEditModal(false)} title="Edit Profile">
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-saffron/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
            <input
              type="text"
              value={editForm.username}
              onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-saffron/50"
            />
          </div>
          <motion.button
            type="submit"
            disabled={saving}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-gradient-to-r from-saffron to-orange-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save className="w-5 h-5" /> Save Changes</>}
          </motion.button>
        </form>
      </Modal>

      {/* Change Password Modal */}
      <Modal isOpen={passwordModal} onClose={() => setPasswordModal(false)} title="Change Password">
        <form onSubmit={handleChangePassword} className="space-y-4">
          {[
            { name: 'currentPassword', label: 'Current Password' },
            { name: 'newPassword', label: 'New Password' },
            { name: 'confirmPassword', label: 'Confirm New Password' },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{field.label}</label>
              <input
                type="password"
                value={(passwordForm as any)[field.name]}
                onChange={(e) => setPasswordForm({ ...passwordForm, [field.name]: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-saffron/50"
              />
            </div>
          ))}
          <motion.button
            type="submit"
            disabled={saving}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-gradient-to-r from-saffron to-orange-500 text-white rounded-xl font-semibold disabled:opacity-60"
          >
            {saving ? 'Changing...' : 'Change Password'}
          </motion.button>
        </form>
      </Modal>
    </div>
  );
}
