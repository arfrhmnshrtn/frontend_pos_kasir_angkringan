import React from 'react';
import { CreditCard } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/format';

const COLORS = {
  tunai: '#3b82f6', // blue-500
  qris: '#10b981',  // emerald-500
  transfer: '#8b5cf6' // violet-500
};

export default function PaymentMethods({ methods }) {
  if (!methods) return null;

  const data = [
    { name: 'Tunai', value: methods.tunai?.total_amount || 0, count: methods.tunai?.transaction_count || 0, key: 'tunai' },
    { name: 'QRIS', value: methods.qris?.total_amount || 0, count: methods.qris?.transaction_count || 0, key: 'qris' },
    { name: 'Transfer', value: methods.transfer?.total_amount || 0, count: methods.transfer?.transaction_count || 0, key: 'transfer' },
  ];

  const totalAmount = data.reduce((acc, curr) => acc + curr.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border p-3 rounded-lg shadow-lg">
          <p className="font-bold text-text mb-1">{data.name}</p>
          <p className="text-sm font-semibold text-text-secondary">{data.count} Transaksi</p>
          <p className="text-sm font-bold text-primary">{formatCurrency(data.value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col h-full">
      <div className="flex items-center gap-2 font-bold text-lg text-text border-b border-border pb-4 mb-4">
        <CreditCard size={20} className="text-primary" />
        <span>Metode Pembayaran</span>
      </div>

      {totalAmount === 0 ? (
        <div className="flex-1 flex items-center justify-center text-muted font-medium py-8">
          Belum ada transaksi pembayaran pada periode ini.
        </div>
      ) : (
        <div className="flex flex-col md:flex-row items-center gap-6 flex-1">
          <div className="w-40 h-40 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.filter(d => d.value > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.key]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex-1 flex flex-col gap-3 w-full">
            {data.map((item) => {
              const perc = totalAmount > 0 ? ((item.value / totalAmount) * 100).toFixed(1) : 0;
              return (
                <div key={item.key} className="flex items-center justify-between p-3 rounded-xl bg-main border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[item.key] }}></div>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-text leading-tight">{item.name} <span className="font-normal text-text-secondary">({perc}%)</span></span>
                      <span className="text-[0.7rem] font-semibold text-text-secondary">{item.count} transaksi</span>
                    </div>
                  </div>
                  <div className="font-extrabold text-[0.85rem] text-text">{formatCurrency(item.value)}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
