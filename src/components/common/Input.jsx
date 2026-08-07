import React, { forwardRef } from 'react';

export const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      onRightIconClick,
      className = '',
      id,
      type = 'text',
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-text">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {LeftIcon && (
            <div className="absolute left-3.5 text-text-secondary pointer-events-none flex items-center justify-center">
              <LeftIcon className="w-5 h-5" />
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={`w-full rounded-xl border bg-card text-text placeholder-text-muted text-sm transition-all duration-200 focus:outline-none focus:ring-2 ${
              LeftIcon ? 'pl-11' : 'pl-4'
            } ${RightIcon ? 'pr-11' : 'pr-4'} py-2.5 ${
              error
                ? 'border-danger focus:border-danger focus:ring-danger-bg'
                : 'border-border focus:border-primary focus:ring-primary-light'
            } ${className}`}
            {...props}
          />
          {RightIcon && (
            <button
              type="button"
              onClick={onRightIconClick}
              tabIndex={-1}
              className={`absolute right-3.5 text-text-muted hover:text-text-secondary flex items-center justify-center ${
                onRightIconClick ? 'cursor-pointer' : 'pointer-events-none'
              }`}
            >
              <RightIcon className="w-5 h-5" />
            </button>
          )}
        </div>
        {error && <span className="text-xs text-danger font-medium">{error}</span>}
        {!error && helperText && <span className="text-xs text-text-secondary">{helperText}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
