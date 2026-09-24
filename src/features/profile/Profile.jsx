import { useState } from 'react';
import { Check, Clock, Mail, ReceiptText, UserRound } from 'lucide-react';
import useUsers, { initials, useCurrentUser } from '@/features/users/store';
import useSales from '@/features/sales/store';
import saleTotals from '@/features/sales/saleTotals';
import useSettings from '@/features/settings/store';
import DocumentInput, { defaultDocType } from '@/shared/components/DocumentInput';
import { Button, Field, inputClass } from '@/shared/components/Form';
import { isEmail } from '@/features/pos/SendInvoice';

const fmt = (n) => `$${n.toLocaleString('es-CO')}`;
const profileKeys = ['name', 'email', 'telefono', 'tipoDocumento', 'documento'];

function Card({ icon: Icon, title, children, className = '' }) {
  return (
    <section className={`bg-white rounded-2xl border border-brand-150 ${className}`}>
      <div className="flex items-center gap-2 px-6 py-4 border-b border-brand-50">
        <Icon size={16} strokeWidth={1.75} className="text-brand-600" />
        <h2 className="text-sm font-semibold text-brand-800">{title}</h2>
      </div>
      <div className="px-6 py-5">{children}</div>
    </section>
  );
}

function PersonalInfo({ user }) {
  const { update } = useUsers();
  const { tiposDocumento } = useSettings();
  const current = {
    name: user.name,
    email: user.email,
    telefono: user.telefono ?? '',
    tipoDocumento: user.tipoDocumento || defaultDocType(tiposDocumento, 'CC'),
    documento: user.documento ?? '',
  };
  const [form, setForm] = useState(current);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const dirty = profileKeys.some((k) => form[k] !== current[k]);

  function set(patch) {
    setForm((f) => ({ ...f, ...patch }));
    setSaved(false);
  }

  function save(e) {
    e.preventDefault();
    const values = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      telefono: form.telefono.trim(),
      documento: form.documento.trim(),
    };
    const errs = {};
    if (!values.name) errs.name = 'El nombre es obligatorio';
    if (!values.email) errs.email = 'El email es obligatorio';
    else if (!isEmail(values.email)) errs.email = 'Email no válido';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    update(user.id, values);
    setForm(values);
    setSaved(true);
  }

  return (
    <Card icon={UserRound} title="Información personal" className="lg:col-span-2">
      <form onSubmit={save} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Nombre" error={errors.name} className="col-span-2">
            <input value={form.name} onChange={(e) => set({ name: e.target.value })} className={inputClass} />
          </Field>
          <Field label="Email" error={errors.email}>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set({ email: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Teléfono">
            <input
              value={form.telefono}
              onChange={(e) => set({ telefono: e.target.value })}
              className={inputClass}
              inputMode="tel"
              placeholder="300 000 0000"
            />
          </Field>
          <Field label="Documento" group className="col-span-2">
            <DocumentInput
              types={tiposDocumento}
              tipo={form.tipoDocumento}
              numero={form.documento}
              onTipoChange={(tipoDocumento) => set({ tipoDocumento })}
              onNumeroChange={(documento) => set({ documento })}
            />
          </Field>
        </div>
        <div className="flex justify-end items-center gap-2 pt-2">
          {saved && !dirty && (
            <span className="flex items-center gap-1 mr-auto text-xs font-semibold text-success">
              <Check size={14} /> Cambios guardados
            </span>
          )}
          <Button type="submit" disabled={!dirty}>
            Guardar cambios
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default function Profile() {
  const user = useCurrentUser();
  const { items: sales } = useSales();

  const month = new Date().toISOString().slice(0, 7);
  const mySales = sales.filter((s) => s.vendedor === user.name);
  const monthSales = mySales.filter((s) => s.fecha.startsWith(month));
  const sold = (list) => list.reduce((sum, s) => sum + saleTotals(s).total, 0);

  return (
    <div className="p-8 space-y-6 max-w-5xl">
      {/* Summary */}
      <div className="bg-white rounded-2xl border border-brand-150 p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold shrink-0 bg-brand-600 text-white">
          {initials(user.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-display text-brand-800 truncate">{user.name}</h2>
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-brand-800 text-white">{user.rol}</span>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-1 mt-1 text-xs text-brand-600">
            <span className="flex items-center gap-1.5">
              <Mail size={13} /> {user.email}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={13} /> Último acceso: {user.ultimo}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <PersonalInfo key={user.id} user={user} />

        <div className="space-y-6">
          <Card icon={ReceiptText} title="Mis ventas">
            <div className="space-y-3">
              {[
                { label: 'Ventas este mes', val: monthSales.length },
                { label: 'Vendido este mes', val: fmt(sold(monthSales)) },
                { label: 'Ventas totales', val: mySales.length },
              ].map((k) => (
                <div key={k.label} className="flex items-baseline justify-between">
                  <span className="text-xs text-brand-600">{k.label}</span>
                  <span className="text-sm font-bold font-mono text-brand-800">{k.val}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
