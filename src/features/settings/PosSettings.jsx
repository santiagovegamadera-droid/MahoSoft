import ChipList from '@/features/settings/ChipList';
import { Field } from '@/shared/components/Form';

export const posKeys = ['descuentos', 'bancos'];

export function validatePos(form) {
  const values = { ...form, descuentos: [...form.descuentos].sort((a, b) => a - b) };
  const errors = {};
  if (values.bancos.length === 0) errors.bancos = 'Agrega al menos un banco o billetera';
  return { values, errors };
}

const parseDiscount = (text) => {
  const n = Number(text);
  if (text === '' || !Number.isInteger(n) || n < 0 || n > 100)
    return { error: 'Ingresa un número entero entre 0 y 100' };
  return { value: n };
};
const parseBank = (text) => (text ? { value: text } : { error: 'Escribe un nombre' });

export default function PosSettings({ form, update, errors }) {
  return (
    <div className="space-y-5">
      <Field label="Descuentos (%)" group>
        <ChipList
          values={form.descuentos}
          onChange={(descuentos) => update({ descuentos })}
          parse={parseDiscount}
          format={(v) => `${v}%`}
          placeholder="Ej. 25"
        />
      </Field>
      <Field label="Bancos y billeteras para transferencias" error={errors.bancos} group>
        <ChipList
          values={form.bancos}
          onChange={(bancos) => update({ bancos })}
          parse={parseBank}
          placeholder="Ej. Banco Caja Social"
        />
      </Field>
    </div>
  );
}
