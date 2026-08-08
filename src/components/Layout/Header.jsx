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
    <header className="h-17.5 bg-header/80 backdrop-blur-md border-b border-border px-6 flex items-center justify-between sticky top-0 z-90">
      <div className="flex items-center gap-4">
        <button
          className="lg:hidden bg-transparent border-none text-text cursor-pointer p-1.5"
          onClick={() => setMobileOpen(prev => !prev)}
          aria-label="Toggle mobile menu"
        >
          <MenuIcon size={24} />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button
          className="w-10 h-10 rounded-lg border border-border bg-card text-text-secondary flex items-center justify-center cursor-pointer transition-colors hover:bg-main hover:text-text hover:border-primary"
          onClick={() => setDarkTheme(!darkTheme)}
          title={darkTheme ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkTheme ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="flex items-center gap-2 cursor-pointer ml-1">
          <div className="w-9 h-9 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-[0.85rem]">A</div>
          <ChevronDown size={16} className="text-text-secondary" />
        </div>
      </div>
    </header>
  );
}
