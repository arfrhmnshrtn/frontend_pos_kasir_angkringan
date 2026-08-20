import React, { useState, useEffect, useCallback } from 'react';
import { CreditCard, Search } from 'lucide-react';
import { Button } from '../common/Button';
import { Pagination } from '../common/Pagination';
import { formatCurrency, formatDate } from '../../utils/format';
import { debtService } from '../../services/debt.service';
import { useToast } from '../../contexts/ToastContext';
import { PayDebtModal } from './PayDebtModal';

export const DebtSummaryTable = ({ onPaymentSuccess }) => {
  const toast = useToast();
  const [debts, setDebts] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, total_pages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState(null);

  const fetchDebts = useCallback(async (page = 1, searchQuery = search) => {
    setLoading(true);
    try {
      const res = await debtService.getDebts({ page, limit: 10, search: searchQuery, status: 'BELUM_LUNAS' });
      const data = res?.data?.data || res?.data || [];
      const m = res?.data?.pagination || res?.pagination || { page: 1, limit: 10, total: 0, total_pages: 1 };
      setDebts(data);
      setMeta(m);
    } catch (err) {
      toast.error('Gagal mengambil data hutang gantung.');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Initial fetch and on search change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => fetchDebts(1, search), 500);
    return () => clearTimeout(timer);
  }, [search, fetchDebts]);

  const handlePageChange = (p) => {
    fetchDebts(p, search);
  };

  const handleOpenPay = (debt) => {
    setSelectedDebt(debt);
    setPayModalOpen(true);
  };

  const handleSuccess = () => {
    setPayModalOpen(false);
    fetchDebts(meta.page, search);
    if (onPaymentSuccess) onPaymentSuccess();
  };

  const getStatusBadge = (status) => {
    if (status === 'LUNAS') return <span className="text-[0.7rem] font-bold bg-success-bg text-success px-2 py-0.5 rounded">LUNAS</span>;
    if (status === 'SEBAGIAN') return <span className="text-[0.7rem] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">SEBAGIAN</span>;
    return <span className="text-[0.7rem] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded">BELUM LUNAS</span>;
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm flex flex-col pt-5">
      <div className="px-5 mb-4 flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2 font-bold text-lg text-text">
          <CreditCard size={20} className="text-amber-500" />
          <span>Daftar Hutang / Piutang Pelanggan</span>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
          <input 
            type="text" 
            className="pl-8 pr-3 py-1.5 bg-main border border-border rounded-lg text-sm text-text focus:outline-none focus:border-primary transition-all w-50" 
            placeholder="Cari pelanggan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-main text-text-secondary border-b border-border">
              <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wider">Tgl Transaksi</th>
              <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wider">Nama Pelanggan</th>
              <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wider">Total Hutang</th>
              <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wider">Sisa Hutang</th>
              <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wider text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="px-5 py-8 text-center text-muted">Memuat daftar hutang...</td></tr>
            ) : debts.length === 0 ? (
              <tr><td colSpan="6" className="px-5 py-10 text-center text-muted">Belum ada tanggungan hutang pelanggan.</td></tr>
            ) : (
              debts.map(d => (
                <tr key={d.id} className="border-b border-border/50 hover:bg-main/30">
                   <td className="px-5 py-3 text-text-secondary">{formatDate(d.created_at).split(' ')[0]}</td>
                   <td className="px-5 py-3 font-bold text-text">{d.customer_name || 'Tidak ada nama'}</td>
                   <td className="px-5 py-3 text-text font-medium">{formatCurrency(d.total_amount)}</td>
                   <td className="px-5 py-3 font-bold text-amber-600">{formatCurrency(d.remaining_amount)}</td>
                   <td className="px-5 py-3">{getStatusBadge(d.status)}</td>
                   <td className="px-5 py-3 text-center">
                     <Button 
                       variant="primary" 
                       size="sm" 
                       className="text-xs h-7 py-0 px-3 bg-amber-500 hover:bg-amber-600 border-amber-600 shadow-none"
                       onClick={() => handleOpenPay(d)}
                     >
                       Bayar
                     </Button>
                   </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && debts.length > 0 && (
         <div className="px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border">
            <div className="text-sm text-text-secondary">
               Menampilkan {(meta.page - 1) * meta.limit + 1} - {Math.min(meta.page * meta.limit, meta.total)} dari {meta.total} data
            </div>
            <Pagination currentPage={meta.page} totalPages={meta.total_pages} onPageChange={handlePageChange} />
         </div>
      )}

      {selectedDebt && (
        <PayDebtModal 
          isOpen={payModalOpen}
          onClose={() => setPayModalOpen(false)}
          onSuccess={handleSuccess}
          debt={selectedDebt}
        />
      )}
    </div>
  );
};
