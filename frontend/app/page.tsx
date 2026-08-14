import Hero from '@/components/Hero';
import IndependenceBanner from '@/components/IndependenceBanner';

export default function Home() {
  return (
    <div>
      <Hero />
      <IndependenceBanner />
      {/* Footer */}
      <footer className="py-8 px-4 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-900 text-center">
        <div className="flex h-4 justify-center gap-0.5 mb-3">
          <div className="w-1 rounded-full bg-saffron" />
          <div className="w-1 rounded-full bg-gray-300 dark:bg-gray-600" />
          <div className="w-1 rounded-full bg-green-600" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          🇮🇳 Tiranga Connect — Independence Day 2026
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          A social referral network for Internship Day demonstration
        </p>
      </footer>
    </div>
  );
}
