import React from 'react';
import { Spinner } from './Spinner';

export const Loading = ({ text = 'Memuat data...', fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-sm">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl flex flex-col items-center gap-3 border border-slate-200 dark:border-slate-800">
          <Spinner size="lg" className="text-blue-600" />
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <Spinner size="md" className="text-blue-600" />
      <p className="text-sm text-slate-500 font-medium">{text}</p>
    </div>
  );
};
