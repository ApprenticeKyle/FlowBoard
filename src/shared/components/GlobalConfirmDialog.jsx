import { ConfirmDialog } from '@shared/ui';
import { useConfirmStore } from '@shared/store/confirmStore';

export const GlobalConfirmDialog = () => {
  const { isOpen, title, message, confirmText, cancelText, onConfirm, variant, closeConfirm } = useConfirmStore();

  const handleConfirm = () => {
    onConfirm?.();
    closeConfirm();
  };

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={closeConfirm}
      title={title}
      message={message}
      confirmText={confirmText}
      cancelText={cancelText}
      onConfirm={handleConfirm}
      variant={variant}
    />
  );
};

