import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Loader2, Mail, Send } from 'lucide-react';
import { api } from '@/shared/lib/api';

export const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());

/**
 * Emails a sale's receipt (POST /api/ventas/{id}/enviar). With `sendNow` it goes out on its own, to the email the
 * customer left at checkout.
 */
export default function SendInvoice({ ventaId, factura, email: initialEmail = '', sendNow = false }) {
  const [email, setEmail] = useState(initialEmail);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const autoSent = useRef(false);
  const valid = isEmail(email);

  async function send(address) {
    setError('');
    setStatus('sending');
    try {
      await api(`/api/ventas/${ventaId}/enviar`, { method: 'POST', body: { correo: address.trim() } });
      setStatus('sent');
    } catch (err) {
      setError(err.message);
      setStatus('idle');
    }
  }

  // Only once, even when React runs effects twice in development
  useEffect(() => {
    if (sendNow && isEmail(initialEmail) && !autoSent.current) {
      autoSent.current = true;
      send(initialEmail);
    }
  }, []);

  if (status === 'sending') {
    return (
      <div className="flex items-center gap-2.5 p-3 rounded-xl border text-left border-brand-150 bg-brand-25">
        <Loader2 size={18} className="shrink-0 animate-spin text-brand-600" />
        <div className="min-w-0">
          <p className="text-xs font-semibold text-brand-800">Enviando factura...</p>
          <p className="text-xs truncate text-subtle">{email}</p>
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
          <p className="text-xs truncate text-brand-600">{email}</p>
        </div>
        <button onClick={() => setStatus('idle')} className="text-xs font-semibold text-brand-600 hover:text-brand-800">
          Cambiar
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (valid) send(email);
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
          className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg border text-xs outline-none bg-white border-brand-150 text-brand-800 placeholder:text-subtle focus:border-brand-600"
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
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </form>
  );
}
