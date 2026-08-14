# Dokumentasi Frontend - Fitur Barang Terbuang (Waste Management)

## 1. Tujuan Fitur
Fitur Waste Management (Barang Terbuang) memungkinkan user (Owner/Admin) untuk mencatat dan memantau barang yang terbuang atau mengalami kerugian (loss). Pencatatan ini akan menyesuaikan stok terkait secara otomatis (di proses oleh backend) dan memberikan laporan analisis kerugian berdasarkan item dan alasan terbuang.

## 2. Route & Navigasi
Fitur ini berintegrasi pada sistem routing/tab existing:
- **Menu Sidebar**: `Laporan & Keuangan` -> `Barang Terbuang / Waste`
- **Identifier Sub-rutin / Tab**: `kebocoran`
- Dilindungi oleh sistem Autentikasi dan Role-Based Access Control (RBAC).

## 3. Permission (RBAC Frontend)
Akses dan tindakan dibatasi berdasarkan granular permissions:
- `waste.read`: Membuka halaman, tabel list barang terbuang, dan detail catatan.
- `waste.create`: Membuka form dan mensubmit pencatatan barang terbuang baru.
- `waste.update`: Mengedit jumlah atau alasan dari barang terbuang yang sudah dicatat.
- `waste.delete`: Menghapus riwayat barang terbuang (stok akan dikembalikan oleh backend).
- `waste.analysis`: Menampilkan summary kerugian dan komponen chart analisis (Summary & Trend Analysis).

## 4. API Service & Endpoints
Service berada di `src/services/waste.service.js` menggunakan interseptor `axios.js`.

| Method | Endpoint | Fungsi | Permission |
| --- | --- | --- | --- |
| GET | `/api/wastes` | Mengambil daftar barang terbuang beserta filternya dan pagination | `waste.read` |
| GET | `/api/wastes/:id` | Mengambil detail spesifik pencatatan barang terbuang | `waste.read` |
| POST | `/api/wastes` | Mencatat barang terbuang baru (produk/ingredient) | `waste.create` |
| PATCH | `/api/wastes/:id` | Mengkoreksi pencatatan barang terbuang | `waste.update` |
| DELETE | `/api/wastes/:id` | Menghapus barang terbuang (mengembalikan stok) | `waste.delete` |
| GET | `/api/wastes/summary` | Mengambil ringkasan (Total Kerugian, Total Pencatatan, dll) | `waste.analysis` |
| GET | `/api/wastes/analysis` | Mengambil data agregrated chart & top wasted items | `waste.analysis` |

> *Catatan*: Endpoint API bahan baku menggunakan try-catch fallback pada `/api/ingredients` jika tersedia di backend.

## 5. Struktur Component
Struktur komponen ditempatkan di dalam folder existing `src/components/Kebocoran/`:
1. **`WasteManagementView.jsx`**: Entry point pemersatu (Smart Component) yang menangani fetch, filter, pagination, modals, dan state utama manajemen limbah ini.
2. **`WasteTable.jsx`**: Reusable presenational UI untuk merender state table (termasuk empty view dan loading indicator).
3. **`WasteSummary.jsx`**: Summary Card (Total kerugian, item terbanyak, pencatatan) yang muncul di top-level.
4. **`WasteAnalysis.jsx`**: Section grafis atau stat detail untuk progress chart alasan kerugian, list top barang terbanyak rusak (Analysis Component).
5. **`WasteFormModal.jsx`**: Form Component untuk operasi Create dan Update records barang terbuang.
6. **`WasteDetailModal.jsx`**: Pop-up Detail read-only untuk informasi barang terbuang yang komprehensif.

## 6. Fitur & Mekanisme
- **Pencarian (Search)**: Menerapkan teknik _debounce_ selama 500ms agar mencegah request spam ke backend.
- **Filter Waktu & Kategori**: Filter `startDate`, `endDate`, `type`, `reason` disusun ke URLQuery melalui `URLSearchParams` yang menghindari parameter _empety string_.
- **Format UI Standar**: Mata uang menggunakan formatter bawaan `formatCurrency` dan format tanggal menggunakan `formatDate`.
- **Delete Action & State**: Terdapat Confirmation Dialog pada action Delete, di-disable ketika _action in progress_ (double submit prevention). Set action refresh akan ter-trigger bila sukses.

## 7. Penanganan Error & Notifikasi
Sistem menggunakan `ToastContext` bawaan project:
- Sukses akan diganjar notifikasi `toast.success('Pencatatan berhasil disimpan')` diikuti reload state pada component.
- Failure/Error 4xx-5xx akan ditangkap catch blok dan me-render `toast.error(error.message)` API backend.
- Sistem form menerapkan standar default, disable submit-button, error text dekat field, dan loading states.

## 8. Potensi Masalah / Area Integrasi
- **Dropdown INGREDIENTS**: API backend saat audit tidak memiliki controller independen yang khusus me-list Ingredient global (`/ingredients` belum tersedia sebagai service terpisah). Untuk Product, endpoint secara default disandarkan pada `/katalog`. Frontend secara halus akan membungkus dengan _fallback error safe_ bila endpoint belum eksis sehingga tidak crash.
