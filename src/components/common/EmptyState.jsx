import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'Tidak Ada Data',
  description = 'Belum ada data yang tersedia untuk ditampilkan.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-main border border-border flex items-center justify-center text-text-secondary mb-4 shadow-sm">
        <Icon className="w-8 h-8" />
      </div>
      <h4 className="text-base font-bold text-text mb-1">{title}</h4>
      <p className="text-sm text-text-secondary max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
