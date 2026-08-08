import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

export default function ReceiptModal({
  isOpen,
  onClose,
  completedOrder
}) {
  if (!isOpen || !completedOrder) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card w-full max-w-sm rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-border flex flex-col items-center justify-center text-center p-8" onClick={(e) => e.stopPropagation()}>
        <div className="w-16 h-16 bg-success-bg text-success rounded-full flex items-center justify-center mb-5">
          <CheckCircle2 size={40} />
        </div>
        
        <h2 className="text-xl font-extrabold text-text mb-2 tracking-tight">Transaksi Berhasil!</h2>
        
        <p className="text-sm text-text-secondary mb-6 leading-relaxed">
          Pesanan baru atas nama <span className="font-bold text-text">{completedOrder.customer}</span> dengan total <span className="font-bold text-primary">{completedOrder.total}</span> telah berhasil ditambahkan.
        </p>

        <button 
          className="w-full py-3 rounded-lg text-sm font-bold bg-primary text-white hover:bg-primary-hover transition-colors shadow-md flex items-center justify-center gap-2" 
          onClick={onClose}
        >
          <CheckCircle2 size={18} />
          Tutup & Kembali
        </button>
      </div>
    </div>
  );
}
