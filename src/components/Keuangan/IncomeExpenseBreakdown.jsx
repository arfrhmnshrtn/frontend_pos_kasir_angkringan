import React from 'react';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { formatCurrency } from '../../utils/format';

export const IncomeExpenseBreakdown = ({ incomeBreakdown, expenseBreakdown, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start animate-pulse">
        <div className="bg-card border border-border rounded-xl h-75"></div>
        <div className="bg-card border border-border rounded-xl h-75"></div>
      </div>
    );
  }

  // --- INCOME UI ---
  const incomeTotal = incomeBreakdown ? (incomeBreakdown.pos + incomeBreakdown.debt_payment + incomeBreakdown.manual_income) : 0;
  
  const incomes = [
    { name: 'Penjualan', value: incomeBreakdown?.pos || 0, color: 'text-emerald-500', bg: 'bg-emerald-500/10', bar: 'bg-emerald-500' },
    { name: 'Pelunasan Hutang', value: incomeBreakdown?.debt_payment || 0, color: 'text-success', bg: 'bg-success-bg', bar: 'bg-success' },
    { name: 'Pemasukan Lain-lain', value: incomeBreakdown?.manual_income || 0, color: 'text-blue-500', bg: 'bg-blue-100', bar: 'bg-blue-500' }
  ].filter(i => i.value > 0);
  
  incomes.sort((a,b) => b.value - a.value);

  // --- EXPENSE UI ---
  let expenseTotal = 0;
  const expenses = (expenseBreakdown || []).map(e => {
    expenseTotal += e.total_amount;
    return { name: e.category, value: e.total_amount, color: 'text-danger', bg: 'bg-danger/10', bar: 'bg-danger' };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
      
      {/* INCOME BLOCK */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
          <div className="flex items-center gap-2 font-bold text-lg text-text">
            <ArrowDownLeft size={20} className="text-emerald-500" />
            <span>Rincian Pemasukan Kas</span>
          </div>
          <span className="font-extrabold text-emerald-500">{formatCurrency(incomeTotal)}</span>
        </div>
        <div className="flex flex-col gap-4 mt-2">
          {incomes.length > 0 ? incomes.map((inc, i) => {
            const pct = ((inc.value / incomeTotal) * 100) || 0;
            return (
              <div key={i} className="flex flex-col gap-1.5">
                <div className="flex justify-between items-end">
                  <div className="font-semibold text-text text-sm">{inc.name}</div>
                  <div className="font-bold text-sm text-text-secondary">{formatCurrency(inc.value)} <span className="text-xs text-muted font-normal ml-1">({pct.toFixed(1)}%)</span></div>
                </div>
                <div className="bg-main h-2 rounded-full overflow-hidden">
                   <div className={`${inc.bar} h-full rounded-full`} style={{ width: `${pct}%` }}></div>
                </div>
              </div>
            );
          }) : (
            <div className="py-8 text-center text-muted text-sm border-2 border-dashed border-border rounded-lg">Belum ada rincian pemasukan</div>
          )}
        </div>
      </div>

      {/* EXPENSE BLOCK */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
          <div className="flex items-center gap-2 font-bold text-lg text-text">
            <ArrowUpRight size={20} className="text-danger" />
            <span>Kategori Pengeluaran</span>
          </div>
          <span className="font-extrabold text-danger">{formatCurrency(expenseTotal)}</span>
        </div>
        <div className="flex flex-col gap-4 mt-2">
          {expenses.length > 0 ? expenses.map((exp, i) => {
            const pct = ((exp.value / expenseTotal) * 100) || 0;
            return (
              <div key={i} className="flex flex-col gap-1.5">
                <div className="flex justify-between items-end">
                  <div className="font-semibold text-text text-sm">{exp.name}</div>
                  <div className="font-bold text-sm text-text-secondary">{formatCurrency(exp.value)} <span className="text-xs text-muted font-normal ml-1">({pct.toFixed(1)}%)</span></div>
                </div>
                <div className="bg-main h-2 rounded-full overflow-hidden">
                   <div className={`bg-danger h-full rounded-full`} style={{ width: `${pct}%` }}></div>
                </div>
              </div>
            );
          }) : (
            <div className="py-8 text-center text-muted text-sm border-2 border-dashed border-border rounded-lg">Belum ada rincian pengeluaran</div>
          )}
        </div>
      </div>

    </div>
  );
}
