import React from 'react';

export default function AnalysisSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse w-full max-w-[1600px] mx-auto">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 bg-border rounded w-48 mb-2"></div>
          <div className="h-4 bg-border rounded w-72"></div>
        </div>
        <div className="h-10 bg-border rounded w-64"></div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-card border border-border p-5 rounded-xl h-28 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <div className="h-4 bg-border rounded w-20"></div>
              <div className="w-8 h-8 rounded-lg bg-border"></div>
            </div>
            <div className="h-6 bg-border rounded w-32 mt-2"></div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-card border border-border rounded-xl p-6 h-100">
        <div className="h-6 bg-border rounded w-48 mb-6"></div>
        <div className="w-full h-full bg-border/50 rounded-lg"></div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Performa Keuangan */}
        <div className="bg-card border border-border rounded-xl p-6 xl:col-span-1">
          <div className="h-6 bg-border rounded w-40 mb-6"></div>
          <div className="flex flex-col gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="flex justify-between border-b border-border pb-3">
                <div className="h-4 bg-border rounded w-24"></div>
                <div className="h-4 bg-border rounded w-24"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-card border border-border rounded-xl p-6 xl:col-span-2">
           <div className="h-6 bg-border rounded w-40 mb-6"></div>
           <div className="w-full h-64 bg-border/50 rounded-lg"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="h-6 bg-border rounded w-40 mb-6"></div>
          <div className="flex gap-4 items-center">
             <div className="w-32 h-32 rounded-full bg-border shrink-0"></div>
             <div className="flex flex-col gap-3 flex-1">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-10 bg-border rounded w-full"></div>
                ))}
             </div>
          </div>
        </div>

        {/* Debt Summary */}
        <div className="bg-card border border-border rounded-xl p-6">
           <div className="h-6 bg-border rounded w-40 mb-6"></div>
           <div className="flex flex-col gap-3">
             <div className="h-24 bg-border rounded w-full"></div>
             <div className="flex gap-3">
               <div className="h-20 bg-border rounded flex-1"></div>
               <div className="h-20 bg-border rounded flex-1"></div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
