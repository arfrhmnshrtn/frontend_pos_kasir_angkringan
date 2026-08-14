import React from 'react';
import { Trash2, DollarSign, Package, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../../utils/format';

export const WasteSummary = ({ summary }) => {
  const totalItemQty = summary?.total_waste_quantity || 0;
  const totalKerugian = summary?.total_waste_amount || 0;
  const totalRecords = summary?.total_records || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md flex flex-col gap-3 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="w-11 h-11 rounded-lg flex items-center justify-center bg-red-500/10 text-red-500">
            <Trash2 size={22} />
          </div>
          <div className="inline-flex items-center gap-1 text-[0.75rem] font-bold px-2 py-1 rounded-full bg-danger-bg text-danger">
            <TrendingDown size={14} />
            <span>Waste Log</span>
          </div>
        </div>
        <div>
          <div className="text-[1.6rem] font-extrabold text-text tracking-tight">{totalItemQty} Item</div>
          <div className="text-[0.85rem] text-text-secondary font-medium">Total Barang Terbuang</div>
          <div className="text-[0.75rem] text-muted mt-1">
            Dari {totalRecords} pencatatan kebocoran
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md flex flex-col gap-3 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="w-11 h-11 rounded-lg flex items-center justify-center bg-amber-500/10 text-amber-500">
            <DollarSign size={22} />
          </div>
        </div>
        <div>
          <div className="text-[1.6rem] font-extrabold text-danger tracking-tight">{formatCurrency(totalKerugian)}</div>
          <div className="text-[0.85rem] text-text-secondary font-medium">Total Estimasi Kerugian</div>
          <div className="text-[0.75rem] text-muted mt-1">
            Berdasarkan Harga Modal (HPP)
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md flex flex-col gap-3 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="w-11 h-11 rounded-lg flex items-center justify-center bg-blue-500/10 text-blue-500">
            <Package size={22} />
          </div>
        </div>
        <div>
          <div className="text-[1.6rem] font-extrabold text-text tracking-tight">{totalRecords}</div>
          <div className="text-[0.85rem] text-text-secondary font-medium">Total Pencatatan</div>
          <div className="text-[0.75rem] text-muted mt-1">
            Record log waste terbentuk
          </div>
        </div>
      </div>
    </div>
  );
};
