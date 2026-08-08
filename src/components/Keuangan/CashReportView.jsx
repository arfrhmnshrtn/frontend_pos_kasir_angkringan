import React, { useState } from 'react';
import { 
  Wallet, 
  DollarSign, 
  PieChart, 
  Users, 
  PiggyBank, 
  ShieldAlert, 
  ShoppingBag, 
  TrendingUp, 
  Sliders, 
  Percent, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function CashReportView() {
  // Total Revenue / Omset Kas Angkringan Hari Ini
  const totalRevenue = 1850000;

  // 1. Gaji Karyawan (Nominal Tetap Rp)
  const [gajiNominal, setGajiNominal] = useState(450000); // Rp 450.000

  // 2. Persentase Alokasi Pos Lainnya (%)
  const [percentages, setPercentages] = useState({
    tabungan: 20,       // Tabungan / Reinvestasi (20%)
    danaDarurat: 10,    // Dana Darurat (10%)
    bahanBaku: 35       // Belanja Bahan Baku & Ops (35%)
  });

  const [isEditing, setIsEditing] = useState(false);
  
  // Temporary form states for Modal
  const [tempGajiNominal, setTempGajiNominal] = useState(gajiNominal);
  const [tempPercentages, setTempPercentages] = useState({ ...percentages });

  // --- Calculations for Main View ---
  // Calculated Nominals
  const tabunganNominal = (totalRevenue * percentages.tabungan) / 100;
  const danaDaruratNominal = (totalRevenue * percentages.danaDarurat) / 100;
  const bahanBakuNominal = (totalRevenue * percentages.bahanBaku) / 100;

  // Total allocated before Owner Profit
  const totalAllocatedBeforeOwner = gajiNominal + tabunganNominal + danaDaruratNominal + bahanBakuNominal;
  
  // PROFIT BERSIH OWNER (SISA DARI SEMUA)
  const profitOwnerNominal = Math.max(0, totalRevenue - totalAllocatedBeforeOwner);

  // Derived Percentages for UI Display
  const gajiPercent = (gajiNominal / totalRevenue) * 100;
  const tabunganPercent = percentages.tabungan;
  const danaDaruratPercent = percentages.danaDarurat;
  const bahanBakuPercent = percentages.bahanBaku;
  const profitOwnerPercent = (profitOwnerNominal / totalRevenue) * 100;

  // --- Modal Temp Calculations ---
  const tempTabunganNominal = (totalRevenue * tempPercentages.tabungan) / 100;
  const tempDanaDaruratNominal = (totalRevenue * tempPercentages.danaDarurat) / 100;
  const tempBahanBakuNominal = (totalRevenue * tempPercentages.bahanBaku) / 100;
  const tempTotalAllocated = tempGajiNominal + tempTabunganNominal + tempDanaDaruratNominal + tempBahanBakuNominal;
  const tempProfitNominal = Math.max(0, totalRevenue - tempTotalAllocated);
  const tempProfitPercent = (tempProfitNominal / totalRevenue) * 100;

  const handleSaveAllocations = (e) => {
    e.preventDefault();
    if (tempTotalAllocated > totalRevenue) {
      alert(`Total alokasi (Rp ${tempTotalAllocated.toLocaleString('id-ID')}) melebihi total kas yang ada (Rp ${totalRevenue.toLocaleString('id-ID')})!`);
      return;
    }
    setGajiNominal(tempGajiNominal);
    setPercentages({ ...tempPercentages });
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col gap-5">
      
      {/* 1. Top Cash Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md flex flex-col gap-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-lg flex items-center justify-center bg-blue-500/10 text-blue-500">
              <Wallet size={22} />
            </div>
            <div className="inline-flex items-center gap-1 text-[0.75rem] font-bold px-2 py-1 rounded-full bg-success-bg text-success">
              <span>Total Kas</span>
            </div>
          </div>
          <div>
            <div className="text-[1.6rem] font-extrabold text-text tracking-tight">
              Rp {totalRevenue.toLocaleString('id-ID')}
            </div>
            <div className="text-[0.85rem] text-text-secondary font-medium">Total Saldo Kas Masuk (Hari Ini)</div>
            <div className="text-[0.75rem] text-muted mt-1">
              Omset bersih siap dialokasikan
            </div>
          </div>
        </div>

        {/* Gaji Karyawan (Nominal Fixed) */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md flex flex-col gap-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-lg flex items-center justify-center bg-emerald-500/10 text-emerald-500">
              <Users size={22} />
            </div>
            <div className="inline-flex items-center gap-1 text-[0.75rem] font-bold px-2 py-1 rounded-full bg-success-bg text-success">
              <span>Nominal Rp</span>
            </div>
          </div>
          <div>
            <div className="text-[1.6rem] font-extrabold text-success tracking-tight">
              Rp {gajiNominal.toLocaleString('id-ID')}
            </div>
            <div className="text-[0.85rem] text-text-secondary font-medium">Gaji Karyawan ({gajiPercent.toFixed(1)}%)</div>
            <div className="text-[0.75rem] text-muted mt-1">
              Nominal tetap gaji staff & kasir
            </div>
          </div>
        </div>

        {/* Tabungan Usaha */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md flex flex-col gap-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-lg flex items-center justify-center bg-amber-500/10 text-amber-500">
              <PiggyBank size={22} />
            </div>
            <div className="inline-flex items-center gap-1 text-[0.75rem] font-bold px-2 py-1 rounded-full bg-success-bg text-success">
              <span>{tabunganPercent}% Alokasi</span>
            </div>
          </div>
          <div>
            <div className="text-[1.6rem] font-extrabold text-amber-500 tracking-tight">
              Rp {tabunganNominal.toLocaleString('id-ID')}
            </div>
            <div className="text-[0.85rem] text-text-secondary font-medium">Tabungan Usaha ({tabunganPercent}%)</div>
            <div className="text-[0.75rem] text-muted mt-1">
              Tabungan pengembangan cabang
            </div>
          </div>
        </div>

        {/* Profit Bersih Owner (Sisa dari Semua) */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md flex flex-col gap-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-lg flex items-center justify-center bg-purple-500/10 text-purple-500">
              <TrendingUp size={22} />
            </div>
            <div className="inline-flex items-center gap-1 text-[0.75rem] font-bold px-2 py-1 rounded-full bg-purple-500/10 text-purple-500">
              <span>Sisa Bersih</span>
            </div>
          </div>
          <div>
            <div className="text-[1.6rem] font-extrabold text-purple-500 tracking-tight">
              Rp {profitOwnerNominal.toLocaleString('id-ID')}
            </div>
            <div className="text-[0.85rem] text-text-secondary font-medium">Profit Bersih Owner ({profitOwnerPercent.toFixed(1)}%)</div>
            <div className="text-[0.75rem] font-bold text-purple-500 mt-1">
              ✓ Sisa bersih setelah semua pos
            </div>
          </div>
        </div>
      </div>

      {/* 2. Methods Breakdown & Allocation Progress Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        
        {/* Metrik Saldo Metode Pembayaran */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
            <div className="flex items-center gap-2 font-bold text-lg text-text">
              <DollarSign size={20} className="text-primary" />
              <span>Sumber Rincian Kas Pembayaran</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="bg-main p-4 rounded-xl flex justify-between items-center border border-border/50">
              <div>
                <div className="text-[0.85rem] text-text-secondary">QRIS / E-Wallet</div>
                <div className="text-[1.25rem] font-extrabold text-text mt-1">Rp 1.120.000</div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.7rem] font-bold bg-success-bg text-success">60.5% dari Total</span>
            </div>

            <div className="bg-main p-4 rounded-xl flex justify-between items-center border border-border/50">
              <div>
                <div className="text-[0.85rem] text-text-secondary">Tunai (Cash in Hand)</div>
                <div className="text-[1.25rem] font-extrabold text-text mt-1">Rp 630.000</div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.7rem] font-bold bg-amber-100 text-amber-700">34.0% dari Total</span>
            </div>

            <div className="bg-main p-4 rounded-xl flex justify-between items-center border border-border/50">
              <div>
                <div className="text-[0.85rem] text-text-secondary">Transfer Bank</div>
                <div className="text-[1.25rem] font-extrabold text-text mt-1">Rp 100.000</div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.7rem] font-bold bg-blue-100 text-blue-700">5.5% dari Total</span>
            </div>
          </div>
        </div>

        {/* Persentase Alokasi Kas Visual */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
            <div className="flex items-center gap-2 font-bold text-lg text-text">
              <PieChart size={20} className="text-primary" />
              <span>Visual Pembagian Kantong Kas</span>
            </div>
            <button 
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border bg-main text-text-secondary border-border hover:bg-border/50 hover:text-text transition-all"
              onClick={() => {
                setTempGajiNominal(gajiNominal);
                setTempPercentages({ ...percentages });
                setIsEditing(true);
              }}
            >
              <Sliders size={14} /> Atur Budgeting Kas
            </button>
          </div>

          <div className="flex flex-col gap-4">
            
            {/* Gaji Karyawan (Nominal Fixed) */}
            <div>
              <div className="flex justify-between text-[0.85rem] font-semibold mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Users size={15} className="text-success" /> Gaji Karyawan (Nominal Rp)
                </span>
                <span className="text-success font-bold">
                  Rp {gajiNominal.toLocaleString('id-ID')} ({gajiPercent.toFixed(1)}%)
                </span>
              </div>
              <div className="bg-main h-2.5 rounded-full overflow-hidden">
                <div className="bg-success h-full rounded-full" style={{ width: `${Math.min(100, gajiPercent)}%` }}></div>
              </div>
            </div>

            {/* Tabungan Usaha */}
            <div>
              <div className="flex justify-between text-[0.85rem] font-semibold mb-1.5">
                <span className="flex items-center gap-1.5">
                  <PiggyBank size={15} className="text-amber-500" /> Tabungan Usaha ({tabunganPercent}%)
                </span>
                <span className="text-amber-500 font-bold">Rp {tabunganNominal.toLocaleString('id-ID')}</span>
              </div>
              <div className="bg-main h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${tabunganPercent}%` }}></div>
              </div>
            </div>

            {/* Dana Darurat */}
            <div>
              <div className="flex justify-between text-[0.85rem] font-semibold mb-1.5">
                <span className="flex items-center gap-1.5">
                  <ShieldAlert size={15} className="text-danger" /> Dana Darurat ({danaDaruratPercent}%)
                </span>
                <span className="text-danger font-bold">Rp {danaDaruratNominal.toLocaleString('id-ID')}</span>
              </div>
              <div className="bg-main h-2.5 rounded-full overflow-hidden">
                <div className="bg-danger h-full rounded-full" style={{ width: `${danaDaruratPercent}%` }}></div>
              </div>
            </div>

            {/* Belanja Bahan Baku & Operasional */}
            <div>
              <div className="flex justify-between text-[0.85rem] font-semibold mb-1.5">
                <span className="flex items-center gap-1.5">
                  <ShoppingBag size={15} className="text-blue-500" /> Bahan Baku & Ops ({bahanBakuPercent}%)
                </span>
                <span className="text-blue-500 font-bold">Rp {bahanBakuNominal.toLocaleString('id-ID')}</span>
              </div>
              <div className="bg-main h-2.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: `${bahanBakuPercent}%` }}></div>
              </div>
            </div>

            {/* Profit Bersih Owner (Sisa dari Semua) */}
            <div className="bg-purple-500/10 p-3 rounded-lg border border-purple-500/20 mt-1">
              <div className="flex justify-between text-[0.85rem] font-bold mb-1.5">
                <span className="flex items-center gap-1.5 text-purple-600">
                  <TrendingUp size={15} /> Profit Bersih Owner (Sisa Kas)
                </span>
                <span className="text-purple-600 font-extrabold">
                  Rp {profitOwnerNominal.toLocaleString('id-ID')} ({profitOwnerPercent.toFixed(1)}%)
                </span>
              </div>
              <div className="bg-main h-2.5 rounded-full overflow-hidden mb-2">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: `${Math.min(100, profitOwnerPercent)}%` }}></div>
              </div>
              <div className="text-[0.72rem] text-muted">
                *Dihitung otomatis dari total kas dikurangi (Gaji + Tabungan + Dana Darurat + Bahan Baku)
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* 3. Detailed Table Breakdown of Cash Allocation */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
          <div className="flex items-center gap-2 font-bold text-lg text-text">
            <Percent size={20} className="text-primary" />
            <span>Rincian Pembagian Kantong Kas (Budgeting Ledger)</span>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-main text-text-secondary border-b border-border">
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Pos Kantong Alokasi</th>
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Tipe Anggaran</th>
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Formula / Patokan</th>
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Nominal Alokasi (Rp)</th>
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Status Pos</th>
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Keterangan / Tujuan Pos</th>
              </tr>
            </thead>
            <tbody>
              {/* Gaji Karyawan */}
              <tr className="border-b border-border hover:bg-main/30 transition-colors">
                <td className="px-4 py-3.5 font-bold text-success flex items-center gap-2">
                  <Users size={16} /> Gaji Karyawan
                </td>
                <td className="px-4 py-3.5"><span className="text-[0.7rem] bg-main px-2 py-1 rounded-md border border-border font-bold text-text-secondary">Nominal Rp</span></td>
                <td className="px-4 py-3.5 text-xs text-text-secondary">Nominal Tetap (Input Manual)</td>
                <td className="px-4 py-3.5 font-extrabold text-success">Rp {gajiNominal.toLocaleString('id-ID')}</td>
                <td className="px-4 py-3.5"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.7rem] font-bold bg-success-bg text-success">Tersimpan</span></td>
                <td className="px-4 py-3.5 text-xs text-text-secondary">Anggaran tetap untuk pembayaran gaji staff kasir & penjaga angkringan.</td>
              </tr>

              {/* Tabungan Usaha */}
              <tr className="border-b border-border hover:bg-main/30 transition-colors">
                <td className="px-4 py-3.5 font-bold text-amber-500 flex items-center gap-2">
                  <PiggyBank size={16} /> Tabungan Usaha
                </td>
                <td className="px-4 py-3.5"><span className="text-[0.7rem] bg-main px-2 py-1 rounded-md border border-border font-bold text-text-secondary">{percentages.tabungan}% Omset</span></td>
                <td className="px-4 py-3.5 text-xs text-text-secondary">{percentages.tabungan}% × Rp {totalRevenue.toLocaleString('id-ID')}</td>
                <td className="px-4 py-3.5 font-extrabold text-amber-500">Rp {tabunganNominal.toLocaleString('id-ID')}</td>
                <td className="px-4 py-3.5"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.7rem] font-bold bg-success-bg text-success">Tersimpan</span></td>
                <td className="px-4 py-3.5 text-xs text-text-secondary">Tabungan reinvestasi untuk ekspansi cabang atau beli inventaris baru.</td>
              </tr>

              {/* Dana Darurat */}
              <tr className="border-b border-border hover:bg-main/30 transition-colors">
                <td className="px-4 py-3.5 font-bold text-danger flex items-center gap-2">
                  <ShieldAlert size={16} /> Dana Darurat
                </td>
                <td className="px-4 py-3.5"><span className="text-[0.7rem] bg-main px-2 py-1 rounded-md border border-border font-bold text-text-secondary">{percentages.danaDarurat}% Omset</span></td>
                <td className="px-4 py-3.5 text-xs text-text-secondary">{percentages.danaDarurat}% × Rp {totalRevenue.toLocaleString('id-ID')}</td>
                <td className="px-4 py-3.5 font-extrabold text-danger">Rp {danaDaruratNominal.toLocaleString('id-ID')}</td>
                <td className="px-4 py-3.5"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.7rem] font-bold bg-success-bg text-success">Tersimpan</span></td>
                <td className="px-4 py-3.5 text-xs text-text-secondary">Cadangan dana siaga jika ada kerusakan gerobak/peralatan mendadak.</td>
              </tr>

              {/* Bahan Baku & Ops */}
              <tr className="border-b border-border hover:bg-main/30 transition-colors">
                <td className="px-4 py-3.5 font-bold text-blue-500 flex items-center gap-2">
                  <ShoppingBag size={16} /> Bahan Baku & Ops
                </td>
                <td className="px-4 py-3.5"><span className="text-[0.7rem] bg-main px-2 py-1 rounded-md border border-border font-bold text-text-secondary">{percentages.bahanBaku}% Omset</span></td>
                <td className="px-4 py-3.5 text-xs text-text-secondary">{percentages.bahanBaku}% × Rp {totalRevenue.toLocaleString('id-ID')}</td>
                <td className="px-4 py-3.5 font-extrabold text-blue-500">Rp {bahanBakuNominal.toLocaleString('id-ID')}</td>
                <td className="px-4 py-3.5"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.7rem] font-bold bg-blue-100 text-blue-700">Restock</span></td>
                <td className="px-4 py-3.5 text-xs text-text-secondary">Putaran modal belanja sate, nasi, gas LPG, & operasional besok.</td>
              </tr>

              {/* Profit Owner (Sisa dari Semua) */}
              <tr className="bg-purple-500/5">
                <td className="px-4 py-3.5 font-extrabold text-purple-600 flex items-center gap-2">
                  <TrendingUp size={16} /> Profit Bersih Owner
                </td>
                <td className="px-4 py-3.5"><span className="text-[0.7rem] bg-purple-500 text-white px-2 py-1 rounded-md font-bold">Sisa Semua</span></td>
                <td className="px-4 py-3.5 text-xs text-purple-600 font-semibold">Total Kas − Seluruh Pos Alokasi</td>
                <td className="px-4 py-3.5 font-black text-purple-600 text-[1.05rem]">Rp {profitOwnerNominal.toLocaleString('id-ID')}</td>
                <td className="px-4 py-3.5"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.7rem] font-bold bg-purple-500 text-white">Siap Ambil</span></td>
                <td className="px-4 py-3.5 text-xs text-text-secondary font-semibold">Sisa uang bersih murni yang menjadi hak keuntungan pemilik toko.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. EDIT BUDGETING MODAL */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditing(false)}>
          <div className="bg-card w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-border flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-main/50">
              <div className="flex items-center gap-2.5">
                <Sliders size={20} className="text-primary" />
                <h3 className="font-bold text-lg text-text m-0">Pengaturan Budgeting & Alokasi Kas</h3>
              </div>
            </div>

            <form onSubmit={handleSaveAllocations} className="flex flex-col">
              <div className="p-6 flex flex-col gap-4">
                
                {/* Real-time Calculation Summary Box */}
                <div className={`p-3.5 rounded-xl border mb-2 text-[0.85rem] ${tempTotalAllocated <= totalRevenue ? 'bg-main border-border' : 'bg-danger-bg border-danger'}`}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-muted font-medium">Total Kas Tersedia:</span>
                    <span className="font-extrabold text-text">Rp {totalRevenue.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between mb-2.5">
                    <span className="text-muted font-medium">Total Pos Alokasi (Gaji+Ops+Tabungan+Darurat):</span>
                    <span className="font-bold text-blue-500">Rp {tempTotalAllocated.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-dashed border-border font-extrabold">
                    <span className="text-purple-500">Estimasi Profit Bersih Owner (Sisa):</span>
                    <span className={`text-[0.95rem] ${tempProfitNominal >= 0 ? 'text-purple-600' : 'text-danger'}`}>
                      Rp {tempProfitNominal.toLocaleString('id-ID')} ({tempProfitPercent.toFixed(1)}%)
                    </span>
                  </div>
                </div>

                {/* Input Nominal Gaji Karyawan */}
                <div>
                  <label className="block text-xs font-bold text-success mb-1.5 uppercase tracking-wider">
                    1. Gaji Karyawan (Nominal Rp)
                  </label>
                  <input 
                    type="number" 
                    className="w-full bg-main border border-border rounded-lg text-sm text-text px-3 py-2.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all"
                    value={tempGajiNominal}
                    onChange={(e) => setTempGajiNominal(Number(e.target.value))}
                    min="0"
                    placeholder="Contoh: 450000"
                    required
                  />
                  <div className="text-[0.75rem] text-muted mt-1 font-medium">
                    Masukkan angka nominal rupiah tetap (bukan persentase).
                  </div>
                </div>

                {/* Input Persentase Tabungan Usaha */}
                <div>
                  <label className="block text-xs font-bold text-amber-500 mb-1.5 uppercase tracking-wider">
                    2. Tabungan Usaha (%)
                  </label>
                  <input 
                    type="number" 
                    className="w-full bg-main border border-border rounded-lg text-sm text-text px-3 py-2.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all"
                    value={tempPercentages.tabungan}
                    onChange={(e) => setTempPercentages({ ...tempPercentages, tabungan: Number(e.target.value) })}
                    min="0"
                    max="100"
                    required
                  />
                </div>

                {/* Input Persentase Dana Darurat */}
                <div>
                  <label className="block text-xs font-bold text-danger mb-1.5 uppercase tracking-wider">
                    3. Dana Darurat (%)
                  </label>
                  <input 
                    type="number" 
                    className="w-full bg-main border border-border rounded-lg text-sm text-text px-3 py-2.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all"
                    value={tempPercentages.danaDarurat}
                    onChange={(e) => setTempPercentages({ ...tempPercentages, danaDarurat: Number(e.target.value) })}
                    min="0"
                    max="100"
                    required
                  />
                </div>

                {/* Input Persentase Belanja Bahan Baku */}
                <div>
                  <label className="block text-xs font-bold text-blue-500 mb-1.5 uppercase tracking-wider">
                    4. Belanja Bahan Baku & Operasional (%)
                  </label>
                  <input 
                    type="number" 
                    className="w-full bg-main border border-border rounded-lg text-sm text-text px-3 py-2.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all"
                    value={tempPercentages.bahanBaku}
                    onChange={(e) => setTempPercentages({ ...tempPercentages, bahanBaku: Number(e.target.value) })}
                    min="0"
                    max="100"
                    required
                  />
                </div>

                {/* Auto Calculated Profit Owner info */}
                <div className="bg-purple-500/10 p-3 rounded-lg text-purple-600 text-[0.8rem] font-semibold mt-1">
                  💡 <strong>Profit Bersih Owner</strong> akan dihitung otomatis dari sisa kas yang belum terpakai oleh 4 pos di atas.
                </div>
              </div>

              <div className="flex justify-end gap-3 px-6 py-4 border-t border-border bg-main/30">
                <button type="button" className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-main text-text border border-border hover:bg-border/50 transition-colors" onClick={() => setIsEditing(false)}>
                  Batal
                </button>
                <button type="submit" className="px-5 py-2.5 rounded-lg text-sm font-bold bg-primary hover:bg-primary-hover text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed" disabled={tempTotalAllocated > totalRevenue}>
                  Simpan Budgeting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
