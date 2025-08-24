'use client';

import { useState, ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface ConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  loading?: boolean;
  variant?: 'destructive' | 'default';
  icon?: ReactNode;
}

export function ConfirmationModal({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  loading = false,
  variant = 'default',
  icon
}: ConfirmationModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const defaultIcon = variant === 'destructive' ? (
    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 mx-auto">
      <Trash2 className="w-6 h-6 text-red-600" />
    </div>
  ) : (
    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4 mx-auto">
      <AlertTriangle className="w-6 h-6 text-blue-600" />
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          {icon || defaultIcon}
          <DialogTitle className="text-lg font-readex">{title}</DialogTitle>
          <DialogDescription className="text-center font-readex">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="font-readex"
          >
            {cancelText}
          </Button>
          <Button
            variant={variant}
            onClick={handleConfirm}
            disabled={loading}
            className="font-readex"
          >
            {loading ? 'Processing...' : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Hook for managing confirmation modal state
export function useConfirmationModal() {
  const [modalState, setModalState] = useState<{
    open: boolean;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    loading?: boolean;
    variant?: 'destructive' | 'default';
    icon?: ReactNode;
  }>({
    open: false,
    title: '',
    description: '',
    onConfirm: () => {},
  });

  const showConfirmation = (config: Omit<typeof modalState, 'open'>) => {
    setModalState({ ...config, open: true });
  };

  const hideConfirmation = () => {
    setModalState(prev => ({ ...prev, open: false }));
  };

  const setLoading = (loading: boolean) => {
    setModalState(prev => ({ ...prev, loading }));
  };

  return {
    modalState,
    showConfirmation,
    hideConfirmation,
    setLoading,
  };
}
