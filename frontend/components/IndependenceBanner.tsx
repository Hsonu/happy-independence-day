'use client';

import { motion } from 'framer-motion';

export default function IndependenceBanner() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            How <span className="text-saffron">Tiranga Connect</span> Works
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Build your network by sharing your unique referral link. Watch your connections grow in real-time.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              icon: '🔗',
              title: 'Get Your Link',
              description: 'Register and receive your unique referral code and shareable link instantly.',
              color: 'from-saffron/10 to-orange-50 dark:from-saffron/5 dark:to-orange-950/20',
              borderColor: 'border-saffron/20',
            },
            {
              step: '02',
              icon: '📤',
              title: 'Share & Connect',
              description: 'Share your referral link via WhatsApp, Telegram, Email, or any platform.',
              color: 'from-white to-gray-50 dark:from-gray-800/50 dark:to-gray-900/50',
              borderColor: 'border-gray-200 dark:border-gray-700',
            },
            {
              step: '03',
              icon: '🌳',
              title: 'Watch It Grow',
              description: 'See your network tree expand in real-time as connections join through your link.',
              color: 'from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20',
              borderColor: 'border-green-200/50 dark:border-green-800/30',
            },
          ].map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className={`relative p-8 rounded-2xl bg-gradient-to-br ${item.color} border ${item.borderColor} group hover:shadow-lg transition-all duration-300`}
            >
              <div className="absolute top-4 right-4 text-5xl font-bold text-gray-200 dark:text-gray-800">
                {item.step}
              </div>
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Connection flow */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-[#0a0a2e] to-[#000040] text-white text-center"
        >
          <div className="flex flex-wrap justify-center items-center gap-4 text-lg">
            <span className="px-4 py-2 rounded-xl bg-saffron/20 border border-saffron/30">
              User A 🔗
            </span>
            <span className="text-white/40">→</span>
            <span className="px-4 py-2 rounded-xl bg-white/10 border border-white/20">
              Shares Link
            </span>
            <span className="text-white/40">→</span>
            <span className="px-4 py-2 rounded-xl bg-green-500/20 border border-green-500/30">
              User B Joins ✅
            </span>
            <span className="text-white/40">→</span>
            <span className="px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30">
              🌳 Network Grows
            </span>
          </div>
          <p className="mt-4 text-white/50 text-sm">
            Each person gets their own referral link to continue growing the network
          </p>
        </motion.div>
      </div>
    </section>
  );
}
