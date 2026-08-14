import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { formatCurrency, formatChartDate } from '../../utils/format';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border p-3 rounded-lg shadow-lg">
        <p className="font-bold text-text mb-2 text-sm">{formatChartDate(label)}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm font-semibold flex items-center gap-2" style={{ color: entry.stroke || entry.fill }}>
            <span>{entry.name === 'Omzet' ? 'Omzet:' : 'Transaksi:'}</span>
            <span>{entry.name === 'Omzet' ? formatCurrency(entry.value) : entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function SalesChartDisplay({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col h-100">
        <div className="flex items-center gap-2 font-bold text-lg text-text border-b border-border pb-4 mb-4">
          <TrendingUp size={20} className="text-primary" />
          <span>Grafik Omset Penjualan</span>
        </div>
        <div className="flex-1 flex items-center justify-center text-muted font-medium">
          Belum ada data penjualan pada periode ini.
        </div>
      </div>
    );
  }

  // Format data for Recharts
  const chartData = data.map(item => ({
    ...item,
    formattedDate: formatChartDate(item.date)
  }));

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col h-100">
      <div className="flex items-center gap-2 font-bold text-lg text-text border-b border-border pb-4 mb-6">
        <TrendingUp size={20} className="text-primary" />
        <span>Grafik Omset Penjualan</span>
      </div>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156, 163, 175, 0.2)" />
            <XAxis 
              dataKey="formattedDate" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#6b7280' }} 
              dy={10}
            />
            <YAxis 
              yAxisId="left"
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={(value) => `Rp${value / 1000}k`}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              yAxisId="left"
              type="monotone" 
              dataKey="revenue" 
              name="Omzet"
              stroke="#3b82f6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
