import React from 'react';
import { Search, Filter, History } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/format';
import { Pagination } from '../common/Pagination';
import { Button } from '../common/Button';
import { Select } from '../common/Select';

export const CashTransactionTable = ({ 
  transactions, 
  meta, 
  loading, 
  filters, 
  onFilterChange,
  onViewDetail
}) => {
  const handleSearch = (e) => {
    onFilterChange({ search: e.target.value, page: 1 });
  };
  
  const handleSelectChange = (e) => {
    onFilterChange({ [e.target.name]: e.target.value, page: 1 });
  };

  const getTypeBadge = (type) => {
    if (type === 'CASH_IN') return <span className="inline-flex py-1 px-2.5 rounded-full text-[0.7rem] font-bold bg-emerald-100 text-emerald-700">PEMASUKAN</span>;
    return <span className="inline-flex py-1 px-2.5 rounded-full text-[0.7rem] font-bold bg-danger/10 text-danger">PENGELUARAN</span>;
  };

  const getSourceBadge = (source) => {
    switch (source) {
      case 'POS': return <span className="text-[0.7rem] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded border border-blue-200">POS</span>;
      case 'DEBT_PAYMENT': return <span className="text-[0.7rem] font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">PIUTANG</span>;
      case 'INCOME': return <span className="text-[0.7rem] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">OTHER IN</span>;
      default: return <span className="text-[0.7rem] font-bold text-text-secondary bg-main px-2 py-0.5 rounded border border-border">MANUAL</span>;
    }
  }

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm flex flex-col pt-5">
      <div className="px-5 mb-4 flex items-center gap-2 font-bold text-lg text-text">
         <History size={20} className="text-primary" />
         <span>Riwayat Transaksi Kas</span>
      </div>

      <div className="px-5 mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
          <input 
            type="text" 
            className="w-full pl-9 pr-4 py-2 bg-main border border-border rounded-lg text-sm text-text focus:outline-none focus:border-primary transition-all h-10.5" 
            placeholder="Cari keterangan / no transaksi..."
            defaultValue={filters.search}
            onBlur={handleSearch}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
          />
        </div>
        <Select 
          name="type" 
          value={filters.type} 
          onChange={handleSelectChange}
          options={[
            { value: '', label: 'Semua Jenis' },
            { value: 'CASH_IN', label: 'Pemasukan' },
            { value: 'CASH_OUT', label: 'Pengeluaran' }
          ]}
        />
        <Select 
          name="payment_method" 
          value={filters.payment_method} 
          onChange={handleSelectChange}
          options={[
            { value: '', label: 'Semua Metode' },
            { value: 'tunai', label: 'Tunai' },
            { value: 'qris', label: 'QRIS' },
            { value: 'transfer', label: 'Transfer' }
          ]}
        />
      </div>

      <div className="w-full overflow-x-auto border-t border-border">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-main text-text-secondary border-b border-border">
              <th className="px-5 py-3.5 font-semibold text-xs uppercase tracking-wider">Tgl & Tanggal</th>
              <th className="px-5 py-3.5 font-semibold text-xs uppercase tracking-wider">Jenis Transaksi</th>
              <th className="px-5 py-3.5 font-semibold text-xs uppercase tracking-wider">Keterangan</th>
              <th className="px-5 py-3.5 font-semibold text-xs uppercase tracking-wider">Metode</th>
              <th className="px-5 py-3.5 font-semibold text-xs uppercase tracking-wider text-right">Nominal (Rp)</th>
              <th className="px-5 py-3.5 font-semibold text-xs uppercase tracking-wider text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="px-5 py-8 text-center text-muted">Memuat transaksi...</td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-5 py-10 text-center text-muted">
                  Belum ada transaksi pada periode ini.
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-border/50 hover:bg-main/30 transition-colors">
                  <td className="px-5 py-3.5 text-text">
                     <span className="font-semibold block">{formatDate(tx.transaction_date).split(' ')[0]}</span>
                     <span className="text-[0.7rem] text-muted">{new Date(tx.transaction_date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    {getTypeBadge(tx.type)}
                  </td>
                  <td className="px-5 py-3.5 max-w-50 truncate">
                     <div className="font-medium text-text mb-0.5 truncate">{tx.description}</div>
                     {getSourceBadge(tx.source_type)}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-[0.75rem] font-bold text-text-secondary uppercase">{tx.payment_method}</span>
                  </td>
                  <td className={`px-5 py-3.5 font-bold text-right ${tx.type === 'CASH_IN' ? 'text-emerald-500' : 'text-danger'}`}>
                     {tx.type === 'CASH_IN' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <Button variant="outline" size="sm" onClick={() => onViewDetail(tx)} className="text-xs h-7 py-0 px-3">Detail</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && transactions.length > 0 && (
        <div className="px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border">
          <div className="text-sm text-text-secondary">
             Menampilkan {(meta.page - 1) * meta.limit + 1} - {Math.min(meta.page * meta.limit, meta.total)} dari {meta.total} data
          </div>
          <Pagination 
            currentPage={meta.page}
            totalPages={meta.total_pages}
            onPageChange={(page) => onFilterChange({ page })}
          />
        </div>
      )}
    </div>
  );
};
