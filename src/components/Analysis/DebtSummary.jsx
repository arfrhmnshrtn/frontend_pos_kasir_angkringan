import React from 'react';
import { BookOpen, TrendingDown, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../utils/format';

export default function DebtSummary({ summary }) {
  if (!summary) return null;

  const isEmpty =
    summary.total_debt === 0 &&
    summary.total_paid === 0 &&
    summary.total_remaining === 0;

  const progress =
    summary.total_debt > 0
      ? Math.min(100, Math.round((summary.total_paid / summary.total_debt) * 100))
      : 0;

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col h-full bg-linear-to-br from-orange-50 via-orange-50/40 to-transparent dark:from-orange-950/20 dark:via-orange-950/5 dark:to-transparent">
      <div className="flex items-center gap-2.5 font-bold text-lg text-text border-b border-border/50 pb-4 mb-5">
        <span className="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-900/30">
          <BookOpen size={18} className="text-orange-500" />
        </span>
        <span>Ringkasan Hutang</span>
      </div>

      {isEmpty ? (
        <div className="flex-1 flex flex-col items-center justify-center text-muted font-medium py-8 gap-2">
          <BookOpen size={28} className="text-muted/40" />
          <span>Tidak ada hutang pada periode ini.</span>
        </div>
      ) : (
        <div className="flex flex-col gap-4 flex-1">
          {/* Total Hutang - Hero card */}
          <div className="relative overflow-hidden bg-white dark:bg-card border border-orange-200/70 dark:border-orange-900/50 p-5 rounded-xl flex flex-col items-center text-center shadow-sm">
            <span className="text-xs font-bold text-orange-600/70 dark:text-orange-500/70 uppercase tracking-wider mb-1.5">
              Total Hutang
            </span>
            <span className="text-3xl font-black text-orange-600 dark:text-orange-500 tabular-nums">
              {formatCurrency(summary.total_debt)}
            </span>

            {/* Progress bar */}
            <div className="w-full mt-4">
              <div className="h-1.5 w-full rounded-full bg-orange-100 dark:bg-orange-950/40 overflow-hidden">
                <div
                  className="h-full rounded-full bg-orange-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[11px] font-medium text-muted mt-1.5 block">
                {progress}% terbayar
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-card border border-border/50 p-4 rounded-xl flex flex-col items-center text-center gap-1 shadow-sm hover:border-emerald-200 dark:hover:border-emerald-900/50 transition-colors">
              <TrendingUp size={16} className="text-emerald-500 mb-0.5" />
              <span className="text-xs font-bold text-emerald-600/70 dark:text-emerald-500/70 uppercase tracking-wider">
                Sudah Dibayar
              </span>
              <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-500 tabular-nums">
                {formatCurrency(summary.total_paid)}
              </span>
            </div>

            <div className="bg-white dark:bg-card border border-border/50 p-4 rounded-xl flex flex-col items-center text-center gap-1 shadow-sm hover:border-red-200 dark:hover:border-red-900/50 transition-colors">
              <TrendingDown size={16} className="text-red-500 mb-0.5" />
              <span className="text-xs font-bold text-red-600/70 dark:text-red-500/70 uppercase tracking-wider">
                Sisa Hutang
              </span>
              <span className="text-lg font-extrabold text-red-600 dark:text-red-500 tabular-nums">
                {formatCurrency(summary.total_remaining)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}