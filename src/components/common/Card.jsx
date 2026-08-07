import React from 'react';

export const Card = ({ children, className = '', header, footer, ...props }) => {
  return (
    <div
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm transition-all duration-200 ${className}`}
      {...props}
    >
      {header && <div className="p-5 border-b border-slate-100 dark:border-slate-800 font-bold">{header}</div>}
      <div className="p-6">{children}</div>
      {footer && <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 rounded-b-2xl">{footer}</div>}
    </div>
  );
};
