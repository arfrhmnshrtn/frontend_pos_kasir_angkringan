import React, { useState } from 'react';
import api from '../../services/axios';
import { X, Trash2, AlertTriangle } from 'lucide-react';

export default function DeleteOrderModal({ isOpen, onClose, order, onDeleteSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !order) return null;

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await api.delete(`/pos-kasir/${order.id}`);

      onDeleteSuccess();
      onClose();
    } catch (err) {
      console.error("Delete Error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-card w-full max-w-sm rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-border flex flex-col" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-danger-bg">
          <div className="flex items-center gap-2 text-danger">
            <AlertTriangle size={20} />
            <span className="font-bold text-lg">Hapus Pesanan?</span>
          </div>
          <button 
            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:text-text hover:bg-border/50 transition-colors" 
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          {error && (
            <div className="bg-danger-bg text-danger p-3 rounded-lg text-sm flex items-start gap-2">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <p className="text-text text-sm">
            Apakah Anda yakin ingin menghapus pesanan <br className="hidden sm:block" /> 
            <strong className="text-danger text-base mt-1 inline-block">{order.nomor_pesanan}</strong>?
          </p>
          <p className="text-text-secondary text-xs">
            Tindakan ini permanen dan tidak dapat dibatalkan.
          </p>

          <div className="pt-2 flex gap-3">
             <button 
                type="button"
                className="w-full py-2.5 rounded-lg text-sm font-bold text-text-secondary bg-main border border-border hover:bg-border/50 transition-all flex items-center justify-center"
                onClick={onClose}
                disabled={isLoading}
              >
                Batal
              </button>
            <button 
              type="button"
              onClick={handleDelete}
              disabled={isLoading}
              className={`w-full py-2.5 rounded-lg text-sm font-bold text-white transition-all shadow-md flex items-center justify-center gap-2 ${
                isLoading ? 'bg-danger/50 cursor-not-allowed' : 'bg-danger hover:bg-red-600'
              }`}
            >
              <Trash2 size={18} />
              {isLoading ? 'Menghapus...' : 'Hapus'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
