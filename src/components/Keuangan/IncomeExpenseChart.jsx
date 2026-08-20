import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/format';
import { Activity } from 'lucide-react';

export const IncomeExpenseChart = ({ flowData, loading }) => {
  if (loading) {
    return <div className="bg-card border border-border rounded-xl p-6 h-100 animate-pulse shadow-sm flex items-center justify-center text-muted">Memuat grafik arus kas...</div>;
  }

  if (!flowData || flowData.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 h-100 flex flex-col items-center justify-center text-text-secondary shadow-sm">
        <Activity size={40} className="text-muted mb-3 opacity-50" />
        <p className="font-medium">Belum ada data arus kas untuk ditampilkan.</p>
        <p className="text-sm mt-1 text-muted">Pilih rentang tanggal yang memiliki transaksi.</p>
      </div>
    );
  }

  const formatYAxis = (tick) => {
    if (tick >= 1000000) return `Rp ${tick / 1000000}M`;
    if (tick >= 1000) return `Rp ${tick / 1000}k`;
    return tick;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border p-3 rounded-lg shadow-xl shadow-black/5 text-sm">
          <p className="font-bold mb-2 border-b border-border pb-1 text-text">{new Date(label).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4 py-0.5">
              <span style={{ color: entry.color }} className="font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
                {entry.name}
              </span>
              <span className="font-bold text-text">{formatCurrency(entry.value)}</span>
            </div>
          ))}
          {/* Net Cash Flow Diff */}
          {payload.length >= 2 && (
             <div className="flex items-center justify-between gap-4 py-1 mt-2 border-t border-border/50">
               <span className="font-bold text-text-secondary">Cash Flow Bersih</span>
               <span className={`font-bold ${payload[0].value - payload[1].value >= 0 ? 'text-success' : 'text-danger'}`}>
                 {formatCurrency(payload[0].value - payload[1].value)}
               </span>
             </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
         <div className="flex items-center gap-2 font-bold text-lg text-text">
           <Activity size={20} className="text-primary" />
           <span>Trend Pemasukan vs Pengeluaran</span>
         </div>
         <div className="flex gap-4">
           <div className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary">
             <div className="w-3 h-3 rounded-sm bg-success/80"></div>
             Pemasukan
           </div>
           <div className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary">
             <div className="w-3 h-3 rounded-sm bg-danger/80"></div>
             Pengeluaran
           </div>
         </div>
      </div>
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={flowData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorCashIn" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorCashOut" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="date" tickFormatter={(val) => new Date(val).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
            <YAxis tickFormatter={formatYAxis} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dx={-10} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" name="Pemasukan" dataKey="cash_in" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCashIn)" />
            <Area type="monotone" name="Pengeluaran" dataKey="cash_out" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorCashOut)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
