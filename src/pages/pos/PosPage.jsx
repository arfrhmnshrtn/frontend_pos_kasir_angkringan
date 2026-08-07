import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ShoppingCart, Store, Check, Plus, Coffee } from 'lucide-react';

export const PosPage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-blue-600" /> POS Kasir Angkringan
          </h1>
          <p className="text-sm text-slate-500">Kasir: <span className="font-semibold text-slate-700 dark:text-slate-300">{user?.name}</span></p>
        </div>
        <Badge variant="success" size="lg">Sistem POS Siap</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Menu Grid Placeholder */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['Semua', 'Makanan', 'Minuman', 'Sate & Sundukan', 'Gorengan'].map((cat, i) => (
              <button
                key={i}
                className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  i === 0
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { name: 'Nasi Kucing Teri', price: 'Rp 4.000', cat: 'Makanan' },
              { name: 'Sate Usus', price: 'Rp 3.000', cat: 'Sate' },
              { name: 'Es Teh Manis', price: 'Rp 3.000', cat: 'Minuman' },
              { name: 'Wedang Jahe', price: 'Rp 5.000', cat: 'Minuman' },
              { name: 'Tahu Isi', price: 'Rp 2.000', cat: 'Gorengan' },
              { name: 'Sate Telur Puyuh', price: 'Rp 4.000', cat: 'Sate' },
            ].map((item, idx) => (
              <Card key={idx} className="hover:border-blue-500 cursor-pointer transition-all duration-200 group">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Coffee className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{item.name}</h4>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-1">{item.price}</p>
                <Button size="sm" variant="secondary" className="w-full mt-3 font-semibold text-xs">
                  <Plus className="w-3.5 h-3.5 mr-1" /> Tambah
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <Card header="Keranjang Belanja" className="h-fit">
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center text-xs text-slate-400">
              Belum ada item dipilih
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>Rp 0</span>
              </div>
              <div className="flex justify-between font-bold text-base text-slate-900 dark:text-slate-100 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Total Bayar</span>
                <span className="text-blue-600 dark:text-blue-400">Rp 0</span>
              </div>
            </div>

            <Button variant="primary" size="lg" className="w-full font-bold shadow-md" disabled>
              Proses Pembayaran
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
