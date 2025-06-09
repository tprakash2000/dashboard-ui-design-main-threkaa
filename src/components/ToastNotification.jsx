import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';

const ToastNotification = ({ 
    message, 
    type = 'success', 
    onClose,
    autoClose = true,
    duration = 3000 
}) => {
    useEffect(() => {
        if (autoClose) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [autoClose, duration, onClose]);

    const icons = {
        success: <CheckCircle2 className="text-green-500" size={20} />,
        error: <XCircle className="text-red-500" size={20} />
    };

    const backgrounds = {
        success: 'bg-green-50 dark:bg-green-900/20',
        error: 'bg-red-50 dark:bg-red-900/20'
    };

    const textColors = {
        success: 'text-green-800 dark:text-green-200',
        error: 'text-red-800 dark:text-red-200'
    };

    return (
        <div className={`fixed right-4 top-4 z-50 flex items-center gap-x-3 rounded-lg ${backgrounds[type]} p-4 pr-12 shadow-lg`}>
            {icons[type]}
            <p className={`text-sm font-medium ${textColors[type]}`}>{message}</p>
            <button
                onClick={onClose}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400"
            >
                <X size={16} />
            </button>
        </div>
    );
};

export default ToastNotification; 