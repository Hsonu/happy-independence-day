'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Network,
  Link as LinkIcon,
  Trophy,
  Award,
  Bell,
  User,
  Shield,
  BarChart3,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/network', label: 'Network', icon: Network },
  { href: '/referrals', label: 'Referrals', icon: LinkIcon },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/achievements', label: 'Achievements', icon: Award },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  // Don't show sidebar on landing, login, register pages
  if (['/', '/login', '/register'].includes(pathname)) return null;

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-[calc(100vh-4rem)] bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 p-4">
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-saffron/10 text-saffron border border-saffron/20'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-saffron"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}

        {/* Admin link */}
        {user?.role === 'admin' && (
          <Link href="/admin">
            <motion.div
              whileHover={{ x: 4 }}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                pathname === '/admin'
                  ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 border border-indigo-200 dark:border-indigo-800'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900'
              }`}
            >
              <Shield className="w-5 h-5" />
              Admin Panel
            </motion.div>
          </Link>
        )}
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
        <div className="px-4 py-3 rounded-xl bg-gradient-to-r from-saffron/5 to-green-500/5 border border-saffron/10">
          <p className="text-xs font-semibold text-gray-900 dark:text-white">🇮🇳 Tiranga Connect</p>
          <p className="text-xs text-gray-500 mt-0.5">Independence Day 2026</p>
        </div>
      </div>
    </aside>
  );
}
