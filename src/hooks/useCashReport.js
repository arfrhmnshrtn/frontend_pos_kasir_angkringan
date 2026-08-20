import { useState, useCallback, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import * as cashService from '../services/cash.service';
import { debtService } from '../services/debt.service';
import { getSalesAnalysis } from '../services/analysis.service';

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

  const [txFilters, setTxFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    type: ''
  });

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [reportRes, flowRes, incomeRes, expenseRes, analysisRes] = await Promise.all([
        cashService.getCashReports(filters),
        cashService.getCashFlow(filters),
        cashService.getIncomeBreakdown(filters),
        cashService.getExpenseBreakdown(filters),
        getSalesAnalysis(filters).catch(() => null)
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
      toast.error(err?.response?.data?.message || 'Gagal mengambil data laporan kas');
    } finally {
      setLoading(false);
    }
  }, [filters, toast]);

  const fetchTransactions = useCallback(async () => {
    try {
      const params = {
        ...filters,
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
  }, [filters, txFilters]);

  // Initial Fetch & Refresh on filter change
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setTxFilters(prev => ({ ...prev, page: 1 }));
  };

  const updateTxFilters = (newTxFilters) => {
    setTxFilters(prev => ({ ...prev, ...newTxFilters }));
  };

  const refreshAll = () => {
    fetchDashboardData();
    fetchTransactions();
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
    refreshAll
  };
};
