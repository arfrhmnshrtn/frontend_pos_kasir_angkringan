import React, { useState, useEffect } from 'react';
import { User, Lock, Delete, Store } from 'lucide-react';

export default function LoginView({ onLoginSuccess }) {
  const [role, setRole] = useState('kasir'); // 'owner' or 'kasir'
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const roles = [
    { id: 'owner', label: 'Owner (Pemilik)' },
    { id: 'kasir', label: 'Kasir (Staff)' }
  ];

  const handleKeyPress = (num) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
      setError('');
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setError('');
  };

  const handleLogin = () => {
    if (pin.length !== 4) {
      setError('PIN harus 4 digit!');
      return;
    }

    // Default PIN: Owner = 1234, Kasir = 0000
    if (role === 'owner') {
       if (pin === '1234') {
         if(onLoginSuccess) onLoginSuccess('owner');
       } else {
         setError('PIN Owner salah!');
         setPin('');
       }
    } else if (role === 'kasir') {
       if (pin === '0000') {
         if(onLoginSuccess) onLoginSuccess('kasir');
       } else {
         setError('PIN Kasir salah!');
         setPin('');
       }
    }
  };

  useEffect(() => {
    if (pin.length === 4) {
      // Auto-submit after a slight delay for better UX
      const timer = setTimeout(() => {
        handleLogin();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [pin, role]);

  return (
    <div className="min-h-screen w-full bg-main flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-15%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-15%] right-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[120px]"></div>

      <div className="bg-card w-full max-w-sm rounded-[2rem] shadow-sm border border-border p-8 relative z-10 animate-in fade-in duration-500 zoom-in-95">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
            <Store size={32} />
          </div>
          <h1 className="text-2xl font-black text-text tracking-tight">ANGKRINGAN 88</h1>
          <p className="text-sm text-text-secondary mt-1">Silakan masuk untuk melanjutkan</p>
        </div>

        {/* Role Selection Dropdown */}
        <div className="mb-8">
          <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">
            Masuk Sebagai
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setPin('');
                setError('');
              }}
              className="w-full pl-12 pr-4 py-3.5 bg-main border border-border rounded-xl text-text font-bold appearance-none focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all cursor-pointer"
            >
              {roles.map(r => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        {/* PIN Input Field */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-3 text-center">
            Masukkan PIN 4 Digit
          </label>
          <div className="relative">
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pin}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, '');
                setPin(val);
                setError('');
              }}
              className="w-full bg-main border-2 border-border focus:border-primary rounded-xl py-4 text-center text-3xl tracking-[1em] font-black text-text outline-none transition-all shadow-inner"
              placeholder="••••"
              autoFocus
            />
          </div>
          
          <div className="h-4 mt-3 text-center">
             {error && <span className="text-danger text-xs font-bold flex items-center justify-center gap-1"><Lock size={12}/>{error}</span>}
          </div>
        </div>

      </div>
    </div>
  );
}
