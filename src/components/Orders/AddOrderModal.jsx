import React, { useState } from 'react';
import { X, Plus, Utensils } from 'lucide-react';

export default function AddOrderModal({ isOpen, onClose, onAddOrder }) {
  const [customer, setCustomer] = useState('');
  const [table, setTable] = useState('01');
  const [items, setItems] = useState('');
  const [total, setTotal] = useState('');
  const [payment, setPayment] = useState('QRIS');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customer || !items || !total) return;

    const newOrder = {
      id: `AK-${Math.floor(1000 + Math.random() * 9000)}`,
      customer,
      table,
      items,
      total: total.startsWith('Rp') ? total : `Rp ${Number(total).toLocaleString('id-ID')}`,
      payment,
      time: 'Baru saja',
      status: 'Menunggu'
    };

    onAddOrder(newOrder);
    onClose();
    // Reset
    setCustomer('');
    setItems('');
    setTotal('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-border flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-main/50">
          <div className="flex items-center gap-2.5">
            <Utensils size={20} className="text-primary" />
            <h3 className="font-bold text-lg text-text m-0">Tambah Pesanan Baru</h3>
          </div>
          <button className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:text-text hover:bg-border/50 transition-colors" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="p-6 flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">Nama Pelanggan / Pemesan</label>
              <input 
                type="text" 
                className="w-full bg-main border border-border rounded-lg text-sm text-text px-3 py-2.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all" 
                placeholder="Contoh: Budi Santoso"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">Meja / Lokasi</label>
                <input 
                  type="text" 
                  className="w-full bg-main border border-border rounded-lg text-sm text-text px-3 py-2.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all"
                   placeholder="Contoh: 01"
                   value={table}
                   onChange={(e) => setTable(e.target.value)}
                   required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">Metode Pembayaran</label>
                <select className="w-full bg-main border border-border rounded-lg text-sm text-text px-3 py-2.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all cursor-pointer" value={payment} onChange={(e) => setPayment(e.target.value)}>
                  <option value="QRIS">QRIS</option>
                  <option value="Tunai">Tunai / Cash</option>
                  <option value="Transfer">Transfer Bank</option>
                  <option value="Hutang">Hutang</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">Daftar Item Menu (Porsi)</label>
              <input 
                type="text" 
                className="w-full bg-main border border-border rounded-lg text-sm text-text px-3 py-2.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all" 
                placeholder="Contoh: 2x Sate Kulit, 1x Nasi Kucing, 1x Es Teh"
                value={items}
                onChange={(e) => setItems(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">Total Harga (Rp)</label>
              <input 
                type="number" 
                className="w-full bg-main border border-border rounded-lg text-sm text-text px-3 py-2.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all" 
                placeholder="Contoh: 18000"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 px-6 py-4 border-t border-border bg-main/30">
            <button type="button" className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-main text-text border border-border hover:bg-border/50 transition-colors" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="px-5 py-2.5 rounded-lg text-sm font-bold bg-primary hover:bg-primary-hover text-white shadow-md hover:shadow-lg flex gap-2 items-center hover:-translate-y-px transition-all">
              <Plus size={16} />
              Simpan Pesanan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
