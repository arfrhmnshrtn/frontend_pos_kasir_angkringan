import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const Unauthorized401 = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-20 h-20 bg-rose-100 dark:bg-rose-950/50 rounded-3xl flex items-center justify-center text-rose-600 dark:text-rose-400 mb-6 shadow-xl">
        <Lock className="w-10 h-10" />
      </div>
      <h1 className="text-6xl font-black text-slate-900 dark:text-slate-100 tracking-tight">401</h1>
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-2">Sesi Berakhir / Tidak Terotentikasi</h2>
      <p className="text-slate-500 max-w-md mt-2 text-sm leading-relaxed">
        Sesi login Anda telah kadaluarsa atau Anda belum melakukan otentikasi. Silakan masuk kembali dengan PIN Anda.
      </p>
      <div className="mt-8">
        <Link to="/login">
          <Button variant="primary" size="lg" icon={ArrowLeft} className="font-bold">
            Kembali ke Login
          </Button>
        </Link>
      </div>
    </div>
  );
};
