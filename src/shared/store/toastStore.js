import { create } from 'zustand';

export const useToastStore = create((set) => ({
  toast: {
    visible: false,
    message: '',
    type: 'success',
    duration: 3000,
  },

  showToast: (message, type = 'success', duration = 3000) => {
    set({
      toast: {
        visible: true,
        message,
        type,
        duration,
      },
    });
  },

  hideToast: () => {
    set((state) => ({
      toast: {
        ...state.toast,
        visible: false,
      },
    }));
  },

  showSuccess: (message, duration) => {
    set({
      toast: {
        visible: true,
        message,
        type: 'success',
        duration: duration || 3000,
      },
    });
  },

  showError: (message, duration) => {
    set({
      toast: {
        visible: true,
        message,
        type: 'error',
        duration: duration || 3000,
      },
    });
  },

  showWarning: (message, duration) => {
    set({
      toast: {
        visible: true,
        message,
        type: 'warning',
        duration: duration || 3000,
      },
    });
  },

  showInfo: (message, duration) => {
    set({
      toast: {
        visible: true,
        message,
        type: 'info',
        duration: duration || 3000,
      },
    });
  },
}));

