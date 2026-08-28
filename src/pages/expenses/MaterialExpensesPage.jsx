import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Wallet, ShoppingBag } from 'lucide-react';
import { getMaterialExpenses, createMaterialExpense, updateMaterialExpense, removeMaterialExpense } from '../../services/material-expense.service';
import AnalysisFilters from '../../components/Analysis/AnalysisFilters';
import { formatCurrency, formatDate } from '../../utils/format';
import { Card } from '../../components/common/Card';
import { Table } from '../../components/common/Table';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { useAuth } from '../../hooks/useAuth';

export default function MaterialExpensesPage() {
  const { role, hasPermission } = useAuth();
  
  const canCreate = role === 'OWNER' || hasPermission('expense.create') || hasPermission('cash.transaction.create');
  const canUpdate = role === 'OWNER' || hasPermission('expense.update') || hasPermission('cash.transaction.update');
  const canDelete = role === 'OWNER' || hasPermission('expense.delete') || hasPermission('cash.transaction.delete');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const [filter, setFilter] = useState('30days');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [currentId, setCurrentId] = useState(null);

  const [formData, setFormData] = useState({
    item_name: '',
    quantity: '',
    unit: 'KG', // default map
    total_price: '',
    note: ''
  });
  const [formError, setFormError] = useState(null);

  // Delete Confirm
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteItemName, setDeleteItemName] = useState('');

  const fetchExpenses = async (params) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMaterialExpenses(params);
      if (response && response.success) {
        setData(response.data);
      } else {
        setError(response?.message || 'Gagal memuat data pengeluaran bahan baku.');
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Pengeluaran Bahan Baku | POS Angkringan";
  }, []);

  useEffect(() => {
    if (filter === 'custom') return;
    fetchExpenses({ period: filter });
  }, [filter]);

  const handleApplyCustom = () => {
    if (customStartDate && customEndDate) {
      if (customStartDate > customEndDate) {
        setError('Tanggal mulai tidak boleh lebih besar dari tanggal akhir.');
        return;
      }
      fetchExpenses({ period: 'custom', startDate: customStartDate, endDate: customEndDate });
    }
  };

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setFormData({
      item_name: '',
      quantity: '',
      unit: 'KG',
      total_price: '',
      note: ''
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setModalMode('edit');
    setCurrentId(item.id);
    setFormData({
      item_name: item.nama_item,
      quantity: item.jumlah,
      unit: item.satuan,
      total_price: item.total_harga,
      note: item.catatan || ''
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const calculateTotal = () => {
    return parseFloat(formData.total_price) || 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.item_name || !formData.quantity || !formData.unit || !formData.total_price) {
      setFormError('Semua field yang diperlukan harus diisi.');
      return;
    }
    
    const quantity = parseFloat(formData.quantity);
    const total_price = parseFloat(formData.total_price);
    
    if (quantity <= 0) {
      setFormError('Jumlah harus lebih dari 0.');
      return;
    }
    
    if (total_price < 0) {
      setFormError('Total harga tidak boleh negatif.');
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError(null);
      
      const payload = {
        item_name: formData.item_name,
        quantity,
        unit: formData.unit,
        total_price,
        note: formData.note
      };

      if (modalMode === 'create') {
        await createMaterialExpense(payload);
      } else {
        await updateMaterialExpense(currentId, payload);
      }
      
      setIsModalOpen(false);
      // Refresh data
      filter === 'custom' ? handleApplyCustom() : fetchExpenses({ period: filter });
    } catch (err) {
      setFormError(err?.response?.data?.message || err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (item) => {
    setDeleteId(item.id);
    setDeleteItemName(item.nama_item);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setIsSubmitting(true);
      await removeMaterialExpense(deleteId);
      setIsConfirmOpen(false);
      filter === 'custom' ? handleApplyCustom() : fetchExpenses({ period: filter });
    } catch (err) {
      alert(err?.response?.data?.message || err.message || 'Gagal menghapus data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { header: 'No', accessor: (row, idx) => idx + 1, className: 'w-16 text-center' },
    { header: 'Nama Item', accessor: 'nama_item' },
    { header: 'Jumlah', accessor: (row) => `${row.jumlah} - ${row.satuan}`, className: 'font-medium' },
    { header: 'Harga Satuan', accessor: (row) => formatCurrency(row.harga_satuan) },
    { header: 'Total Harga', accessor: (row) => formatCurrency(row.total_harga), className: 'text-primary font-bold' },
    { header: 'Tanggal', accessor: (row) => formatDate(row.tanggal) },
    { 
      header: 'Aksi', 
      className: 'w-24 text-center',
      accessor: (row) => (
        <div className="flex justify-center gap-2">
          {canUpdate && (
            <button
              onClick={() => handleOpenEditModal(row)}
              className="text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-blue-300 dark:bg-blue-900/40 dark:hover:bg-blue-900/60 p-1.5 rounded transition-colors"
              title="Edit"
            >
              <Edit size={16} />
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => handleDeleteClick(row)}
              className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 dark:text-red-400 dark:hover:text-red-300 dark:bg-red-900/40 dark:hover:bg-red-900/60 p-1.5 rounded transition-colors"
              title="Hapus"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      )
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1600px] mx-auto animate-in fade-in duration-300">
      <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Pengeluaran Bahan Baku</h1>
          <p className="text-sm text-muted mt-1">Kelola pencatatan belanja bahan baku dengan rapi.</p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4">
          <AnalysisFilters
            filter={filter}
            setFilter={setFilter}
            customStartDate={customStartDate}
            setCustomStartDate={setCustomStartDate}
            customEndDate={customEndDate}
            setCustomEndDate={setCustomEndDate}
            onApplyCustom={handleApplyCustom}
          />
          {canCreate && (
            <Button
              onClick={handleOpenCreateModal}
              icon={Plus}
              className="w-full md:w-auto shrink-0"
            >
              Tambah Pengeluaran
            </Button>
          )}
        </div>
      </div>

      {error ? (
         <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
           <div className="text-red-500 font-bold mb-2 text-lg">Gagal memuat data</div>
           <p className="text-red-600 dark:text-red-400 text-sm mb-4 max-w-lg">{error}</p>
           <button
             onClick={() => filter === 'custom' ? handleApplyCustom() : fetchExpenses({ period: filter })}
             className="bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/40 dark:hover:bg-red-900/60 dark:text-red-300 px-5 py-2 rounded-lg text-sm font-bold transition-colors"
           >
             Coba Lagi
           </button>
         </div>
       ) : loading ? (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {[...Array(2)].map((_, i) => <div key={i} className="h-28 bg-card rounded-xl border border-border animate-pulse" />)}
         </div>
       ) : !data ? (
         <div className="bg-card border border-border rounded-xl p-8 text-center text-muted">
           Belum ada pencatatan pengeluaran bahan baku.
         </div>
       ) : (
         <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-xl p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md relative overflow-hidden">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0 text-orange-500 bg-orange-500/10">
                    <Wallet size={24} />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="text-xs text-text-secondary font-bold uppercase tracking-wider mb-1">Total Pengeluaran</div>
                    <div className="text-2xl font-extrabold tracking-tight truncate text-orange-500">
                      {formatCurrency(data.summary.total_material_expense)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md relative overflow-hidden">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0 text-indigo-500 bg-indigo-500/10">
                    <ShoppingBag size={24} />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="text-xs text-text-secondary font-bold uppercase tracking-wider mb-1">Total Transaksi</div>
                    <div className="text-2xl font-extrabold tracking-tight truncate text-indigo-500">
                      {data.summary.total_purchase_transactions} <span className="text-base font-semibold">struk</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
 
           <Card header="Daftar Pembelian Bahan Baku" className="overflow-hidden">
             {data.items && data.items.length > 0 ? (
               <div className="overflow-x-auto w-full">
                 <Table
                   data={data.items}
                   columns={columns}
                   keyExtractor={(row) => row.id}
                 />
               </div>
             ) : (
               <div className="p-8 text-center text-muted">
                 Belum ada pencatatan pengeluaran bahan baku pada periode ini.
               </div>
             )}
           </Card>
         </>
       )}

       <Modal 
        isOpen={isModalOpen} 
        onClose={() => !isSubmitting && setIsModalOpen(false)}
        title={modalMode === 'create' ? "Tambah Pengeluaran Bahan Baku" : "Edit Pengeluaran Bahan Baku"}
        size="md"
       >
         <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {formError && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
                {formError}
              </div>
            )}
            <Input
              label="Nama Item"
              placeholder="Contoh: Beras, Telur"
              value={formData.item_name}
              onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
              required
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Jumlah"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="Contoh: 10"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text">Satuan</label>
                <select 
                  className="w-full h-11 px-3 py-2 bg-card border border-border rounded-xl text-text text-sm focus:outline-none focus:ring-2 focus:border-primary focus:ring-primary-light transition-all"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  required
                >
                  <option value="KG">KG</option>
                  <option value="GRAM">GRAM</option>
                  <option value="LITER">LITER</option>
                  <option value="ML">ML</option>
                  <option value="PCS">PCS</option>
                  <option value="IKAT">IKAT</option>
                  <option value="PACK">PACK</option>
                </select>
              </div>
            </div>

            <Input
              label="Total Harga Bayar"
              type="number"
              min="0"
              placeholder="Contoh: 15000"
              value={formData.total_price}
              onChange={(e) => setFormData({ ...formData, total_price: e.target.value })}
              required
            />
            
            <Input
              label="Catatan (Opsional)"
              placeholder="Catatan tambahan belanja..."
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            />

            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl mt-2 flex justify-between items-center border border-border">
              <span className="font-semibold text-text">Total:</span>
              <span className="font-bold text-lg text-primary">{formatCurrency(calculateTotal())}</span>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                loading={isSubmitting}
              >
                Simpan
              </Button>
            </div>
         </form>
       </Modal>

       <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Hapus Pengeluaran"
        message={`Apakah Anda yakin ingin menghapus pencatatan pembelian ${deleteItemName}? Tindakan ini akan mempengaruhi laporan keuangan secara otomatis.`}
        confirmText="Hapus"
        cancelText="Batal"
        isDestructive={true}
        loading={isSubmitting}
       />
    </div>
  );
}
