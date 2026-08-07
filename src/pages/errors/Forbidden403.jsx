import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';

export const Forbidden403 = () => {
  const navigate = useNavigate();
  const { role } = useAuth();

  const roleName = (typeof role === 'string' ? role : role?.name || '').toUpperCase();
  const defaultRedirect = roleName === 'KASIR' ? '/pos' : '/dashboard';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-20 h-20 bg-amber-100 dark:bg-amber-950/50 rounded-3xl flex items-center justify-center text-amber-600 dark:text-amber-400 mb-6 shadow-xl">
        <ShieldAlert className="w-10 h-10" />
      </div>
      <h1 className="text-6xl font-black text-slate-900 dark:text-slate-100 tracking-tight">403</h1>
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-2">Akses Ditolak (Forbidden)</h2>
      <p className="text-slate-500 max-w-md mt-2 text-sm leading-relaxed">
        Anda tidak memiliki izin (permission/role) yang sesuai untuk mengakses halaman ini.
      </p>
      <div className="mt-8">
        <Button variant="primary" size="lg" icon={ArrowLeft} onClick={() => navigate(defaultRedirect)} className="font-bold">
          Kembali ke Halaman Utama
        </Button>
      </div>
    </div>
  );
};
