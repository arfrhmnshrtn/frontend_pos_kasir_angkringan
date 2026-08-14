import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Trash2, Calendar, Filter } from 'lucide-react';
import { wasteService } from '../../services/waste.service';
import { usePermission } from '../../hooks/usePermission';
import { useToast } from '../../contexts/ToastContext';
import { WasteSummary } from './WasteSummary';
import { WasteTable } from './WasteTable';
import { WasteFormModal } from './WasteFormModal';
import { WasteDetailModal } from './WasteDetailModal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { Button } from '../common/Button';
import { Pagination } from '../common/Pagination';
import { Input } from '../common/Input';
import { Select } from '../common/Select';

export default function WasteManagementView() {
  const { hasPermission } = usePermission();
  const toast = useToast();

  // Allowed?
  const canRead = hasPermission('waste.read');
  const canCreate = hasPermission('waste.create');
  const canUpdate = hasPermission('waste.update');
  const canDelete = hasPermission('waste.delete');
  const canAnalyze = hasPermission('waste.analysis');

  const [wastes, setWastes] = useState([]);
  const [summary, setSummary] = useState(null);
  const [meta, setMeta] = useState({ page: 1, limit: 20, total: 0, total_pages: 1 });
  
  const [loading, setLoading] = useState(true);
  const [loadingSummary, setLoadingSummary] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState({
    page: 1,
    startDate: '',
    endDate: '',
    type: '',
    reason: ''
  });

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailData, setDetailData] = useState(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setFilters(prev => ({ ...prev, page: 1 }));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchWastes = useCallback(async () => {
    if (!canRead) return;
    setLoading(true);
    try {
      const params = {
        ...filters,
        search: debouncedSearch
      };
      const res = await wasteService.getWastes(params);
      setWastes(res?.data?.data || res?.data || []);
      if (res?.data?.meta) {
        setMeta(res.data.meta);
      } else if (res?.meta) {
          setMeta(res.meta);
      }
    } catch (err) {
      toast.error('Gagal mengambil data barang terbuang');
      setWastes([]);
    } finally {
      setLoading(false);
    }
  }, [filters, debouncedSearch, canRead, toast]);

  const fetchSummary = useCallback(async () => {
    if (!canAnalyze) return;
    setLoadingSummary(true);
    try {
      const params = {
        startDate: filters.startDate,
        endDate: filters.endDate
      };
      const res = await wasteService.getSummary(params);
      setSummary(res?.data?.data || res?.data || null);
    } catch (err) {
       console.error(err);
    } finally {
      setLoadingSummary(false);
    }
  }, [filters.startDate, filters.endDate, canAnalyze]);

  useEffect(() => {
    fetchWastes();
  }, [fetchWastes]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilters({
      page: 1,
      startDate: '',
      endDate: '',
      type: '',
      reason: ''
    });
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    toast.success('Pencatatan berhasil disimpan.');
    fetchWastes();
    fetchSummary();
  };

  const handleOpenEdit = (data) => {
    setEditData(data);
    setIsFormOpen(true);
  };

  const handleOpenDetail = async (data) => {
    try {
      const res = await wasteService.getWasteById(data.id);
      setDetailData(res?.data?.data || res?.data || data);
      setIsDetailOpen(true);
    } catch (err) {
      toast.error('Gagal memuat detail.');
    }
  };

  const handleOpenDelete = (data) => {
    setDeleteData(data);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteData) return;
    setDeleting(true);
    try {
      await wasteService.deleteWaste(deleteData.id);
      toast.success('Barang terbuang berhasil dihapus dan stok dikembalikan.');
      setIsDeleteOpen(false);
      setDeleteData(null);
      fetchWastes();
      fetchSummary();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Gagal menghapus.');
    } finally {
      setDeleting(false);
    }
  };

  if (!canRead) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-text-secondary">
        <Trash2 size={48} className="mb-4 text-muted" />
        <h2 className="text-xl font-bold text-text mb-2">Akses Ditolak</h2>
        <p>Anda tidak memiliki izin untuk melihat modul Barang Terbuang.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex md:items-center justify-end flex-col md:flex-row gap-4">
        {/* <div>
          <h2 className="text-2xl font-bold text-text tracking-tight flex items-center gap-2 mb-1">
            <Trash2 className="text-danger w-6 h-6" />
            Barang Terbuang
          </h2>
          <p className="text-sm text-text-secondary">
            Catat dan pantau barang yang terbuang untuk membantu mengontrol kerugian dan stok.
          </p>
        </div> */}
        {canCreate && (
          <Button variant="primary" onClick={() => { setEditData(null); setIsFormOpen(true); }} className="whitespace-nowrap shadow-md">
            <Plus size={16} className="mr-2" />
            Catat Barang Terbuang
          </Button>
        )}
      </div>

      {canAnalyze && (
        <WasteSummary summary={summary} />
      )}

      <div className="bg-card border border-border rounded-xl shadow-sm p-5 md:p-6 flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          <div className="relative col-span-1 md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
            <input 
              type="text" 
              className="w-full pl-9 pr-4 py-2 bg-main border border-border rounded-lg text-sm text-text focus:outline-none focus:border-primary transition-all" 
              placeholder="Cari barang, catatan, pembuat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Input 
            name="startDate" 
            label="" 
            type="date"
            value={filters.startDate} 
            onChange={handleFilterChange} 
            placeholder="Mulai Tanggal"
            className="mt-0"
          />
          <Input 
            name="endDate" 
            label="" 
            type="date"
            value={filters.endDate} 
            onChange={handleFilterChange} 
            placeholder="Sampai Tanggal"
          />

          <Button variant="outline" onClick={handleResetFilters} className="h-10.5 mt-0 text-xs">
            Reset Filter
          </Button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 mt-1">
          <div className="text-sm font-semibold text-text-secondary mr-2 flex items-center"><Filter size={14} className="mr-1"/> Filter Cepat:</div>
          <Select 
            name="type" 
            value={filters.type} 
            onChange={handleFilterChange}
            options={[
              { value: '', label: 'Semua Kategori' },
              { value: 'PRODUCT', label: 'Produk/Menu' },
              { value: 'INGREDIENT', label: 'Bahan Baku' }
            ]}
          />
          <Select 
            name="reason" 
            value={filters.reason} 
            onChange={handleFilterChange}
            options={[
              { value: '', label: 'Semua Alasan' },
              { value: 'BASI', label: 'Basi' },
              { value: 'KADALUARSA', label: 'Kadaluarsa' },
              { value: 'RUSAK', label: 'Rusak' },
              { value: 'GOSONG', label: 'Gosong' }
            ]}
          />
        </div>

        <WasteTable 
          wastes={wastes}
          loading={loading}
          onDetail={handleOpenDetail}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
          hasPermission={hasPermission}
        />

        {!loading && wastes.length > 0 && (
          <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-4">
             <div className="text-sm text-text-secondary">
               Menampilkan {(meta.page - 1) * meta.limit + 1} - {Math.min(meta.page * meta.limit, meta.total)} dari {meta.total} data
             </div>
             <Pagination 
               currentPage={meta.page}
               totalPages={meta.total_pages}
               onPageChange={handlePageChange}
             />
          </div>
        )}
      </div>

      <WasteFormModal 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleFormSuccess}
        editData={editData}
      />

      <WasteDetailModal 
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        waste={detailData}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => !deleting && setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Konfirmasi Hapus Barang Terbuang"
        message={`Apakah Anda yakin ingin menghapus pencatatan barang terbuang ini? (${deleteData?.item_name}, ${deleteData?.quantity} ${deleteData?.unit || ''}) \nPenghapusan akan mengembalikan stok sebesar jumlah barang terbuang.`}
        confirmText={deleting ? 'Menghapus...' : 'Hapus'}
        cancelText="Batal"
        variant="danger"
      />
    </div>
  );
}
