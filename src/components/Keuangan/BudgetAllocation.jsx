import React, { useState } from 'react';
import { PieChart as PieChartIcon, Sliders, Users, PiggyBank, ShieldAlert, ShoppingBag, TrendingUp, Percent } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import { Button } from '../common/Button';

export const BudgetAllocation = ({ reportData, loading }) => {
  if (loading || !reportData) {
    return <div className="bg-card border border-border rounded-xl h-100 animate-pulse"></div>;
  }

  const { budget, summary, profit } = reportData;
  if (!budget) return null;

  const totalRevenue = summary.total_cash_in || 0; // Using total cash in as the 'omset' basis for budgeting
  
  // Try to map colors / icons based on common names if possible, else use defaults.
  const getBudgetTheme = (name) => {
    const l = name.toLowerCase();
    if (l.includes('gaji')) return { icon: <Users size={16} />, color: 'emerald', textClass: 'text-success', bgClass: 'bg-success', softBg: 'bg-success-bg' };
    if (l.includes('tabungan')) return { icon: <PiggyBank size={16} />, color: 'amber', textClass: 'text-amber-500', bgClass: 'bg-amber-500', softBg: 'bg-amber-500/10' };
    if (l.includes('darurat')) return { icon: <ShieldAlert size={16} />, color: 'danger', textClass: 'text-danger', bgClass: 'bg-danger', softBg: 'bg-danger/10' };
    if (l.includes('bahan')) return { icon: <ShoppingBag size={16} />, color: 'blue', textClass: 'text-blue-500', bgClass: 'bg-blue-500', softBg: 'bg-blue-100' };
    return { icon: <PieChartIcon size={16} />, color: 'slate', textClass: 'text-slate-600', bgClass: 'bg-slate-600', softBg: 'bg-slate-100' };
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Visual Alokasi */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
          <div className="flex items-center gap-2 font-bold text-lg text-text">
            <PieChartIcon size={20} className="text-primary" />
            <span>Visual Pembagian Kantong Kas</span>
          </div>
          <Button variant="outline" size="sm" className="h-8 text-xs font-semibold">
            <Sliders size={14} className="mr-1.5" /> Atur Budgeting Kas
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          {budget.allocations.map((alloc, idx) => {
            const theme = getBudgetTheme(alloc.name);
            return (
              <div key={idx}>
                <div className="flex justify-between items-center text-[0.85rem] font-semibold mb-1.5">
                  <span className={`flex items-center gap-2 ${theme.textClass}`}>
                    {theme.icon} {alloc.name} ({alloc.percentage}%)
                  </span>
                  <span className={`font-bold ${theme.textClass}`}>
                    Rp {alloc.amount.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="bg-main h-2.5 rounded-full overflow-hidden">
                  <div className={`${theme.bgClass} h-full rounded-full`} style={{ width: `${alloc.percentage}%` }}></div>
                </div>
              </div>
            );
          })}

          {/* Sisa / Profit Owner */}
          <div className="bg-purple-500/10 p-3 rounded-lg border border-purple-500/20 mt-1">
            <div className="flex justify-between items-center text-[0.85rem] font-bold mb-1.5">
               <span className="flex items-center gap-2 text-purple-600">
                 <TrendingUp size={15} /> Sisa Bersih Owner / Belum Dialokasikan
               </span>
               <span className="text-purple-600 font-extrabold">
                 Rp {budget.remaining_amount.toLocaleString('id-ID')} ({budget.remaining_percentage}%)
               </span>
            </div>
            <div className="bg-main h-2.5 rounded-full overflow-hidden mb-2">
               <div className="bg-purple-500 h-full rounded-full" style={{ width: `${budget.remaining_percentage}%` }}></div>
            </div>
            <div className="text-[0.72rem] text-muted">*Sisa persen dari 100% total kas yang dibagikan.</div>
          </div>
        </div>
      </div>

      {/* Tabel Rincian */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
          <div className="flex items-center gap-2 font-bold text-lg text-text">
            <Percent size={20} className="text-primary" />
            <span>Rincian Pembagian Kantong Kas (Budget Ledger)</span>
          </div>
        </div>
        
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-main text-text-secondary border-b border-border">
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider text-left">Pos Kantong Alokasi</th>
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider text-center">Tipe Anggaran</th>
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider text-right">Nominal Alokasi (Rp)</th>
              </tr>
            </thead>
            <tbody>
              {budget.allocations.map((alloc, idx) => {
                 const theme = getBudgetTheme(alloc.name);
                 return (
                   <tr key={idx} className="border-b border-border hover:bg-main/30 transition-colors">
                     <td className={`px-4 py-3.5 font-bold flex items-center gap-2 ${theme.textClass}`}>
                       {theme.icon} {alloc.name}
                     </td>
                     <td className="px-4 py-3.5 text-center">
                       <span className="text-[0.7rem] bg-main px-2 py-1 rounded-md border border-border font-bold text-text-secondary">
                         {alloc.percentage}% Omset
                       </span>
                     </td>
                     <td className={`px-4 py-3.5 font-extrabold text-right ${theme.textClass}`}>
                       {formatCurrency(alloc.amount)}
                     </td>
                   </tr>
                 );
              })}
              <tr className="bg-purple-500/5">
                <td className="px-4 py-3.5 font-extrabold text-purple-600 flex items-center gap-2">
                  <TrendingUp size={16} /> Profit Sisa Belum Dialokasikan
                </td>
                <td className="px-4 py-3.5 text-center">
                  <span className="text-[0.7rem] bg-purple-500 text-white px-2 py-1 rounded-md font-bold">
                    Sisa Kas ({budget.remaining_percentage}%)
                  </span>
                </td>
                <td className="px-4 py-3.5 font-black text-purple-600 text-right">
                  {formatCurrency(budget.remaining_amount)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
