import React from 'react';
import { BookOpen } from 'lucide-react';
import { formatCurrency } from '../../utils/format';

export default function DebtSummary({ summary }) {
  if (!summary) return null;

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col h-full bg-linear-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/20 dark:to-orange-900/10">
      <div className="flex items-center gap-2 font-bold text-lg text-text border-b border-border/50 pb-4 mb-4">
        <BookOpen size={20} className="text-orange-500" />
        <span>Ringkasan Hutang</span>
      </div>

      {summary.total_debt === 0 && summary.total_paid === 0 && summary.total_remaining === 0 ? (
        <div className="flex-1 flex items-center justify-center text-muted font-medium py-8">
          Tidak ada hutang pada periode ini.
        </div>
      ) : (
        <div className="flex flex-col gap-4 flex-1">
          <div className="bg-white dark:bg-card border border-orange-200 dark:border-orange-900/50 p-4 rounded-xl flex flex-col justify-between shadow-sm items-center text-center">
            <span className="text-xs font-bold text-orange-600/70 dark:text-orange-500/70 uppercase tracking-wider mb-1">Total Hutang</span>
            <span className="text-2xl font-black text-orange-600 dark:text-orange-500">{formatCurrency(summary.total_debt)}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-card border border-border/50 p-4 rounded-xl flex flex-col justify-between shadow-sm items-center text-center">
              <span className="text-xs font-bold text-emerald-600/70 dark:text-emerald-500/70 uppercase tracking-wider mb-1">Sudah Dibayar</span>
              <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-500">{formatCurrency(summary.total_paid)}</span>
            </div>
            
            <div className="bg-white dark:bg-card border border-border/50 p-4 rounded-xl flex flex-col justify-between shadow-sm items-center text-center">
              <span className="text-xs font-bold text-red-600/70 dark:text-red-500/70 uppercase tracking-wider mb-1">Sisa Hutang</span>
              <span className="text-lg font-extrabold text-red-600 dark:text-red-500">{formatCurrency(summary.total_remaining)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
