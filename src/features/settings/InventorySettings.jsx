import { Field, inputClass } from '@/shared/components/Form';

export const inventoryKeys = ['stockBajoProducto', 'stockBajoTalla'];

export function validateInventory(form) {
  const values = { stockBajoProducto: Number(form.stockBajoProducto), stockBajoTalla: Number(form.stockBajoTalla) };
  const errors = {};
  for (const k of inventoryKeys) {
    if (form[k] === '' || !Number.isInteger(values[k]) || values[k] < 0)
      errors[k] = 'Ingresa un número entero mayor o igual a 0';
  }
  return { values, errors };
}

export default function InventorySettings({ form, update, errors }) {
  const set = (k) => (e) => update({ [k]: e.target.value });
  return (
    <div className="grid grid-cols-2 gap-4">
      <Field label="Stock bajo por producto (unidades)" error={errors.stockBajoProducto}>
        <input
          type="number"
          min={0}
          value={form.stockBajoProducto}
          onChange={set('stockBajoProducto')}
          className={`${inputClass} font-mono`}
        />
        <span className="block mt-1 text-xs text-brand-400">Se usa en Productos y en el Punto de Venta.</span>
      </Field>
      <Field label="Stock bajo por talla (unidades)" error={errors.stockBajoTalla}>
        <input
          type="number"
          min={0}
          value={form.stockBajoTalla}
          onChange={set('stockBajoTalla')}
          className={`${inputClass} font-mono`}
        />
        <span className="block mt-1 text-xs text-brand-400">Se usa en Productos → Stock actual.</span>
      </Field>
    </div>
  );
}
