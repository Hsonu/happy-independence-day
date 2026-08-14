'use client';

import { motion } from 'framer-motion';
import { Copy, Link as LinkIcon } from 'lucide-react';
import { getReferralLink, copyToClipboard } from '@/lib/utils';
import { useToast } from './Toast';
import ShareReferral from './ShareReferral';

interface ReferralCardProps {
  referralCode: string;
}

export default function ReferralCard({ referralCode }: ReferralCardProps) {
  const { showToast } = useToast();

  const handleCopyCode = async () => {
    await copyToClipboard(referralCode);
    showToast('Referral code copied!', 'success');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl bg-gradient-to-br from-[#0a0a2e] to-[#000040] text-white border border-white/10 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-saffron/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-500/10 rounded-full blur-2xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <LinkIcon className="w-5 h-5 text-saffron" />
          <h3 className="font-semibold">Your Referral</h3>
        </div>

        {/* Referral Code */}
        <div className="mb-4">
          <p className="text-xs text-white/50 mb-1">Referral Code</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold font-mono tracking-wider text-saffron">
              {referralCode}
            </span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCopyCode}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Copy className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Share section */}
        <ShareReferral referralCode={referralCode} />
      </div>
    </motion.div>
  );
}
