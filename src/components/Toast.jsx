import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AlertCircle } from 'lucide-react';

const Toast = ({ isVisible, message, type = 'success', duration = 3000, onClose }) => {
    const getIcon = () => {
        switch (type) {
            case 'success':
                return <Check className="w-5 h-5 text-green-400" />;
            case 'error':
                return <X className="w-5 h-5 text-red-400" />;
            case 'warning':
                return <AlertCircle className="w-5 h-5 text-yellow-400" />;
            default:
                return <Check className="w-5 h-5 text-green-400" />;
        }
    };

    const getBackgroundColor = () => {
        switch (type) {
            case 'success':
                return 'rgba(16, 185, 129, 0.1)';
            case 'error':
                return 'rgba(239, 68, 68, 0.1)';
            case 'warning':
                return 'rgba(245, 158, 11, 0.1)';
            default:
                return 'rgba(16, 185, 129, 0.1)';
        }
    };

    const getBorderColor = () => {
        switch (type) {
            case 'success':
                return 'rgba(16, 185, 129, 0.3)';
            case 'error':
                return 'rgba(239, 68, 68, 0.3)';
            case 'warning':
                return 'rgba(245, 158, 11, 0.3)';
            default:
                return 'rgba(16, 185, 129, 0.3)';
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed top-8 right-8 z-50 max-w-sm w-full"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 100, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                >
                    <div
                        className="glass-card rounded-xl p-4 flex items-center gap-3 border"
                        style={{
                            backgroundColor: getBackgroundColor(),
                            borderColor: getBorderColor(),
                        }}
                    >
                        {getIcon()}
                        <p className="text-sm font-medium text-white flex-1">{message}</p>
                        <button
                            className="text-slate-400 hover:text-white transition-colors"
                            onClick={onClose}
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Toast;
