import React from 'react';
import { ShoppingBag, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export const OrderSummary = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-card border border-border rounded-xl p-5 md:p-6 shadow-sm flex flex-col justify-between">
      
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
          Status Pesanan
        </h3>
        <span className="text-[10px] font-bold bg-primary-light text-primary px-2 py-0.5 rounded border border-primary/20">HARI INI</span>
      </div>

      <div className="grid grid-cols-2 gap-3 flex-1 content-center">
        {/* Total Box */}
        <div className="col-span-2 flex items-center justify-between border border-primary/30 bg-primary/5 rounded-lg p-3">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-white p-2 rounded shadow-sm">
              <ShoppingBag size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none mb-1">Total Pesanan</p>
              <h4 className="text-xl font-extrabold text-text leading-none">{data.total}</h4>
            </div>
          </div>
        </div>

        {/* Lunas */}
        <div className="border border-border rounded-lg p-3 bg-main/50 flex flex-col justify-between h-full hover:border-success/40 transition-colors">
          <div className="flex items-center gap-1.5 mb-2 text-success">
            <CheckCircle size={14} />
            <p className="text-[10px] font-bold uppercase tracking-widest">Lunas</p>
          </div>
          <p className="text-xl font-extrabold text-text leading-none">{data.lunas}</p>
        </div>

        {/* Belum Bayar */}
        <div className="border border-border rounded-lg p-3 bg-main/50 flex flex-col justify-between h-full hover:border-warning/40 transition-colors">
          <div className="flex items-center gap-1.5 mb-2 text-amber-500">
            <Clock size={14} />
            <p className="text-[10px] font-bold uppercase tracking-widest">Pending</p>
          </div>
          <p className="text-xl font-extrabold text-text leading-none">{data.belum_bayar}</p>
        </div>

        {/* Hutang */}
        <div className="col-span-2 border border-border rounded-lg p-3 bg-main/50 flex items-center justify-between hover:border-danger/40 transition-colors mt-1">
          <div className="flex items-center gap-2 text-danger">
            <AlertCircle size={16} />
            <p className="text-xs font-bold uppercase tracking-wider">Hutang Kasbon</p>
          </div>
          <p className="text-lg font-extrabold text-text">{data.hutang}</p>
        </div>
      </div>
    </div>
  );
};
