'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Menu, X, Bell, Sun, Moon, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNotificationCount } from '@/hooks/useUser';
import { getInitials, getAvatarColor } from '@/lib/utils';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count: unreadCount } = useNotificationCount();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDark = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Don't show navbar on landing page
  if (pathname === '/') return null;

  return (
    <nav className="sticky top-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-2">
            <div className="flex h-8">
              <div className="w-1.5 rounded-full bg-saffron" />
              <div className="w-1.5 rounded-full bg-white border border-gray-200 dark:border-gray-600 mx-0.5" />
              <div className="w-1.5 rounded-full bg-green-600" />
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white hidden sm:block">
              Tiranga<span className="text-saffron">Connect</span>
            </span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {user && (
              <>
                {/* Notifications */}
                <Link href="/notifications">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </motion.button>
                </Link>
              </>
            )}

            {/* Dark mode toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDark}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>

            {user && (
              <>
                {/* Profile */}
                <Link href="/profile" className="flex items-center gap-2 ml-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: getAvatarColor(user.name) }}
                  >
                    {getInitials(user.name)}
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user.name}
                  </span>
                </Link>

                {/* Logout */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={logout}
                  className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-400 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </motion.button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
