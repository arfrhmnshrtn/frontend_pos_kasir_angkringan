import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import {
  TrendingUp,
  ShoppingCart,
  Users,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardPage = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const roleName = (typeof role === 'string' ? role : role?.name || '').toUpperCase();

  const stats = [
    {
      title: 'Penjualan Hari Ini',
      value: 'Rp 1.450.000',
      change: '+14.2%',
      isPositive: true,
      icon: DollarSign,
      color: 'bg-emerald-500',
    },
    {
      title: 'Total Transaksi',
      value: '48 Transaksi',
      change: '+8.5%',
      isPositive: true,
      icon: ShoppingCart,
      color: 'bg-blue-500',
    },
    {
      title: 'Kasir Aktif',
      value: '4 Kasir',
      change: 'Stabil',
      isPositive: true,
      icon: Users,
      color: 'bg-indigo-500',
    },
    {
      title: 'Rata-rata Order',
      value: 'Rp 30.200',
      change: '-2.1%',
      isPositive: false,
      icon: TrendingUp,
      color: 'bg-amber-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-xl">
          <Badge variant="primary" className="bg-white/20 text-white backdrop-blur-md border border-white/20 mb-3">
            {roleName} DASHBOARD
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Selamat Datang, {user?.name || 'User'}!
          </h2>
          <p className="mt-2 text-blue-100 text-sm leading-relaxed">
            Sistem POS Angkringan siap digunakan. Pantau aktivitas penjualan, kelola data kasir, dan tingkatkan performa bisnis Anda secara realtime.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {roleName === 'KASIR' ? (
              <Button
                variant="primary"
                onClick={() => navigate('/pos')}
                className="bg-white text-blue-700 hover:bg-blue-50 shadow-md font-bold"
              >
                <ShoppingCart className="w-4 h-4 mr-2" /> Buka POS Kasir
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={() => navigate('/users')}
                className="bg-white text-blue-700 hover:bg-blue-50 shadow-md font-bold"
              >
                <Users className="w-4 h-4 mr-2" /> Kelola Kasir
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => navigate('/profile/change-pin')}
              className="border-white/40 text-white hover:bg-white/10"
            >
              Ubah PIN
            </Button>
          </div>
        </div>

        {/* Decorative circle gradient */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{stat.value}</h3>
                </div>
                <div className={`w-12 h-12 rounded-2xl ${stat.color} text-white flex items-center justify-center shadow-md`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold">
                {stat.isPositive ? (
                  <span className="flex items-center text-emerald-600 dark:text-emerald-400">
                    <ArrowUpRight className="w-4 h-4 mr-0.5" /> {stat.change}
                  </span>
                ) : (
                  <span className="flex items-center text-rose-600 dark:text-rose-400">
                    <ArrowDownRight className="w-4 h-4 mr-0.5" /> {stat.change}
                  </span>
                )}
                <span className="text-slate-400 font-normal">vs hari kemarin</span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2" header="Ringkasan Performa">
          <div className="h-64 flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center">
            <div>
              <RefreshCw className="w-8 h-8 mx-auto mb-2 text-slate-300 animate-spin" />
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Grafik Penjualan Realtime</p>
              <p className="text-xs text-slate-400 mt-1">Placeholder data visualisasi statistik POS Angkringan</p>
            </div>
          </div>
        </Card>

        <Card header="Status Kasir Hari Ini">
          <div className="space-y-4">
            {[
              { name: 'Budi Santoso', status: 'Aktif', time: 'Shift Pagi (08:00 - 16:00)' },
              { name: 'Siti Rahma', status: 'Aktif', time: 'Shift Sore (16:00 - 23:00)' },
              { name: 'Andi Wijaya', status: 'Istirahat', time: 'Shift Pagi' },
            ].map((kasir, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{kasir.name}</p>
                  <p className="text-xs text-slate-500">{kasir.time}</p>
                </div>
                <Badge variant={kasir.status === 'Aktif' ? 'success' : 'warning'} size="sm">
                  {kasir.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
