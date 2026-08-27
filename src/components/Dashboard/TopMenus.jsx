import React from 'react';
import { Flame } from 'lucide-react';

export const TopMenus = ({ data }) => {
  return (
    <div className="bg-card border border-border rounded-xl shadow-sm flex flex-col h-full">
      <div className="flex justify-between items-center p-5 border-b border-border">
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-2">
          <Flame size={16} className="text-orange-500" /> Menu Terlaris (Top 10)
        </h3>
      </div>

      {!data || data.length === 0 ? (
        <div className="flex-1 p-6 flex flex-col items-center justify-center text-text-secondary">
          Belum ada data penjualan menu.
        </div>
      ) : (
        <div className="flex flex-col flex-1 divide-y divide-border overflow-y-auto w-full">
          {data.map((item, index) => {
            const isTop3 = index < 3;
            return (
              <div key={index} className="flex flex-wrap items-center justify-between p-4 hover:bg-main/30 transition-colors">
                <div className="flex items-center gap-3 min-w-0 pr-4">
                  <div className={`w-8 h-8 shrink-0 rounded flex items-center justify-center text-xs font-bold ${isTop3 ? 'bg-orange-100 text-orange-600 border border-orange-200' : 'bg-main text-text-secondary border border-border'}`}>
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-text text-sm truncate">
                      {item.nama_menu}
                    </h4>
                  </div>
                </div>
                <div className="text-right whitespace-nowrap">
                  <span className="font-extrabold text-primary">{item.total_terjual}</span>
                  <span className="text-xs font-medium text-text-secondary ml-1">porsi</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
