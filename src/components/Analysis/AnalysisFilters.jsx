import React from 'react';
import { Calendar } from 'lucide-react';

export default function AnalysisFilters({ 
  filter, 
  setFilter, 
  customStartDate, 
  setCustomStartDate, 
  customEndDate, 
  setCustomEndDate,
  onApplyCustom
}) {
  const options = [
    { value: '7days', label: '7 Hari' },
    { value: '30days', label: '30 Hari' },
    { value: 'month', label: 'Bulan Ini' },
    { value: 'year', label: 'Tahun Ini' },
    { value: 'custom', label: 'Custom' }
  ];

  return (
    <div className="flex flex-col md:flex-row gap-3 items-end md:items-center">
      <div className="flex items-center gap-1.5 p-1 bg-main border border-border rounded-lg overflow-x-auto w-full md:w-auto">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
              filter === opt.value
                ? 'bg-primary text-white shadow-sm'
                : 'text-text-secondary hover:text-text hover:bg-border/30'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {filter === 'custom' && (
        <div className="flex items-center gap-2 p-2 bg-main border border-border rounded-lg w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-secondary font-medium">Dari</span>
            <input 
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="bg-card border border-border rounded text-xs px-2 py-1 text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-secondary font-medium">Sampai</span>
            <input 
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="bg-card border border-border rounded text-xs px-2 py-1 text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <button 
            onClick={onApplyCustom}
            disabled={!customStartDate || !customEndDate}
            className="bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white p-1.5 rounded text-xs px-3 transition-colors font-semibold"
          >
            Terapkan
          </button>
        </div>
      )}
    </div>
  );
}
