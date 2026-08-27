import React, { useState, useEffect } from 'react';
import { Package, ShoppingBag, Wallet, TrendingUp, DollarSign } from 'lucide-react';
import { getProductsSold } from '../../services/analysis.service';
import AnalysisFilters from '../../components/Analysis/AnalysisFilters';
import { formatCurrency, formatDate } from '../../utils/format';
import { Card } from '../../components/common/Card';
import { Table } from '../../components/common/Table';

export default function ProductsSoldPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summaryData, setSummaryData] = useState(null);

  const [filter, setFilter] = useState('30days');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const fetchSummary = async (params) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProductsSold(params);
      if (response && response.success) {
        setSummaryData(response.data);
      } else {
        setError(response?.message || 'Gagal memuat summary barang terjual.');
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Summary Barang Terjual | POS Angkringan";
  }, []);

  useEffect(() => {
    if (filter === 'custom') return;
    fetchSummary({ period: filter });
  }, [filter]);

  const handleApplyCustom = () => {
    if (customStartDate && customEndDate) {
      if (customStartDate > customEndDate) {
        setError('Tanggal mulai tidak boleh lebih besar dari tanggal akhir.');
        return;
      }
      fetchSummary({ period: 'custom', startDate: customStartDate, endDate: customEndDate });
    }
  };

  const columns = [
    { header: 'No', accessor: (row, idx) => idx + 1, className: 'w-16 text-center' },
    { header: 'Produk', accessor: 'name' },
    { header: 'Terjual', accessor: (row) => `${row.quantity} item`, className: 'font-semibold text-primary' },
    { header: 'Harga Jual', accessor: (row) => formatCurrency(row.selling_price || (row.revenue / (row.quantity || 1))) },
    { header: 'Harga Beli/Modal', accessor: (row) => formatCurrency(row.purchase_price || (row.cost / (row.quantity || 1))) },
    { header: 'Omzet', accessor: (row) => formatCurrency(row.revenue), className: 'text-green-600 font-semibold' },
    { header: 'Modal', accessor: (row) => formatCurrency(row.cost), className: 'text-orange-600' },
    { header: 'Laba', accessor: (row) => formatCurrency(row.profit), className: 'text-emerald-600 font-bold' },
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1600px] mx-auto animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Laporan Barang Terjual</h1>
          {!loading && summaryData?.period && (
            <div className="mt-3 text-xs font-semibold bg-main border border-border inline-block px-3 py-1.5 rounded-lg shadow-sm">
              Periode: <span className="text-primary">{formatDate(summaryData.period.start_date)} - {formatDate(summaryData.period.end_date)}</span>
            </div>
          )}
        </div>

        <AnalysisFilters
          filter={filter}
          setFilter={setFilter}
          customStartDate={customStartDate}
          setCustomStartDate={setCustomStartDate}
          customEndDate={customEndDate}
          setCustomEndDate={setCustomEndDate}
          onApplyCustom={handleApplyCustom}
        />
      </div>

      {error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="text-red-500 font-bold mb-2 text-lg">Gagal memuat data</div>
          <p className="text-red-600 dark:text-red-400 text-sm mb-4 max-w-lg">{error}</p>
          <button
            onClick={() => filter === 'custom' ? handleApplyCustom() : fetchSummary({ period: filter })}
            className="bg-red-100 hover:bg-red-200 text-red-700 px-5 py-2 rounded-lg text-sm font-bold transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => <div key={i} className="h-24 bg-card rounded-xl border border-border animate-pulse" />)}
        </div>
      ) : !summaryData ? (
        <div className="bg-card border border-border rounded-xl p-8 text-center text-muted">
          Belum ada data barang terjual pada periode ini.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            
            <div className="bg-card border border-border rounded-xl p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md relative overflow-hidden">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-blue-500 bg-blue-500/10">
                  <Package size={20} />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="text-xs text-text-secondary font-bold uppercase tracking-wider mb-0.5">Total Produk</div>
                  <div className="text-[1.2rem] font-extrabold tracking-tight truncate text-blue-500">
                    {summaryData.summary.total_products}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md relative overflow-hidden">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-indigo-500 bg-indigo-500/10">
                  <ShoppingBag size={20} />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="text-xs text-text-secondary font-bold uppercase tracking-wider mb-0.5">Unit Terjual</div>
                  <div className="text-[1.2rem] font-extrabold tracking-tight truncate text-indigo-500">
                    {summaryData.summary.total_items_sold} <span className="text-sm font-semibold">item</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md relative overflow-hidden">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-emerald-500 bg-emerald-500/10">
                  <DollarSign size={20} />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="text-xs text-text-secondary font-bold uppercase tracking-wider mb-0.5">Total Omzet</div>
                  <div className="text-[1.2rem] font-extrabold tracking-tight truncate text-emerald-500">
                    {formatCurrency(summaryData.summary.total_revenue)}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md relative overflow-hidden">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-amber-500 bg-amber-500/10">
                  <Wallet size={20} />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="text-xs text-text-secondary font-bold uppercase tracking-wider mb-0.5">Total Modal</div>
                  <div className="text-[1.2rem] font-extrabold tracking-tight truncate text-amber-500">
                    {formatCurrency(summaryData.summary.total_cost)}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md relative overflow-hidden">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-purple-500 bg-purple-500/10">
                  <TrendingUp size={20} />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="text-xs text-text-secondary font-bold uppercase tracking-wider mb-0.5">Total Laba</div>
                  <div className="text-[1.2rem] font-extrabold tracking-tight truncate text-purple-500">
                    {formatCurrency(summaryData.summary.total_profit)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Card header="Daftar Produk Terjual" className="overflow-hidden">
            {summaryData.products.length > 0 ? (
              <div className="overflow-x-auto w-full">
                <Table
                  data={summaryData.products}
                  columns={columns}
                  keyExtractor={(row) => row.id}
                />
              </div>
            ) : (
              <div className="p-8 text-center text-muted">
                Belum ada produk yang terjual pada periode ini.
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
