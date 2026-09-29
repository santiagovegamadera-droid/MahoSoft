import { useEffect, useRef, useState } from 'react';
import { FileText, Paperclip, X } from 'lucide-react';
import useSettings from '@/features/settings/store';
import { formatSize } from '@/shared/lib/files';

export const EMPTY_PROOF = { file: null, banco: '', referencia: '' };

// Same types and size the server accepts (it checks the content too)
const ACCEPTED = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 10 * 1024 * 1024;

// The receipt is saved on the server together with the sale
export default function TransferProof({ value, onChange }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const { file } = value;
  const { bancos } = useSettings();

  useEffect(() => {
    if (!file?.type.startsWith('image/')) return setPreview(null);
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function pick(f) {
    if (!f) return;
    if (!ACCEPTED.includes(f.type)) return setError('Debe ser un PDF o una imagen JPG, PNG o WebP');
    if (f.size > MAX_SIZE) return setError('No puede pesar más de 10 MB');
    setError('');
    onChange({ ...value, file: f });
  }
  const set = (k) => (e) => onChange({ ...value, [k]: e.target.value });
  const fieldClass =
    'min-w-0 px-2 py-1.5 rounded-md border text-xs outline-none bg-white border-brand-150 text-brand-800 placeholder:text-subtle focus:border-brand-600';

  return (
    <div className="p-2.5 rounded-xl border space-y-2 border-brand-150 bg-white">
      <p className="text-xs font-semibold text-brand-600">Comprobante de transferencia</p>

      {file ? (
        <div className="flex items-center gap-2 p-1.5 rounded-lg border border-brand-100 bg-brand-25">
          {preview ? (
            <img src={preview} alt="Comprobante" className="w-9 h-9 rounded-md object-cover shrink-0" />
          ) : (
            <div className="w-9 h-9 rounded-md flex items-center justify-center shrink-0 bg-brand-100 text-brand-600">
              <FileText size={16} />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold truncate text-brand-800">{file.name}</p>
            <p className="text-xs text-subtle">{formatSize(file.size)}</p>
          </div>
          <button
            onClick={() => onChange({ ...value, file: null })}
            className="p-1 rounded-md text-subtle hover:text-danger hover:bg-danger-soft"
            aria-label="Quitar comprobante"
          >
            <X size={13} />
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
          className={`w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg border border-dashed text-xs font-semibold transition-colors ${
            dragging
              ? 'border-brand-600 bg-brand-50 text-brand-800'
              : 'border-brand-200 text-brand-600 hover:border-brand-400 hover:bg-brand-25'
          }`}
        >
          <Paperclip size={13} />
          Adjuntar foto o PDF
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(',')}
        onChange={(e) => {
          pick(e.target.files[0]);
          e.target.value = '';
        }}
        className="hidden"
      />

      <div className="grid grid-cols-[3fr_2fr] gap-1.5">
        <select value={value.banco} onChange={set('banco')} className={fieldClass} aria-label="Banco">
          <option value="">Banco / billetera</option>
          {bancos.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
        <input
          value={value.referencia}
          onChange={set('referencia')}
          placeholder="Referencia"
          className={fieldClass}
          aria-label="Número de referencia"
        />
      </div>

      {error && <p className="text-xs text-danger">{error}</p>}
      {!file && <p className="text-xs text-warning">Sin comprobante, la venta quedará pendiente de verificar</p>}
    </div>
  );
}
