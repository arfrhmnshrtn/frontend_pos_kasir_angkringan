import React, { useState } from 'react';
import { Flame, TrendingUp, Calendar } from 'lucide-react';

export default function SalesChart() {
  const [timeRange, setTimeRange] = useState('minggu');

  // Sample sales trend data
  const dataMap = {
    minggu: [
      { day: 'Sen', val: 65, total: 'Rp 1.2M' },
      { day: 'Sel', val: 80, total: 'Rp 1.6M' },
      { day: 'Rab', val: 75, total: 'Rp 1.4M' },
      { day: 'Kam', val: 90, total: 'Rp 1.9M' },
      { day: 'Jum', val: 100, total: 'Rp 2.4M' },
      { day: 'Sab', val: 120, total: 'Rp 3.1M' },
      { day: 'Min', val: 110, total: 'Rp 2.8M' },
    ],
    bulan: [
      { day: 'W1', val: 70, total: 'Rp 8.5M' },
      { day: 'W2', val: 85, total: 'Rp 10.2M' },
      { day: 'W3', val: 95, total: 'Rp 11.8M' },
      { day: 'W4', val: 115, total: 'Rp 14.5M' },
    ]
  };

  const activeData = dataMap[timeRange] || dataMap['minggu'];

  const topMenuItems = [
    { rank: 1, name: 'Sate Kulit Bakar', sales: '438 Porsi', price: 'Rp 3.000' },
    { rank: 2, name: 'Nasi Kucing Teri', sales: '382 Porsi', price: 'Rp 4.000' },
    { rank: 3, name: 'Es Teh Manis Jumbo', sales: '310 Gelas', price: 'Rp 4.000' },
    { rank: 4, name: 'Sate Usus Pedas', sales: '295 Porsi', price: 'Rp 3.000' },
    { rank: 5, name: 'Wedang Jahe Rempah', sales: '210 Gelas', price: 'Rp 6.000' },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
      {/* Chart Card */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-6 xl:col-span-2 flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
          <div className="flex items-center gap-2 font-bold text-lg text-text">
            <TrendingUp size={20} className="text-primary" />
            <span>Grafik Omset Penjualan</span>
          </div>

          <div className="flex gap-1.5 p-1 bg-main border border-border rounded-lg">
            <button 
              className={`px-4 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${timeRange === 'minggu' ? 'bg-card shadow-sm text-text' : 'text-text-secondary hover:text-text'}`}
              onClick={() => setTimeRange('minggu')}
            >
              Mingguan
            </button>
            <button 
              className={`px-4 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${timeRange === 'bulan' ? 'bg-card shadow-sm text-text' : 'text-text-secondary hover:text-text'}`}
              onClick={() => setTimeRange('bulan')}
            >
              Bulanan
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col mt-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Total Estimasi Omset ({timeRange})</div>
              <div className="text-3xl font-extrabold text-text tracking-tight">
                {timeRange === 'minggu' ? 'Rp 14.400.000' : 'Rp 45.000.000'}
              </div>
            </div>
            <div className="bg-card border border-border px-3 py-1.5 rounded-lg text-xs font-semibold text-text-secondary flex items-center gap-1.5 shadow-sm">
              <Calendar size={14} />
              <span>Agustus 2026</span>
            </div>
          </div>

          <div className="flex items-end justify-between h-[200px] mt-auto">
            {activeData.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="text-[0.65rem] font-bold text-muted opacity-0 group-hover:opacity-100 transition-opacity -translate-y-2 group-hover:translate-y-0">{item.total}</div>
                <div className="w-full max-w-[32px] bg-main rounded-md h-full flex items-end overflow-hidden">
                  <div 
                    className="w-full bg-gradient-to-t from-primary/80 to-primary rounded-md transition-all duration-500 ease-out group-hover:from-primary group-hover:to-primary-hover relative shadow-[0_0_10px_rgba(37,99,235,0.2)]" 
                    style={{ height: `${(item.val / 120) * 100}%` }}
                    title={`${item.day}: ${item.total}`}
                  />
                </div>
                <span className="text-[0.7rem] font-semibold text-text-secondary mt-1">{item.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Items Card */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-6 xl:col-span-1">
        <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
          <div className="flex items-center gap-2 font-bold text-lg text-text">
            <Flame size={20} className="text-primary" />
            <span>Menu Terfavorit</span>
          </div>
          <span className="text-xs font-medium text-muted bg-main px-2 py-1 rounded">Minggu ini</span>
        </div>

        <div className="flex flex-col gap-3">
          {topMenuItems.map((item) => (
            <div key={item.rank} className="flex items-center justify-between p-3 rounded-xl bg-main border border-border/50 hover:border-primary/30 hover:bg-card hover:shadow-sm transition-all hover:translate-x-1 group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-light text-primary font-black text-sm flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                  #{item.rank}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-text leading-tight mb-0.5">{item.name}</span>
                  <span className="text-[0.7rem] font-semibold text-text-secondary">{item.sales} terjual</span>
                </div>
              </div>
              <div className="font-extrabold text-[0.85rem] text-primary">{item.price}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
