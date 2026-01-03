import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel }) => {
    const { t } = useTranslation();

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Background overlay */}
                    <motion.div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onCancel}
                    />

                    {/* Dialog */}
                    <motion.div
                        className="relative glass-card rounded-2xl p-6 max-w-md w-full mx-4 border border-white/10"
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                                <Trash2 className="w-8 h-8 text-red-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{title || t('confirmDialog.title')}</h3>
                            <p className="text-slate-400">{message || t('confirmDialog.message')}</p>
                        </div>

                        <div className="flex gap-4">
                            <button
                                className="flex-1 px-4 py-2.5 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-colors"
                                onClick={onCancel}
                            >
                                {t('confirmDialog.cancel')}
                            </button>
                            <button
                                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors"
                                onClick={onConfirm}
                            >
                                {t('confirmDialog.confirm')}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmDialog;
