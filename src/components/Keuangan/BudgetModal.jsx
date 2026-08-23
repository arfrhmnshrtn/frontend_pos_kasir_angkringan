import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useToast } from '../../contexts/ToastContext';
import * as cashService from '../../services/cash.service';

export const BudgetModal = ({
  isOpen,
  onClose,
  onSuccess,
  editingBudget,
  activeBudgets = [],
}) => {
  const toast = useToast();
  const isEdit = !!editingBudget;

  // Form state
  const [formData, setFormData] = useState({ 
    name: '', 
    allocation_type: 'PERCENTAGE', 
    percentage: '', 
    fixed_amount: '' 
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Pre-fill form when editing
  useEffect(() => {
    if (isOpen) {
      if (editingBudget) {
        setFormData({
          name: editingBudget.name || '',
          allocation_type: editingBudget.allocation_type || 'PERCENTAGE',
          percentage: editingBudget.percentage ? editingBudget.percentage.toString() : '',
          fixed_amount: editingBudget.fixed_amount ? editingBudget.fixed_amount.toString() : '',
        });
      } else {
        setFormData({ name: '', allocation_type: 'PERCENTAGE', percentage: '', fixed_amount: '' });
      }
      setErrors({});
    }
  }, [isOpen, editingBudget]);

  // Total percentage from other active PERCENTAGE budgets (excluding the one being edited)
  const otherTotalPercentage = useMemo(() => {
    return activeBudgets
      .filter((b) => b.allocation_type === 'PERCENTAGE' || !b.allocation_type)
      .filter((b) => (isEdit ? b.id !== editingBudget.id : true))
      .reduce((sum, b) => sum + b.percentage, 0);
  }, [activeBudgets, editingBudget, isEdit]);

  // Remaining available percentage
  const availablePercentage = Math.max(0, 100 - otherTotalPercentage);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const setType = (type) => {
    setFormData((prev) => ({ ...prev, allocation_type: type }));
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nama budget wajib diisi.';
    }

    if (formData.allocation_type === 'PERCENTAGE') {
      const pct = parseFloat(formData.percentage);
      if (!formData.percentage && formData.percentage !== 0 && formData.percentage !== '0') {
        newErrors.percentage = 'Persentase wajib diisi.';
      } else if (isNaN(pct)) {
        newErrors.percentage = 'Persentase harus berupa angka.';
      } else if (pct <= 0) {
        newErrors.percentage = 'Persentase harus lebih besar dari 0.';
      } else if (pct > 100) {
        newErrors.percentage = 'Persentase tidak boleh lebih dari 100.';
      } else if (pct > availablePercentage) {
        newErrors.percentage = `Total alokasi budget persentase tidak boleh melebihi 100%. Sisa tersedia: ${availablePercentage}%.`;
      }
    } else {
      const amt = parseInt(formData.fixed_amount, 10);
      if (!formData.fixed_amount && formData.fixed_amount !== 0 && formData.fixed_amount !== '0') {
        newErrors.fixed_amount = 'Nominal wajib diisi.';
      } else if (isNaN(amt)) {
        newErrors.fixed_amount = 'Nominal harus berupa angka.';
      } else if (amt <= 0) {
        newErrors.fixed_amount = 'Nominal harus lebih besar dari 0.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: formData.name.trim(),
      allocation_type: formData.allocation_type,
    };

    if (formData.allocation_type === 'PERCENTAGE') {
      payload.percentage = parseFloat(formData.percentage);
      payload.fixed_amount = 0;
    } else {
      payload.fixed_amount = parseInt(formData.fixed_amount, 10);
      payload.percentage = 0;
    }

    setSubmitting(true);
    try {
      if (isEdit) {
        await cashService.updateBudget(editingBudget.id, payload);
        toast.success('Alokasi budget berhasil diperbarui');
      } else {
        await cashService.createBudget(payload);
        toast.success('Alokasi budget berhasil dibuat');
      }
      onSuccess();
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Terjadi kesalahan. Silakan coba lagi.';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Alokasi Budget' : 'Tambah Alokasi Budget'}
      subtitle={
        isEdit
          ? `Ubah data alokasi budget "${editingBudget?.name}"`
          : 'Tambahkan alokasi budget baru untuk mengatur pembagian dana kas'
      }
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Name field */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="budget-name" className="text-sm font-medium text-text">
            Nama Budget
          </label>
          <input
            id="budget-name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Contoh: Dana Darurat"
            className={`w-full rounded-xl border bg-card text-text placeholder-text-muted text-sm transition-all duration-200 focus:outline-none focus:ring-2 pl-4 pr-4 py-2.5 ${
              errors.name
                ? 'border-danger focus:border-danger focus:ring-danger-bg'
                : 'border-border focus:border-primary focus:ring-primary-light'
            }`}
            disabled={submitting}
          />
          {errors.name && (
            <span className="text-xs text-danger font-medium">{errors.name}</span>
          )}
        </div>

        {/* Type Selection */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text">Jenis Alokasi</label>
          <div className="flex bg-main p-1 rounded-xl border border-border">
            <button
              type="button"
              className={`flex-1 text-sm font-semibold py-2 rounded-lg transition-colors ${
                formData.allocation_type === 'PERCENTAGE'
                  ? 'bg-card shadow-sm border border-border/50 text-primary'
                  : 'text-text-secondary hover:text-text'
              }`}
              onClick={() => setType('PERCENTAGE')}
              disabled={submitting}
            >
              Persentase (%)
            </button>
            <button
              type="button"
              className={`flex-1 text-sm font-semibold py-2 rounded-lg transition-colors ${
                formData.allocation_type === 'FIXED'
                  ? 'bg-card shadow-sm border border-border/50 text-emerald-500'
                  : 'text-text-secondary hover:text-text'
              }`}
              onClick={() => setType('FIXED')}
              disabled={submitting}
            >
              Nominal (Rp)
            </button>
          </div>
        </div>

        {/* Value Field depending on type */}
        {formData.allocation_type === 'PERCENTAGE' ? (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="budget-percentage" className="text-sm font-medium text-text">
              Persentase
            </label>
            <div className="relative flex items-center">
              <input
                id="budget-percentage"
                name="percentage"
                type="number"
                min="1"
                max="100"
                step="1"
                value={formData.percentage}
                onChange={handleChange}
                placeholder="Contoh: 10"
                className={`w-full rounded-xl border bg-card text-text placeholder-text-muted text-sm transition-all duration-200 focus:outline-none focus:ring-2 pl-4 pr-10 py-2.5 ${
                  errors.percentage
                    ? 'border-danger focus:border-danger focus:ring-danger-bg'
                    : 'border-border focus:border-primary focus:ring-primary-light'
                }`}
                disabled={submitting}
              />
              <span className="absolute right-3.5 text-text-secondary font-semibold text-sm pointer-events-none">
                %
              </span>
            </div>
            {errors.percentage && (
              <span className="text-xs text-danger font-medium">{errors.percentage}</span>
            )}
            {!errors.percentage && (
              <span className="text-xs text-text-secondary">
                Sisa alokasi tersedia: {availablePercentage}%
              </span>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="budget-fixed" className="text-sm font-medium text-text">
              Nominal Fix (Rp)
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-text-secondary font-semibold text-sm pointer-events-none">
                Rp
              </span>
              <input
                id="budget-fixed"
                name="fixed_amount"
                type="number"
                min="0"
                step="1000"
                value={formData.fixed_amount}
                onChange={handleChange}
                placeholder="Contoh: 1000000"
                className={`w-full rounded-xl border bg-card text-text placeholder-text-muted text-sm transition-all duration-200 focus:outline-none focus:ring-2 pl-9 pr-4 py-2.5 ${
                  errors.fixed_amount
                    ? 'border-danger focus:border-danger focus:ring-danger-bg'
                    : 'border-border focus:border-primary focus:ring-primary-light'
                }`}
                disabled={submitting}
              />
            </div>
            {errors.fixed_amount && (
              <span className="text-xs text-danger font-medium">{errors.fixed_amount}</span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-border mt-1">
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Batal
          </Button>
          <Button type="submit" variant="primary" isLoading={submitting} disabled={submitting}>
            {submitting ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Simpan'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
