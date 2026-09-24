import ChipList from '@/features/settings/ChipList';
import { Field } from '@/shared/components/Form';

export const documentKeys = ['tiposDocumento'];

export function validateDocuments(form) {
  const errors = {};
  if (form.tiposDocumento.length === 0) errors.tiposDocumento = 'Agrega al menos un tipo de documento';
  return { values: form, errors };
}

const parseType = (text) => (text ? { value: text } : { error: 'Escribe un tipo de documento' });

export default function DocumentSettings({ form, update, errors }) {
  return (
    <Field label="Tipos de documento" error={errors.tiposDocumento} group>
      <p className="mb-3 text-xs text-brand-600">
        Se ofrecen al registrar los datos del cliente. El primero es el que viene seleccionado.
      </p>
      <ChipList
        values={form.tiposDocumento}
        onChange={(tiposDocumento) => update({ tiposDocumento })}
        parse={parseType}
        placeholder="Ej. PEP"
      />
    </Field>
  );
}
