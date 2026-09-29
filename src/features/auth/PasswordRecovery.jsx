import { useState } from 'react';
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2, Lock, Mail } from 'lucide-react';
import { api } from '@/shared/lib/api';

export const PASSWORD_MIN = 8;

/** Code from the emailed link (?restablecer=…), or null */
export const resetCodeFromUrl = () => new URLSearchParams(window.location.search).get('restablecer');

// Same look as the login fields
function InputRow({ id, label, icon: Icon, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold mb-1.5 uppercase tracking-wide text-brand-800">
        {label}
      </label>
      <div className="flex items-center gap-3 px-4 rounded-xl border border-brand-200 bg-white text-brand-800 transition-all focus-within:border-brand-600 focus-within:ring-3 focus-within:ring-brand-600/15">
        <Icon size={18} strokeWidth={1.75} className="shrink-0 text-brand-600" />
        <input id={id} className="w-full py-[clamp(8px,1.4vh,12px)] text-sm outline-none bg-transparent" {...props} />
      </div>
    </div>
  );
}

function Message({ error, children }) {
  const Icon = error ? AlertCircle : CheckCircle2;
  return (
    <p
      role={error ? 'alert' : 'status'}
      className={`flex items-start gap-2 px-3 py-2.5 rounded-xl text-sm ${
        error ? 'bg-danger-soft text-danger' : 'bg-success-soft text-success'
      }`}
    >
      <Icon size={17} className="shrink-0 mt-px" />
      {children}
    </p>
  );
}

const submitClass =
  'mt-1 w-full disabled:opacity-70 disabled:cursor-wait py-[clamp(10px,1.6vh,14px)] rounded-xl flex items-center justify-center gap-2 text-base font-semibold text-white transition-all hover:brightness-110 bg-linear-90 from-brand-500 to-brand-700 shadow-[0_6px_20px_rgba(94,47,112,0.35)]';

function BackLink({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-800"
    >
      <ArrowLeft size={14} /> Volver a ingresar
    </button>
  );
}

/** Asks for the email and sends the link; the answer doesn't say whether the email has an account */
export function ForgotPassword({ initialEmail, onBack }) {
  const [email, setEmail] = useState(initialEmail);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setError('');
    setSending(true);
    try {
      await api('/api/auth/recuperar-password', { method: 'POST', body: { email: email.trim() } });
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-[clamp(10px,2vh,20px)]">
      <InputRow
        id="recover-email"
        label="Correo electrónico"
        icon={Mail}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="username"
        placeholder="tu@correo.com"
        required
        autoFocus
      />
      {error && <Message error>{error}</Message>}
      {sent && (
        <Message>
          Si ese correo tiene una cuenta, te enviamos un enlace para crear una contraseña nueva. Revisa también el
          correo no deseado; el enlace vence en 1 hora.
        </Message>
      )}
      <button type="submit" disabled={sending} className={submitClass}>
        {sending && <Loader2 size={18} strokeWidth={1.75} className="animate-spin" />}
        {sending ? 'Enviando…' : sent ? 'Enviar otra vez' : 'Enviar enlace'}
      </button>
      <BackLink onClick={onBack} />
    </form>
  );
}

/** New password with the code from the emailed link */
export function ResetPassword({ code, onDone, onBack }) {
  const [nueva, setNueva] = useState('');
  const [repetir, setRepetir] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    if (nueva.length < PASSWORD_MIN) return setError(`La contraseña debe tener al menos ${PASSWORD_MIN} caracteres`);
    if (nueva !== repetir) return setError('Las contraseñas no coinciden');
    setError('');
    setSaving(true);
    try {
      await api('/api/auth/restablecer-password', { method: 'POST', body: { codigo: code, nueva } });
      onDone();
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-[clamp(10px,2vh,20px)]">
      <InputRow
        id="reset-new"
        label="Contraseña nueva"
        icon={Lock}
        type="password"
        value={nueva}
        onChange={(e) => setNueva(e.target.value)}
        autoComplete="new-password"
        required
        autoFocus
      />
      <InputRow
        id="reset-repeat"
        label="Repite la contraseña"
        icon={Lock}
        type="password"
        value={repetir}
        onChange={(e) => setRepetir(e.target.value)}
        autoComplete="new-password"
        required
      />
      {error && <Message error>{error}</Message>}
      <button type="submit" disabled={saving} className={submitClass}>
        {saving && <Loader2 size={18} strokeWidth={1.75} className="animate-spin" />}
        {saving ? 'Guardando…' : 'Guardar contraseña'}
      </button>
      <BackLink onClick={onBack} />
    </form>
  );
}
