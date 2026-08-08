import React, { useState } from 'react';
import { 
  Trash2, 
  Plus, 
  Search, 
  AlertTriangle, 
  DollarSign, 
  Package, 
  Calendar,
  X,
  Filter,
  CheckCircle2,
  TrendingDown
} from 'lucide-react';

export default function WasteManagementView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterReason, setFilterReason] = useState('semua');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initial waste logs data
  const [wasteLogs, setWasteLogs] = useState([
    {
      id: 'WST-001',
      date: '06 Ags 2026 21:00',
      itemName: 'Nasi Kucing Teri',
      category: 'Nasi',
      qty: 6,
      unitCost: 2500,
      totalLoss: 15000,
      reason: 'Basi / Sisa Harian',
      notes: 'Sisa dagangan tidak habis karena hujan malam ini',
      loggedBy: 'Kasir Andi'
    },
    {
      id: 'WST-002',
      date: '06 Ags 2026 19:30',
      itemName: 'Sate Kulit Bakar',
      category: 'Sate',
      qty: 4,
      unitCost: 2000,
      totalLoss: 8000,
      reason: 'Rusak / Hangus',
      notes: 'Terlalu lama di atas panggangan arang',
      loggedBy: 'Mas Pak Admin'
    },
    {
      id: 'WST-003',
      date: '05 Ags 2026 22:15',
      itemName: 'Gorengan Tempe Mendoan',
      category: 'Gorengan',
      qty: 8,
      unitCost: 1200,
      totalLoss: 9600,
      reason: 'Basi / Lembek',
      notes: 'Minyak dingin tempe jadi lembek dan dingin',
      loggedBy: 'Kasir Budi'
    },
    {
      id: 'WST-004',
      date: '05 Ags 2026 18:00',
      itemName: 'Wedang Jahe Rempah',
      category: 'Minuman',
      qty: 3,
      unitCost: 3500,
      totalLoss: 10500,
      reason: 'Jatuh / Tumpah',
      notes: 'Gelas pecah saat dipindahkan ke nampan',
      loggedBy: 'Staff Maya'
    }
  ]);

  // Form State for modal
  const [itemName, setItemName] = useState('Nasi Kucing Teri');
  const [qty, setQty] = useState('');
  const [unitCost, setUnitCost] = useState('');
  const [reason, setReason] = useState('Basi / Sisa Harian');
  const [notes, setNotes] = useState('');

  const catalogOptions = [
    { name: 'Nasi Kucing Teri', category: 'Nasi', defaultCost: 2500 },
    { name: 'Nasi Kucing Bandeng', category: 'Nasi', defaultCost: 2500 },
    { name: 'Sate Kulit Bakar', category: 'Sate', defaultCost: 2000 },
    { name: 'Sate Usus Pedas', category: 'Sate', defaultCost: 2000 },
    { name: 'Sate Telur Puyuh', category: 'Sate', defaultCost: 2800 },
    { name: 'Gorengan Tempe Mendoan', category: 'Gorengan', defaultCost: 1200 },
    { name: 'Wedang Jahe Rempah', category: 'Minuman', defaultCost: 3500 },
    { name: 'Es Teh Manis Jumbo', category: 'Minuman', defaultCost: 1500 },
  ];

  const handleItemSelect = (selectedName) => {
    setItemName(selectedName);
    const item = catalogOptions.find(i => i.name === selectedName);
    if (item) {
      setUnitCost(item.defaultCost);
    }
  };

  const handleAddWaste = (e) => {
    e.preventDefault();
    if (!qty || !unitCost) return;

    const numQty = Number(qty);
    const numCost = Number(unitCost);
    const selectedCatalog = catalogOptions.find(i => i.name === itemName);

    const now = new Date();
    const formattedDate = `${now.getDate()} Ags 2026 ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newEntry = {
      id: `WST-00${wasteLogs.length + 1}`,
      date: formattedDate,
      itemName,
      category: selectedCatalog ? selectedCatalog.category : 'Lainnya',
      qty: numQty,
      unitCost: numCost,
      totalLoss: numQty * numCost,
      reason,
      notes: notes || '-',
      loggedBy: 'Mas Pak Admin'
    };

    setWasteLogs([newEntry, ...wasteLogs]);
    setIsModalOpen(false);

    // Reset Form
    setQty('');
    setUnitCost('');
    setNotes('');
  };

  const handleDeleteLog = (id) => {
    setWasteLogs(prev => prev.filter(item => item.id !== id));
  };

  // Filter logs
  const filteredLogs = wasteLogs.filter(log => {
    const matchSearch = log.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        log.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        log.loggedBy.toLowerCase().includes(searchQuery.toLowerCase());

    const matchReason = filterReason === 'semua' || log.reason.toLowerCase().includes(filterReason.toLowerCase());

    return matchSearch && matchReason;
  });

  // Calculate Metrics
  const totalItemQty = wasteLogs.reduce((acc, curr) => acc + curr.qty, 0);
  const totalKerugian = wasteLogs.reduce((acc, curr) => acc + curr.totalLoss, 0);

  const getReasonBadgeClass = (reasonText) => {
    const r = reasonText.toLowerCase();
    if (r.includes('basi') || r.includes('sisa')) return 'bg-amber-100 text-amber-700 border border-amber-200';
    if (r.includes('rusak') || r.includes('hangus')) return 'bg-red-100 text-red-700 border border-red-200';
    if (r.includes('jatuh') || r.includes('tumpah')) return 'bg-blue-100 text-blue-700 border border-blue-200';
    return 'bg-main text-text border border-border';
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md flex flex-col gap-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-lg flex items-center justify-center bg-red-500/10 text-red-500">
              <Trash2 size={22} />
            </div>
            <div className="inline-flex items-center gap-1 text-[0.75rem] font-bold px-2 py-1 rounded-full bg-danger-bg text-danger">
              <TrendingDown size={14} />
              <span>Waste Log</span>
            </div>
          </div>
          <div>
            <div className="text-[1.6rem] font-extrabold text-text tracking-tight">{totalItemQty} Porsi</div>
            <div className="text-[0.85rem] text-text-secondary font-medium">Total Barang Terbuang</div>
            <div className="text-[0.75rem] text-muted mt-1">
              Dari {wasteLogs.length} pencatatan kebocoran
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md flex flex-col gap-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-lg flex items-center justify-center bg-amber-500/10 text-amber-500">
              <DollarSign size={22} />
            </div>
          </div>
          <div>
            <div className="text-[1.6rem] font-extrabold text-danger tracking-tight">Rp {totalKerugian.toLocaleString('id-ID')}</div>
            <div className="text-[0.85rem] text-text-secondary font-medium">Total Est. Kerugian (Harga Beli)</div>
            <div className="text-[0.75rem] text-muted mt-1">
              Nilai modal barang terbuang
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md flex flex-col gap-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-lg flex items-center justify-center bg-blue-500/10 text-blue-500">
              <AlertTriangle size={22} />
            </div>
          </div>
          <div>
            <div className="text-[1.2rem] font-extrabold text-text tracking-tight mt-1.5">Basi / Sisa Harian</div>
            <div className="text-[0.85rem] text-text-secondary font-medium mt-1">Penyebab Dominan</div>
            <div className="text-[0.75rem] text-muted mt-1">
              Terbanyak pada produk Nasi Kucing
            </div>
          </div>
        </div>
      </div>

      {/* Main Table & Filter Card */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
          <div className="flex items-center gap-2 font-bold text-lg text-text">
            <Trash2 size={20} className="text-danger" />
            <span>Pencatatan Kebocoran Stok & Barang Terbuang</span>
          </div>

          <div className="flex gap-3 items-center w-full sm:w-auto">
            <div className="relative flex-1 sm:w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
              <input 
                type="text" 
                className="w-full pl-9 pr-4 py-2 bg-main border border-border rounded-lg text-sm text-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all" 
                placeholder="Cari item / catatan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="bg-danger hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-transform shadow-md hover:-translate-y-px whitespace-nowrap" onClick={() => setIsModalOpen(true)}>
              <Plus size={16} />
              <span className="hidden sm:inline">Catat Barang Terbuang</span>
            </button>
          </div>
        </div>

        {/* Sub-tabs Filter Alasan */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {['semua', 'basi', 'rusak', 'tumpah'].map(reasonTab => (
            <button
              key={reasonTab}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${filterReason === reasonTab ? 'bg-primary text-white border-primary shadow-sm' : 'bg-main text-text-secondary border-border hover:bg-border/50'} capitalize`}
              onClick={() => setFilterReason(reasonTab)}
            >
              {reasonTab === 'semua' ? 'Semua Alasan' : reasonTab === 'basi' ? '🍂 Basi / Sisa Malam' : reasonTab === 'rusak' ? '🔥 Rusak / Hangus' : '🥛 Tumpah / Pecah'}
            </button>
          ))}
        </div>

        {/* Data Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-main text-text-secondary border-b border-border">
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">ID Waste</th>
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Waktu Kejadian</th>
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Nama Item / Kategori</th>
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Jumlah Porsi</th>
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Harga Beli / Unit</th>
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Total Kerugian</th>
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Alasan Kebocoran</th>
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Catatan / Keterangan</th>
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Diinput Oleh</th>
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map(log => (
                  <tr key={log.id} className="border-b border-border hover:bg-main/30 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-danger">{log.id}</td>
                    <td className="px-4 py-3.5 text-xs text-text-secondary">{log.date}</td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-text">{log.itemName}</div>
                      <div className="text-[0.75rem] text-muted">{log.category}</div>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-text">{log.qty} Porsi</td>
                    <td className="px-4 py-3.5 text-text">Rp {log.unitCost.toLocaleString('id-ID')}</td>
                    <td className="px-4 py-3.5 font-extrabold text-danger">
                      Rp {log.totalLoss.toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[0.7rem] font-bold ${getReasonBadgeClass(log.reason)}`}>
                        {log.reason}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-text-secondary max-w-full">
                      {log.notes}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-text">{log.loggedBy}</td>
                    <td className="px-4 py-3.5 text-right">
                      <button 
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-danger hover:text-white hover:bg-danger transition-colors ml-auto" 
                        title="Hapus Catatan"
                        onClick={() => handleDeleteLog(log.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center py-8 text-muted">
                    Tidak ada pencatatan barang terbuang yang sesuai filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Waste Record */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
          <div className="bg-card w-full max-w-full rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-border flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-main/50">
              <div className="flex items-center gap-2.5">
                <Trash2 size={20} className="text-danger" />
                <h3 className="font-bold text-lg text-text m-0">Form Input Barang Terbuang / Waste</h3>
              </div>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:text-text hover:bg-border/50 transition-colors" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddWaste} className="flex flex-col">
              <div className="p-6 flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">Pilih Item Menu / Barang</label>
                  <select 
                    className="w-full bg-main border border-border rounded-lg text-sm text-text px-3 py-2.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all cursor-pointer" 
                    value={itemName} 
                    onChange={(e) => handleItemSelect(e.target.value)}
                  >
                    {catalogOptions.map(opt => (
                      <option key={opt.name} value={opt.name}>
                        {opt.name} ({opt.category}) - Est Modal: Rp {opt.defaultCost}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">Jumlah (Porsi / Unit)</label>
                    <input 
                      type="number" 
                      className="w-full bg-main border border-border rounded-lg text-sm text-text px-3 py-2.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all" 
                      placeholder="Contoh: 3"
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                      required
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">Harga Modal per Unit (Rp)</label>
                    <input 
                      type="number" 
                      className="w-full bg-main border border-border rounded-lg text-sm text-text px-3 py-2.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all" 
                      placeholder="Contoh: 2500"
                      value={unitCost}
                      onChange={(e) => setUnitCost(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">Alasan Kebocoran / Terbuang</label>
                  <select 
                    className="w-full bg-main border border-border rounded-lg text-sm text-text px-3 py-2.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all cursor-pointer" 
                    value={reason} 
                    onChange={(e) => setReason(e.target.value)}
                  >
                    <option value="Basi / Sisa Harian">Basi / Sisa Harian (Tidak Laku)</option>
                    <option value="Rusak / Hangus">Rusak / Hangus saat Dimasak</option>
                    <option value="Jatuh / Tumpah">Jatuh / Tumpah saat Disajikan</option>
                    <option value="Bahan Mentah Busuk">Bahan Mentah Busuk di Penyimpanan</option>
                    <option value="Kebocoran Stok / Hilang">Kebocoran Stok / Hilang</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">Catatan Tambahan (Keterangan)</label>
                  <textarea 
                    className="w-full bg-main border border-border rounded-lg text-sm text-text px-3 py-2.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all min-h-full" 
                    rows="3"
                    placeholder="Contoh: Hujan deras membuat angkringan sepi, sisa nasi kucing basi."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 px-6 py-4 border-t border-border bg-main/30">
                <button type="button" className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-main text-text border border-border hover:bg-border/50 transition-colors" onClick={() => setIsModalOpen(false)}>
                  Batal
                </button>
                <button type="submit" className="px-5 py-2.5 rounded-lg text-sm font-bold bg-danger hover:bg-red-600 text-white shadow-md hover:shadow-lg flex gap-2 items-center hover:-translate-y-px transition-all">
                  <Plus size={16} />
                  Simpan Data Waste
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
