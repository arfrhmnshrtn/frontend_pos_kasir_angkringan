import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  UserCheck, 
  Truck, 
  X, 
  Trash2,
  Phone,
  AlertCircle,
  Calendar
} from 'lucide-react';

export default function DebtManagementView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState('semua');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initial Sample Debt/Receivable Records
  const [records, setRecords] = useState([
    {
      id: 'DEBT-101',
      date: '06 Ags 2026',
      dueDate: '10 Ags 2026',
      type: 'Piutang Pelanggan', // Money owed to us (Pelanggan kasbon)
      name: 'Rian Permana',
      phone: '0812-3456-7890',
      amount: 45000,
      status: 'Belum Lunas',
      notes: 'Makan 5x Sate Kulit + 2x Nasi Kucing & Es Teh (Kasbon)',
      loggedBy: 'Kasir Andi'
    },
    {
      id: 'DEBT-102',
      date: '05 Ags 2026',
      dueDate: '08 Ags 2026',
      type: 'Hutang Usaha', // Money we owe to suppliers
      name: 'Pak Kliwon (Supplier Ayam & Daging)',
      phone: '0857-1122-3344',
      amount: 350000,
      status: 'Belum Lunas',
      notes: 'Belanja stok usus ayam & kulit segar 10 kg',
      loggedBy: 'Mas Pak Admin'
    },
    {
      id: 'DEBT-103',
      date: '05 Ags 2026',
      dueDate: '12 Ags 2026',
      type: 'Piutang Pelanggan',
      name: 'Mas Budi (Komunitas Motor)',
      phone: '0896-9988-7766',
      amount: 68000,
      status: 'Belum Lunas',
      notes: 'Nongkrong rame-rame kasbon dulu bayar pas gajian',
      loggedBy: 'Kasir Budi'
    },
    {
      id: 'DEBT-104',
      date: '04 Ags 2026',
      dueDate: '05 Ags 2026',
      type: 'Hutang Usaha',
      name: 'Agen Es Batu Kristal Pak Slamet',
      phone: '0813-5544-3322',
      amount: 70000,
      status: 'Lunas',
      notes: 'Beli 5 bal es batu kristal jumbo',
      loggedBy: 'Mas Pak Admin'
    }
  ]);

  // Modal Form State
  const [type, setType] = useState('Piutang Pelanggan');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  const handleAddRecord = (e) => {
    e.preventDefault();
    if (!name || !amount) return;

    const now = new Date();
    const formattedDate = `${now.getDate()} Ags 2026`;

    const newRec = {
      id: `DEBT-${Math.floor(100 + Math.random() * 900)}`,
      date: formattedDate,
      dueDate: dueDate || '10 Ags 2026',
      type,
      name,
      phone: phone || '-',
      amount: Number(amount),
      status: 'Belum Lunas',
      notes: notes || '-',
      loggedBy: 'Mas Pak Admin'
    };

    setRecords([newRec, ...records]);
    setIsModalOpen(false);

    // Reset Form
    setName('');
    setPhone('');
    setAmount('');
    setDueDate('');
    setNotes('');
  };

  const handleToggleStatus = (id) => {
    setRecords(prev => prev.map(rec => {
      if (rec.id === id) {
        const nextStatus = rec.status === 'Belum Lunas' ? 'Lunas' : 'Belum Lunas';
        return { ...rec, status: nextStatus };
      }
      return rec;
    }));
  };

  const handleDeleteRecord = (id) => {
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  // Calculations
  const totalPiutang = records
    .filter(r => r.type === 'Piutang Pelanggan' && r.status === 'Belum Lunas')
    .reduce((acc, r) => acc + r.amount, 0);

  const totalHutang = records
    .filter(r => r.type === 'Hutang Usaha' && r.status === 'Belum Lunas')
    .reduce((acc, r) => acc + r.amount, 0);

  const totalUnpaidCount = records.filter(r => r.status === 'Belum Lunas').length;

  // Filter Records
  const filteredRecords = records.filter(rec => {
    const matchSearch = rec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        rec.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        rec.phone.includes(searchQuery);

    let matchTab = true;
    if (filterTab === 'piutang') matchTab = rec.type === 'Piutang Pelanggan';
    else if (filterTab === 'hutang') matchTab = rec.type === 'Hutang Usaha';
    else if (filterTab === 'belum_lunas') matchTab = rec.status === 'Belum Lunas';
    else if (filterTab === 'lunas') matchTab = rec.status === 'Lunas';

    return matchSearch && matchTab;
  });

  return (
    <div className="flex flex-col gap-5">
      {/* Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md flex flex-col gap-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-lg flex items-center justify-center bg-blue-500/10 text-blue-500">
              <UserCheck size={22} />
            </div>
            <div className="inline-flex items-center gap-1 text-[0.75rem] font-bold px-2 py-1 rounded-full bg-success-bg text-success">
              <span>Ditagih</span>
            </div>
          </div>
          <div>
            <div className="text-[1.6rem] font-extrabold text-blue-500 tracking-tight">
              Rp {totalPiutang.toLocaleString('id-ID')}
            </div>
            <div className="text-[0.85rem] text-text-secondary font-medium">Total Piutang Pelanggan (Bon / Kasbon)</div>
            <div className="text-[0.75rem] text-muted mt-1">
              Uang yang akan diterima dari pelanggan
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md flex flex-col gap-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-lg flex items-center justify-center bg-red-500/10 text-red-500">
              <Truck size={22} />
            </div>
            <div className="inline-flex items-center gap-1 text-[0.75rem] font-bold px-2 py-1 rounded-full bg-danger-bg text-danger">
              <span>Wajib Dibayar</span>
            </div>
          </div>
          <div>
            <div className="text-[1.6rem] font-extrabold text-danger tracking-tight">
              Rp {totalHutang.toLocaleString('id-ID')}
            </div>
            <div className="text-[0.85rem] text-text-secondary font-medium">Total Hutang Usaha (Ke Supplier/Vendor)</div>
            <div className="text-[0.75rem] text-muted mt-1">
              Tanggungan pembayaran ke supplier
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md flex flex-col gap-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-lg flex items-center justify-center bg-amber-500/10 text-amber-500">
              <Clock size={22} />
            </div>
          </div>
          <div>
            <div className="text-[1.6rem] font-extrabold text-text tracking-tight">{totalUnpaidCount} Catatan</div>
            <div className="text-[0.85rem] text-text-secondary font-medium">Status Belum Lunas</div>
            <div className="text-[0.75rem] text-muted mt-1">
              Perlu follow up / penagihan segera
            </div>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
          <div className="flex items-center gap-2 font-bold text-lg text-text">
            <BookOpen size={20} className="text-primary" />
            <span>Catatan Buku Hutang & Piutang Angkringan</span>
          </div>

          <div className="flex gap-3 items-center w-full sm:w-auto">
            <div className="relative flex-1 sm:w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
              <input 
                type="text" 
                className="w-full pl-9 pr-4 py-2 bg-main border border-border rounded-lg text-sm text-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all" 
                placeholder="Cari nama, no HP, catatan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-transform shadow-md hover:-translate-y-px whitespace-nowrap" onClick={() => setIsModalOpen(true)}>
              <Plus size={16} />
              <span className="hidden sm:inline">Catat Hutang / Piutang</span>
            </button>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'semua', label: 'Semua Catatan' },
            { id: 'piutang', label: '👤 Piutang Pelanggan (Kasbon)' },
            { id: 'hutang', label: '🚚 Hutang Ke Supplier' },
            { id: 'belum_lunas', label: '⏳ Belum Lunas' },
            { id: 'lunas', label: '✅ Lunas' },
          ].map(tab => (
            <button
              key={tab.id}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${filterTab === tab.id ? 'bg-primary text-white border-primary shadow-sm' : 'bg-main text-text-secondary border-border hover:bg-border/50'}`}
              onClick={() => setFilterTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Data Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-main text-text-secondary border-b border-border">
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Tanggal & Jatuh Tempo</th>
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Jenis Catatan</th>
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Nama Pelanggan / Supplier</th>
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">No. Kontak</th>
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Nominal (Rp)</th>
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Status Pembayaran</th>
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Catatan / Keterangan</th>
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider text-right">Aksi Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map(rec => (
                  <tr key={rec.id} className="border-b border-border hover:bg-main/30 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-muted">{rec.id}</td>
                    <td className="px-4 py-3.5 text-xs text-text">
                      <div className="font-semibold">{rec.date}</div>
                      <div className="text-[0.75rem] text-danger flex items-center gap-1 mt-0.5">
                        <Calendar size={12} /> JT: {rec.dueDate}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.7rem] font-bold ${rec.type === 'Piutang Pelanggan' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                        {rec.type === 'Piutang Pelanggan' ? 'Piutang (Bon)' : 'Hutang Supplier'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-text">{rec.name}</td>
                    <td className="px-4 py-3.5 text-xs text-text-secondary">
                      <div className="flex items-center gap-1.5">
                        <Phone size={12} /> {rec.phone}
                      </div>
                    </td>
                    <td className={`px-4 py-3.5 font-extrabold ${rec.type === 'Piutang Pelanggan' ? 'text-blue-500' : 'text-danger'}`}>
                      Rp {rec.amount.toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.7rem] font-bold ${rec.status === 'Lunas' ? 'bg-success-bg text-success' : 'bg-danger-bg text-danger'}`}>
                        {rec.status === 'Lunas' ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                        {rec.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-text-secondary max-w-[220px]">
                      {rec.notes}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${rec.status === 'Lunas' ? 'bg-main text-text-secondary border-border hover:bg-border/50 hover:text-text' : 'bg-success-bg text-success border-success hover:bg-success hover:text-white'}`}
                          onClick={() => handleToggleStatus(rec.id)}
                        >
                          {rec.status === 'Lunas' ? 'Batal Lunas' : 'Tandai Lunas'}
                        </button>
                        <button 
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-danger hover:text-white hover:bg-danger transition-colors cursor-pointer"
                          title="Hapus Catatan"
                          onClick={() => handleDeleteRecord(rec.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-8 text-muted">
                    Tidak ada catatan hutang/piutang yang sesuai.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
          <div className="bg-card w-full max-w-[500px] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-border flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-main/50">
              <div className="flex items-center gap-2.5">
                <BookOpen size={20} className="text-primary" />
                <h3 className="font-bold text-lg text-text m-0">Form Catatan Hutang / Piutang</h3>
              </div>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:text-text hover:bg-border/50 transition-colors" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddRecord} className="flex flex-col">
              <div className="p-6 flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">Jenis Catatan</label>
                  <select 
                    className="w-full bg-main border border-border rounded-lg text-sm text-text px-3 py-2.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all cursor-pointer" 
                    value={type} 
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="Piutang Pelanggan">Piutang Pelanggan (Pelanggan Kasbon / Utang Makan)</option>
                    <option value="Hutang Usaha">Hutang Usaha (Hutang Kita ke Supplier / Vendor)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                    {type === 'Piutang Pelanggan' ? 'Nama Pelanggan' : 'Nama Supplier / Pihak Vendor'}
                  </label>
                  <input 
                    type="text" 
                    className="w-full bg-main border border-border rounded-lg text-sm text-text px-3 py-2.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all" 
                    placeholder={type === 'Piutang Pelanggan' ? "Contoh: Mas Budi Komunitas Motor" : "Contoh: Pak Kliwon Supplier Daging"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">No. Kontak / Whatsapp</label>
                    <input 
                      type="text" 
                      className="w-full bg-main border border-border rounded-lg text-sm text-text px-3 py-2.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all" 
                      placeholder="Contoh: 081234567890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

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
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">Tanggal Jatuh Tempo (Due Date)</label>
                  <input 
                    type="date" 
                    className="w-full bg-main border border-border rounded-lg text-sm text-text px-3 py-2.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all text-text-secondary" 
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">Detail Catatan / Keterangan</label>
                  <textarea 
                    className="w-full bg-main border border-border rounded-lg text-sm text-text px-3 py-2.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all min-h-[80px]" 
                    rows="3"
                    placeholder="Contoh: Makan 4 sate + 2 nasi kucing, janji bayar hari jumat."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 px-6 py-4 border-t border-border bg-main/30">
                <button type="button" className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-main text-text border border-border hover:bg-border/50 transition-colors" onClick={() => setIsModalOpen(false)}>
                  Batal
                </button>
                <button type="submit" className="px-5 py-2.5 rounded-lg text-sm font-bold bg-primary hover:bg-primary-hover text-white shadow-md hover:shadow-lg flex gap-2 items-center hover:-translate-y-px transition-all">
                  <Plus size={16} />
                  Simpan Catatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
