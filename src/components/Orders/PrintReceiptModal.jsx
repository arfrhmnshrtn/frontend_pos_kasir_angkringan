import React from 'react';
import { X, Printer } from 'lucide-react';

export default function PrintReceiptModal({ isOpen, onClose, order }) {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (isoStr) => {
    if (!isoStr) return '';
    const date = new Date(isoStr);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    }) + ' ' + date.toLocaleTimeString('id-ID', {
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:bg-transparent print:backdrop-blur-none" onClick={onClose}>
      
      {/* CSS Khusus untuk Pencetakan (Print) Murni */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-receipt-section, #print-receipt-section * {
            visibility: visible;
          }
          #print-receipt-section {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            max-width: 80mm; /* Lebar thermal standard 80mm */
            margin: 0;
            padding: 0;
          }
          /* Hilangkan elemen box shadow dan background saat print */
          .print-hide-bg {
             background: transparent !important;
             box-shadow: none !important;
             border: none !important;
          }
          .print-hide {
             display: none !important;
          }
        }
      `}</style>

      <div 
        className="bg-card w-full max-w-[360px] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-border flex flex-col print-hide-bg" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-main/50 print-hide">
          <div className="font-bold text-lg text-text">Pratinjau Struk</div>
          <button 
            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:text-text hover:bg-border/50 transition-colors" 
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal content shown on screen */}
        <div className="p-5 overflow-y-auto max-h-[70vh] custom-scrollbar bg-white text-slate-900 print:overflow-visible print:p-0">
          
          {/* ---> Area Spesifik Untuk Dicetak <--- */}
          <div className="text-[0.85rem] font-mono leading-tight bg-white mb-2" id="print-receipt-section">
            <div className="text-center mb-4 border-b border-dashed border-slate-400 pb-2">
              <div className="font-bold text-[1.1rem]">ANGKRINGAN 88</div>
              <div className="text-[0.75rem] mt-1">Jl. Desa Gedung Boga</div>
              <div className="text-[0.75rem]">Telp / WA: 0858-5500-7722</div>
            </div>

            <div className="flex justify-between text-[0.75rem] mb-1">
              <span>Struk: {order.nomor_pesanan}</span>
              <span>{formatDate(order.created_at)}</span>
            </div>
            <div className="text-[0.75rem] mb-3 border-b border-dashed border-slate-400 pb-2">
              Pelanggan: <span className="font-bold">{order.nama_pelanggan}</span>
            </div>

            {/* Items List */}
            <div className="mb-3">
              {order.detail_pesanan?.map((item, idx) => {
                const subtotal = item.subtotal || (item.jumlah * item.harga);
                return (
                  <div key={idx} className="flex justify-between mb-1">
                    <div className="flex-1 pr-2">
                      <div>{item.nama_menu}</div>
                      <div className="text-[0.7rem] text-slate-600">{item.jumlah} x Rp {(item.harga || (subtotal / item.jumlah)).toLocaleString('id-ID')}</div>
                    </div>
                    <div className="font-bold text-right whitespace-nowrap">
                      Rp {subtotal?.toLocaleString('id-ID')}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-dashed border-slate-400 pt-2 mb-3">
              <div className="flex justify-between font-bold text-[0.95rem]">
                <span>TOTAL:</span>
                <span>Rp {order.total_harga?.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-[0.75rem] mt-1 text-slate-600">
                <span>Pembayaran:</span>
                <span className="uppercase">{order.metode_pembayaran || '-'}</span>
              </div>
              <div className="flex justify-between text-[0.75rem] mt-0.5 text-slate-600">
                <span>Status:</span>
                <span className="font-bold text-black uppercase">{order.status === 'lunas' ? 'LUNAS' : (order.status === 'belum_bayar' ? 'BELUM DIBAYAR' : 'HUTANG')}</span>
              </div>
            </div>

            <div className="text-center mt-6 text-[0.7rem] text-slate-600 border-t border-dashed border-slate-400 pt-2">
              Matur Nuwun Sampun Mampir!<br />
              Struk ini adalah bukti pembayaran sah.
            </div>
          </div>
          {/* ---> Berakhir Area Dicetak <--- */}

        </div>

        <div className="p-4 border-t border-border bg-main/30 flex gap-3 print-hide">
          <button 
            className="w-full py-2.5 rounded-lg text-sm font-semibold bg-primary hover:bg-primary-hover text-white transition-colors flex items-center justify-center gap-2 shadow-sm" 
            onClick={handlePrint}
          >
            <Printer size={18} /> Cetak Struk Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}
