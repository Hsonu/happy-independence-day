'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { GrowthData } from '@/types';

interface GrowthChartProps {
  data: GrowthData[];
  title?: string;
}

export default function GrowthChart({ data, title = 'Network Growth' }: GrowthChartProps) {
  const chartData = data.map((d) => ({
    date: new Date(d._id).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    connections: d.count,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
            <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" allowDecimals={false} />
            <Tooltip
              contentStyle={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            />
            <Line
              type="monotone"
              dataKey="connections"
              stroke="#FF9933"
              strokeWidth={3}
              dot={{ fill: '#FF9933', r: 4 }}
              activeDot={{ r: 6, fill: '#FF9933' }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[300px] flex items-center justify-center text-gray-400">
          No growth data yet. Share your referral link to start!
        </div>
      )}
    </motion.div>
  );
}
