import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '../../utils/format';
import { DollarSign } from 'lucide-react';

export const PaymentMethodChart = ({ reportData, loading }) => {
  if (loading) {
    return <div className="bg-card border border-border rounded-xl h-80 shadow-sm animate-pulse m-0 flex items-center justify-center p-6 text-muted">Memuat metode pembayaran...</div>;
  }

  const m = reportData?.payment_methods;
  if (!m) return null;

  const data = [
    { name: 'QRIS / E-Wallet', value: m.qris?.cash_in || 0, color: '#3b82f6', bg: 'bg-blue-100', text: 'text-blue-700' },
    { name: 'Tunai (Cash)', value: m.tunai?.cash_in || 0, color: '#f59e0b', bg: 'bg-amber-100', text: 'text-amber-700' },
    { name: 'Transfer Bank', value: m.transfer?.cash_in || 0, color: '#8b5cf6', bg: 'bg-purple-100', text: 'text-purple-700' }
  ].filter(d => d.value > 0);

  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border p-3 rounded-lg shadow-xl shadow-black/5 text-sm">
          <p className="font-bold text-text flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }}></span>
            {data.name}
          </p>
          <p className="font-extrabold">{formatCurrency(data.value)}</p>
          <p className="text-xs text-text-secondary mt-1">
            {((data.value / total) * 100).toFixed(1)}% dari total masuk
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col gap-4 h-full">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2 font-bold text-lg text-text">
          <DollarSign size={20} className="text-primary" />
          <span>Sumber Kas Masuk (Metode)</span>
        </div>
      </div>
      
      {total > 0 ? (
        <div className="flex flex-col gap-4 h-full justify-center">
          <div className="h-45 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[0.7rem] text-text-secondary font-bold uppercase tracking-wider">Total</span>
              <span className="text-sm font-black text-text">{formatCurrency(total)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-2">
            {data.map((item, idx) => {
              const perc = ((item.value / total) * 100).toFixed(1);
              return (
                <div key={idx} className="bg-main/50 p-3 rounded-lg flex justify-between items-center border border-border/50">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></span>
                    <div>
                      <div className="text-[0.85rem] font-semibold text-text leading-tight">{item.name}</div>
                      <div className="text-[0.75rem] font-bold text-text-secondary mt-0.5">{formatCurrency(item.value)}</div>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[0.7rem] font-bold ${item.bg} ${item.text}`}>
                    {perc}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-text-secondary min-h-50">
          <DollarSign size={36} className="text-muted mb-2 opacity-50" />
          <p className="text-sm text-center">Belum ada pemasukan yang bisa dikalkulasi methodenya.</p>
        </div>
      )}
    </div>
  );
};
