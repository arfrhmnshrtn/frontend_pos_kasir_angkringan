import { useState, useCallback, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import * as cashService from '../services/cash.service';
import { getSalesAnalysis } from '../services/analysis.service';

/**
 * Helper: Get the current month's full date range (1st to last day)
 * Uses local date construction to avoid timezone shift issues.
 */
const getCurrentMonthRange = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed
  const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
  // Day 0 of next month = last day of current month
  const lastDay = new Date(year, month + 1, 0).getDate();
  const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
  return { startDate, endDate };
};

/**
 * Helper: Get current year's full date range (Jan 1 to Dec 31)
 */
const getCurrentYearRange = () => {
  const year = new Date().getFullYear();
  return {
    startDate: `${year}-01-01`,
    endDate: `${year}-12-31`
  };
};

/**
 * Build the API params object based on the active period filter.
 * For "all" we send no period/startDate/endDate so the backend uses its default wide range.
 * For "month" and "year" we compute the exact range and send as "custom" period + dates.
 * For "custom" we pass through the user's chosen dates.
 */
const buildFilterParams = (period, startDate, endDate) => {
  if (period === 'all') {
    // Send no date filtering — use very wide custom range
    return { period: 'custom', startDate: '2000-01-01', endDate: '2099-12-31' };
  }
  if (period === 'month') {
    const range = getCurrentMonthRange();
    return { period: 'custom', startDate: range.startDate, endDate: range.endDate };
  }
  if (period === 'year') {
    const range = getCurrentYearRange();
    return { period: 'custom', startDate: range.startDate, endDate: range.endDate };
  }
  if (period === 'custom' && startDate && endDate) {
    return { period: 'custom', startDate, endDate };
  }
  // Fallback: month
  const range = getCurrentMonthRange();
  return { period: 'custom', startDate: range.startDate, endDate: range.endDate };
};

export const useCashReport = () => {
  const toast = useToast();
  
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [flowData, setFlowData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [transactionMeta, setTransactionMeta] = useState({ page: 1, limit: 10, total: 0, total_pages: 1 });
  
  const [incomeBreakdown, setIncomeBreakdown] = useState(null);
  const [expenseBreakdown, setExpenseBreakdown] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  
  const [filters, setFilters] = useState({
    period: 'month',
    startDate: '',
    endDate: ''
  });

  // Separate state for custom date inputs (staged, not yet applied)
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [customDateError, setCustomDateError] = useState('');

  const [txFilters, setTxFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    type: ''
  });

  // Track whether the active filter params have actually been applied
  // This prevents fetching on every keystroke for custom dates
  const [appliedFilters, setAppliedFilters] = useState({
    period: 'month',
    startDate: '',
    endDate: ''
  });

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const apiParams = buildFilterParams(appliedFilters.period, appliedFilters.startDate, appliedFilters.endDate);

      const [reportRes, flowRes, incomeRes, expenseRes, analysisRes] = await Promise.all([
        cashService.getCashReports(apiParams),
        cashService.getCashFlow(apiParams),
        cashService.getIncomeBreakdown(apiParams),
        cashService.getExpenseBreakdown(apiParams),
        getSalesAnalysis(apiParams).catch(() => null)
      ]);

      setReportData(reportRes?.data?.data || reportRes?.data || null);
      setFlowData(flowRes?.data?.data || flowRes?.data || []);
      setIncomeBreakdown(incomeRes?.data?.data || incomeRes?.data || null);
      setExpenseBreakdown(expenseRes?.data?.data || expenseRes?.data || []);
      
      if (analysisRes && analysisRes.data?.data?.top_products) {
        setTopProducts(analysisRes.data.data.top_products);
      } else {
        setTopProducts([]);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Gagal mengambil data laporan kas');
    } finally {
      setLoading(false);
    }
  }, [appliedFilters, toast]);

  const fetchTransactions = useCallback(async () => {
    try {
      const apiParams = buildFilterParams(appliedFilters.period, appliedFilters.startDate, appliedFilters.endDate);
      const params = {
        ...apiParams,
        ...txFilters
      };
      const res = await cashService.getCashTransactions(params);
      const data = res?.data?.data || res?.data || [];
      const meta = res?.data?.pagination || res?.pagination || { page: 1, limit: 10, total: 0, total_pages: 1 };
      
      setTransactions(data);
      setTransactionMeta(meta);
    } catch (err) {
      console.error(err);
    }
  }, [appliedFilters, txFilters]);

  // Initial Fetch & Refresh on applied filter change
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  /**
   * Called when user selects a preset period (all, month, year).
   * Immediately applies the filter and triggers data fetch.
   */
  const updateFilters = (newFilters) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    setTxFilters(prev => ({ ...prev, page: 1 }));

    // For non-custom periods, immediately apply
    if (updated.period !== 'custom') {
      setCustomDateError('');
      setCustomStartDate('');
      setCustomEndDate('');

      // Compute the actual dates for display purposes
      let displayStart = '';
      let displayEnd = '';
      if (updated.period === 'month') {
        const range = getCurrentMonthRange();
        displayStart = range.startDate;
        displayEnd = range.endDate;
      } else if (updated.period === 'year') {
        const range = getCurrentYearRange();
        displayStart = range.startDate;
        displayEnd = range.endDate;
      }

      setAppliedFilters({
        period: updated.period,
        startDate: displayStart,
        endDate: displayEnd
      });
    }
  };

  /**
   * Validate and apply custom date filter.
   * Returns true if applied successfully, false on validation error.
   */
  const applyCustomDateFilter = () => {
    setCustomDateError('');

    if (!customStartDate) {
      setCustomDateError('Tanggal mulai wajib diisi.');
      return false;
    }
    if (!customEndDate) {
      setCustomDateError('Tanggal selesai wajib diisi.');
      return false;
    }
    if (customStartDate > customEndDate) {
      setCustomDateError('Tanggal mulai tidak boleh lebih besar dari tanggal selesai.');
      return false;
    }

    const applied = {
      period: 'custom',
      startDate: customStartDate,
      endDate: customEndDate
    };
    setFilters(applied);
    setAppliedFilters(applied);
    setTxFilters(prev => ({ ...prev, page: 1 }));
    return true;
  };

  const updateTxFilters = (newTxFilters) => {
    setTxFilters(prev => ({ ...prev, ...newTxFilters }));
  };

  const refreshAll = () => {
    fetchDashboardData();
    fetchTransactions();
  };

  /**
   * Compute the human-readable active period label.
   */
  const getActivePeriodLabel = () => {
    const { period, startDate, endDate } = appliedFilters;
    if (period === 'all') {
      return 'Menampilkan seluruh data';
    }
    // For month, year, custom — show the actual date range
    if (startDate && endDate) {
      const formatDisplay = (dateStr) => {
        if (!dateStr) return '';
        const [y, m, d] = dateStr.split('-');
        const date = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
      };
      return `${formatDisplay(startDate)} - ${formatDisplay(endDate)}`;
    }
    return 'Bulan Ini';
  };

  return {
    loading,
    reportData,
    flowData,
    incomeBreakdown,
    expenseBreakdown,
    topProducts,
    transactions,
    transactionMeta,
    filters,
    txFilters,
    updateFilters,
    updateTxFilters,
    refreshAll,
    // New exports for period filter feature
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
    customDateError,
    applyCustomDateFilter,
    getActivePeriodLabel,
    appliedFilters
  };
};
