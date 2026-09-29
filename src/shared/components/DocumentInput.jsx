import { inputClass } from '@/shared/components/Form';

// ID type select + number input; `types` comes from Settings (tiposDocumento)
export default function DocumentInput({ types, tipo, numero, onTipoChange, onNumeroChange, autoFocus }) {
  return (
    <div className="flex gap-2">
      <select
        value={tipo}
        onChange={(e) => onTipoChange(e.target.value)}
        className={`${inputClass} w-auto! px-3!`}
        aria-label="Tipo de documento"
      >
        {types.map((t) => (
          <option key={t}>{t}</option>
        ))}
        {/* A type removed from Settings stays selectable for records that already use it */}
        {tipo && !types.includes(tipo) && <option>{tipo}</option>}
      </select>
      <input
        value={numero}
        onChange={(e) => onNumeroChange(e.target.value)}
        className={`${inputClass} min-w-0`}
        inputMode="numeric"
        aria-label="Número de documento"
        autoFocus={autoFocus}
      />
    </div>
  );
}

// Supplier and customer forms start on this type when the record has none yet
export const defaultDocType = (types, preferred) => (types.includes(preferred) ? preferred : (types[0] ?? ''));

export const formatDocument = (tipo, numero) => [tipo, numero].filter(Boolean).join(' ');
