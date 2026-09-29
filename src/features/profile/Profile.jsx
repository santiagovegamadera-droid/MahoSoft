import { useEffect, useState } from 'react';
import { Check, Clock, KeyRound, Loader2, Mail, ReceiptText, UserRound } from 'lucide-react';
import { initials, PASSWORD_MIN, useCurrentUser } from '@/features/users/store';
import { refreshUser } from '@/features/auth/session';
import useSales, { isVoided } from '@/features/sales/store';
import useSettings from '@/features/settings/store';
import { api } from '@/shared/lib/api';
import DocumentInput, { defaultDocType } from '@/shared/components/DocumentInput';
import { ErrorAlert, LoadingState } from '@/shared/components/Feedback';
import { Button, Field, inputClass } from '@/shared/components/Form';
import { isEmail } from '@/features/pos/SendInvoice';

const fmt = (n) => `$${n.toLocaleString('es-CO')}`;
const fmtAccess = (iso) =>
  iso
    ? new Date(iso).toLocaleString('es-CO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
    : '—';
const profileKeys = ['nombre', 'email', 'telefono', 'tipoDocumento', 'documento'];

function Card({ icon: Icon, title, children, className = '' }) {
  return (
    <section className={`bg-white rounded-2xl border border-brand-150 ${className}`}>
      <div className="flex items-center gap-2 px-5 py-3 border-b border-brand-50">
        <Icon size={16} strokeWidth={1.75} className="text-brand-600" />
        <h2 className="text-sm font-semibold text-brand-800">{title}</h2>
      </div>
      <div className="px-5 py-4">{children}</div>
    </section>
  );
}

function SubmitButton({ saving, disabled, children }) {
  return (
    <Button type="submit" disabled={disabled || saving}>
      {saving && <Loader2 size={16} className="animate-spin" />}
      {saving ? 'Guardando…' : children}
    </Button>
  );
}

/** Own details; role and permissions are set by the administrator in Usuarios */
function PersonalInfo({ perfil, onSaved }) {
  const { tiposDocumento } = useSettings();
  const current = {
    nombre: perfil.nombre,
    email: perfil.email,
    telefono: perfil.telefono,
    tipoDocumento: perfil.tipoDocumento || defaultDocType(tiposDocumento, 'CC'),
    documento: perfil.documento,
  };
  const [form, setForm] = useState(current);
  const [errors, setErrors] = useState({});
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const dirty = profileKeys.some((k) => form[k] !== current[k]);

  function set(patch) {
    setForm((f) => ({ ...f, ...patch }));
    setSaved(false);
  }

  async function save(e) {
    e.preventDefault();
    const values = {
      ...form,
      nombre: form.nombre.trim(),
      email: form.email.trim(),
      telefono: form.telefono.trim(),
      documento: form.documento.trim(),
    };
    const errs = {};
    if (!values.nombre) errs.nombre = 'El nombre es obligatorio';
    if (!values.email) errs.email = 'El email es obligatorio';
    else if (!isEmail(values.email)) errs.email = 'Email no válido';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSaveError('');
    setSaving(true);
    try {
      const updated = await api('/api/perfil', { method: 'PUT', body: values });
      await refreshUser(); // the sidebar shows the session's name
      onSaved(updated);
      setSaved(true);
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card icon={UserRound} title="Información personal" className="lg:col-span-2">
      <form onSubmit={save} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nombre" error={errors.nombre} className="sm:col-span-2">
            <input
              value={form.nombre}
              onChange={(e) => set({ nombre: e.target.value })}
              maxLength={150}
              className={inputClass}
            />
          </Field>
          <Field label="Email" error={errors.email}>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set({ email: e.target.value })}
              maxLength={256}
              className={inputClass}
            />
            <span className="block mt-1 text-xs text-subtle">Es el correo con el que inicias sesión.</span>
          </Field>
          <Field label="Teléfono">
            <input
              value={form.telefono}
              onChange={(e) => set({ telefono: e.target.value })}
              maxLength={30}
              className={inputClass}
              inputMode="tel"
              placeholder="300 000 0000"
            />
          </Field>
          <Field label="Documento" group className="sm:col-span-2">
            <DocumentInput
              types={tiposDocumento}
              tipo={form.tipoDocumento}
              numero={form.documento}
              onTipoChange={(tipoDocumento) => set({ tipoDocumento })}
              onNumeroChange={(documento) => set({ documento })}
            />
          </Field>
        </div>
        <ErrorAlert message={saveError} />
        <div className="flex justify-end items-center gap-2 pt-2">
          {saved && !dirty && (
            <span className="flex items-center gap-1 mr-auto text-xs font-semibold text-success">
              <Check size={14} /> Cambios guardados
            </span>
          )}
          <SubmitButton saving={saving} disabled={!dirty}>
            Guardar cambios
          </SubmitButton>
        </div>
      </form>
    </Card>
  );
}

const emptyPasswords = { actual: '', nueva: '', repetir: '' };

function ChangePassword() {
  const [form, setForm] = useState(emptyPasswords);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setDone(false);
  };

  async function save(e) {
    e.preventDefault();
    if (!form.actual) return setError('Escribe tu contraseña actual');
    if (form.nueva.length < PASSWORD_MIN)
      return setError(`La nueva contraseña debe tener al menos ${PASSWORD_MIN} caracteres`);
    if (form.nueva !== form.repetir) return setError('Las contraseñas nuevas no coinciden');
    setError('');
    setSaving(true);
    try {
      await api('/api/auth/cambiar-password', { method: 'POST', body: { actual: form.actual, nueva: form.nueva } });
      setForm(emptyPasswords);
      setDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card icon={KeyRound} title="Cambiar contraseña">
      <form onSubmit={save} className="space-y-3">
        <Field label="Contraseña actual">
          <input
            type="password"
            value={form.actual}
            onChange={set('actual')}
            autoComplete="current-password"
            className={inputClass}
          />
        </Field>
        <Field label="Nueva contraseña">
          <input
            type="password"
            value={form.nueva}
            onChange={set('nueva')}
            autoComplete="new-password"
            className={inputClass}
          />
        </Field>
        <Field label="Repite la nueva contraseña">
          <input
            type="password"
            value={form.repetir}
            onChange={set('repetir')}
            autoComplete="new-password"
            className={inputClass}
          />
        </Field>
        <ErrorAlert message={error} />
        {done && (
          <p className="flex items-center gap-1 text-xs font-semibold text-success">
            <Check size={14} /> Contraseña actualizada
          </p>
        )}
        <div className="flex justify-end">
          <SubmitButton saving={saving}>Cambiar contraseña</SubmitButton>
        </div>
      </form>
    </Card>
  );
}

/** Sales of the signed-in seller; only for users who can open the POS */
function MySales({ userId }) {
  const { items: sales } = useSales();
  const now = new Date();
  const inThisMonth = (iso) => {
    const d = new Date(iso);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  };
  // Voided sales don't count
  const mySales = sales.filter((s) => s.vendedorId === userId && !isVoided(s));
  const monthSales = mySales.filter((s) => inThisMonth(s.fecha));
  const sold = (list) => list.reduce((sum, s) => sum + s.total, 0);

  return (
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
  );
}

export default function Profile() {
  const user = useCurrentUser();
  const [perfil, setPerfil] = useState(null);
  const [error, setError] = useState('');

  function load() {
    setError('');
    api('/api/perfil')
      .then(setPerfil)
      .catch((err) => setError(err.message));
  }
  useEffect(load, []);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-5xl">
      {/* Summary */}
      <div className="bg-white rounded-2xl border border-brand-150 p-5 flex items-center gap-4">
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
              <Clock size={13} /> Último acceso: {fmtAccess(perfil?.ultimoAcceso)}
            </span>
          </div>
        </div>
      </div>

      <ErrorAlert message={error} onRetry={load} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {perfil ? (
          <PersonalInfo key={perfil.id} perfil={perfil} onSaved={setPerfil} />
        ) : (
          <div className="lg:col-span-2">{!error && <LoadingState message="Cargando tus datos…" />}</div>
        )}

        <div className="space-y-6">
          <ChangePassword />
          {user.permisos.includes('POS') && <MySales userId={user.id} />}
        </div>
      </div>
    </div>
  );
}
