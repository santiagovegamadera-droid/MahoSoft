import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
const focusables = (el) => [...el.querySelectorAll(FOCUSABLE)];

export default function Modal({ title, onClose, children, footer, size = 'md' }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  // Read on first render: by the time effects run, an autoFocus field has already taken focus
  const [opener] = useState(() => document.activeElement);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Move focus into the dialog (unless a field already has autoFocus) and give it back on close
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog.contains(document.activeElement)) {
      const first = focusables(dialog).find((el) => el !== closeRef.current);
      (first ?? closeRef.current).focus();
    }
    return () => opener?.focus?.();
  }, [opener]);

  // Keep Tab / Shift+Tab cycling inside the dialog
  function trapFocus(e) {
    if (e.key !== 'Tab') return;
    e.stopPropagation(); // a dialog opened inside another handles its own Tab
    const items = focusables(dialogRef.current);
    if (items.length === 0) return;
    const first = items[0];
    const last = items.at(-1);
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-900/40" onMouseDown={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        onKeyDown={trapFocus}
        onMouseDown={(e) => e.stopPropagation()}
        className={`w-full ${size === 'lg' ? 'max-w-2xl' : 'max-w-md'} max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-xl outline-none`}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-brand-50">
          <h2 className="text-lg font-display text-brand-800">{title}</h2>
          <button
            ref={closeRef}
            onClick={onClose}
            className="p-1 rounded-lg text-subtle hover:bg-brand-50 hover:text-brand-800"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-5 py-4 overflow-y-auto">{children}</div>
        {footer && <div className="flex justify-end gap-2 px-5 py-3 border-t border-brand-50">{footer}</div>}
      </div>
    </div>
  );
}
