import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { formatCurrency, formatDate } from '../../utils/format';

export const WasteDetailModal = ({ isOpen, onClose, waste }) => {
  if (!waste) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detail Barang Terbuang"
      maxWidth="max-w-md"
    >
      <div className="space-y-4 text-sm text-text">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
          <div>
            <span className="block text-xs text-text-secondary font-semibold uppercase">Barang</span>
            <span className="font-bold">{waste.item_name || '-'}</span>
          </div>
          <div>
            <span className="block text-xs text-text-secondary font-semibold uppercase">Jenis</span>
            <span>{waste.type === 'PRODUCT' ? 'Produk/Menu' : 'Bahan Baku'}</span>
          </div>
          
          <div>
            <span className="block text-xs text-text-secondary font-semibold uppercase">Jumlah</span>
            <span>{waste.quantity} {waste.unit}</span>
          </div>
          <div>
            <span className="block text-xs text-text-secondary font-semibold uppercase">HPP (Harga Modal)</span>
            <span>{formatCurrency(waste.cost_per_unit)}</span>
          </div>

          <div>
            <span className="block text-xs text-text-secondary font-semibold uppercase">Kerugian</span>
            <span className="font-bold text-danger">{formatCurrency(waste.total_loss)}</span>
          </div>
          <div>
            <span className="block text-xs text-text-secondary font-semibold uppercase">Alasan</span>
            <span>{waste.reason}</span>
          </div>

          <div>
            <span className="block text-xs text-text-secondary font-semibold uppercase">Dicatat Oleh</span>
            <span>{waste.user?.fullname || waste.user?.name || waste.created_by}</span>
          </div>
          <div>
            <span className="block text-xs text-text-secondary font-semibold uppercase">Waktu</span>
            <span>{formatDate(waste.created_at, { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
        
        <div>
          <span className="block text-xs text-text-secondary font-semibold uppercase mb-1">Catatan Tambahan</span>
          <div className="bg-main border border-border p-3 rounded-lg text-text-secondary whitespace-pre-wrap">
            {waste.note || '-'}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="button" variant="primary" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </div>
    </Modal>
  );
};
