import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  Menu as MenuIcon, 
  Plus, 
  CheckCircle2,
  Clock,
  ChevronDown
} from 'lucide-react';

export default function Header({ darkTheme, setDarkTheme, setMobileOpen, onOpenAddModal, searchQuery, setSearchQuery }) {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'Pesanan Baru #AK-1089', time: '2 menit lalu', unread: true },
    { id: 2, title: 'Stok Sate Kulit tersisa 5 porsi', time: '15 menit lalu', unread: true },
    { id: 3, title: 'Pembayaran QRIS Rp 45.000 sukses', time: '1 jam lalu', unread: false },
  ];

  return (
    <header className="h-[70px] bg-header/80 backdrop-blur-md border-b border-border px-6 flex items-center justify-between sticky top-0 z-[90]">
      <div className="flex items-center gap-4">
        <button 
          className="lg:hidden bg-transparent border-none text-text cursor-pointer p-1.5" 
          onClick={() => setMobileOpen(prev => !prev)}
          aria-label="Toggle mobile menu"
        >
          <MenuIcon size={24} />
        </button>

        <div className="relative w-[300px] hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
          <input 
            type="text" 
            className="w-full pl-9 pr-12 py-2 bg-main border border-border rounded-lg text-sm text-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all" 
            placeholder="Cari pesanan, menu, atau pelanggan..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[0.7rem] bg-card border border-border px-1.5 py-0.5 rounded text-muted">⌘K</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button 
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-transform shadow-md hover:-translate-y-px" 
          onClick={onOpenAddModal}
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Tambah Pesanan</span>
        </button>

        <button 
          className="w-10 h-10 rounded-lg border border-border bg-card text-text-secondary flex items-center justify-center cursor-pointer transition-colors hover:bg-main hover:text-text hover:border-primary" 
          onClick={() => setDarkTheme(!darkTheme)}
          title={darkTheme ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkTheme ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="relative">
          <button 
            className="w-10 h-10 rounded-lg border border-border bg-card text-text-secondary flex items-center justify-center cursor-pointer transition-colors hover:bg-main hover:text-text hover:border-primary relative" 
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifikasi"
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full ring-2 ring-card" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-card border border-border rounded-xl shadow-lg p-4 z-[200]">
              <div className="flex justify-between items-center mb-3">
                <strong className="text-[0.95rem]">Notifikasi</strong>
                <span className="text-[0.75rem] text-primary cursor-pointer font-semibold">Tandai dibaca</span>
              </div>
              <div className="flex flex-col gap-2.5">
                {notifications.map(n => (
                  <div key={n.id} className={`p-2.5 rounded-lg text-[0.85rem] ${n.unread ? 'bg-primary-light/50' : 'bg-main'}`}>
                    <div className="font-semibold text-text">{n.title}</div>
                    <div className="text-[0.75rem] text-muted flex items-center gap-1 mt-0.5">
                      <Clock size={12} /> {n.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 cursor-pointer ml-1">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-[0.85rem]">A</div>
          <ChevronDown size={16} className="text-text-secondary" />
        </div>
      </div>
    </header>
  );
}
