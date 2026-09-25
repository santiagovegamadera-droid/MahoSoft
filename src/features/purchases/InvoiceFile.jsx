import { useRef, useState } from 'react';
import { FileText, Paperclip, X } from 'lucide-react';
import { formatSize } from '@/shared/lib/fileStore';

export const MAX_INVOICE_FILE = 10 * 1024 * 1024;
const isAccepted = (f) => f.type === 'application/pdf' || f.type.startsWith('image/');

/** Drop zone for the supplier's invoice (the PDF from the e-invoice email, or a photo) */
export default function InvoiceFile({ file, onChange, onError }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  function pick(f) {
    if (!f) return;
    if (!isAccepted(f)) return onError('El documento debe ser un PDF o una imagen');
    if (f.size > MAX_INVOICE_FILE) return onError('El documento no puede pesar más de 10 MB');
    onError('');
    onChange(f);
  }

  return (
    <>
      {file ? (
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl border border-brand-150 bg-brand-25">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-brand-100 text-brand-600">
            <FileText size={17} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate text-brand-800">{file.name}</p>
            <p className="text-xs text-subtle">{formatSize(file.size)}</p>
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="p-1.5 rounded-md text-subtle hover:text-danger hover:bg-danger-soft"
            aria-label="Quitar documento"
          >
            <X size={15} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            pick(e.dataTransfer.files[0]);
          }}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed text-sm font-medium transition-colors ${
            dragging
              ? 'border-brand-600 bg-brand-50 text-brand-800'
              : 'border-brand-200 text-brand-600 hover:border-brand-400 hover:bg-brand-25'
          }`}
        >
          <Paperclip size={15} />
          Adjuntar PDF o foto de la factura
          <span className="font-normal text-subtle">· o arrástralo aquí</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,image/*"
        onChange={(e) => {
          pick(e.target.files[0]);
          e.target.value = '';
        }}
        className="hidden"
      />
    </>
  );
}
