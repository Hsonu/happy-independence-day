'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Network, Link as LinkIcon, Trophy, User } from 'lucide-react';
import { motion } from 'framer-motion';

const items = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/network', label: 'Network', icon: Network },
  { href: '/referrals', label: 'Referrals', icon: LinkIcon },
  { href: '/leaderboard', label: 'Leaders', icon: Trophy },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function MobileNav() {
  const pathname = usePathname();

  // Don't show on landing, login, register pages
  if (['/', '/login', '/register'].includes(pathname)) return null;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="flex-1">
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col items-center gap-1 py-1.5 rounded-xl transition-colors ${
                  isActive ? 'text-saffron' : 'text-gray-400'
                }`}
              >
                <div className="relative">
                  <item.icon className="w-5 h-5" />
                  {isActive && (
                    <motion.div
                      layoutId="mobile-active"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-saffron"
                    />
                  )}
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
