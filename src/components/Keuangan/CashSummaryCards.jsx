import React from 'react';
import { Wallet, ArrowDownLeft, ArrowUpRight, TrendingUp, HandCoins, CreditCard, BarChart3, ShoppingCart, Package, Percent } from 'lucide-react';
import { formatCurrency } from '../../utils/format';

export const CashSummaryCards = ({ reportData, loading }) => {
  if (loading || !reportData) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7].map(i => (
          <div key={i} className="bg-card border border-border rounded-xl p-4 shadow-sm h-24 animate-pulse flex items-start gap-3">
            <div className="w-9 h-9 bg-muted/20 rounded-lg shrink-0"></div>
            <div className="flex flex-col gap-2 w-full mt-1">
              <div className="h-3 bg-muted/20 rounded w-1/3"></div>
              <div className="h-5 bg-muted/20 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const { summary, profit, debt, sales, cash_flow } = reportData;

  const summaryCards = [
    {
      title: 'Total Kas Masuk',
      value: cash_flow?.total_cash_in || summary?.total_cash_in || 0,
      icon: <ArrowDownLeft size={18} />,
      color: 'emerald',
      desc: 'Penjualan + Pemasukan lain'
    },
    {
      title: 'Total Omzet',
      value: profit?.total_revenue || sales?.total_revenue || 0,
      icon: <ShoppingCart size={18} />,
      color: 'emerald',
      desc: 'Total penjualan pesanan LUNAS'
    },
    {
      title: 'HPP (Harga Pokok)',
      value: profit?.total_cost || 0,
      icon: <Package size={18} />,
      color: 'amber',
      desc: 'Harga modal produk terjual'
    },
    {
      title: 'Pemasukan Lainnya',
      value: profit?.other_income || 0,
      icon: <ArrowDownLeft size={18} />,
      color: 'emerald',
      desc: 'Pemasukan di luar pesanan'
    },
    {
      title: 'Laba Kotor',
      value: profit?.gross_profit || 0,
      icon: <BarChart3 size={18} />,
      color: 'blue',
      desc: '(Omzet + Pemasukan Lain) - HPP',
      isNet: true
    },
    {
      title: 'Total Pengeluaran',
      value: profit?.total_expense || 0,
      icon: <ArrowUpRight size={18} />,
      color: 'danger',
      desc: 'Total Semua Pengeluaran'
    },
    {
      title: 'Laba Bersih',
      value: profit?.net_profit || 0,
      icon: <TrendingUp size={18} />,
      color: 'purple',
      desc: 'Laba Kotor - Pengeluaran',
      isNet: true
    },
    {
      title: 'Piutang Belum Lunas',
      value: debt?.remaining_receivable || 0,
      icon: <CreditCard size={18} />,
      color: 'amber',
      desc: 'Tagihan pelanggan yang belum dibayar'
    }
  ];

  const renderCard = (card, idx) => {
    const isNegativeNet = card.isNet && card.value < 0;
    const colorClass = card.color === 'blue' ? 'text-blue-500 bg-blue-500/10' :
                       card.color === 'emerald' ? 'text-emerald-500 bg-emerald-500/10' :
                       card.color === 'danger' ? 'text-danger bg-danger/10' :
                       card.color === 'purple' ? 'text-purple-500 bg-purple-500/10' :
                       card.color === 'success' ? 'text-success bg-success-bg' :
                       'text-amber-500 bg-amber-500/10';

    const textClass = card.color === 'blue' ? 'text-blue-500' :
                      card.color === 'emerald' ? 'text-emerald-500' :
                      card.color === 'danger' ? 'text-danger' :
                      card.color === 'purple' ? 'text-purple-500' :
                      card.color === 'success' ? 'text-success' :
                      'text-amber-500';

    return (
      <div key={idx} className="bg-card border border-border rounded-xl p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}>
            {card.icon}
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <div className="text-xs text-text-secondary font-bold uppercase tracking-wider mb-0.5">{card.title}</div>
            <div className={`text-[1.3rem] font-extrabold tracking-tight truncate ${isNegativeNet ? 'text-danger' : textClass}`}>
              {isNegativeNet ? '-' : ''}
              {formatCurrency(Math.abs(card.value))}
            </div>
            <div className="text-[0.7rem] text-muted mt-1 leading-snug line-clamp-2">
              {card.desc}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {summaryCards.map((card, idx) => renderCard(card, idx))}
    </div>
  );
};

