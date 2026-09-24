import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Mail, Send } from 'lucide-react';

export const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());

// Visual only: sending is simulated until the backend can deliver emails
export default function SendInvoice({ factura, email: initialEmail = '', sendNow = false }) {
  const [email, setEmail] = useState(initialEmail);
  const [status, setStatus] = useState(sendNow && isEmail(initialEmail) ? 'sending' : 'idle');
  const valid = isEmail(email);

  useEffect(() => {
    if (status !== 'sending') return;
    const t = setTimeout(() => setStatus('sent'), 1200);
    return () => clearTimeout(t);
  }, [status]);

  if (status === 'sending') {
    return (
      <div className="flex items-center gap-2.5 p-3 rounded-xl border text-left border-brand-150 bg-brand-25">
        <Loader2 size={18} className="shrink-0 animate-spin text-brand-600" />
        <div className="min-w-0">
          <p className="text-xs font-semibold text-brand-800">Enviando factura...</p>
          <p className="text-[11px] truncate text-brand-400">{email}</p>
        </div>
      </div>
    );
  }

  if (status === 'sent') {
    return (
      <div className="flex items-center gap-2.5 p-3 rounded-xl border text-left border-success-soft bg-success-soft/40">
        <CheckCircle2 size={18} className="shrink-0 text-success" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-success">Factura #{factura} enviada</p>
          <p className="text-[11px] truncate text-brand-600">{email}</p>
        </div>
        <button onClick={() => setStatus('idle')} className="text-[11px] font-semibold text-brand-600 hover:text-brand-800">
          Cambiar
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (valid) setStatus('sending');
      }}
      className="p-3 rounded-xl border text-left border-brand-150 bg-brand-25"
    >
      <p className="flex items-center gap-1.5 text-xs font-semibold mb-2 text-brand-800">
        <Mail size={14} />
        ¿El cliente quiere la factura por correo?
      </p>
      <div className="flex gap-1.5">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="correo@cliente.com"
          className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg border text-xs outline-none bg-white border-brand-150 text-brand-800 placeholder:text-brand-400 focus:border-brand-600"
          aria-label="Correo del cliente"
        />
        <button
          type="submit"
          disabled={!valid}
          className="flex items-center gap-1 px-3 rounded-lg text-xs font-semibold text-white bg-brand-800 enabled:hover:bg-brand-600 disabled:opacity-40"
        >
          <Send size={12} />
          Enviar
        </button>
      </div>
    </form>
  );
}
