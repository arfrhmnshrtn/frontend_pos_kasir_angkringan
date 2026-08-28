import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../contexts/ToastContext';
import { Card } from '../../components/common/Card';
import { PinInput } from '../../components/common/PinInput';
import { Button } from '../../components/common/Button';
import { KeyRound, ShieldCheck } from 'lucide-react';

export const ChangePinPage = () => {
  const { changePin } = useAuth();
  const toast = useToast();

  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (oldPin.length !== 4 || !/^\d{4}$/.test(oldPin)) {
      const err = 'PIN lama harus 4 digit angka';
      setErrorMsg(err);
      toast.error(err);
      return;
    }

    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      const err = 'PIN baru harus 4 digit angka';
      setErrorMsg(err);
      toast.error(err);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        currentPin: oldPin, // mapped for AuthContext backward compatibility, context handles oldPin natively if owner
        newPin,
        pin: newPin,
      };

      const res = await changePin(payload);

      if (res.success) {
        toast.success(res.message || 'PIN berhasil diubah');
        setOldPin('');
        setNewPin('');
      } else {
        setErrorMsg(res.message || 'Gagal mengubah PIN');
        toast.error(res.message || 'Gagal mengubah PIN');
      }
    } catch (err) {
      toast.error('Terjadi kesalahan saat mengubah PIN');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <KeyRound className="w-6 h-6 text-blue-600" /> Ubah PIN Akun
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Perbarui PIN 4-digit Anda secara berkala untuk menjaga keamanan akun POS Angkringan.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <PinInput
            label="PIN Lama"
            value={oldPin}
            onChange={setOldPin}
            autoFocus={true}
          />

          <hr className="border-slate-100 dark:border-slate-800" />

          <PinInput
            label="PIN Baru (4 Digit)"
            value={newPin}
            onChange={setNewPin}
            autoFocus={false}
            error={errorMsg}
          />

          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full font-bold shadow-md"
              isLoading={loading}
            >
              Simpan PIN Baru
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
