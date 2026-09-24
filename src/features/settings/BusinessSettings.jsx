import { Field, inputClass } from '@/shared/components/Form';

export const businessKeys = [
  'nombre',
  'nit',
  'direccion',
  'ciudad',
  'telefono',
  'correo',
  'instagram',
  'mensajeRecibo',
];

export function validateBusiness(form) {
  const values = { ...form, nombre: form.nombre.trim() };
  const errors = {};
  if (!values.nombre) errors.nombre = 'El nombre es obligatorio';
  return { values, errors };
}

export default function BusinessSettings({ form, update, errors }) {
  const set = (k) => (e) => update({ [k]: e.target.value });
  return (
    <div className="grid grid-cols-2 gap-4">
      <Field label="Nombre del negocio" error={errors.nombre}>
        <input value={form.nombre} onChange={set('nombre')} className={inputClass} />
      </Field>
      <Field label="NIT">
        <input value={form.nit} onChange={set('nit')} placeholder="900.123.456-7" className={inputClass} />
      </Field>
      <Field label="Dirección">
        <input value={form.direccion} onChange={set('direccion')} className={inputClass} />
      </Field>
      <Field label="Ciudad">
        <input value={form.ciudad} onChange={set('ciudad')} className={inputClass} />
      </Field>
      <Field label="Teléfono">
        <input value={form.telefono} onChange={set('telefono')} className={inputClass} />
      </Field>
      <Field label="Correo">
        <input type="email" value={form.correo} onChange={set('correo')} className={inputClass} />
      </Field>
      <Field label="Instagram">
        <input value={form.instagram} onChange={set('instagram')} placeholder="@mahoboutique" className={inputClass} />
      </Field>
      <Field label="Mensaje al pie del recibo">
        <input value={form.mensajeRecibo} onChange={set('mensajeRecibo')} className={inputClass} />
      </Field>
    </div>
  );
}
