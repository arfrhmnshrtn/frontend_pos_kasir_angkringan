import React from 'react';
import { Wallet, Calendar, Check } from 'lucide-react';
import { useCashReport } from '../../hooks/useCashReport';
import { usePermission } from '../../hooks/usePermission';
import { Select } from '../common/Select';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { CashSummaryCards } from './CashSummaryCards';
import { IncomeExpenseChart } from './IncomeExpenseChart';
import { PaymentMethodChart } from './PaymentMethodChart';
import { BudgetAllocation } from './BudgetAllocation';
import { IncomeExpenseBreakdown } from './IncomeExpenseBreakdown';

export default function CashReportView() {
  const { hasPermission } = usePermission();
  const canRead = hasPermission('cash.report.read') || hasPermission('admin');

  const {
    loading,
    reportData,
    flowData,
    incomeBreakdown,
    expenseBreakdown,
    filters,
    updateFilters,
    refreshAll,
    // Period filter
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
    customDateError,
    applyCustomDateFilter,
    getActivePeriodLabel,
    appliedFilters
  } = useCashReport();

  const handlePeriodChange = (e) => {
    const val = e.target.value;
    updateFilters({ period: val });
  };

  const handleApplyCustom = () => {
    applyCustomDateFilter();
  };

  const handleCancelCustom = () => {
    updateFilters({ period: 'month' });
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
      <div className="bg-card border border-border rounded-xl shadow-sm p-4 sm:p-5">
        <div className="flex flex-col gap-4">
          {/* Filter Row */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-3">
            <div className="flex-shrink-0">
              <Select 
                name="period"
                label="Periode"
                value={filters.period}
                onChange={handlePeriodChange}
                placeholder=""
                options={[
                   { value: 'all', label: 'Semua' },
                   { value: 'month', label: 'Bulan Ini' },
                   { value: 'year', label: 'Tahun Ini' },
                   { value: 'custom', label: 'Custom Tanggal' }
                ]}
                className="w-full sm:w-44 !m-0"
              />
            </div>

            {filters.period === 'custom' && (
              <div className="flex flex-col sm:flex-row sm:items-end gap-3 flex-1">
                <div className="flex-1 min-w-0">
                  <Input
                    type="date"
                    label="Tanggal Mulai"
                    name="customStartDate"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="!m-0"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Input
                    type="date"
                    label="Tanggal Selesai"
                    name="customEndDate"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="!m-0"
                  />
                </div>
                <div className="flex gap-2 sm:pb-0">
                  <Button
                    variant="outline"
                    size="md"
                    onClick={handleCancelCustom}
                  >
                    Batal
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    icon={Check}
                    onClick={handleApplyCustom}
                  >
                    Terapkan
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Custom Date Error */}
          {customDateError && (
            <div className="text-xs text-danger font-medium bg-danger/10 border border-danger/20 rounded-lg px-3 py-2">
              {customDateError}
            </div>
          )}

          {/* Active Period Label */}
          <div className="flex items-center gap-2 text-xs font-semibold">
            <Calendar size={14} className="text-primary" />
            <span className="text-text-secondary">Periode:</span>
            <span className="text-primary">{getActivePeriodLabel()}</span>
          </div>
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

          <BudgetAllocation netCashFlow={reportData?.summary?.net_cash_flow || 0} />
        </>
      )}

    </div>
  );
}
