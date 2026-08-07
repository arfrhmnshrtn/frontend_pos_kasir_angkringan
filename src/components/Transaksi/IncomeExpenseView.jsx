import React, { useState } from 'react';
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
  Calendar
} from 'lucide-react';

export default function IncomeExpenseView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('semua');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initial Sample Transaction Logs
  const [transactions, setTransactions] = useState([
    {
      id: 'TRX-101',
      date: '06 Ags 2026 20:30',
      type: 'Pemasukan',
      category: 'Penjualan POS',
      amount: 1850000,
      paymentMethod: 'QRIS & Cash',
      description: 'Total Omset Penjualan Angkringan Malam Ini',
      loggedBy: 'Kasir Andi'
    },
    {
      id: 'TRX-102',
      date: '06 Ags 2026 16:00',
      type: 'Pengeluaran',
      category: 'Belanja Bahan Baku',
      amount: 650000,
      paymentMethod: 'Tunai',
      description: 'Belanja sate, ayam, daging, & bumbu dapur di pasar',
      loggedBy: 'Mas Pak Admin'
    },
    {
      id: 'TRX-103',
      date: '06 Ags 2026 14:15',
      type: 'Pemasukan',
      category: 'Pemasukan Lainnya',
      amount: 250000,
      paymentMethod: 'Transfer',
      description: 'Sewa lapak penitipan titipan kue basah & snack mitra',
      loggedBy: 'Mas Pak Admin'
    },
    {
      id: 'TRX-104',
      date: '05 Ags 2026 21:00',
      type: 'Pengeluaran',
      category: 'Pengeluaran Lainnya',
      amount: 45000,
      paymentMethod: 'Tunai',
      description: 'Iuran kebersihan RT & keamanan pasar harian',
      loggedBy: 'Kasir Budi'
    },
    {
      id: 'TRX-105',
      date: '05 Ags 2026 17:30',
      type: 'Pengeluaran',
      category: 'Operasional',
      amount: 120000,
      paymentMethod: 'Tunai',
      description: 'Beli isi ulang tabung gas LPG 3kg (4 tabung)',
      loggedBy: 'Mas Pak Admin'
    },
    {
      id: 'TRX-106',
      date: '04 Ags 2026 15:00',
      type: 'Pemasukan',
      category: 'Pemasukan Lainnya',
      amount: 80000,
      paymentMethod: 'Tunai',
      description: 'Penjualan minyak goreng bekas (jelantah) ke pengepul',
      loggedBy: 'Staff Maya'
    },
    {
      id: 'TRX-107',
      date: '04 Ags 2026 10:00',
      type: 'Pengeluaran',
      category: 'Pengeluaran Lainnya',
      amount: 75000,
      paymentMethod: 'Tunai',
      description: 'Servis regulator kompor mawar angkringan yang bocor',
      loggedBy: 'Mas Pak Admin'
    }
  ]);

  // Form State for Modal
  const [trxType, setTrxType] = useState('Pengeluaran'); // 'Pemasukan' or 'Pengeluaran'
  const [trxCategory, setTrxCategory] = useState('Pengeluaran Lainnya');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Tunai');
  const [description, setDescription] = useState('');

  const categoryOptions = {
    Pemasukan: ['Penjualan POS', 'Pemasukan Lainnya'],
    Pengeluaran: ['Belanja Bahan Baku', 'Operasional', 'Gaji Karyawan', 'Pengeluaran Lainnya']
  };

  const handleTypeChange = (newType) => {
    setTrxType(newType);
    setTrxCategory(categoryOptions[newType][0]);
  };

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    const now = new Date();
    const formattedDate = `${now.getDate()} Ags 2026 ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newTrx = {
      id: `TRX-${Math.floor(100 + Math.random() * 900)}`,
      date: formattedDate,
      type: trxType,
      category: trxCategory,
      amount: Number(amount),
      paymentMethod,
      description: description || '-',
      loggedBy: 'Mas Pak Admin'
    };

    setTransactions([newTrx, ...transactions]);
    setIsModalOpen(false);

    // Reset Form
    setAmount('');
    setDescription('');
  };

  const handleDeleteTrx = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Calculations
  const totalIncome = transactions
    .filter(t => t.type === 'Pemasukan')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalOtherIncome = transactions
    .filter(t => t.type === 'Pemasukan' && t.category === 'Pemasukan Lainnya')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'Pengeluaran')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalOtherExpense = transactions
    .filter(t => t.type === 'Pengeluaran' && t.category === 'Pengeluaran Lainnya')
    .reduce((acc, t) => acc + t.amount, 0);

  const netCashFlow = totalIncome - totalExpense;

  // Filtering
  const filteredTransactions = transactions.filter(t => {
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
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md flex flex-col gap-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-lg flex items-center justify-center bg-emerald-500/10 text-emerald-500">
              <ArrowUpRight size={22} />
            </div>
            <div className="inline-flex items-center gap-1 text-[0.75rem] font-bold px-2 py-1 rounded-full bg-success-bg text-success">
              <TrendingUp size={14} />
              <span>Inflow</span>
            </div>
          </div>
          <div>
            <div className="text-[1.6rem] font-extrabold text-success tracking-tight">
              Rp {totalIncome.toLocaleString('id-ID')}
            </div>
            <div className="text-[0.85rem] text-text-secondary font-medium">Total Pemasukan</div>
            <div className="text-[0.75rem] text-muted mt-1">
              Termasuk Pemasukan Lainnya: <strong className="text-text-secondary">Rp {totalOtherIncome.toLocaleString('id-ID')}</strong>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md flex flex-col gap-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-lg flex items-center justify-center bg-red-500/10 text-red-500">
              <ArrowDownLeft size={22} />
            </div>
            <div className="inline-flex items-center gap-1 text-[0.75rem] font-bold px-2 py-1 rounded-full bg-danger-bg text-danger">
              <TrendingDown size={14} />
              <span>Outflow</span>
            </div>
          </div>
          <div>
            <div className="text-[1.6rem] font-extrabold text-danger tracking-tight">
              Rp {totalExpense.toLocaleString('id-ID')}
            </div>
            <div className="text-[0.85rem] text-text-secondary font-medium">Total Pengeluaran</div>
            <div className="text-[0.75rem] text-muted mt-1">
              Termasuk Pengeluaran Lainnya: <strong className="text-text-secondary">Rp {totalOtherExpense.toLocaleString('id-ID')}</strong>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md flex flex-col gap-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-lg flex items-center justify-center bg-blue-500/10 text-blue-500">
              <DollarSign size={22} />
            </div>
          </div>
          <div>
            <div className="text-[1.6rem] font-extrabold text-text tracking-tight">
              Rp {netCashFlow.toLocaleString('id-ID')}
            </div>
            <div className="text-[0.85rem] text-text-secondary font-medium">Arus Kas Bersih (Net Cashflow)</div>
            <div className={`text-[0.75rem] mt-1 font-bold ${netCashFlow >= 0 ? 'text-success' : 'text-danger'}`}>
              {netCashFlow >= 0 ? '✓ Surplus Keuangan' : '⚠ Defisit Keuangan'}
            </div>
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
            <div className="relative flex-1 sm:w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
              <input 
                type="text" 
                className="w-full pl-9 pr-4 py-2 bg-main border border-border rounded-lg text-sm text-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all" 
                placeholder="Cari transaksi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
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
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map(t => (
                  <tr key={t.id} className="border-b border-border hover:bg-main/30 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-muted">{t.id}</td>
                    <td className="px-4 py-3.5 text-xs text-text-secondary">{t.date}</td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.7rem] font-bold ${
                        t.type === 'Pemasukan' ? 'bg-success-bg text-success' : 'bg-danger-bg text-danger'
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
                    <td className="px-4 py-3.5 text-xs text-text-secondary max-w-[240px]">
                      {t.description}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-text">{t.loggedBy}</td>
                    <td className="px-4 py-3.5 text-right flex justify-end">
                      <button 
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-danger hover:text-white hover:bg-danger transition-colors cursor-pointer"
                        title="Hapus Transaksi"
                        onClick={() => handleDeleteTrx(t.id)}
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
          <div className="bg-card w-full max-w-[500px] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-border flex flex-col" onClick={(e) => e.stopPropagation()}>
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
                      className={`py-2 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all border ${trxType === 'Pemasukan' ? 'bg-success-bg text-success border-success' : 'bg-main text-text-secondary border-border hover:bg-border/50'}`}
                      onClick={() => handleTypeChange('Pemasukan')}
                    >
                      <ArrowUpRight size={16} />
                      Pemasukan
                    </button>

                    <button
                      type="button"
                      className={`py-2 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all border ${trxType === 'Pengeluaran' ? 'bg-danger-bg text-danger border-danger' : 'bg-main text-text-secondary border-border hover:bg-border/50'}`}
                      onClick={() => handleTypeChange('Pengeluaran')}
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
                    onChange={(e) => setTrxCategory(e.target.value)}
                  >
                    {categoryOptions[trxType].map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
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
                    className="w-full bg-main border border-border rounded-lg text-sm text-text px-3 py-2.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all min-h-[80px]" 
                    rows="3"
                    placeholder={trxCategory.includes('Lainnya') ? "Tuliskan rincian transaksi lainnya..." : "Tuliskan keterangan transaksi..."}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 px-6 py-4 border-t border-border bg-main/30">
                <button type="button" className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-main text-text border border-border hover:bg-border/50 transition-colors" onClick={() => setIsModalOpen(false)}>
                  Batal
                </button>
                <button type="submit" className="px-5 py-2.5 rounded-lg text-sm font-bold bg-primary hover:bg-primary-hover text-white shadow-md hover:shadow-lg flex gap-2 items-center hover:-translate-y-px transition-all">
                  <Plus size={16} />
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
