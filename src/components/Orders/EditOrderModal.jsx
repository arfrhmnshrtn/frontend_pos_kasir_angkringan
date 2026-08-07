import React, { useState, useEffect } from 'react';
import api from '../../services/axios';
import { X, Save, AlertCircle } from 'lucide-react';

export default function EditOrderModal({ isOpen, onClose, order, onUpdateSuccess }) {
    const [metodePembayaran, setMetodePembayaran] = useState('');
    const [statusPembayaran, setStatusPembayaran] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (order) {
            setMetodePembayaran(order.metode_pembayaran || 'tunai');
            setStatusPembayaran(order.status || 'belum_bayar');
            setError(null);
        }
    }, [order]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const payload = {
            metode_pembayaran: metodePembayaran,
            status: statusPembayaran
        };

        try {
            const result = await api.patch(`/pos-kasir/${order.id}/pembayaran`, payload);
            console.log(payload);
            console.log(result);

            onUpdateSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-card w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-border flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-main/50">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-lg text-text">Edit Pembayaran Pesanan</span>
                    </div>
                    <button
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:text-text hover:bg-border/50 transition-colors"
                        onClick={onClose}
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5">
                    {error && (
                        <div className="bg-danger-bg text-danger p-3 rounded-lg text-sm flex items-start gap-2">
                            <AlertCircle size={16} className="mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold text-text-secondary mb-1">
                            Metode Pembayaran
                        </label>
                        <select
                            value={metodePembayaran}
                            onChange={(e) => setMetodePembayaran(e.target.value)}
                            className="w-full bg-main border border-border rounded-lg text-sm text-text px-3 py-2.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all cursor-pointer"
                        >
                            <option value="tunai">Tunai</option>
                            <option value="qris">QRIS</option>
                            <option value="transfer">Transfer Bank</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-text-secondary mb-1">
                            Status Pembayaran
                        </label>
                        <select
                            value={statusPembayaran}
                            onChange={(e) => setStatusPembayaran(e.target.value)}
                            className="w-full bg-main border border-border rounded-lg text-sm text-text px-3 py-2.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all cursor-pointer"
                        >
                            <option value="belum_bayar">Belum Dibayar</option>
                            <option value="lunas">Lunas</option>
                            <option value="hutang">Hutang</option>
                        </select>
                    </div>

                    <div className="pt-2 flex gap-3">
                        <button
                            type="button"
                            className="w-full py-2.5 rounded-lg text-sm font-bold text-text-secondary bg-main border border-border hover:bg-border/50 transition-all flex items-center justify-center"
                            onClick={onClose}
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-2.5 rounded-lg text-sm font-bold text-white transition-all shadow-md flex items-center justify-center gap-2 ${isLoading ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary hover:bg-primary-hover'
                                }`}
                        >
                            <Save size={18} />
                            {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
