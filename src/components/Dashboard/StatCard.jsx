import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StatCard({ title, value, trend, isPositive, icon: Icon, colorClass, subtitle }) {
  const getIconColor = () => {
    switch (colorClass) {
      case 'orange': return 'bg-blue-600/10 text-blue-600'; // Was orange in name but used blue variables in old CSS
      case 'blue': return 'bg-blue-500/10 text-blue-500';
      case 'green': return 'bg-emerald-500/10 text-emerald-500';
      case 'purple': return 'bg-purple-500/10 text-purple-500';
      default: return 'bg-blue-500/10 text-blue-500';
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md hover:border-primary/30 flex flex-col gap-3 relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${getIconColor()}`}>
          <Icon size={22} />
        </div>
        {trend && (
          <div className={`inline-flex items-center gap-1 text-[0.75rem] font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-success-bg text-success' : 'bg-danger-bg text-danger'}`}>
            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            <span>{trend}</span>
          </div>
        )}
      </div>

      <div>
        <div className="text-[1.6rem] font-extrabold text-text tracking-tight">{value}</div>
        <div className="text-[0.85rem] text-text-secondary font-medium">{title}</div>
        {subtitle && <div className="text-[0.75rem] text-muted mt-1">{subtitle}</div>}
      </div>
    </div>
  );
}
