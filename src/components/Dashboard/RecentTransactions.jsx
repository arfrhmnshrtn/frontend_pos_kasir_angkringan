import React from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../utils/format';
import { Badge } from '../common/Badge';

export const RecentTransactions = ({ transactions }) => {
  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col lg:col-span-1">
      <div className="p-5 border-b border-border bg-main/30">
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
          Pengeluaran Terbaru
        </h3>
      </div>
      
      {!transactions || transactions.length === 0 ? (
        <div className="p-6 flex items-center justify-center text-sm text-text-secondary">
          Tidak ada data pengeluaran.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-main text-text-secondary border-b border-border">
              <tr>
                <th className="p-4 font-semibold text-xs uppercase tracking-wider">Tipe</th>
                <th className="p-4 font-semibold text-xs uppercase tracking-wider text-right">Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {transactions.map((trx, idx) => (
                <tr key={idx} className="hover:bg-main/30 transition-colors">
                  <td className="p-4">
                    <Badge variant={trx.tipe === 'Bahan Baku' ? 'warning' : 'primary'} size="sm">
                      {trx.tipe}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-slate-500 font-medium">{item.kategori?.nama || '-'}</td>
                  <td className={`px-5 py-4 text-right font-black ${item.jenis === 'pemasukan' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {formatCurrency(item.nominal)}
                  </td>
                  <td className="px-5 py-4 font-bold text-slate-500">{getMethodLabel(item.metode_pembayaran)}</td>
                  <td className="px-5 py-4 text-slate-500 font-medium truncate max-w-50" title={item.keterangan}>{item.keterangan || '-'}</td>
                  <td className="px-5 py-4 text-slate-500 font-medium whitespace-nowrap">{formatDateTime(item.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
