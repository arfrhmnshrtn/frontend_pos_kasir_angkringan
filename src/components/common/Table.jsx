import React from 'react';

export const Table = ({ headers = [], children, className = '' }) => {
  return (
    <div className={`w-full overflow-x-auto rounded-xl border border-border shadow-sm ${className}`}>
      <table className="w-full text-left text-sm border-collapse">
        <thead className="bg-main text-text-secondary font-semibold border-b border-border uppercase text-xs tracking-wider">
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="px-6 py-4">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-card text-text">
          {children}
        </tbody>
      </table>
    </div>
  );
};
