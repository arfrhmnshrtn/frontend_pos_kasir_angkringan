import React from 'react';
import { DollarSign } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../../utils/format';

export default function FinancialSummary({ summary }) {
  if (!summary) return null;

  const data = [
    { label: 'Total Omzet', value: formatCurrency(summary.total_revenue), textClass: 'text-text' },
    { label: 'Total Modal', value: formatCurrency(summary.total_cost), textClass: 'text-text' },
    { label: 'Laba Kotor', value: formatCurrency(summary.gross_profit), textClass: 'text-blue-500 font-bold' },
    { label: 'Margin Laba', value: formatPercentage(summary.profit_margin), textClass: 'text-text-secondary' },
    { label: 'Laba Bersih Penjualan', value: formatCurrency(summary.net_profit), textClass: 'text-emerald-500 font-extrabold text-lg' },
  ];

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm p-6 xl:col-span-1 h-full flex flex-col">
      <div className="flex items-center gap-2 font-bold text-lg text-text border-b border-border pb-4 mb-4">
        <DollarSign size={20} className="text-primary" />
        <span>Performa Keuangan</span>
      </div>

      <div className="flex flex-col gap-4">
        {data.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center border-b border-border pb-3 last:border-0 last:pb-0">
            <span className="text-sm font-semibold text-text-secondary">{item.label}</span>
            <span className={`text-sm ${item.textClass}`}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
