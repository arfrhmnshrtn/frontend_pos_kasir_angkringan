import React from 'react';
import { formatCurrency } from '../../utils/format';
import { TrendingUp, TrendingDown, Clock, UtensilsCrossed, Receipt, Wallet, BadgeCheck, AlertCircle } from 'lucide-react';
import { Badge } from '../common/Badge';

export const AllTimeStats = ({ data }) => {
  if (!data) return null;
  const isProfit = data.laba >= 0;

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 border-b border-border bg-main/30 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Clock size={20} className="text-text-secondary" />
          <h2 className="text-base font-bold text-text">Dataset Seluruh Waktu</h2>
        </div>
        <span className="text-xs font-semibold text-text-secondary uppercase tracking-widest bg-main px-3 py-1 rounded-md border border-border">Live Monitoring</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-border">
        {/* Laba Bersih Utama */}
        <div className="p-6 lg:col-span-2 flex flex-col justify-between">
          <div>
            <p className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">Total Laba Bersih</p>
            <div className="flex items-end gap-3 mb-6">
              <h3 className={`text-4xl font-extrabold tracking-tight ${isProfit ? 'text-emerald-600' : 'text-rose-600'}`}>
                {formatCurrency(data.laba)}
              </h3>
              <div className={`p-1.5 rounded bg-main border border-border flex items-center shadow-sm ${isProfit ? 'text-emerald-600' : 'text-rose-600'}`}>
                {isProfit ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-border rounded-lg p-4 bg-primary/5">
              <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1 flex items-center gap-1"><BadgeCheck size={12}/> Pemasukan</p>
              <p className="text-lg font-bold text-text">{formatCurrency(data.pemasukan)}</p>
            </div>
            <div className="border border-border rounded-lg p-4 bg-rose-500/5">
              <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1 flex items-center gap-1"><Wallet size={12}/> Pengeluaran</p>
              <p className="text-lg font-bold text-text">{formatCurrency(data.pengeluaran)}</p>
            </div>
          </div>
        </div>

        {/* Info Grid Lanjutan */}
        <div className="p-0 flex flex-col divide-y divide-border lg:col-span-2">
          
          <div className="grid grid-cols-2 divide-x divide-border flex-1">
            <div className="p-6 flex flex-col justify-between group hover:bg-main/20 transition-colors">
              <Receipt className="text-primary mb-3" size={24} />
              <div>
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Total Transaksi</p>
                <p className="text-2xl font-bold text-text">{data.total_pesanan}</p>
              </div>
            </div>
            <div className="p-6 flex flex-col justify-between group hover:bg-main/20 transition-colors">
              <UtensilsCrossed className="text-amber-500 mb-3" size={24} />
              <div>
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Menu Terdaftar</p>
                <p className="text-2xl font-bold text-text">{data.total_menu}</p>
              </div>
            </div>
          </div>

          <div className="p-6 flex items-center justify-between group hover:bg-main/20 transition-colors bg-rose-500/5">
            <div className="flex items-center gap-4">
              <AlertCircle size={24} className="text-rose-500" />
              <div>
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Total Hutang Berjalan</p>
                <div className="flex items-center gap-3">
                  <p className="text-2xl font-extrabold text-rose-600">{formatCurrency(data.hutang_aktif)}</p>
                  {data.hutang_aktif > 0 && <Badge variant="danger" size="sm">Menunggu Pembayaran</Badge>}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
