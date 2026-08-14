import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import api from '../../services/axios';
import { wasteService } from '../../services/waste.service';

const REASON_OPTIONS = [
  { value: 'BASI', label: 'Basi' },
  { value: 'KADALUARSA', label: 'Kadaluarsa' },
  { value: 'RUSAK', label: 'Rusak' },
  { value: 'GOSONG', label: 'Gosong' },
  { value: 'JATUH', label: 'Jatuh' },
  { value: 'SALAH_PRODUKSI', label: 'Salah Produksi' },
  { value: 'SISA_PRODUKSI', label: 'Sisa Produksi' },
  { value: 'HILANG', label: 'Hilang' },
  { value: 'LAINNYA', label: 'Lainnya' }
];

export const WasteFormModal = ({
  isOpen,
  onClose,
  onSuccess,
  editData
}) => {
  const [formData, setFormData] = useState({
    type: 'PRODUCT',
    item_id: '',
    quantity: '',
    reason: 'BASI',
    note: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);

  const fetchItems = async (type) => {
    setLoadingItems(true);
    setErrorMsg(null);
    try {
      if (type === 'PRODUCT') {
        const res = await api.get('/katalog');
        const data = res?.data?.data || res?.data || res || [];
        setItems(Array.isArray(data) ? data.map(i => ({ value: i.id, label: i.nama_item })) : []);
      } else {
        // Fallback for ingredients if the endpoint exists, it should be /ingredients
        try {
          const res = await api.get('/ingredients'); 
          const data = res?.data?.data || res?.data || res || [];
          setItems(Array.isArray(data) ? data.map(i => ({ value: i.id, label: i.name })) : []);
        } catch (err) {
            console.warn("Ingredient fetch error", err);
            setItems([]);
        }
      }
    } catch (err) {
      console.error(err);
      setItems([]);
    } finally {
      setLoadingItems(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setFormData({
          type: editData.type,
          item_id: editData.item_id,
          quantity: editData.quantity,
          reason: editData.reason || 'BASI',
          note: editData.note || ''
        });
        fetchItems(editData.type);
      } else {
        setFormData({
          type: 'PRODUCT',
          item_id: '',
          quantity: '',
          reason: 'BASI',
          note: ''
        });
        fetchItems('PRODUCT');
      }
      setErrorMsg(null);
    }
  }, [isOpen, editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'type') {
      setFormData(prev => ({ ...prev, item_id: '' }));
      fetchItems(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!formData.item_id) {
      setErrorMsg('Pilih barang terlebih dahulu.');
      return;
    }
    if (formData.quantity <= 0) {
      setErrorMsg('Jumlah harus lebih dari 0.');
      return;
    }
    if (formData.reason === 'LAINNYA' && !formData.note) {
      setErrorMsg('Catatan wajib diisi jika alasan adalah "Lainnya".');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        quantity: Number(formData.quantity),
        reason: formData.reason,
        note: formData.note
      };
      
      if (!editData) {
        payload.type = formData.type;
        payload.item_id = Number(formData.item_id);
        await wasteService.createWaste(payload);
      } else {
        await wasteService.updateWaste(editData.id, payload);
      }
      onSuccess();
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || err?.message || 'Gagal menyimpan barang terbuang.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={!submitting ? onClose : () => {}}
      title={editData ? "Koreksi Barang Terbuang" : "Catat Barang Terbuang"}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {errorMsg && (
          <div className="bg-danger/10 text-danger text-sm p-3 rounded-lg border border-danger/20">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Jenis Barang"
            name="type"
            value={formData.type}
            onChange={handleChange}
            options={[
              { value: 'PRODUCT', label: 'Produk/Menu' },
              { value: 'INGREDIENT', label: 'Bahan Baku' }
            ]}
            disabled={!!editData || submitting}
            required
          />
          <Select
            label="Barang"
            name="item_id"
            value={formData.item_id}
            onChange={handleChange}
            options={[{ value: '', label: 'Pilih barang...' }, ...items]}
            disabled={!!editData || submitting || loadingItems}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Jumlah"
            name="quantity"
            type="number"
            min="1"
            step="0.01"
            value={formData.quantity}
            onChange={handleChange}
            disabled={submitting}
            required
          />
          <Select
            label="Alasan"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            options={REASON_OPTIONS}
            disabled={submitting}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-secondary mb-1.5 align-baseline">
            Catatan
          </label>
          <textarea 
            className="w-full bg-main border border-border rounded-lg text-sm text-text px-3 py-2.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all min-h-24"
            placeholder={formData.reason === 'LAINNYA' ? 'Wajib diisi...' : 'Opsional...'}
            name="note"
            value={formData.note}
            onChange={handleChange}
            disabled={submitting}
            required={formData.reason === 'LAINNYA'}
          />
        </div>

        <div className="flex justify-end gap-3 mt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
            Batal
          </Button>
          <Button type="submit" variant="primary" disabled={submitting} loading={submitting}>
            {submitting ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
