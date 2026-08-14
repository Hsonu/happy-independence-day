'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Countdown from './Countdown';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/Toast';
import { Copy } from 'lucide-react';

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
  const { showToast } = useToast();
  const [inviteName, setInviteName] = useState('');
  const [referrerName, setReferrerName] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const invitedBy = params.get('invitedBy');
      if (invitedBy) {
        setReferrerName(invitedBy);
      }
    }
  }, []);

  const handleShare = () => {
    const baseUrl = 'https://happy-independence-day-fohd.onrender.com/';
    const shareUrl = inviteName.trim()
      ? `${baseUrl}?invitedBy=${encodeURIComponent(inviteName.trim())}`
      : baseUrl;

    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        showToast('🇮🇳 Link copied! Share the pride with your friends.', 'success');
      })
      .catch(() => {
        showToast('Failed to copy link. Please share the URL manually!', 'error');
      });
  };

  const getWhatsAppLink = () => {
    const baseUrl = 'https://happy-independence-day-fohd.onrender.com/';
    const shareUrl = inviteName.trim()
      ? `${baseUrl}?invitedBy=${encodeURIComponent(inviteName.trim())}`
      : baseUrl;
      
    const message = inviteName.trim()
      ? `*${inviteName.trim()}* has invited you to connect on Tiranga Connect for the 80th Independence Day! 🇮🇳 Join here: ${shareUrl}`
      : `Join the India referral network built for the 80th Independence Day! 🇮🇳 Let's connect and grow together! Join here: ${baseUrl}`;
      
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  };

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
        {/* Referrer Welcome Banner */}
        {referrerName && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-saffron/10 border border-saffron/20 max-w-md mx-auto"
          >
            <p className="text-sm font-semibold text-saffron">
              🇮🇳 You are invited by <span className="underline font-bold">{referrerName}</span> to join the celebration!
            </p>
          </motion.div>
        )}

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
          className="w-full max-w-2xl mx-auto"
        >
          {user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
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
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6 w-full">
              <p className="text-white/95 font-medium text-lg flex items-center justify-center gap-2 bg-white/5 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/10 shadow-inner">
                🧡 Share with your friends & family to grow the Network! 💚
              </p>

              {/* Name Input */}
              <div className="w-full max-w-sm">
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 text-center">
                  Enter your name to personalize the invite:
                </label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="Your Name (e.g. Sonu Raj)"
                  className="w-full px-5 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/30 text-center font-medium text-md focus:outline-none focus:ring-2 focus:ring-saffron/50 focus:border-saffron transition-all shadow-inner"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShare}
                  className="px-8 py-3.5 bg-gradient-to-r from-[#FF9933] via-white to-[#138808] text-gray-900 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 border border-white/20"
                >
                  <Copy className="w-5 h-5 text-gray-900" strokeWidth={2.5} /> Copy Share Link
                </motion.button>

                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-8 py-3.5 bg-[#25D366] text-white rounded-xl font-bold text-lg shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.458h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Share on WhatsApp
                  </motion.button>
                </a>
              </div>

              <div className="flex gap-6 items-center mt-2">
                <Link href="/register" className="text-white/60 hover:text-white transition-all underline text-sm font-semibold hover:no-underline">
                  🇮🇳 Register / Join Network
                </Link>
                <span className="text-white/20">|</span>
                <Link href="/login" className="text-white/60 hover:text-white transition-all underline text-sm font-semibold hover:no-underline">
                  🔑 Admin Login
                </Link>
              </div>
            </div>
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
