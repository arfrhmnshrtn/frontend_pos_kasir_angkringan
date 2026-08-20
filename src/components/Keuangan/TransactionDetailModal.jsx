import React from 'react';
import { Modal } from '../common/Modal';
import { formatCurrency, formatDate } from '../../utils/format';

export const TransactionDetailModal = ({ isOpen, onClose, transaction }) => {
  if (!transaction) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detail Transaksi Kas"
      maxWidth="max-w-md"
    >
      <div className="flex flex-col gap-4 text-sm text-text">
        
        <div className="flex items-center justify-between border-b border-border pb-3">
          <span className="font-semibold text-text-secondary">Status</span>
          <span className="font-bold text-success">BERHASIL</span>
        </div>

        <div className="grid grid-cols-2 gap-y-3">
          <div>
            <span className="block text-xs text-text-secondary font-semibold uppercase">Jenis</span>
            <span className={`font-bold ${transaction.type === 'CASH_IN' ? 'text-emerald-500' : 'text-danger'}`}>
              {transaction.type === 'CASH_IN' ? 'PEMASUKAN' : 'PENGELUARAN'}
            </span>
          </div>
          <div>
            <span className="block text-xs text-text-secondary font-semibold uppercase">Metode</span>
            <span className="font-bold uppercase">{transaction.payment_method}</span>
          </div>
          <div>
            <span className="block text-xs text-text-secondary font-semibold uppercase">Tanggal</span>
            <span className="font-bold">{formatDate(transaction.transaction_date)}</span>
          </div>
          <div>
            <span className="block text-xs text-text-secondary font-semibold uppercase">Nominal</span>
            <span className="font-black text-[1.1rem]">{formatCurrency(transaction.amount)}</span>
          </div>
          <div className="col-span-2">
            <span className="block text-xs text-text-secondary font-semibold uppercase">Keterangan / Deskripsi</span>
            <span className="font-medium">{transaction.description}</span>
          </div>
          <div className="col-span-2">
            <span className="block text-xs text-text-secondary font-semibold uppercase">Sumber Sistem</span>
            <span className="font-medium bg-main px-2 py-0.5 rounded border border-border inline-block mt-0.5">
              {transaction.source_type} {transaction.source_id ? `(ID: ${transaction.source_id})` : ''}
            </span>
          </div>
          {transaction.user && (
            <div className="col-span-2">
              <span className="block text-xs text-text-secondary font-semibold uppercase">Dibuat Oleh</span>
              <span className="font-medium">{transaction.user.fullname}</span>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
