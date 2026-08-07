import React from 'react';

export const Badge = ({ children, variant = 'default', size = 'md', className = '' }) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    primary: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200',
    success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200',
    danger: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200',
    warning: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px] font-semibold rounded-md',
    md: 'px-2.5 py-1 text-xs font-semibold rounded-lg',
    lg: 'px-3 py-1.5 text-sm font-semibold rounded-xl',
  };

  return (
    <span
      className={`inline-flex items-center justify-center font-medium ${variants[variant] || variants.default} ${
        sizes[size] || sizes.md
      } ${className}`}
    >
      {children}
    </span>
  );
};
