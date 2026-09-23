import { Pencil, Trash2 } from 'lucide-react';

export const inputClass =
  'w-full px-4 py-2.5 rounded-xl border text-sm outline-none bg-white border-brand-200 text-brand-800 focus:border-brand-600 focus:ring-3 focus:ring-brand-600/15';

// Use group for fields holding several controls (checkbox lists), which can't live inside a <label>
export function Field({ label, error, children, className = '', group = false }) {
  const Tag = group ? 'div' : 'label';
  return (
    <Tag className={`block ${className}`}>
      <span className="block text-xs font-semibold mb-1.5 uppercase tracking-wide text-brand-800">{label}</span>
      {children}
      {error && <span className="block mt-1 text-xs text-danger">{error}</span>}
    </Tag>
  );
}

export function CheckboxList({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const checked = value.includes(o);
        return (
          <button
            key={o}
            type="button"
            onClick={() => onChange(checked ? value.filter((v) => v !== o) : [...value, o])}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              checked ? 'bg-brand-600 border-brand-600 text-white' : 'bg-white border-brand-200 text-brand-600'
            }`}
            aria-pressed={checked}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

const buttonVariants = {
  primary: 'bg-brand-600 text-white hover:bg-brand-800',
  secondary: 'border border-brand-200 text-brand-600 hover:bg-brand-50',
  soft: 'bg-brand-200 text-brand-800 hover:bg-brand-400',
  danger: 'bg-danger text-white hover:brightness-110',
};

export function Button({ variant = 'primary', className = '', ...props }) {
  return (
    <button
      type="button"
      className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 ${buttonVariants[variant]} ${className}`}
      {...props}
    />
  );
}

/** Activo/Inactivo switch; works inside clickable rows without triggering them */
export function StatusToggle({ value, onChange, label }) {
  const active = value === 'Activo';
  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      aria-label={label ? `${label} activo` : 'Activo'}
      onClick={(e) => {
        e.stopPropagation();
        onChange(active ? 'Inactivo' : 'Activo');
      }}
      title={value}
      className="inline-flex items-center"
    >
      <span
        className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors ${
          active ? 'bg-success' : 'bg-brand-200'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow transition-transform ${
            active ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </span>
    </button>
  );
}

/** Edit + delete icon buttons for a table row or card */
export function RowActions({ onEdit, onDelete, label }) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        className="p-1.5 rounded-lg text-brand-600 hover:bg-brand-50 hover:text-brand-800"
        aria-label={`Editar ${label}`}
        title="Editar"
      >
        <Pencil size={15} />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="p-1.5 rounded-lg text-brand-600 hover:bg-danger-soft hover:text-danger"
        aria-label={`Eliminar ${label}`}
        title="Eliminar"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}
