import React from 'react';

export const Table = ({ headers = [], columns, data, keyExtractor, children, className = '' }) => {
  const isDynamic = !!(columns && data);

  return (
    <div className={`w-full overflow-x-auto rounded-xl border border-border shadow-sm ${className}`}>
      <table className="w-full text-left text-sm border-collapse">
        <thead className="bg-main text-text-secondary font-semibold border-b border-border uppercase text-xs tracking-wider">
          <tr>
            {isDynamic
              ? columns.map((col, index) => (
                  <th key={index} className={`px-6 py-4 ${col.className || ''}`}>
                    {col.header}
                  </th>
                ))
              : headers.map((header, index) => (
                  <th key={index} className="px-6 py-4">
                    {header}
                  </th>
                ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-card text-text">
          {isDynamic
            ? data.map((row, idx) => (
                <tr key={keyExtractor ? keyExtractor(row) : row.id || idx} className="hover:bg-main transition-colors border-b border-border last:border-b-0">
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className={`px-6 py-4 ${col.className || ''}`}>
                      {typeof col.accessor === 'function' ? col.accessor(row, idx) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            : children}
        </tbody>
      </table>
    </div>
  );
};
