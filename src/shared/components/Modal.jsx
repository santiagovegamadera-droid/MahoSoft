import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ title, onClose, children, footer, size = 'md' }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-900/40" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(e) => e.stopPropagation()}
        className={`w-full ${size === 'lg' ? 'max-w-2xl' : 'max-w-md'} max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-xl`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-50">
          <h2 className="text-lg font-display text-brand-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-brand-400 hover:bg-brand-50 hover:text-brand-800"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5 overflow-y-auto">{children}</div>
        {footer && <div className="flex justify-end gap-2 px-6 py-4 border-t border-brand-50">{footer}</div>}
      </div>
    </div>
  );
}
