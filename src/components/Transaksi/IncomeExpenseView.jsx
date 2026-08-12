import React, { useState, useEffect } from 'react';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Search,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Filter,
  X,
  Trash2,
  Receipt,
  FileText,
  Calendar,
  ShoppingBag,
  BadgeDollarSign
} from 'lucide-react';
import api from '../../services/axios';
import { transaksiService } from '../../services/transaksi.service';
import { useToast } from '../../contexts/ToastContext';

export default function IncomeExpenseView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('semua');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Date range filter state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const [transactions, setTransactions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  const fetchCategories = async () => {
    try {
      const res = await transaksiService.getAllCategories();
      if (res?.success) {
        setCategories(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '-';
    const dateObj = new Date(isoString);
    const pad = (n) => n.toString().padStart(2, '0');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${pad(dateObj.getDate())} ${monthNames[dateObj.getMonth()]} ${dateObj.getFullYear()} ${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}`;
  };

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const res = await transaksiService.getAll();
      if (res?.success) {
        const mappedData = res.data.map(t => ({
          id: t.nomor_transaksi || `TRX-${t.id}`,
          rawId: t.id,
          rawDate: t.created_at,
          date: formatDate(t.created_at),
          type: t.jenis === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran',
          category: t.kategori?.nama || 'Lainnya',
          amount: Number(t.nominal),
          paymentMethod: (t.metode_pembayaran || '').toUpperCase(),
          description: t.keterangan || '-',
          loggedBy: t.user?.fullname || '-'
        }));
        setTransactions(mappedData);
      }
    } catch (err) {
      toast.error('Gagal memuat data transaksi keuangan');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const result = await api.get('/pos-kasir');
      let actualData = [];
      if (result && Array.isArray(result.data)) actualData = result.data;
      else if (result && result.data && Array.isArray(result.data.data)) actualData = result.data.data;
      else if (Array.isArray(result)) actualData = result;
      setOrders(actualData);
    } catch (err) {
      console.error('Failed to fetch orders for profit calc:', err);
    }
  };

  // Form State for Modal
  const [trxType, setTrxType] = useState('pengeluaran'); // 'pemasukan' or 'pengeluaran'
  const [trxCategory, setTrxCategory] = useState(''); // ID of the category
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Tunai');
  const [description, setDescription] = useState('');
  const [isSubmittingTrx, setIsSubmittingTrx] = useState(false);

  // Form State for Category Modal
  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState('pengeluaran');
  const [isSubmittingCat, setIsSubmittingCat] = useState(false);

  const availableCategories = categories.filter(c => c.jenis === trxType);

  useEffect(() => {
    if (availableCategories.length > 0 && !availableCategories.find(c => c.id === trxCategory)) {
      setTrxCategory(availableCategories[0].id);
    }
  }, [trxType, availableCategories, trxCategory]);

  const handleTypeChange = (newType) => {
    setTrxType(newType);
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0 || !trxCategory) {
      toast.error('Mohon lengkapi data transaksi dengan benar');
      return;
    }

    setIsSubmittingTrx(true);
    try {
      const payload = {
        id_kategori: Number(trxCategory),
        nominal: Number(amount),
        metode_pembayaran: paymentMethod.toLowerCase(),
        keterangan: description || '-'
      };

      const res = await transaksiService.createTransaction(trxType, payload);

      if (res?.success) {
        toast.success('Transaksi berhasil ditambahkan');
        setIsModalOpen(false);
        setAmount('');
        setDescription('');
        fetchTransactions(); // Refresh table
      }
    } catch (err) {
      toast.error(err?.message || 'Gagal menyimpan transaksi');
    } finally {
      setIsSubmittingTrx(false);
    }
  };

  const handleDeleteTrx = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setIsSubmittingCat(true);
    try {
      const payload = {
        nama: newCatName,
        jenis: newCatType
      };
      const res = await transaksiService.createCategory(payload);
      if (res?.success) {
        toast.success(`Kategori "${newCatName}" berhasil ditambahkan`);
        setIsCategoryModalOpen(false);
        setNewCatName('');
        fetchCategories();
      }
    } catch (err) {
      toast.error(err?.message || 'Gagal menambahkan kategori baru');
    } finally {
      setIsSubmittingCat(false);
    }
  };

  // Date range filtering helper
  const isInDateRange = (rawDate) => {
    if (!startDate && !endDate) return true;
    if (!rawDate) return false;
    const txDate = new Date(rawDate);
    if (startDate) {
      const from = new Date(startDate);
      from.setHours(0, 0, 0, 0);
      if (txDate < from) return false;
    }
    if (endDate) {
      const to = new Date(endDate);
      to.setHours(23, 59, 59, 999);
      if (txDate > to) return false;
    }
    return true;
  };

  // Apply date range to transactions first for stat cards
  const dateFilteredTransactions = transactions.filter(t => isInDateRange(t.rawDate));

  // Apply date range to orders for profit calculation
  const dateFilteredOrders = orders.filter(o => isInDateRange(o.created_at));

  // Sales profit calculation (harga_jual - harga_modal) * jumlah for lunas orders
  const salesStats = dateFilteredOrders
    .filter(o => o.status === 'lunas')
    .reduce((acc, order) => {
      const details = order.detail_pesanan || [];
      details.forEach(d => {
        const hargaJual = d.harga || 0;
        const hargaModal = d.menu?.harga_modal || 0;
        const qty = d.jumlah || 0;
        acc.totalRevenue += hargaJual * qty;
        acc.totalCost += hargaModal * qty;
      });
      acc.totalOrders += 1;
      return acc;
    }, { totalRevenue: 0, totalCost: 0, totalOrders: 0 });

  const grossProfit = salesStats.totalRevenue - salesStats.totalCost;
  const profitMargin = salesStats.totalRevenue > 0 ? ((grossProfit / salesStats.totalRevenue) * 100).toFixed(1) : 0;

  // Calculations (respect date range)
  const totalIncome = dateFilteredTransactions
    .filter(t => t.type === 'Pemasukan')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalOtherIncome = dateFilteredTransactions
    .filter(t => t.type === 'Pemasukan' && t.category === 'Pemasukan Lainnya')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = dateFilteredTransactions
    .filter(t => t.type === 'Pengeluaran')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalOtherExpense = dateFilteredTransactions
    .filter(t => t.type === 'Pengeluaran' && t.category === 'Pengeluaran Lainnya')
    .reduce((acc, t) => acc + t.amount, 0);

  const netCashFlow = totalIncome - totalExpense;

  // Filtering (search + type + date range)
  const filteredTransactions = dateFilteredTransactions.filter(t => {
    const matchSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.loggedBy.toLowerCase().includes(searchQuery.toLowerCase());

    let matchType = true;
    if (filterType === 'pemasukan') matchType = t.type === 'Pemasukan';
    else if (filterType === 'pengeluaran') matchType = t.type === 'Pengeluaran';
    else if (filterType === 'pemasukan_lainnya') matchType = t.category === 'Pemasukan Lainnya';
    else if (filterType === 'pengeluaran_lainnya') matchType = t.category === 'Pengeluaran Lainnya';

    return matchSearch && matchType;
  });

  return (
    <div className="flex flex-col gap-5">
      {/* Compact Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {/* Total Penjualan */}
        <div className="bg-card border border-border rounded-lg p-3.5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md flex items-center justify-center bg-indigo-500/10 text-indigo-500">
                <ShoppingBag size={16} />
              </div>
              <span className="text-xs font-semibold text-text-secondary">Penjualan</span>
            </div>
            <span className="text-[0.65rem] font-bold px-1.5 py-0.5 rounded-full bg-info-bg text-info">
              {salesStats.totalOrders} Lunas
            </span>
          </div>
          <div className="text-lg font-extrabold text-info tracking-tight leading-tight">
            Rp {salesStats.totalRevenue.toLocaleString('id-ID')}
          </div>
          <div className="text-[0.65rem] text-muted leading-snug">
            Modal: <strong className="text-text-secondary">Rp {salesStats.totalCost.toLocaleString('id-ID')}</strong>
          </div>
        </div>

        {/* Laba Bersih */}
        <div className="bg-card border border-border rounded-lg p-3.5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-md flex items-center justify-center ${grossProfit >= 0 ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'}`}>
                <BadgeDollarSign size={16} />
              </div>
              <span className="text-xs font-semibold text-text-secondary">Laba Bersih</span>
            </div>
            <span className={`text-[0.65rem] font-bold px-1.5 py-0.5 rounded-full ${grossProfit >= 0 ? 'bg-warning-bg text-amber-700' : 'bg-danger-bg text-danger'}`}>
              {profitMargin}%
            </span>
          </div>
          <div className={`text-lg font-extrabold tracking-tight leading-tight ${grossProfit >= 0 ? 'text-amber-600 dark:text-amber-400' : 'text-danger'}`}>
            Rp {grossProfit.toLocaleString('id-ID')}
          </div>
          <div className="text-[0.65rem] text-muted leading-snug">
            Jual &minus; modal pesanan lunas
          </div>
        </div>

        {/* Total Pemasukan */}
        <div className="bg-card border border-border rounded-lg p-3.5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md flex items-center justify-center bg-emerald-500/10 text-emerald-500">
                <ArrowUpRight size={16} />
              </div>
              <span className="text-xs font-semibold text-text-secondary">Pemasukan</span>
            </div>
            <span className="text-[0.65rem] font-bold px-1.5 py-0.5 rounded-full bg-success-bg text-success">
              Inflow
            </span>
          </div>
          <div className="text-lg font-extrabold text-success tracking-tight leading-tight">
            Rp {totalIncome.toLocaleString('id-ID')}
          </div>
          <div className="text-[0.65rem] text-muted leading-snug">
            Lainnya: <strong className="text-text-secondary">Rp {totalOtherIncome.toLocaleString('id-ID')}</strong>
          </div>
        </div>

        {/* Total Pengeluaran */}
        <div className="bg-card border border-border rounded-lg p-3.5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md flex items-center justify-center bg-red-500/10 text-red-500">
                <ArrowDownLeft size={16} />
              </div>
              <span className="text-xs font-semibold text-text-secondary">Pengeluaran</span>
            </div>
            <span className="text-[0.65rem] font-bold px-1.5 py-0.5 rounded-full bg-danger-bg text-danger">
              Outflow
            </span>
          </div>
          <div className="text-lg font-extrabold text-danger tracking-tight leading-tight">
            Rp {totalExpense.toLocaleString('id-ID')}
          </div>
          <div className="text-[0.65rem] text-muted leading-snug">
            Lainnya: <strong className="text-text-secondary">Rp {totalOtherExpense.toLocaleString('id-ID')}</strong>
          </div>
        </div>

        {/* Net Cashflow */}
        <div className="bg-card border border-border rounded-lg p-3.5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md flex items-center justify-center bg-blue-500/10 text-blue-500">
              <DollarSign size={16} />
            </div>
            <span className="text-xs font-semibold text-text-secondary">Sisa Uang</span>
          </div>
          <div className="text-lg font-extrabold text-text tracking-tight leading-tight">
            Rp {netCashFlow.toLocaleString('id-ID')}
          </div>
          <div className={`text-[0.65rem] font-bold leading-snug ${netCashFlow >= 0 ? 'text-success' : 'text-danger'}`}>
            {netCashFlow >= 0 ? '✓ Surplus' : '⚠ Defisit'}
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
          <div className="flex items-center gap-2 font-bold text-lg text-text">
            <Receipt size={20} className="text-primary" />
            <span>Riwayat Transaksi Pemasukan & Pengeluaran</span>
          </div>

          <div className="flex gap-3 items-center w-full sm:w-auto">
            <div className="relative flex-1 sm:w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
              <input
                type="text"
                className="w-full pl-9 pr-4 py-2 bg-main border border-border rounded-lg text-sm text-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all"
                placeholder="Cari transaksi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-transform shadow-md hover:-translate-y-px whitespace-nowrap" onClick={() => setIsCategoryModalOpen(true)}>
              <Plus size={16} />
              <span className="hidden sm:inline">Buat Kategori Baru</span>
            </button>
            <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-transform shadow-md hover:-translate-y-px whitespace-nowrap" onClick={() => setIsModalOpen(true)}>
              <Plus size={16} />
              <span className="hidden sm:inline">Catat Transaksi Baru</span>
            </button>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'semua', label: 'Semua Transaksi' },
            { id: 'pemasukan', label: '📈 Pemasukan' },
            { id: 'pengeluaran', label: '📉 Pengeluaran' },
            { id: 'pemasukan_lainnya', label: '✨ Pemasukan Lainnya' },
            { id: 'pengeluaran_lainnya', label: '🧾 Pengeluaran Lainnya' },
          ].map(tab => (
            <button
              key={tab.id}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${filterType === tab.id ? 'bg-primary text-white border-primary shadow-sm' : 'bg-main text-text-secondary border-border hover:bg-border/50'}`}
              onClick={() => setFilterType(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Date Range Filter */}
        <div className="flex flex-wrap items-center gap-3 bg-main/50 px-4 py-2.5 rounded-lg border border-border">
          <div className="flex items-center gap-2 text-sm font-semibold text-text-secondary shrink-0">
            <Calendar size={16} className="text-primary" />
            <span>Filter Tanggal</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="date"
              className="bg-card border border-border rounded-lg text-xs text-text px-2.5 py-1.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all w-36"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              title="Dari tanggal"
            />
            <span className="text-muted text-xs font-medium">s/d</span>
            <input
              type="date"
              className="bg-card border border-border rounded-lg text-xs text-text px-2.5 py-1.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all w-36"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              title="Sampai tanggal"
            />
          </div>

          {(startDate || endDate) && (
            <button
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-danger bg-danger-bg border border-danger/20 hover:bg-danger hover:text-white transition-colors shrink-0"
              onClick={() => { setStartDate(''); setEndDate(''); }}
            >
              <X size={12} />
              Reset
            </button>
          )}

          {(startDate || endDate) && (
            <span className="text-[0.7rem] text-muted font-medium ml-auto">
              {filteredTransactions.length} transaksi ditemukan
            </span>
          )}
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-main text-text-secondary border-b border-border">
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">ID Trx</th>
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Tanggal & Waktu</th>
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Tipe</th>
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Kategori Transaksi</th>
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Nominal (Rp)</th>
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Metode</th>
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Keterangan / Rincian</th>
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Diinput Oleh</th>
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="9" className="text-center py-8 text-muted">
                    Memuat data transaksi...
                  </td>
                </tr>
              ) : filteredTransactions.length > 0 ? (
                filteredTransactions.map(t => (
                  <tr key={t.id} className="border-b border-border hover:bg-main/30 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-muted">{t.id}</td>
                    <td className="px-4 py-3.5 text-xs text-text-secondary">{t.date}</td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.7rem] font-bold ${t.type === 'Pemasukan' ? 'bg-success-bg text-success' : 'bg-danger-bg text-danger'
                        }`}>
                        {t.type === 'Pemasukan' ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                        {t.type}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`font-semibold ${t.category.includes('Lainnya') ? 'text-primary bg-primary-light px-2 py-0.5 rounded' : 'text-text'}`}>
                        {t.category}
                      </span>
                    </td>
                    <td className={`px-4 py-3.5 font-extrabold ${t.type === 'Pemasukan' ? 'text-success' : 'text-danger'}`}>
                      {t.type === 'Pemasukan' ? '+' : '-'} Rp {t.amount.toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-[0.7rem] bg-main px-2 py-1 rounded-md border border-border font-bold text-text-secondary uppercase tracking-wider">
                        {t.paymentMethod}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-text-secondary max-w-full">
                      {t.description}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-text">{t.loggedBy}</td>
                    <td className="px-4 py-3.5 text-right flex justify-end">
                      <button
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-danger hover:text-white hover:bg-danger transition-colors cursor-pointer"
                        title="Hapus Transaksi"
                        onClick={() => handleDeleteTrx(t.rawId)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-8 text-muted">
                    Tidak ada catatan transaksi yang sesuai.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Transaction */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
          <div className="bg-card w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-border flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-main/50">
              <div className="flex items-center gap-2.5">
                <Receipt size={20} className="text-primary" />
                <h3 className="font-bold text-lg text-text m-0">Input Transaksi Keuangan</h3>
              </div>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:text-text hover:bg-border/50 transition-colors" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="flex flex-col">
              <div className="p-6 flex flex-col gap-4">
                {/* Type Selection */}
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">Tipe Transaksi</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      className={`py-2 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all border ${trxType === 'pemasukan' ? 'bg-success-bg text-success border-success' : 'bg-main text-text-secondary border-border hover:bg-border/50'}`}
                      onClick={() => handleTypeChange('pemasukan')}
                    >
                      <ArrowUpRight size={16} />
                      Pemasukan
                    </button>

                    <button
                      type="button"
                      className={`py-2 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all border ${trxType === 'pengeluaran' ? 'bg-danger-bg text-danger border-danger' : 'bg-main text-text-secondary border-border hover:bg-border/50'}`}
                      onClick={() => handleTypeChange('pengeluaran')}
                    >
                      <ArrowDownLeft size={16} />
                      Pengeluaran
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">Kategori Transaksi</label>
                  <select
                    className="w-full bg-main border border-border rounded-lg text-sm text-text px-3 py-2.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all cursor-pointer"
                    value={trxCategory}
                    onChange={(e) => setTrxCategory(Number(e.target.value))}
                    required
                  >
                    {availableCategories.length === 0 && <option value="" disabled>Belum ada kategori</option>}
                    {availableCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nama}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">Nominal (Rp)</label>
                    <input
                      type="number"
                      className="w-full bg-main border border-border rounded-lg text-sm text-text px-3 py-2.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all"
                      placeholder="Contoh: 50000"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">Metode Pembayaran</label>
                    <select
                      className="w-full bg-main border border-border rounded-lg text-sm text-text px-3 py-2.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all cursor-pointer"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <option value="Tunai">Tunai / Cash</option>
                      <option value="Transfer">Transfer Bank</option>
                      <option value="QRIS">QRIS / E-Wallet</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">Keterangan / Rincian</label>
                  <textarea
                    className="w-full bg-main border border-border rounded-lg text-sm text-text px-3 py-2.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all min-h-12"
                    rows="3"
                    placeholder={availableCategories.find(c => c.id === trxCategory)?.nama?.includes('Lainnya') ? "Tuliskan rincian transaksi lainnya..." : "Tuliskan keterangan transaksi..."}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 px-6 py-4 border-t border-border bg-main/30">
                <button type="button" className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-main text-text border border-border hover:bg-border/50 transition-colors" onClick={() => setIsModalOpen(false)}>
                  Batal
                </button>
                <button type="submit" disabled={isSubmittingTrx || !trxCategory} className="px-5 py-2.5 rounded-lg text-sm font-bold bg-primary hover:bg-primary-hover text-white shadow-md hover:shadow-lg flex gap-2 items-center hover:-translate-y-px transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  <Plus size={16} />
                  {isSubmittingTrx ? 'Menyimpan...' : 'Simpan Transaksi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add Category */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsCategoryModalOpen(false)}>
          <div className="bg-card w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-border flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-main/50">
              <div className="flex items-center gap-2.5">
                <Plus size={20} className="text-primary" />
                <h3 className="font-bold text-lg text-text m-0">Buat Kategori Baru</h3>
              </div>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:text-text hover:bg-border/50 transition-colors" onClick={() => setIsCategoryModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="flex flex-col">
              <div className="p-6 flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">Nama Kategori</label>
                  <input
                    type="text"
                    className="w-full bg-main border border-border rounded-lg text-sm text-text px-3 py-2.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all"
                    placeholder="Contoh: Pengeluaran Lainnya"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">Jenis Kategori</label>
                  <select
                    className="w-full bg-main border border-border rounded-lg text-sm text-text px-3 py-2.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all cursor-pointer"
                    value={newCatType}
                    onChange={(e) => setNewCatType(e.target.value)}
                    required
                  >
                    <option value="pengeluaran">Pengeluaran</option>
                    <option value="pemasukan">Pemasukan</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 px-6 py-4 border-t border-border bg-main/30">
                <button type="button" className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-main text-text border border-border hover:bg-border/50 transition-colors" onClick={() => setIsCategoryModalOpen(false)}>
                  Batal
                </button>
                <button type="submit" disabled={isSubmittingCat} className="px-5 py-2.5 rounded-lg text-sm font-bold bg-primary hover:bg-primary-hover text-white shadow-md hover:shadow-lg flex gap-2 items-center hover:-translate-y-px transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  <Plus size={16} />
                  {isSubmittingCat ? 'Menyimpan...' : 'Simpan Kategori'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
