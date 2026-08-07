import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle, Info, Trash2 } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Konfirmasi Tindakan',
  message = 'Apakah Anda yakin ingin melanjutkan?',
  confirmText = 'Ya, Lanjutkan',
  cancelText = 'Batal',
  variant = 'danger',
  isLoading = false,
}) => {
  const iconVariants = {
    danger: <Trash2 className="w-6 h-6 text-danger" />,
    warning: <AlertTriangle className="w-6 h-6 text-warning" />,
    info: <Info className="w-6 h-6 text-info" />,
  };

  const bgVariants = {
    danger: 'bg-danger-bg',
    warning: 'bg-warning-bg',
    info: 'bg-info-bg',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton={false} maxWidth="max-w-md">
      <div className="flex flex-col items-center text-center p-2">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${bgVariants[variant] || bgVariants.danger}`}>
          {iconVariants[variant] || iconVariants.danger}
        </div>
        <h3 className="text-lg font-bold text-text mb-2">{title}</h3>
        <p className="text-sm text-text-secondary mb-6 leading-relaxed">{message}</p>
        <div className="flex items-center justify-center gap-3 w-full">
          <Button variant="secondary" onClick={onClose} disabled={isLoading} className="w-1/2">
            {cancelText}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
            isLoading={isLoading}
            className="w-1/2"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
