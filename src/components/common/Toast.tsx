import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3200);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      id="app-toast-notification"
      role="status"
      aria-live="polite"
      className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#1B3024] text-[#FEFDF3] border border-[#DFFFAE]/30 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200 max-w-md w-[90%]"
    >
      <CheckCircle2 className="w-5 h-5 text-[#DFFFAE] flex-shrink-0" />
      <span className="text-xs sm:text-sm font-medium flex-1 truncate">{message}</span>
      <button
        type="button"
        id="btn-close-toast"
        onClick={onClose}
        className="p-1 rounded-md text-[#FEFDF3]/70 hover:text-[#FEFDF3] hover:bg-[#FEFDF3]/10 transition-colors cursor-pointer"
        aria-label="Fechar notificação"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
