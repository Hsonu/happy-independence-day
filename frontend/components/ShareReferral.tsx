'use client';

import { motion } from 'framer-motion';
import { Copy, Share2, MessageCircle, Send, Mail } from 'lucide-react';
import { getReferralLink, copyToClipboard } from '@/lib/utils';
import { useToast } from './Toast';

interface ShareReferralProps {
  referralCode: string;
}

export default function ShareReferral({ referralCode }: ShareReferralProps) {
  const { showToast } = useToast();
  const link = getReferralLink(referralCode);

  const handleCopy = async () => {
    await copyToClipboard(link);
    showToast('Referral link copied!', 'success');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Tiranga Connect 🇮🇳',
          text: `Join the Tiranga Connect network this Independence Day! Use my referral link:`,
          url: link,
        });
      } catch {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  const shareButtons = [
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      color: 'bg-green-500 hover:bg-green-600',
      url: `https://wa.me/?text=${encodeURIComponent(`🇮🇳 Join Tiranga Connect this Independence Day!\n\n${link}`)}`,
    },
    {
      icon: Send,
      label: 'Telegram',
      color: 'bg-blue-500 hover:bg-blue-600',
      url: `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent('🇮🇳 Join Tiranga Connect this Independence Day!')}`,
    },
    {
      icon: Mail,
      label: 'Email',
      color: 'bg-gray-600 hover:bg-gray-700',
      url: `mailto:?subject=${encodeURIComponent('Join Tiranga Connect 🇮🇳')}&body=${encodeURIComponent(`Join the Tiranga Connect network!\n\n${link}`)}`,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Referral link display */}
      <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <input
          type="text"
          value={link}
          readOnly
          className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-300 outline-none truncate font-mono"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-2 bg-saffron text-white rounded-lg text-sm font-medium hover:bg-saffron/90 transition-colors"
        >
          <Copy className="w-4 h-4" />
          Copy
        </motion.button>
      </div>

      {/* Share buttons */}
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-saffron to-orange-500 text-white rounded-xl font-medium shadow-sm"
        >
          <Share2 className="w-4 h-4" />
          Share
        </motion.button>

        {shareButtons.map((btn) => (
          <motion.a
            key={btn.label}
            href={btn.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`p-2.5 rounded-xl text-white ${btn.color} transition-colors`}
            title={btn.label}
          >
            <btn.icon className="w-5 h-5" />
          </motion.a>
        ))}
      </div>
    </div>
  );
}
