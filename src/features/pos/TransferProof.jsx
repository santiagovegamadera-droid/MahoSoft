import { useEffect, useRef, useState } from 'react';
import { FileText, Paperclip, X } from 'lucide-react';

export const BANKS = ['Nequi', 'Daviplata', 'Bancolombia', 'Davivienda', 'Banco de Bogotá', 'BBVA', 'Otro'];
export const EMPTY_PROOF = { file: null, banco: '', referencia: '' };

const kb = (n) => (n < 1024 * 1024 ? `${Math.round(n / 1024)} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`);

// Visual only: the file stays in the browser until the backend can store it
export default function TransferProof({ value, onChange }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const { file } = value;

  useEffect(() => {
    if (!file?.type.startsWith('image/')) return setPreview(null);
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const pick = (f) => f && onChange({ ...value, file: f });
  const set = (k) => (e) => onChange({ ...value, [k]: e.target.value });
  const fieldClass =
    'min-w-0 px-2 py-1.5 rounded-md border text-[11px] outline-none bg-white border-brand-150 text-brand-800 placeholder:text-brand-400 focus:border-brand-600';

  return (
    <div className="p-2.5 rounded-xl border space-y-2 border-brand-150 bg-white">
      <p className="text-[11px] font-semibold text-brand-600">Comprobante de transferencia</p>

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
            <p className="text-[11px] font-semibold truncate text-brand-800">{file.name}</p>
            <p className="text-[10px] text-brand-400">{kb(file.size)}</p>
          </div>
          <button
            onClick={() => onChange({ ...value, file: null })}
            className="p-1 rounded-md text-brand-400 hover:text-danger hover:bg-danger-soft"
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
          className={`w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg border border-dashed text-[11px] font-semibold transition-colors ${
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
        accept="image/*,application/pdf"
        onChange={(e) => {
          pick(e.target.files[0]);
          e.target.value = '';
        }}
        className="hidden"
      />

      <div className="grid grid-cols-2 gap-1.5">
        <select value={value.banco} onChange={set('banco')} className={fieldClass} aria-label="Banco">
          <option value="">Banco / billetera</option>
          {BANKS.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
        <input
          value={value.referencia}
          onChange={set('referencia')}
          placeholder="N.º referencia"
          className={fieldClass}
          aria-label="Número de referencia"
        />
      </div>

      {!file && <p className="text-[10px] text-warning">Sin comprobante, la venta quedará pendiente de verificar</p>}
    </div>
  );
}
