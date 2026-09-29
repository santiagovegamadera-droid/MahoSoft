import { useEffect, useState } from 'react';
import { Loader2, Search, UserCheck } from 'lucide-react';
import { searchCustomers } from '@/features/sales/store';
import { formatDocument } from '@/shared/components/DocumentInput';
import { inputClass } from '@/shared/components/Form';

/** Finds a saved customer by document, phone or name, so their details don't have to be typed again */
export default function CustomerSearch({ onPick }) {
  const [text, setText] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const query = text.trim();

  // Waits until typing pauses, and drops answers to older searches
  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      setSearching(false);
      return;
    }
    const controller = new AbortController();
    setSearching(true);
    const timer = setTimeout(async () => {
      try {
        setResults(await searchCustomers(query, controller.signal));
        setError('');
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message);
      } finally {
        if (!controller.signal.aborted) setSearching(false);
      }
    }, 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  function pick(c) {
    onPick(c);
    setText('');
  }

  return (
    <div className="relative">
      <Search size={15} className="absolute left-3 top-2.5 text-subtle" />
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Buscar cliente guardado por documento, teléfono o nombre"
        className={`${inputClass} pl-9`}
        aria-label="Buscar cliente guardado"
      />
      {searching && <Loader2 size={15} className="absolute right-3 top-2.5 animate-spin text-subtle" />}
      {query.length >= 3 && !searching && (
        <div className="mt-1.5 rounded-xl border border-brand-150 bg-white overflow-hidden">
          {error ? (
            <p className="px-3 py-2 text-xs text-danger">{error}</p>
          ) : results.length === 0 ? (
            <p className="px-3 py-2 text-xs text-subtle">Sin coincidencias: escribe sus datos abajo.</p>
          ) : (
            results.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => pick(c)}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-brand-25 border-b last:border-b-0 border-brand-50"
              >
                <UserCheck size={15} className="shrink-0 text-brand-600" />
                <span className="min-w-0">
                  <span className="block text-sm font-medium truncate text-brand-800">{c.nombre}</span>
                  <span className="block text-xs truncate text-subtle">
                    {[formatDocument(c.tipoDocumento, c.documento), c.telefono, c.correo].filter(Boolean).join(' · ')}
                  </span>
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
