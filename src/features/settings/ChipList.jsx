import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button, inputClass } from '@/shared/components/Form';

// Editable list of chips; `parse` turns the typed text into { value } or { error }
export default function ChipList({ values, onChange, parse, format = (v) => v, placeholder }) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  function add() {
    const result = parse(text.trim());
    if (result.error) return setError(result.error);
    if (values.includes(result.value)) return setError('Ya está en la lista');
    onChange([...values, result.value]);
    setText('');
    setError('');
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {values.map((v) => (
          <span
            key={v}
            className="flex items-center gap-1 pl-3 pr-1.5 py-1 rounded-lg text-xs font-semibold bg-brand-200 text-brand-800"
          >
            {format(v)}
            <button
              type="button"
              onClick={() => onChange(values.filter((x) => x !== v))}
              className="p-0.5 rounded text-brand-600 hover:text-danger hover:bg-danger-soft"
              aria-label={`Quitar ${format(v)}`}
            >
              <X size={12} />
            </button>
          </span>
        ))}
        {values.length === 0 && <span className="text-xs text-brand-400">Lista vacía</span>}
      </div>
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className={`${inputClass} max-w-60`}
        />
        <Button variant="soft" onClick={add} disabled={!text.trim()}>
          <Plus size={16} /> Agregar
        </Button>
      </div>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
