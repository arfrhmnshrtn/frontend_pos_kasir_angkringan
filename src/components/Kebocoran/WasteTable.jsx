import React from 'react';
import { Trash2, Edit3, Eye } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/format';
import { Badge } from '../common/Badge';

export const WasteTable = ({
  wastes,
  loading,
  onDetail,
  onEdit,
  onDelete,
  hasPermission
}) => {
  const getReasonBadgeClass = (reasonText) => {
    const r = (reasonText || '').toUpperCase();
    if (r === 'BASI' || r === 'KADALUARSA') return 'warning';
    if (r === 'RUSAK' || r === 'GOSONG' || r === 'JATUH') return 'danger';
    return 'primary';
  };

  const getReasonLabel = (r) => {
    switch (r) {
      case 'BASI': return 'Basi';
      case 'KADALUARSA': return 'Kadaluarsa';
      case 'RUSAK': return 'Rusak';
      case 'GOSONG': return 'Gosong';
      case 'JATUH': return 'Jatuh';
      case 'SALAH_PRODUKSI': return 'Salah Produksi';
      case 'SISA_PRODUKSI': return 'Sisa Produksi';
      case 'HILANG': return 'Hilang';
      case 'LAINNYA': return 'Lainnya';
      default: return r;
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-card border border-border rounded-xl shadow-sm p-8 text-center text-muted">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        Memuat data barang terbuang...
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto bg-card border border-border rounded-xl shadow-sm">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="bg-main text-text-secondary border-b border-border">
            <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">No</th>
            <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Barang</th>
            <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Jenis</th>
            <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Jumlah</th>
            <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">HPP</th>
            <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Kerugian</th>
            <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Alasan</th>
            <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Waktu</th>
            <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {wastes.length > 0 ? (
            wastes.map((log, idx) => (
              <tr key={log.id} className="border-b border-border hover:bg-main/30 transition-colors">
                <td className="px-4 py-3.5 text-text-secondary">{idx + 1}</td>
                <td className="px-4 py-3.5 font-bold text-text">{log.item_name || 'Tidak Diketahui'}</td>
                <td className="px-4 py-3.5 text-xs text-text-secondary">
                  {log.type === 'PRODUCT' ? 'Produk/Menu' : 'Bahan Baku'}
                </td>
                <td className="px-4 py-3.5 font-bold text-text">{log.quantity} {log.unit}</td>
                <td className="px-4 py-3.5 text-text">{formatCurrency(log.cost_per_unit)}</td>
                <td className="px-4 py-3.5 font-extrabold text-danger">
                  {formatCurrency(log.total_loss)}
                </td>
                <td className="px-4 py-3.5">
                  <Badge variant={getReasonBadgeClass(log.reason)} size="sm">
                    {getReasonLabel(log.reason)}
                  </Badge>
                </td>
                <td className="px-4 py-3.5 text-xs text-text-secondary">
                  {formatDate(log.created_at, { hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="px-4 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5 flex-nowrap">
                    <button 
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-primary hover:bg-primary-light transition-colors" 
                      title="Detail"
                      onClick={() => onDetail(log)}
                    >
                      <Eye size={16} />
                    </button>
                    {hasPermission('waste.update') && (
                      <button 
                         className="w-8 h-8 flex items-center justify-center rounded-lg text-warning hover:bg-warning-bg transition-colors" 
                         title="Edit Catatan"
                         onClick={() => onEdit(log)}
                       >
                         <Edit3 size={16} />
                       </button>
                    )}
                    {hasPermission('waste.delete') && (
                      <button 
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-danger hover:text-white hover:bg-danger transition-colors" 
                        title="Hapus Catatan"
                        onClick={() => onDelete(log)}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center py-10 text-text-secondary flex flex-col items-center justify-center gap-2">
                <Trash2 size={40} className="text-muted" />
                <span>Belum ada pencatatan barang terbuang.</span>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
