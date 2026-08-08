import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, ShieldCheck, UserCheck, Lock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../contexts/ToastContext';
import { userService } from '../../services/user.service';
import { PinInput } from '../../components/common/PinInput';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';

export const LoginPage = () => {
  const { login, isAuthenticated, role: authRole } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [role, setRole] = useState('OWNER'); // 'OWNER' or 'KASIR'
  const [kasirList, setKasirList] = useState([]);
  const [selectedKasirId, setSelectedKasirId] = useState('');
  const [pin, setPin] = useState('');
  const [loadingKasir, setLoadingKasir] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // If already authenticated, redirect automatically
  useEffect(() => {
    if (isAuthenticated) {
      const currentRole = (typeof authRole === 'string' ? authRole : authRole?.name || '').toUpperCase();
      if (currentRole === 'OWNER') {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/pos', { replace: true });
      }
    }
  }, [isAuthenticated, authRole, navigate]);

  // Fetch kasir list when KASIR role is selected
  useEffect(() => {
    if (role === 'KASIR') {
      fetchKasirUsers();
    } else {
      setSelectedKasirId('');
      setErrorMessage('');
    }
  }, [role]);

  const fetchKasirUsers = async () => {
    setLoadingKasir(true);
    setErrorMessage('');
    try {
      const res = await userService.getKasirUsers();
      const list = res?.data || res || [];
      setKasirList(Array.isArray(list) ? list : []);
      if (Array.isArray(list) && list.length > 0) {
        setSelectedKasirId(list[0].id || list[0]._id || '');
      }
    } catch (err) {
      toast.error('Gagal mengambil daftar kasir');
      setKasirList([]);
    } finally {
      setLoadingKasir(false);
    }
  };

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setRole(newRole);
    setPin('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Form validations
    if (role === 'KASIR' && !selectedKasirId) {
      const err = 'Silakan pilih kasir terlebih dahulu';
      setErrorMessage(err);
      toast.error(err);
      return;
    }

    if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      const err = 'PIN harus terdiri dari 4 digit angka';
      setErrorMessage(err);
      toast.error(err);
      return;
    }

    setLoadingSubmit(true);

    const payload = {
      role,
      pin,
      ...(role === 'KASIR' ? { userId: selectedKasirId } : {}),
    };

    const res = await login(payload);

    setLoadingSubmit(false);

    if (res.success) {
      toast.success(res.message || 'Login berhasil! Selamat datang.');
      const userRole = (typeof res.data.role === 'string' ? res.data.role : res.data.role?.name || role).toUpperCase();
      
      if (userRole === 'OWNER') {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/pos', { replace: true });
      }
    } else {
      const errMsg = res.message || 'Login gagal. PIN atau akun salah.';
      setErrorMessage(errMsg);
      toast.error(errMsg);
    }
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-slate-50 via-blue-50/40 to-slate-100 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 transition-all duration-300">
        
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30 mb-4 ring-4 ring-blue-50 dark:ring-blue-950/50">
            <Store className="w-9 h-9" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            POS Angkringan
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Silakan masuk untuk melanjutkan
          </p>
        </div>

        {/* Form Login */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Dropdown Masuk Sebagai */}
          <Select
            label="Masuk Sebagai"
            value={role}
            onChange={handleRoleChange}
            disabled={loadingSubmit}
            options={[
              { value: 'OWNER', label: '👑 Owner / Pemilik' },
              { value: 'KASIR', label: '👨‍🍳 Kasir' },
            ]}
          />

          {/* Dropdown Pilih Kasir (Only when role KASIR) */}
          {role === 'KASIR' && (
            <div>
              {loadingKasir ? (
                <div className="py-2 text-center text-xs text-slate-500 animate-pulse">
                  Memuat daftar kasir...
                </div>
              ) : kasirList.length === 0 ? (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl text-xs text-amber-700 dark:text-amber-300 text-center">
                  Tidak ada akun kasir aktif tersedia.
                </div>
              ) : (
                <Select
                  label="Pilih Kasir"
                  value={selectedKasirId}
                  onChange={(e) => setSelectedKasirId(e.target.value)}
                  disabled={loadingSubmit}
                  options={kasirList.map((k) => ({
                    value: k.id || k._id,
                    label: `${k.name} (${k.username || k.code || 'Kasir'})`,
                  }))}
                />
              )}
            </div>
          )}

          {/* 4-digit PIN Input */}
          <div className="pt-1">
            <PinInput
              label="PIN 4 Digit"
              length={4}
              value={pin}
              onChange={setPin}
              error={errorMessage}
              disabled={loadingSubmit}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full shadow-lg shadow-blue-600/30 font-bold"
            isLoading={loadingSubmit}
            disabled={loadingSubmit || (role === 'KASIR' && !selectedKasirId)}
          >
            Masuk ke Sistem
          </Button>

        </form>

        {/* Footer info */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-400">
          Sistem Kasir POS Angkringan Production Ready &copy; 2026
        </div>
      </div>
    </div>
  );
};
