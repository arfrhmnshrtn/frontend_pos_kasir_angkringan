import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  PieChart as PieChartIcon,
  Plus,
  Pencil,
  Trash2,
  Target,
  Percent,
  Wallet,
  Banknote,
} from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import * as cashService from '../../services/cash.service';
import { formatCurrency } from '../../utils/format';
import { Button } from '../common/Button';
import { EmptyState } from '../common/EmptyState';
import { BudgetModal } from './BudgetModal';
import { DeleteBudgetModal } from './DeleteBudgetModal';

export const BudgetAllocation = ({ netProfit = 0 }) => {
  const toast = useToast();

  // Data state
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ─── Fetch Budgets ────────────────────────────────────────────
  const fetchBudgets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await cashService.getBudgets();
      const data = res?.data || res || [];
      setBudgets(Array.isArray(data) ? data : []);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Gagal mengambil data budget.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  // ─── Computed values ──────────────────────────────────────────
  const activeBudgets = useMemo(
    () => budgets.filter((b) => b.is_active),
    [budgets]
  );

  const sortedBudgets = useMemo(
    () => [...activeBudgets].sort((a, b) => {
      // Put PERCENTAGE first, then FIXED. Then sort by amount
      if (a.allocation_type === 'FIXED' && b.allocation_type !== 'FIXED') return 1;
      if (a.allocation_type !== 'FIXED' && b.allocation_type === 'FIXED') return -1;
      if (a.allocation_type === 'FIXED') return b.fixed_amount - a.fixed_amount;
      return b.percentage - a.percentage;
    }),
    [activeBudgets]
  );

  const totalPercentage = useMemo(
    () => activeBudgets.reduce((sum, b) => sum + (b.allocation_type === 'FIXED' ? 0 : b.percentage), 0),
    [activeBudgets]
  );

  const remainingPercentage = useMemo(
    () => Math.max(0, 100 - totalPercentage),
    [totalPercentage]
  );

  const totalFixedAmount = useMemo(
    () => activeBudgets.reduce((sum, b) => sum + (b.allocation_type === 'FIXED' ? (b.fixed_amount || 0) : 0), 0),
    [activeBudgets]
  );

  // Compute monetary amounts from net cash flow
  const totalAllocatedAmount = useMemo(
    () => Math.round(netProfit * (totalPercentage / 100)) + totalFixedAmount,
    [netProfit, totalPercentage, totalFixedAmount]
  );

  const remainingAmount = useMemo(
    () => netProfit - totalAllocatedAmount,
    [netProfit, totalAllocatedAmount]
  );

  // ─── CRUD handlers ───────────────────────────────────────────
  const handleCreate = () => {
    setEditingBudget(null);
    setModalOpen(true);
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingBudget(null);
  };

  const handleSaveSuccess = async () => {
    handleModalClose();
    await fetchBudgets();
  };

  const handleDeleteClick = (budget) => {
    setDeleteTarget(budget);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await cashService.deleteBudget(deleteTarget.id);
      toast.success('Alokasi budget berhasil dihapus');
      setDeleteTarget(null);
      await fetchBudgets();
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Gagal menghapus budget. Silakan coba lagi.';
      toast.error(message);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteTarget(null);
  };

  // ─── Color helpers ────────────────────────────────────────────
  const BUDGET_COLORS = [
    { bg: 'bg-blue-500', text: 'text-blue-500', soft: 'bg-blue-500/10', ring: 'ring-blue-500/20' },
    { bg: 'bg-emerald-500', text: 'text-emerald-500', soft: 'bg-emerald-500/10', ring: 'ring-emerald-500/20' },
    { bg: 'bg-amber-500', text: 'text-amber-500', soft: 'bg-amber-500/10', ring: 'ring-amber-500/20' },
    { bg: 'bg-rose-500', text: 'text-rose-500', soft: 'bg-rose-500/10', ring: 'ring-rose-500/20' },
    { bg: 'bg-purple-500', text: 'text-purple-500', soft: 'bg-purple-500/10', ring: 'ring-purple-500/20' },
    { bg: 'bg-cyan-500', text: 'text-cyan-500', soft: 'bg-cyan-500/10', ring: 'ring-cyan-500/20' },
    { bg: 'bg-orange-500', text: 'text-orange-500', soft: 'bg-orange-500/10', ring: 'ring-orange-500/20' },
    { bg: 'bg-teal-500', text: 'text-teal-500', soft: 'bg-teal-500/10', ring: 'ring-teal-500/20' },
  ];

  const getColor = (index) => BUDGET_COLORS[index % BUDGET_COLORS.length];

  // ─── Loading skeleton ────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col gap-5">
        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-5 h-5 bg-muted/20 rounded animate-pulse"></div>
            <div className="h-5 bg-muted/20 rounded w-48 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-main border border-border rounded-xl p-4 h-20 animate-pulse"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-main border border-border rounded-xl p-5 h-40 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-5">
      <div className="bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col gap-5">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <div className="flex items-center gap-2.5 font-bold text-lg text-text">
            <PieChartIcon size={20} className="text-primary" />
            <span>Alokasi Budget</span>
          </div>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={handleCreate}
          >
            Tambah Budget
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Net Cash Flow Reference */}
          <div className="bg-main border border-border rounded-xl p-4 flex items-start gap-3.5 transition-all hover:-translate-y-0.5 hover:shadow-sm">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-purple-500 bg-purple-500/10">
              <Banknote size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-text-secondary font-bold uppercase tracking-wider mb-0.5">
                Laba Bersih
              </span>
              <span className={`text-2xl font-extrabold tracking-tight ${netProfit < 0 ? 'text-danger' : 'text-purple-500'}`}>
                {formatCurrency(netProfit)}
              </span>
              <span className="text-[0.65rem] text-muted mt-0.5">Dasar perhitungan alokasi</span>
            </div>
          </div>

          {/* Total Alokasi */}
          <div className="bg-main border border-border rounded-xl p-4 flex items-start gap-3.5 transition-all hover:-translate-y-0.5 hover:shadow-sm">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-blue-500 bg-blue-500/10">
              <Target size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-text-secondary font-bold uppercase tracking-wider mb-0.5">
                Total Alokasi
              </span>
              <span className={`text-2xl font-extrabold tracking-tight ${totalPercentage > 100 ? 'text-danger' : 'text-blue-500'}`}>
                {totalPercentage}%
              </span>
              <span className="text-[0.65rem] text-muted mt-0.5">{formatCurrency(totalAllocatedAmount)}</span>
            </div>
          </div>

          {/* Sisa Alokasi */}
          <div className="bg-main border border-border rounded-xl p-4 flex items-start gap-3.5 transition-all hover:-translate-y-0.5 hover:shadow-sm">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${remainingAmount < 0 ? 'text-danger bg-danger/10' : 'text-emerald-500 bg-emerald-500/10'}`}>
              <Wallet size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-text-secondary font-bold uppercase tracking-wider mb-0.5">
                Sisa Alokasi
              </span>
              <span className={`text-2xl font-extrabold tracking-tight ${remainingAmount < 0 ? 'text-danger' : remainingAmount === 0 ? 'text-text-secondary' : 'text-emerald-500'}`}>
                {remainingPercentage}%
              </span>
              <span className="text-[0.65rem] text-muted mt-0.5">{formatCurrency(remainingAmount)}</span>
            </div>
          </div>
        </div>

        {/* Total progress bar */}
        <div>
          <div className="flex justify-between items-center text-xs font-semibold text-text-secondary mb-1.5">
            <span>Total dialokasikan</span>
            <span>{totalPercentage}% / 100%</span>
          </div>
          <div className="bg-main h-3 rounded-full overflow-hidden border border-border">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${totalPercentage > 100 ? 'bg-danger' : 'bg-blue-500'}`}
              style={{ width: `${Math.min(100, totalPercentage)}%` }}
            ></div>
          </div>
        </div>

        {/* Budget Cards or Empty State */}
        {sortedBudgets.length === 0 ? (
          <EmptyState
            icon={PieChartIcon}
            title="Belum ada alokasi budget"
            description="Tambahkan alokasi budget untuk mengatur pembagian dana kas."
            actionLabel="+ Tambah Budget"
            onAction={handleCreate}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedBudgets.map((budget, idx) => {
              const color = getColor(idx);
              const isFixed = budget.allocation_type === 'FIXED';
              let safePercentage = 0;
              let amount = 0;
              
              if (isFixed) {
                amount = budget.fixed_amount || 0;
                safePercentage = netProfit > 0 ? Math.min(100, (amount / netProfit) * 100) : 0;
              } else {
                safePercentage = Math.min(100, Math.max(0, budget.percentage));
                amount = Math.round(netProfit * (budget.percentage / 100));
              }
              return (
                <div
                  key={budget.id}
                  className="bg-main border border-border rounded-xl p-5 flex flex-col gap-3 transition-all hover:-translate-y-1 hover:shadow-md group"
                >
                  {/* Name + Percentage/Fixed Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${color.soft}`}>
                        {isFixed ? <Banknote size={14} className={color.text} /> : <Percent size={14} className={color.text} />}
                      </div>
                      <h4 className="font-bold text-text text-sm truncate">
                        {budget.name}
                      </h4>
                    </div>
                    {isFixed ? (
                      <span className={`text-xs font-bold shrink-0 bg-card border px-2 py-1 rounded-md ${color.text} border-${color.text.replace('text-', '')}/30`}>
                        FIXED
                      </span>
                    ) : (
                      <span className={`text-xl font-extrabold shrink-0 ${color.text}`}>
                        {budget.percentage}%
                      </span>
                    )}
                  </div>

                  {/* Monetary Amount */}
                  <div className={`text-sm font-bold ${color.text}`}>
                    {formatCurrency(amount)}
                  </div>

                  {/* Progress bar */}
                  <div>
                    <div className="bg-card h-2.5 rounded-full overflow-hidden border border-border/50">
                      <div
                        className={`${color.bg} h-full rounded-full transition-all duration-500 ease-out`}
                        style={{ width: `${safePercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-1 mt-auto">
                    <button
                      onClick={() => handleEdit(budget)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-blue-500 px-2.5 py-1.5 rounded-lg hover:bg-blue-500/10 transition-colors cursor-pointer"
                    >
                      <Pencil size={13} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(budget)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-danger px-2.5 py-1.5 rounded-lg hover:bg-danger/10 transition-colors cursor-pointer"
                    >
                      <Trash2 size={13} />
                      Hapus
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <BudgetModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSuccess={handleSaveSuccess}
        editingBudget={editingBudget}
        activeBudgets={activeBudgets}
      />

      {/* Delete Confirmation */}
      <DeleteBudgetModal
        isOpen={!!deleteTarget}
        budgetName={deleteTarget?.name || ''}
        isLoading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};
