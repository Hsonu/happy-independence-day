'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, UserPlus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/Toast';
import api from '@/lib/api';

function RegisterForm() {
  const searchParams = useSearchParams();
  const refCode = searchParams.get('ref') || '';

  const { register } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [referrer, setReferrer] = useState<string | null>(null);

  useEffect(() => {
    if (refCode) {
      // Look up referrer
      api.get(`/users/referral/${refCode}`)
        .then(({ data }) => {
          if (data.success) setReferrer(data.data.user.name);
        })
        .catch(() => {});
    }
  }, [refCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please enter your name', 'error');
      return;
    }
    setLoading(true);
    try {
      await register({
        name: name.trim(),
        referralCode: refCode
      });
      showToast('Welcome to Tiranga Connect! 🇮🇳', 'success');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="flex h-8 justify-center gap-0.5 mb-4">
            <div className="w-2 rounded-full bg-saffron" />
            <div className="w-2 rounded-full bg-gray-200 dark:bg-gray-600" />
            <div className="w-2 rounded-full bg-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Join the Network</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Create your Tiranga Connect account</p>
        </div>

        {/* Referrer banner */}
        {referrer && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 rounded-xl bg-saffron/10 border border-saffron/20 text-center"
          >
            <p className="text-sm font-medium text-saffron">
              🇮🇳 You were invited by <span className="font-bold">{referrer}</span>
            </p>
          </motion.div>
        )}

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-saffron/50 focus:border-saffron transition-all"
                />
              </div>
            </div>

            {refCode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Referral Code
                </label>
                <div className="relative">
                  <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={refCode}
                    disabled
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-400 font-mono uppercase"
                  />
                </div>
              </div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-gradient-to-r from-saffron to-orange-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-saffron/25 hover:shadow-xl disabled:opacity-60 transition-all mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  🇮🇳 Join the Network
                </>
              )}
            </motion.button>
          </form>
        </div>

        <p className="text-center mt-6 text-sm text-gray-500">
          Admin?{' '}
          <Link href="/login" className="text-saffron font-medium hover:underline">
            Admin Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-saffron/30 border-t-saffron rounded-full animate-spin" /></div>}>
      <RegisterForm />
    </Suspense>
  );
}
