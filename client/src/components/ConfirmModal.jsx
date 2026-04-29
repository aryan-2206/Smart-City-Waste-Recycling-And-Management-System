import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Loader2 } from 'lucide-react';

/**
 * Reusable Confirm Modal with blur backdrop, animated entry, keyboard Escape support.
 * Props:
 *   isOpen      - boolean
 *   onClose     - fn
 *   onConfirm   - fn
 *   title       - string
 *   message     - string
 *   confirmText - string (default 'Confirm')
 *   cancelText  - string (default 'Cancel')
 *   variant     - 'danger' | 'warning' | 'info' (default 'danger')
 *   loading     - boolean
 */
const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
}) => {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const variantConfig = {
    danger:  { icon: '🗑️', accent: 'bg-red-500 hover:bg-red-600 shadow-red-500/25',   ring: 'ring-red-500/20',   iconBg: 'bg-red-100 dark:bg-red-950/30', iconColor: 'text-red-500' },
    warning: { icon: '⚠️', accent: 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/25', ring: 'ring-amber-500/20', iconBg: 'bg-amber-100 dark:bg-amber-950/30', iconColor: 'text-amber-500' },
    info:    { icon: 'ℹ️', accent: 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/25',  ring: 'ring-blue-500/20',  iconBg: 'bg-blue-100 dark:bg-blue-950/30', iconColor: 'text-blue-500' },
  };
  const cfg = variantConfig[variant] || variantConfig.danger;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white dark:bg-[#0d1a2e] rounded-[1.5rem] shadow-2xl border border-slate-100 dark:border-white/10 w-full max-w-sm overflow-hidden">
              {/* Top bar accent */}
              <div className={`h-1 w-full ${variant === 'danger' ? 'bg-red-500' : variant === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`} />

              <div className="p-6">
                {/* Icon + Close */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl ${cfg.iconBg} flex items-center justify-center text-2xl`}>
                    {cfg.icon}
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Title + Message */}
                <h3 className="text-[16px] font-black text-slate-800 dark:text-white mb-2 tracking-tight">{title}</h3>
                <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed">{message}</p>

                {/* Buttons */}
                <div className="flex items-center gap-3 mt-6">
                  <button
                    onClick={onClose}
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-[13px] font-black hover:bg-slate-50 dark:hover:bg-white/5 transition-all disabled:opacity-50"
                  >
                    {cancelText}
                  </button>
                  <button
                    onClick={onConfirm}
                    disabled={loading}
                    className={`flex-1 px-4 py-2.5 rounded-xl text-white text-[13px] font-black shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 ${cfg.accent}`}
                  >
                    {loading && <Loader2 size={14} className="animate-spin" />}
                    {confirmText}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
