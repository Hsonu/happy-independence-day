'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Countdown from './Countdown';
import { useAuth } from '@/hooks/useAuth';

// Ashoka Chakra SVG component
function AshokaChakra({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      <circle cx="100" cy="100" r="20" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5" />
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 15 * Math.PI) / 180;
        const x1 = (100 + 20 * Math.cos(angle)).toFixed(4);
        const y1 = (100 + 20 * Math.sin(angle)).toFixed(4);
        const x2 = (100 + 90 * Math.cos(angle)).toFixed(4);
        const y2 = (100 + 90 * Math.sin(angle)).toFixed(4);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.2"
          />
        );
      })}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 15 * Math.PI) / 180;
        const cx = (100 + 55 * Math.cos(angle)).toFixed(4);
        const cy = (100 + 55 * Math.sin(angle)).toFixed(4);
        return <circle key={i} cx={cx} cy={cy} r="3" fill="currentColor" opacity="0.3" />;
      })}
    </svg>
  );
}

// Floating particles
function Particles() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => {
        const colors = ['#FF9933', '#FFFFFF', '#138808'];
        const color = colors[i % 3];
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              backgroundColor: color,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.3,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'easeInOut',
            }}
          />
        );
      })}
    </div>
  );
}

export default function Hero() {
  const { user } = useAuth();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a0a2e] via-[#0d1137] to-[#000020]">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-saffron/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px]" />

      {/* Ashoka Chakra background */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] text-white/[0.04]"
      >
        <AshokaChakra className="w-full h-full" />
      </motion.div>

      <Particles />

      {/* Tricolor top line */}
      <div className="absolute top-0 left-0 right-0 h-1 flex">
        <div className="flex-1 bg-saffron" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-green-600" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white/80 text-sm mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          15 August 2026 • 80th Independence Day
        </motion.div>

        {/* Logo */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6"
        >
          <span className="bg-gradient-to-r from-saffron via-white to-green-400 bg-clip-text text-transparent">
            TIRANGA
          </span>
          <br />
          <span className="text-white">CONNECT</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-xl sm:text-2xl md:text-3xl font-light text-white/90 mb-4"
        >
          One Connection. One Nation. One India.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-base sm:text-lg text-white/60 mb-10 max-w-2xl mx-auto"
        >
          This Independence Day, celebrate the power of unity by connecting with people around you.
        </motion.p>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-10"
        >
          <Countdown />
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          {user ? (
            <>
              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3.5 bg-gradient-to-r from-saffron to-orange-500 text-white rounded-xl font-semibold text-lg shadow-lg shadow-saffron/30 hover:shadow-xl hover:shadow-saffron/40 transition-all"
                >
                  🇮🇳 Go to Dashboard
                </motion.button>
              </Link>
              <Link href="/network">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3.5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl font-semibold text-lg hover:bg-white/20 transition-all"
                >
                  Explore Network
                </motion.button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3.5 bg-gradient-to-r from-saffron to-orange-500 text-white rounded-xl font-semibold text-lg shadow-lg shadow-saffron/30 hover:shadow-xl hover:shadow-saffron/40 transition-all"
                >
                  🇮🇳 Join the Network
                </motion.button>
              </Link>
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3.5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl font-semibold text-lg hover:bg-white/20 transition-all"
                >
                  Admin Login
                </motion.button>
              </Link>
            </>
          )}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16 grid grid-cols-3 gap-6 max-w-md mx-auto"
        >
          {[
            { label: 'Network', value: '∞' },
            { label: 'Unity', value: '🇮🇳' },
            { label: 'Connection', value: '💫' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl mb-1">{stat.value}</div>
              <div className="text-xs sm:text-sm text-white/50">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-gray-950 to-transparent" />
    </section>
  );
}
