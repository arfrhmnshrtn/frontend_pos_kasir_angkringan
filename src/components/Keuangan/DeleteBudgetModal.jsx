import React from 'react';
import { ConfirmDialog } from '../common/ConfirmDialog';

export const DeleteBudgetModal = ({
  isOpen,
  budgetName,
  isLoading,
  onConfirm,
  onCancel,
}) => {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onCancel}
      onConfirm={onConfirm}
      title="Hapus Alokasi Budget?"
      message={`Apakah Anda yakin ingin menghapus "${budgetName}"? Tindakan ini tidak dapat dibatalkan.`}
      confirmText={isLoading ? 'Menghapus...' : 'Hapus'}
      cancelText="Batal"
      variant="danger"
      isLoading={isLoading}
    />
  );
};
