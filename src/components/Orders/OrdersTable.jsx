import React, { useState, useEffect } from 'react';
import api from '../../services/axios';
import EditOrderModal from './EditOrderModal';
import PrintReceiptModal from './PrintReceiptModal';
import DeleteOrderModal from './DeleteOrderModal';
import {
  Eye,
  Check,
  Edit,


  X,
  Filter,
  Search,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Printer,
  Trash2
} from 'lucide-react';

export default function OrdersTable({ searchQuery }) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printOrder, setPrintOrder] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [successAlert, setSuccessAlert] = useState({ show: false, message: '' });

  const handleUpdateSuccess = async () => {
    await fetchOrders();
    setSuccessAlert({ show: true, message: 'Berhasil memperbarui pesanan!' });
    setTimeout(() => {
      setSuccessAlert({ show: false, message: '' });
    }, 3000);
  };

  const handleDeleteSuccess = async () => {
    await fetchOrders();
    setSuccessAlert({ show: true, message: 'Berhasil menghapus pesanan!' });
    setTimeout(() => {
      setSuccessAlert({ show: false, message: '' });
    }, 3000);
  };

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const result = await api.get('/pos-kasir');
      let actualData = [];
      if (result && Array.isArray(result.data)) {
         actualData = result.data;
      } else if (result && result.data && Array.isArray(result.data.data)) {
         actualData = result.data.data;
      } else if (Array.isArray(result)) {
         actualData = result;
      }
      setOrders(actualData);
    } catch (error) {
      console.error("Gagal mengambil data pesanan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleEditClick = (order) => {
    setSelectedOrder(order);
    setIsEditModalOpen(true);
  };

  const handlePrintClick = (order) => {
    setPrintOrder(order);
    setIsPrintModalOpen(true);
  };

  const handleDeleteClick = (order) => {
    setSelectedOrder(order);
    setIsDeleteModalOpen(true);
  };

  // Filter orders by search query & payment status filter (Lunas vs Utang)
  const filteredOrders = orders.filter(order => {
    const id = order.nomor_pesanan || '';
    const customer = order.nama_pelanggan || '';
    const items = order.detail_pesanan?.map(d => d.nama_menu).join(', ') || '';

    const matchesSearch =
      id.toLowerCase().includes((searchQuery || '').toLowerCase()) ||
      customer.toLowerCase().includes((searchQuery || '').toLowerCase()) ||
      items.toLowerCase().includes((searchQuery || '').toLowerCase());

    const status = (order.status || '').toLowerCase();
    const matchesPayment = status === 'belum_bayar'; // Hanya tampilkan yang belum dibayar

    return matchesSearch && matchesPayment;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const currentData = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleTogglePaymentStatus = (id) => {
    setOrders(prev => prev.map(o => {
      if (o.id === id) {
        const nextStatus = o.status === 'belum_bayar' ? 'lunas' : 'belum_bayar';
        return {
          ...o,
          status: nextStatus,
          metode_pembayaran: nextStatus === 'lunas' && !o.metode_pembayaran ? 'Tunai' : o.metode_pembayaran
        };
      }
      return o;
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount).replace(/,00$/, '');
  };

  const formatTime = (isoString) => {
    if (!isoString) return '-';

    const date = new Date(isoString);

    const tanggal = date
      .toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
      .replace('Agu', 'Ags');

    const jam = date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    return `${tanggal}, ${jam} WIB`;
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col gap-4 relative">

      {/* Success Alert */}
      {successAlert.show && (
        <div className="absolute top-4 right-4 z-50 animate-in fade-in slide-in-from-top-4 flex items-center gap-2 bg-green-100 text-green-700 font-bold px-4 py-3 rounded-lg shadow-md border border-green-200">
          <CheckCircle2 size={20} />
          <span>{successAlert.message}</span>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg text-text">Daftar Pesanan Terbaru</span>
          <span className="text-xs text-muted font-medium">
            ({filteredOrders.length} Pesanan ditemukan)
          </span>
        </div>

        {/* Status Tab (Hanya Belum Dibayar) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mt-1 sm:mt-0">
          <span className="px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border bg-primary text-white border-primary shadow-sm">
            Belum Dibayar
          </span>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-main text-text-secondary border-b border-border">
              <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">ID Pesanan</th>
              <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Nama Pelanggan</th>
              <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Detail Menu Pembelian</th>
              <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Total Pembayaran</th>
              <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Waktu</th>
              <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Metode Pembayaran</th>
              <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Status Pembayaran</th>
              <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider text-right">Aksi Pembayaran</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="8" className="text-center py-8 text-muted">
                  Memuat pesanan...
                </td>
              </tr>
            ) : currentData.length > 0 ? (
              currentData.map(order => {
                // const isUtang = order.status === 'belum_bayar';

                return (
                  <tr key={order.id} className="border-b border-border hover:bg-main/30 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-primary">{order.nomor_pesanan}</td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-text">{order.nama_pelanggan}</div>
                    </td>
                    <td className="px-4 py-3.5 max-w-60">
                      <div className="whitespace-nowrap overflow-hidden text-ellipsis text-text">
                        {order.detail_pesanan?.map(d => `${d.jumlah}x ${d.nama_menu}`).join(', ')}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-extrabold text-text">{formatCurrency(order.total_harga)}</td>
                    <td className="px-4 py-3.5 text-xs text-text-secondary">{formatTime(order.created_at)}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="text-[0.7rem] bg-main px-2 py-1 rounded-md border border-border font-bold text-text-secondary uppercase tracking-wider">
                        {order.metode_pembayaran || '-'}
                      </span>
                    </td>

                    {/* Status Pembayaran (Lunas vs Utang) */}
                    <td className="px-4 py-3.5 text-center">
                      {(() => {
                        if (order.status === 'lunas') {
                          return <span className="text-[0.7rem] bg-green-500 px-2 py-1 rounded-md border border-border font-bold text-white uppercase tracking-wider">Lunas</span>;
                        } else if (order.status === 'belum_bayar') {
                          return <span className="text-[0.7rem] bg-yellow-500 px-2 py-1 rounded-md border border-border font-bold text-white uppercase tracking-wider">Belum Bayar</span>;
                        } else {
                          return <span className="text-[0.7rem] bg-red-500 px-2 py-1 rounded-md border border-border font-bold text-white uppercase tracking-wider">Hutang</span>;
                        }
                      })()}
                    </td>

                    {/* Aksi Pembayaran */}
                    <td className='text-center'>
                      <span
                        className="inline-flex items-center justify-center p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white cursor-pointer transition-all duration-200"
                        onClick={() => handleEditClick(order)}
                      >
                        <Edit size={18} />
                      </span>
                      <span
                        className="ml-2 inline-flex items-center justify-center p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white cursor-pointer transition-all duration-200"
                        onClick={() => handlePrintClick(order)}
                      >
                        <Printer size={18} />
                      </span>
                      {order.status === 'belum_bayar' && (
                        <span
                          className="ml-2 inline-flex items-center justify-center p-2 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-600 hover:text-white cursor-pointer transition-all duration-200"
                          onClick={() => handleDeleteClick(order)}
                        >
                          <Trash2 size={18} />
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-8 text-muted">
                  Tidak ada pesanan yang sesuai.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex justify-between items-center pt-3 border-t border-border mt-2">
        <span className="text-xs text-text-secondary font-medium">
          Halaman {currentPage} dari {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center text-text-secondary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-main hover:text-text transition-colors"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center text-text-secondary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-main hover:text-text transition-colors"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <EditOrderModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        order={selectedOrder}
        onUpdateSuccess={handleUpdateSuccess}
      />

      <PrintReceiptModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        order={printOrder}
      />

      <DeleteOrderModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        order={selectedOrder}
        onDeleteSuccess={handleDeleteSuccess}
      />
    </div>
  );
}
