# Dokumentasi Frontend - Laporan Kas & Keuangan

## 1. Tujuan Fitur
Fitur Laporan Kas & Keuangan adalah modul dashboard lengkap yang dirancang untuk memantau performa masuk/keluarnya kas perusahaan. Berbeda dengan modul transaksi harian yang fokus pada operasional point-of-sales, laporan kas menyuguhkan ikhtisar level atas meliputi: arus kas masuk, arus kas keluar, sumber penerimaan per metode pembayaran, alokasi budgeting kantong kas, pengeluaran kategori, pelunasan utang pelanggan, serta laba profit.

Sesuai permintaan, dashboard ini 100% menggunakan data yang dipasok dari RestAPI backend secara real-time. Tidak ada _dummy data_, _hardcode summary_, maupun _fake pagination_.

## 2. Struktur Komponen yang Dibuat
Module ini dirancang secara terpisah dan modular, bersandar pada prinsip _reusable component_:

| File Component | Deskripsi Singkat |
|---|---|
| `CashReportView.jsx` | Container utama yang menggabungkan semua children component. Mengatur *fetching state*, validasi RBAC *permission*, filter tanggal global, serta pergerakan data dari `useCashReport.js`. |
| `CashSummaryCards.jsx` | Komponen visual statis (6 kartu berjejer) yang menyajikan matrik Total Saldo Kas, Total Pemasukan, Total Pengeluaran, Laba Bersih, dsb yang dibentuk dengan ikon Lucide. |
| `IncomeExpenseChart.jsx` | Penampung grafik Recharts _Area Chart_. Secara visual membedakan garis Pemasukan vs Pengeluaran per hari sehingga pola tren arus kas terlihat jelas, termasuk _Tooltip_ untuk flow bersih harian. |
| `PaymentMethodChart.jsx` | Penampung _Donut Pie Chart_ (Recharts) yang mengabstraksi data agregasi sumber dana spesifik per *payment method* (Tunai, QRIS, Transfer). |
| `IncomeExpenseBreakdown.jsx` | Modul berpalang-dua yang memisahkan sumber pemasukan berdasar sifatnya (POS, Piutang, Lain-lain), serta membeberkan peringkat pengeluaran terbesar berdasar kategorinya lewat _progress bar/bar chart_ statis sederhana. |
| `BudgetAllocation.jsx` | Menampilkan tabel dan bilah persentase untuk skema _kantong kas (budgeting ledgers)_. Komponen murni merender kalkulasi persentase dan sisa nilai profit berdasar persentase murni yang dilempar dari backend. |
| `CashTransactionTable.jsx` | Menampilkan riwayat transaksi secara horizontal dengan _pagination_, _search filter_, dan _type filter_. Component melempar event onClick ke parent modal Detail ketika user menekan tombol 'Detail'. |
| `TransactionDetailModal.jsx` | Pop-up overlay (Modal) pembuka rinci detail suatu transaksi (siapa pembuat, no tagihan referensi sumber, tanggal komplit). |
| `DebtSummaryTable.jsx` | Container mini terpisah untuk spesialisasi mengambil, memfilter, dan mendaftar hutang / piutang _outstanding_ yang belum lunas (BELUM LUNAS / SEBAGIAN). _Injectable_ ke layout keuangan. |
| `PayDebtModal.jsx` | Pop-up overlay untuk mengakomodasi alur "Bayar Tagihan Piutang/Hutang" dengan *validation constraint* seperti angka minimal dan *payment method*. Memanggil _CashReport_ _refresh event_ setelah pelunasan sukses. |
| `hooks/useCashReport.js` | _Custom hook_ yang merepresentasikan semua logika Fetch API untuk cash flow, transactions (beserta pagination), filter states, dan error handling (Toast Context). Ini mereduksi *fat component* `CashReportView`. |
| `services/cash.service.js` | Axio Service Provider terpusat khusus untuk fungsional `/cash/*`. |

## 3. Integrasi Endpoint API yang DIgunakan

Berdasarkan *audit file `cash.controller.ts` dan `debt.controller.ts`*, Integrasi endpoint berjalan pada:

| Fitur / Sub-fitur | Method | Endpoint / URL | Parameter yang digunakan |
|---|---|---|---|
| Laporan Summary & Budget | `GET` | `/api/cash/reports` | `?period=...&startDate=...&endDate=...` |
| Chart Arus Kas | `GET` | `/api/cash/flow` | `?period=...&startDate=...&endDate=...` |
| Saldo & Metode Pembayaran | `GET` | `/api/cash/balance` | `?period=...&startDate=...&endDate=...` |
| Rincian Total Pemasukan | `GET` | `/api/cash/income-breakdown` | `?period=...&startDate=...&endDate=...` |
| Rincian Total Pengeluaran | `GET` | `/api/cash/expense-breakdown` | `?period=...&startDate=...&endDate=...` |
| Tabel Transaksi Pagination | `GET` | `/api/cash/transactions` | `?period=...&page=...&limit=...&type=...&payment_method=...&search=...` |
| Daftar Hutang | `GET` | `/api/debts` | `?search=...&status=BELUM_LUNAS&page=...` |
| Aksi Pembayaran Hutang | `POST` | `/api/debts/:id/payments` | _Body:_ `{ amount, payment_method }` |

