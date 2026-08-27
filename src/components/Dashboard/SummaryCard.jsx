import React from 'react';
import { formatCurrency } from '../../utils/format';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const SummaryCard = ({ title, data, isMonthly = false }) => {
  if (!data) return null;

  const isProfit = data.laba >= 0;

  return (
    <div className={`bg-card border border-border rounded-xl p-5 md:p-6 shadow-sm flex flex-col justify-between ${isMonthly ? 'border-primary/30 ring-1 ring-primary/10' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
          {title}
        </h3>
        {isMonthly && <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
      </div>

      <div className="mb-5">
        <p className="text-xs font-semibold text-text-secondary mb-1">Total Laba Bersih</p>
        <div className="flex items-end gap-2 text-text">
          <h2 className={`text-3xl font-extrabold tracking-tight ${isProfit ? 'text-emerald-600' : 'text-rose-600'}`}>
            {formatCurrency(data.laba)}
          </h2>
          <div className={`mb-1 px-1.5 py-0.5 rounded text-xs font-bold flex items-center ${isProfit ? 'bg-success-bg text-success' : 'bg-danger-bg text-danger'}`}>
            {isProfit ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
            {isProfit ? 'Plus' : 'Minus'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border mt-auto">
        <div>
          <p className="text-xs font-semibold text-text-secondary flex items-center mb-1">
            <ArrowDownRight size={14} className="mr-1 text-emerald-500" /> Pemasukan
          </p>
          <p className="text-base font-bold text-text">
            {formatCurrency(data.pemasukan)}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold text-text-secondary flex items-center mb-1">
            <ArrowUpRight size={14} className="mr-1 text-rose-500" /> Pengeluaran
          </p>
          <p className="text-base font-bold text-text">
            {formatCurrency(data.pengeluaran)}
          </p>
        </div>
      </div>
    </div>
  );
};
