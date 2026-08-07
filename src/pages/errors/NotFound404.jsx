import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const NotFound404 = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-20 h-20 bg-blue-100 dark:bg-blue-950/50 rounded-3xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 shadow-xl">
        <FileQuestion className="w-10 h-10" />
      </div>
      <h1 className="text-6xl font-black text-slate-900 dark:text-slate-100 tracking-tight">404</h1>
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-2">Halaman Tidak Ditemukan</h2>
      <p className="text-slate-500 max-w-md mt-2 text-sm leading-relaxed">
        Maaf, halaman yang Anda cari tidak ditemukan atau telah dipindahkan.
      </p>
      <div className="mt-8">
        <Button variant="primary" size="lg" icon={ArrowLeft} onClick={() => navigate(-1)} className="font-bold">
          Kembali
        </Button>
      </div>
    </div>
  );
};
