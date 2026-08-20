import React, { useState, useEffect } from 'react';
import { getSalesAnalysis } from '../../services/analysis.service';
import AnalysisFilters from '../../components/Analysis/AnalysisFilters';
import AnalysisSummary from '../../components/Analysis/AnalysisSummary';
import SalesChartDisplay from '../../components/Analysis/SalesChartDisplay';
import FinancialSummary from '../../components/Analysis/FinancialSummary';
import TopProductsTable from '../../components/Analysis/TopProductsTable';
import PaymentMethods from '../../components/Analysis/PaymentMethods';
import DebtSummary from '../../components/Analysis/DebtSummary';
import AnalysisSkeleton from '../../components/Analysis/AnalysisSkeleton';
import { formatDate } from '../../utils/format';

export default function SalesAnalysis() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);

  const [filter, setFilter] = useState('30days');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const fetchAnalysis = async (params) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getSalesAnalysis(params);
      if (response && response.success === true) {
        setAnalysisData(response.data);
      } else {
        setError(response.message || 'Gagal memuat analisis penjualan.');
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Terjadi kesalahan sistem saat memuat analisis.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Set document title
    document.title = "Analisis Penjualan | Penjualan Angkringan";
  }, []);

  useEffect(() => {
    if (filter === 'custom') return; // Custom fetch is triggered manually
    fetchAnalysis({ period: filter });
  }, [filter]);

  const handleApplyCustom = () => {
    if (customStartDate && customEndDate) {
      if (customStartDate > customEndDate) {
        setError('Tanggal mulai tidak boleh lebih besar dari tanggal akhir.');
        return;
      }
      fetchAnalysis({ period: 'custom', startDate: customStartDate, endDate: customEndDate });
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1600px] mx-auto animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>

          {!loading && analysisData?.period && (
            <div className="mt-3 text-xs font-semibold bg-main border border-border inline-block px-3 py-1.5 rounded-lg shadow-sm">
              Periode: <span className="text-primary">{formatDate(analysisData.period.start_date)} - {formatDate(analysisData.period.end_date)}</span>
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
          <div className="text-red-500 font-bold mb-2 text-lg">Gagal memuat analisis</div>
          <p className="text-red-600 dark:text-red-400 text-sm mb-4 max-w-lg">{error}</p>
          <button
            onClick={() => filter === 'custom' ? handleApplyCustom() : fetchAnalysis({ period: filter })}
            className="bg-red-100 hover:bg-red-200 text-red-700 px-5 py-2 rounded-lg text-sm font-bold transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      ) : loading ? (
        <AnalysisSkeleton />
      ) : !analysisData ? (
        <div className="bg-card border border-border rounded-xl p-8 text-center text-muted">
          Belum ada transaksi pada periode ini.
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <AnalysisSummary summary={analysisData.summary} />

          <SalesChartDisplay data={analysisData.sales_chart} />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 align-top">
            <FinancialSummary summary={analysisData.summary} />
            <TopProductsTable products={analysisData.top_products} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PaymentMethods methods={analysisData.payment_methods} />
            <DebtSummary summary={analysisData.debt_summary} />
          </div>
        </div>
      )}
    </div>
  );
}
