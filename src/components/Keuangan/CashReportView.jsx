import React, { useState } from 'react';
import { Wallet, Info, FileSpreadsheet } from 'lucide-react';
import { useCashReport } from '../../hooks/useCashReport';
import { usePermission } from '../../hooks/usePermission';
import { Select } from '../common/Select';
import { Input } from '../common/Input';
import { formatDate } from '../../utils/format';
import { CashSummaryCards } from './CashSummaryCards';
import { IncomeExpenseChart } from './IncomeExpenseChart';
import { PaymentMethodChart } from './PaymentMethodChart';
import { BudgetAllocation } from './BudgetAllocation';
import { IncomeExpenseBreakdown } from './IncomeExpenseBreakdown';
import { DebtSummaryTable } from './DebtSummaryTable';

export default function CashReportView() {
  const { hasPermission } = usePermission();
  const canRead = hasPermission('cash.report.read') || hasPermission('admin'); // Fallback if explicit permission is different

  const {
    loading,
    reportData,
    flowData,
    incomeBreakdown,
    expenseBreakdown,
    filters,
    updateFilters,
    refreshAll
  } = useCashReport();

  const handlePeriodChange = (e) => {
    const val = e.target.value;
    updateFilters({ period: val });
  };

  const handleDateChange = (e) => {
    updateFilters({ [e.target.name]: e.target.value });
  };

  if (!canRead) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-text-secondary">
        <Wallet size={48} className="mb-4 text-muted" />
        <h2 className="text-xl font-bold text-text mb-2">Akses Ditolak</h2>
        <p>Anda tidak memiliki izin untuk melihat Laporan Kas.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-10 w-full overflow-hidden">
      
      {/* HEADER & FILTER PERIOD */}
      <div className="flex xl:items-center justify-between flex-col xl:flex-row gap-4 mb-2">
        <div>
           {/* Indikator Periode Aktif */}
           <div className="text-xs font-semibold bg-main border border-border inline-block px-3 py-1.5 rounded-lg shadow-sm">
              Periode: <span className="text-primary">
                {reportData?.period?.start_date && reportData?.period?.end_date 
                  ? `${formatDate(reportData.period.start_date)} - ${formatDate(reportData.period.end_date)}`
                  : filters.period === 'custom' && filters.startDate && filters.endDate 
                    ? `${formatDate(filters.startDate)} - ${formatDate(filters.endDate)}` 
                    : filters.period === 'today' ? 'Hari Ini' 
                    : filters.period === '7days' ? '7 Hari Terakhir' 
                    : filters.period === '30days' ? '30 Hari Terakhir' 
                    : filters.period === 'month' ? 'Bulan Ini' 
                    : filters.period === 'year' ? 'Tahun Ini' 
                    : 'Bulan Ini'}
              </span>
           </div>
        </div>
        
        <div className="flex">
          <Select 
            name="period"
            value={filters.period}
            onChange={handlePeriodChange}
            options={[
               { value: 'today', label: 'Hari Ini' },
               { value: '7days', label: '7 Hari Terakhir' },
               { value: '30days', label: '30 Hari Terakhir' },
               { value: 'month', label: 'Bulan Ini' },
               { value: 'year', label: 'Tahun Ini' },
               { value: 'custom', label: 'Custom Tanggal' }
            ]}
            className="w-40 m-0"
          />
          {filters.period === 'custom' && (
            <div className="flex items-center gap-2">
              <Input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleDateChange}
                className="w-35 m-0 h-10.5"
              />
              <span className="text-muted font-bold">-</span>
              <Input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleDateChange}
                className="w-35 m-0 h-10.5"
              />
            </div>
          )}
        </div>
      </div>

      {loading && !reportData ? (
        <div className="text-center py-10 text-muted animate-pulse">Sedang memuat data laporan...</div>
      ) : (
        <>
          <CashSummaryCards reportData={reportData} loading={loading} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
            <div className="lg:col-span-2 w-full max-w-full overflow-hidden">
               <IncomeExpenseChart flowData={flowData} loading={loading} />
            </div>
            <div className="w-full">
               <PaymentMethodChart reportData={reportData} loading={loading} />
            </div>
          </div>
          
          <IncomeExpenseBreakdown 
            incomeBreakdown={incomeBreakdown} 
            expenseBreakdown={expenseBreakdown} 
            loading={loading}
          />
          
          <DebtSummaryTable onPaymentSuccess={refreshAll} />

          <BudgetAllocation reportData={reportData} loading={loading} />
        </>
      )}

    </div>
  );
}
