import { Plus, Trash2 } from 'lucide-react';
import ChipList from '@/features/settings/ChipList';
import { Button, inputClass } from '@/shared/components/Form';

export const sizeKeys = ['tallas'];

export function validateSizes(form) {
  const tallas = form.tallas.map((g) => ({ ...g, nombre: g.nombre.trim() }));
  const errors = {};
  const all = tallas.flatMap((g) => g.valores);
  const repeated = all.find((s, i) => all.indexOf(s) !== i);
  if (tallas.length === 0) errors.tallas = 'Agrega al menos un grupo de tallas';
  else if (tallas.some((g) => !g.nombre)) errors.tallas = 'Cada grupo necesita un nombre';
  else if (tallas.some((g) => g.valores.length === 0)) errors.tallas = 'Cada grupo necesita al menos una talla';
  else if (repeated) errors.tallas = `La talla ${repeated} está en más de un grupo`;
  return { values: { tallas }, errors };
}

const parseSize = (text) => (text ? { value: text.toUpperCase() } : { error: 'Escribe una talla' });

export default function SizeSettings({ form, update, errors }) {
  const setGroup = (i, patch) => update({ tallas: form.tallas.map((g, j) => (j === i ? { ...g, ...patch } : g)) });

  return (
    <div className="space-y-4">
      <p className="text-xs text-brand-600">
        Las tallas se muestran en este orden al crear productos, en el punto de venta y en el stock. Quitar una talla
        no borra el stock que ya tengan los productos.
      </p>
      {form.tallas.map((g, i) => (
        <div key={i} className="rounded-xl border border-brand-150 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <input
              value={g.nombre}
              onChange={(e) => setGroup(i, { nombre: e.target.value })}
              placeholder="Nombre del grupo"
              aria-label="Nombre del grupo"
              className={`${inputClass} max-w-60 font-semibold`}
            />
            <button
              type="button"
              onClick={() => update({ tallas: form.tallas.filter((_, j) => j !== i) })}
              className="ml-auto p-2 rounded-lg text-subtle hover:text-danger hover:bg-danger-soft"
              aria-label={`Eliminar grupo ${g.nombre}`}
            >
              <Trash2 size={16} />
            </button>
          </div>
          <ChipList
            values={g.valores}
            onChange={(valores) => setGroup(i, { valores })}
            parse={parseSize}
            placeholder="Ej. XXXL"
          />
        </div>
      ))}
      {errors.tallas && <p className="text-xs text-danger">{errors.tallas}</p>}
      <Button variant="secondary" onClick={() => update({ tallas: [...form.tallas, { nombre: '', valores: [] }] })}>
        <Plus size={16} /> Agregar grupo
      </Button>
    </div>
  );
}
