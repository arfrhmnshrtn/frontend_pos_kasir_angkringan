import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/format';
import { TrendingUp } from 'lucide-react';

export const SalesChart7Days = ({ data }) => {
  return (
    <div className="bg-card border border-border rounded-xl shadow-sm p-5 md:p-6 flex flex-col h-[400px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-2">
            <TrendingUp size={16} className="text-primary" /> Statistik Penjualan
          </h3>
          <p className="text-xs text-text-secondary mt-1">Grafik 7 hari terakhir</p>
        </div>
      </div>

      {!data || data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-text-secondary text-sm">
          Tidak ada data penjualan
        </div>
      ) : (
        <div className="flex-1 min-h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorLaba" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.1} />
              <XAxis 
                dataKey="tanggal" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 11, fill: 'currentColor', opacity: 0.5}}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 11, fill: 'currentColor', opacity: 0.5}}
                tickFormatter={(value) => `Rp ${value / 1000}k`}
                dx={-10}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  borderColor: 'var(--color-border)',
                  borderRadius: '0.5rem',
                  color: 'var(--color-text)',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  padding: '12px'
                }}
                itemStyle={{ color: 'var(--color-text)', fontSize: '13px', fontWeight: '600' }}
                labelStyle={{ color: 'var(--color-text-secondary)', marginBottom: '8px', fontSize: '12px' }}
                formatter={(value) => [formatCurrency(value), 'Laba Bersih']}
              />
              <Area 
                type="monotone" 
                dataKey="laba" 
                stroke="#3b82f6"
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorLaba)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
