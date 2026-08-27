import React from 'react';
import { formatCurrency, formatDateTime } from '../../utils/format';
import { Badge } from '../common/Badge';

export const RecentOrders = ({ orders }) => {
  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col lg:col-span-2">
      <div className="p-5 border-b border-border bg-main/30">
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
          Pesanan Terakhir (5 Transaksi)
        </h3>
      </div>
      
      {!orders || orders.length === 0 ? (
        <div className="p-6 flex items-center justify-center text-sm text-text-secondary">
          Belum ada pesanan terbaru hari ini.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-main text-text-secondary border-b border-border">
              <tr>
                <th className="p-4 font-semibold text-xs uppercase tracking-wider">Waktu</th>
                <th className="p-4 font-semibold text-xs uppercase tracking-wider">Pelanggan</th>
                <th className="p-4 font-semibold text-xs uppercase tracking-wider">Total</th>
                <th className="p-4 font-semibold text-xs uppercase tracking-wider text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order, idx) => (
                <tr key={idx} className="hover:bg-main/30 transition-colors">
                  <td className="p-4 text-text-secondary">{formatDateTime(order.created_at)}</td>
                  <td className="p-4 font-semibold text-text">
                    {order.nama_pelanggan || 'Guest'}
                  </td>
                  <td className="p-4 font-bold text-text">
                    {formatCurrency(order.total_harga)}
                  </td>
                  <td className="p-4 text-right">
                    <Badge
                      variant={order.status === 'lunas' ? 'success' : order.status === 'hutang' ? 'danger' : 'warning'}
                      size="sm"
                    >
                      {order.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
