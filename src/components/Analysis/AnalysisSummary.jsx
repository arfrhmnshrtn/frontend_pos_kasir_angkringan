import React from 'react';
import { 
  Wallet, 
  Receipt, 
  TrendingUp, 
  Package, 
  CreditCard 
} from 'lucide-react';
import { formatCurrency } from '../../utils/format';

export default function AnalysisSummary({ summary }) {
  if (!summary) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <div className="bg-linear-to-br from-blue-500 to-blue-700 text-white p-5 rounded-xl flex flex-col justify-between shadow-sm relative overflow-hidden group">
        <div className="flex justify-between items-start relative z-10">
          <div className="text-blue-100 font-semibold text-xs tracking-wider uppercase mb-1">Total Omzet</div>
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm group-hover:scale-110 transition-transform">
            <Wallet size={18} />
          </div>
        </div>
        <div className="text-2xl font-extrabold tracking-tight relative z-10 mt-2">
          {formatCurrency(summary.total_revenue)}
        </div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors"></div>
      </div>

      <div className="bg-linear-to-br from-emerald-500 to-emerald-700 text-white p-5 rounded-xl flex flex-col justify-between shadow-sm relative overflow-hidden group">
        <div className="flex justify-between items-start relative z-10">
          <div className="text-emerald-100 font-semibold text-xs tracking-wider uppercase mb-1">Laba Bersih</div>
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm group-hover:scale-110 transition-transform">
            <TrendingUp size={18} />
          </div>
        </div>
        <div className="text-2xl font-extrabold tracking-tight relative z-10 mt-2">
          {formatCurrency(summary.net_profit)}
        </div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors"></div>
      </div>

      <div className="bg-card border border-border p-5 rounded-xl flex flex-col justify-between shadow-sm">
        <div className="flex justify-between items-start">
          <div className="text-text-secondary font-semibold text-xs tracking-wider uppercase mb-1">Laba Kotor</div>
          <div className="bg-main p-2 rounded-lg text-primary">
            <TrendingUp size={18} />
          </div>
        </div>
        <div className="flex items-end justify-between mt-2">
          <div className="text-xl font-extrabold text-text tracking-tight">
            {formatCurrency(summary.gross_profit)}
          </div>
          <div className="text-xs font-bold text-success bg-success-bg px-2 py-0.5 rounded">
            {summary.profit_margin}% Margin
          </div>
        </div>
      </div>

      <div className="bg-card border border-border p-5 rounded-xl flex flex-col justify-between shadow-sm">
        <div className="flex justify-between items-start">
          <div className="text-text-secondary font-semibold text-xs tracking-wider uppercase mb-1">Total Transaksi</div>
          <div className="bg-main p-2 rounded-lg text-primary">
            <Receipt size={18} />
          </div>
        </div>
        <div className="text-xl font-extrabold text-text tracking-tight mt-2">
          {summary.total_transactions} <span className="text-sm font-semibold text-text-secondary">Transaksi</span>
        </div>
      </div>

      <div className="bg-card border border-border p-5 rounded-xl flex flex-col justify-between shadow-sm">
        <div className="flex justify-between items-start">
          <div className="text-text-secondary font-semibold text-xs tracking-wider uppercase mb-1">Item Terjual</div>
          <div className="bg-main p-2 rounded-lg text-primary">
            <Package size={18} />
          </div>
        </div>
        <div className="text-xl font-extrabold text-text tracking-tight mt-2">
          {summary.total_items_sold} <span className="text-sm font-semibold text-text-secondary">Item</span>
        </div>
      </div>

      <div className="bg-card border border-border p-5 rounded-xl flex flex-col justify-between shadow-sm">
        <div className="flex justify-between items-start">
          <div className="text-text-secondary font-semibold text-xs tracking-wider uppercase mb-1">Rata-rata Transaksi</div>
          <div className="bg-main p-2 rounded-lg text-primary">
            <CreditCard size={18} />
          </div>
        </div>
        <div className="text-xl font-extrabold text-text tracking-tight mt-2">
          {formatCurrency(summary.average_transaction)}
        </div>
      </div>
    </div>
  );
}
