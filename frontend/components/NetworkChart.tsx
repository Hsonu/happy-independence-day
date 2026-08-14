'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { motion } from 'framer-motion';
import { GrowthData } from '@/types';

interface NetworkChartProps {
  monthlyData: GrowthData[];
  directConnections: number;
  totalNetwork: number;
}

const COLORS = ['#FF9933', '#138808', '#000080', '#4ECDC4'];

export default function NetworkChart({ monthlyData, directConnections, totalNetwork }: NetworkChartProps) {
  const barData = monthlyData.map((d) => ({
    month: new Date(d._id + '-01').toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
    connections: d.count,
  }));

  const indirect = totalNetwork - directConnections;
  const pieData = [
    { name: 'Direct', value: directConnections },
    { name: 'Indirect', value: indirect > 0 ? indirect : 0 },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Bar chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Connections</h3>
        {barData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                }}
              />
              <Bar dataKey="connections" fill="#138808" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[250px] flex items-center justify-center text-gray-400 text-sm">
            No monthly data yet
          </div>
        )}
      </motion.div>

      {/* Donut chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Network Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
            >
              {pieData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-6 mt-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-saffron" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Direct ({directConnections})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-600" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Indirect ({indirect > 0 ? indirect : 0})</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