* _Semua API menggunakan HTTP Interceptor Axios bawaan POS Angkringan 88. Otentikasi `Authorization: Bearer <Token>` dipasok eksklusif dan otomatis direfresh bila menjumpai 401 via refreshToken layer._

## 4. API yang Belum Tersedia

Tidak ditemukan ketidakcocokan mayor. Backend sudah mumpuni untuk layout yang diminta. Namun, untuk sekedar _nice to have_ yang mungkin dikembangkan di masa depan:
- **API `GET /api/debts/payments/:id`** : Meskipun di _controller_ sudah eksis (_getPayments_), tapi UI tidak secara spesifik punya _history_ bayar hutang detail dari masing-masing pelanggan di satu tempat khusus selain meminjam riwayat di _transaction table_.
- **API Budget Allocation Editing Component**: Saat ini modal _Atur Budgeting Kas_ sengaja ditahan nonaktif secara UI. Endpoint `POST /cash/budget` dan `PATCH /cash/budget/:id` ada, tapi desain _CashReportView.jsx_ origin lawas belum mengakomodir _dynamic list UI_ editing array (sebelumnya hardcode form untuk Tabungan/Darurat dan Gaji). Direkomendasikan *Frontend Next Phase* membuat Management Editor khusus terpisah di *setting* karena akan sangat ribet disematkan di halaman _Report_. (Komponen murni merender API as of now). 

## 5. Alur Authentication & Refresh Data Flow

#### Request Flow Standar (Auth 401 Handle):
`CashReportView` Mounted -> Memanggil Axios (`getReports`, `getFlow`, dll) -> Akses memicu 401 (Misal token expired) -> Interceptor `axios.js` menangkap 401 -> `axios` secara sinkron POST ke `/auth/refresh` -> Sukses? Menyimpan `access_token` ke LocalStorage -> `axios` memanggul kembali _Request_ utama `/cash/reports` dengan *Bearer* terbaru -> Tampi di UI (User _seamless_ tidak sadar ada error 401).

#### Refresh Data / Mutation Flow:
Saat user berhasil membayar Piutang melalui **PayDebtModal.jsx**:
* Submit API sukses (Code `2xx`).
* Modal tertutup, melempar pesan Toast Success.
* Hook memanggil callback `refreshAll()` dari _useCashReport_.
* Semua API `fetchDashboardData` (Summary, Chart, Breakdown) dan `fetchTransactions` dipanggil ulang secara simultan & asinkron. UI React akan otomatis di render per bagian setelah Response tiba. *Browser tidak direload sama sekali `window.location.reload() Dilarang.`*.

## 6. Security & Permission (RBAC)
Sistem memiliki 2 level penjagaan:
1.  **Backend Controller Guards:** Tiap endpoint diamankan `@Permissions(PERMISSIONS.CASH_REPORT_READ)` (Atau `CASH_TRANSACTION_READ`). Walau _frontend_ di-_bypass_, API akan bereaksi respons _403 Forbidden_.
2.  **Frontend Layout Block (CashReportView.jsx):**
    ```javascript
    const canRead = hasPermission('cash.report.read') || hasPermission('admin');
    if (!canRead) return <Akses Ditolak .../>
    ```
    UI hanya tampak, dan _Request_ API tidak akan ditembakkan apabila variabel _permission_ tersebut absen.

## 7. Status Pengujian Singkat (Self Analysis Testing Phase)

- _Authentication_: Sistem JWT dan interceptor Axios dipastikan telah berjalan secara wajar dengan standar yang diterapkan proyek sebelumnya.
- _Report Filter (Hari Ini, 7 Hari, Custom, dll)_: Semua perubahan dropdown berhasil me-reset Pagination (`page: 1`) dan men-_trigger_ event Refresh.
- _Tabel & Pagination_: Filter jenis `IN` dan `OUT` dapat bereaksi normal di `transactions`. _Fallback Limit_ otomatis terkunci pada angka dari parameter.
- _Bayar Hutang Piutang_: Validasi batas tagihan ("Nominal tidak boleh melampaui sisa piutang") telah di set hard-stop di form modal sehingga bebas celah negatif payment backend.

Integrasi dinyatakan selesai sesuai instruksi _strict guideline_.
