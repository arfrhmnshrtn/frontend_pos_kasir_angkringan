import React, { useRef, useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const PinInput = ({ length = 4, value = '', onChange, error, label, disabled = false, autoFocus = true, hideKeypad = false }) => {
  const [showPin, setShowPin] = useState(false);
  const inputRefs = useRef([]);

  // Ensure value is length formatted
  const pinArray = Array.from({ length }, (_, i) => value[i] || '');

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (e, index) => {
    const val = e.target.value;
    // Allow only digits
    if (!/^\d*$/.test(val)) return;

    const newPin = [...pinArray];
    
    // Take the last entered character if replacing
    const lastChar = val.substring(val.length - 1);
    newPin[index] = lastChar;

    const fullPin = newPin.join('');
    onChange(fullPin);

    // Auto move focus to next input
    if (lastChar && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!pinArray[index] && index > 0) {
        // If current input is empty, focus and clear previous
        const newPin = [...pinArray];
        newPin[index - 1] = '';
        onChange(newPin.join(''));
        inputRefs.current[index - 1]?.focus();
      } else {
        const newPin = [...pinArray];
        newPin[index] = '';
        onChange(newPin.join(''));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, length);
    if (pastedData) {
      onChange(pastedData);
      const nextFocusIndex = Math.min(pastedData.length, length - 1);
      inputRefs.current[nextFocusIndex]?.focus();
    }
  };

  const handleKeypadClick = (digit) => {
    if (disabled) return;
    if (digit === 'clear') {
      onChange('');
      inputRefs.current[0]?.focus();
      return;
    }
    if (digit === 'backspace') {
      if (value.length > 0) {
        const newPin = value.slice(0, -1);
        onChange(newPin);
        inputRefs.current[Math.max(0, newPin.length - 1)]?.focus();
      }
      return;
    }
    if (value.length < length) {
      const newPin = value + digit;
      onChange(newPin);
      const nextIndex = Math.min(newPin.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center justify-between">
        {label && <label className="text-sm font-medium text-text">{label}</label>}
        <button
          type="button"
          onClick={() => setShowPin(!showPin)}
          className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1 font-medium cursor-pointer"
          tabIndex={-1}
        >
          {showPin ? (
            <>
              <EyeOff className="w-3.5 h-3.5" /> Sembunyikan
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" /> Tampilkan
            </>
          )}
        </button>
      </div>

      {/* 4 Box PIN Input */}
      <div className="flex items-center justify-center gap-3 my-1" onPaste={handlePaste}>
        {Array.from({ length }).map((_, index) => {
          const isFilled = Boolean(pinArray[index]);
          return (
            <div key={index} className="relative">
              <input
                ref={(el) => (inputRefs.current[index] = el)}
                type={showPin ? 'text' : 'password'}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={pinArray[index] || ''}
                disabled={disabled}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={`w-14 h-16 sm:w-16 sm:h-18 text-center text-2xl font-bold rounded-2xl border transition-all duration-200 focus:outline-none focus:ring-4 select-none ${
                  error
                    ? 'border-danger bg-danger-bg text-danger focus:border-danger focus:ring-danger-bg'
                    : isFilled
                    ? 'border-primary bg-primary-light text-primary shadow-sm'
                    : 'border-border bg-card text-text focus:border-primary focus:ring-primary-light'
                }`}
              />
              {!showPin && isFilled && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-3xl font-black text-primary">
                  •
                </div>
              )}
            </div>
          );
        })}
      </div>

      {error && <span className="text-xs text-danger font-medium text-center">{error}</span>}

      {/* Virtual Keypad for POS Touchscreens */}
      {!hideKeypad && (
        <div className="mt-3 grid grid-cols-3 gap-2 max-w-xs mx-auto w-full">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
          <button
            key={digit}
            type="button"
            disabled={disabled}
            onClick={() => handleKeypadClick(digit)}
            className="h-12 rounded-xl bg-main border border-border hover:bg-card active:bg-main font-bold text-lg text-text-secondary transition-colors cursor-pointer select-none shadow-sm"
          >
            {digit}
          </button>
        ))}
        <button
          type="button"
          disabled={disabled}
          onClick={() => handleKeypadClick('clear')}
          className="h-12 rounded-xl bg-main border border-border hover:bg-danger hover:text-white hover:border-danger text-danger font-medium text-xs transition-colors cursor-pointer select-none shadow-sm"
        >
          Reset
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => handleKeypadClick('0')}
          className="h-12 rounded-xl bg-main border border-border hover:bg-card font-bold text-lg text-text-secondary transition-colors cursor-pointer select-none shadow-sm"
        >
          0
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => handleKeypadClick('backspace')}
          className="h-12 rounded-xl bg-main border border-border hover:bg-card text-text-secondary font-bold text-sm transition-colors cursor-pointer flex items-center justify-center select-none shadow-sm"
        >
          ⌫
        </button>
      </div>
      )}
    </div>
  );
};
