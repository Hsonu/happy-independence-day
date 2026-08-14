'use client';

import { motion } from 'framer-motion';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export default function Loader({ size = 'md', text }: LoaderProps) {
  const sizes = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-16 h-16' };
  const borderSizes = { sm: 'border-2', md: 'border-3', lg: 'border-4' };

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="relative">
        <motion.div
          className={`${sizes[size]} rounded-full ${borderSizes[size]} border-saffron/20 border-t-saffron`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className={`absolute inset-1 rounded-full ${borderSizes[size]} border-green-500/20 border-b-green-500`}
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      {text && <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">{text}</p>}
    </div>
  );
}
