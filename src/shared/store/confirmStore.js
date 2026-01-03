import { create } from 'zustand';

export const useConfirmStore = create((set) => ({
  isOpen: false,
  title: '',
  message: '',
  confirmText: '确认',
  cancelText: '取消',
  onConfirm: null,
  variant: 'danger',

  openConfirm: (config) => {
    set({
      isOpen: true,
      title: config.title || '',
      message: config.message || '',
      confirmText: config.confirmText || '确认',
      cancelText: config.cancelText || '取消',
      onConfirm: config.onConfirm || null,
      variant: config.variant || 'danger',
    });
  },

  closeConfirm: () => {
    set({
      isOpen: false,
      title: '',
      message: '',
      confirmText: '确认',
      cancelText: '取消',
      onConfirm: null,
      variant: 'danger',
    });
  },
}));

