import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { formatCurrency } from '../../utils/format';
import { debtService } from '../../services/debt.service';
import { useToast } from '../../contexts/ToastContext';
import { Wallet } from 'lucide-react';

export const PayDebtModal = ({ isOpen, onClose, onSuccess, debt }) => {
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    payment_method: 'tunai' // Default
  });
  const [errorMsg, setErrorMsg] = useState(null);

  if (!debt) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg(null);
  };

  const setAllAmount = () => {
    setFormData({ ...formData, amount: debt.remaining_amount });
    setErrorMsg(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payAmount = Number(formData.amount);
    
    if (payAmount <= 0) {
      setErrorMsg('Nominal bayar harus lebih dari 0.');
      return;
    }
    
    if (payAmount > debt.remaining_amount) {
      setErrorMsg(`Nominal bayar melebihi sisa hutang (${formatCurrency(debt.remaining_amount)}).`);
      return;
    }

    if (!formData.payment_method) {
      setErrorMsg('Metode pembayaran wajib dipilih.');
      return;
    }

    setSubmitting(true);
    try {
      await debtService.createDebtPayment(debt.id, {
        amount: payAmount,
        payment_method: formData.payment_method
      });
      toast.success(`Pembayaran hutang atas nama ${debt.customer_name} berhasil dicatat.`);
      onSuccess();
    } catch (err) {
       setErrorMsg(err?.response?.data?.message || err?.message || 'Gagal menyimpan pembayaran hutang.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={!submitting ? onClose : () => {}}
      title="Pembayaran Hutang Pelanggan"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {errorMsg && (
           <div className="bg-danger/10 text-danger text-sm p-3 rounded-lg border border-danger/20">
             {errorMsg}
           </div>
        )}

        <div className="bg-main rounded-xl p-4 border border-border shadow-sm flex flex-col gap-2 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
            <Wallet size={120} />
          </div>
          <div>
            <span className="text-xs text-text-secondary font-bold uppercase block mb-0.5">Nama Pelanggan</span>
            <span className="text-lg font-black text-text">{debt.customer_name || 'Tanpa Nama'}</span>
          </div>
          <div className="flex justify-between items-center mt-2 border-t border-border pt-2">
            <div>
              <span className="text-[0.7rem] text-text-secondary font-bold block mb-0.5">Total & Sudah Dibayar</span>
              <span className="font-semibold text-text text-sm">
                {formatCurrency(debt.total_amount)} / <span className="text-success">{formatCurrency(debt.paid_amount)}</span>
              </span>
            </div>
            <div className="text-right">
              <span className="text-[0.7rem] text-text-secondary font-bold block mb-0.5">Sisa Tagihan</span>
              <span className="font-bold text-amber-500 text-sm">
                {formatCurrency(debt.remaining_amount)}
              </span>
            </div>
          </div>
        </div>

        <div>
           <div className="flex justify-between items-end mb-1.5">
             <label className="block text-sm font-semibold text-text-secondary">Nominal Bayar (Rp)</label>
             <button type="button" onClick={setAllAmount} className="text-[0.7rem] font-bold text-primary hover:underline" disabled={submitting}>
                Bayar Lunas (Semua)
             </button>
           </div>
           <input
             type="number"
             name="amount"
             value={formData.amount}
             onChange={handleChange}
             max={debt.remaining_amount}
             min="1"
             required
             disabled={submitting}
             placeholder={`Maks ${debt.remaining_amount}`}
             className="w-full bg-main border border-border rounded-lg text-sm text-text px-3 py-2.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all"
           />
        </div>

        <Select
          label="Metode Pembayaran Masuk Ke"
          name="payment_method"
          value={formData.payment_method}
          onChange={handleChange}
          required
          disabled={submitting}
          options={[
            { value: 'tunai', label: 'Tunai Kasir' },
            { value: 'qris', label: 'QRIS' },
            { value: 'transfer', label: 'Transfer Bank' }
          ]}
        />

        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border">
           <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
             Batal
           </Button>
           <Button type="submit" variant="primary" loading={submitting} disabled={submitting}>
             {submitting ? 'Menyimpan...' : 'Bayar Hutang'}
           </Button>
        </div>

      </form>
    </Modal>
  );
};
