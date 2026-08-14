import React from 'react';
import { Card } from '../common/Card';
import { Table } from '../common/Table';
import { formatCurrency } from '../../utils/format';
import { BarChart3 } from 'lucide-react';

export const WasteAnalysis = ({ analysis, loading }) => {
  if (loading) {
    return (
      <div className="w-full bg-card border border-border rounded-xl shadow-sm p-8 text-center text-muted">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        Menganalisis data barang terbuang...
      </div>
    );
  }

  if (!analysis) return null;

  const { summary, by_reason, top_wasted_items, daily_waste } = analysis;

  return (
    <div className="mt-6 flex flex-col gap-6">
      <div className="flex items-center gap-2 text-lg font-bold text-text mb-2 border-b border-border pb-3">
        <BarChart3 className="text-primary w-6 h-6" />
        Analisis Waste
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-main border border-border rounded-lg p-4">
          <div className="text-xs text-text-secondary uppercase mb-1">Total Kerugian</div>
          <div className="text-xl font-bold text-danger">{formatCurrency(summary?.total_loss || 0)}</div>
        </div>
        <div className="bg-main border border-border rounded-lg p-4">
          <div className="text-xs text-text-secondary uppercase mb-1">Total Quantity</div>
          <div className="text-xl font-bold text-text">{summary?.total_quantity || 0}</div>
        </div>
        <div className="bg-main border border-border rounded-lg p-4">
          <div className="text-xs text-text-secondary uppercase mb-1">Total Pencatatan</div>
          <div className="text-xl font-bold text-text">{summary?.total_records || 0}</div>
        </div>
        <div className="bg-main border border-border rounded-lg p-4">
          <div className="text-xs text-text-secondary uppercase mb-1">Rata-rata Kerugian</div>
          <div className="text-xl font-bold text-text">{formatCurrency(summary?.average_loss_per_record || 0)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card header="Waste Berdasarkan Alasan">
          <div className="space-y-4 mt-2">
            {by_reason && by_reason.length > 0 ? (
              by_reason.map((item, idx) => {
                const percentage = summary?.total_loss > 0 ? (item.total_loss / summary.total_loss) * 100 : 0;
                return (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold text-text">{item.reason}</span>
                      <span className="text-text-secondary">{formatCurrency(item.total_loss)}</span>
                    </div>
                    <div className="w-full bg-border/50 rounded-full h-2">
                      <div
                        className="bg-warning h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-sm text-text-secondary text-center py-4">Data tidak tersedia</div>
            )}
          </div>
        </Card>

        <Card header="Barang Paling Banyak Terbuang (Top 10)">
          <div className="w-full overflow-x-auto mt-2">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-main text-text-secondary border-b border-border">
                  <th className="px-3 py-2 font-semibold">Barang</th>
                  <th className="px-3 py-2 font-semibold text-right">Qty</th>
                  <th className="px-3 py-2 font-semibold text-right">Kerugian</th>
                </tr>
              </thead>
              <tbody>
                {top_wasted_items && top_wasted_items.length > 0 ? (
                  top_wasted_items.map((item, idx) => (
                    <tr key={idx} className="border-b border-border/50">
                      <td className="px-3 py-2 text-text font-medium">{item.name || '-'}</td>
                      <td className="px-3 py-2 text-text-secondary text-right">{item.quantity}</td>
                      <td className="px-3 py-2 text-danger font-semibold text-right">{formatCurrency(item.total_loss)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-4 text-text-secondary text-sm">Data tidak tersedia</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};
