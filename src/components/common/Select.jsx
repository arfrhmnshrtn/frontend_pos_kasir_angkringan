import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

export const Select = forwardRef(
  (
    {
      label,
      options = [],
      error,
      helperText,
      placeholder = 'Pilih salah satu',
      className = '',
      id,
      value,
      onChange,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-text">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`w-full appearance-none rounded-xl border bg-card text-text text-sm transition-all duration-200 focus:outline-none focus:ring-2 pr-10 pl-4 py-2.5 ${
              error
                ? 'border-danger focus:border-danger focus:ring-danger-bg'
                : 'border-border focus:border-primary focus:ring-primary-light'
            } ${disabled ? 'opacity-60 cursor-not-allowed bg-main' : 'cursor-pointer'} ${className}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => {
              const val = typeof opt === 'object' ? opt.value : opt;
              const lbl = typeof opt === 'object' ? opt.label : opt;
              return (
                <option key={val} value={val}>
                  {lbl}
                </option>
              );
            })}
          </select>
          <div className="absolute right-3.5 pointer-events-none text-text-muted">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error && <span className="text-xs text-danger font-medium">{error}</span>}
        {!error && helperText && <span className="text-xs text-text-secondary">{helperText}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
