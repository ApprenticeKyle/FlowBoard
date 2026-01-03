import { Toast } from '@shared/ui';
import { useToastStore } from '@shared/store/toastStore';

export const GlobalToast = () => {
  const { toast, hideToast } = useToastStore();

  return (
    <Toast
      isVisible={toast.visible}
      message={toast.message}
      type={toast.type}
      onClose={hideToast}
      duration={toast.duration}
    />
  );
};

