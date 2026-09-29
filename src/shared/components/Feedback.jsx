import { AlertCircle, Loader2, RotateCw } from 'lucide-react';

/** Error message from the API, with an optional retry */
export function ErrorAlert({ message, onRetry, className = '' }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className={`flex items-start gap-2 px-3 py-2.5 rounded-xl text-sm bg-danger-soft text-danger ${className}`}
    >
      <AlertCircle size={17} className="shrink-0 mt-px" />
      <p className="flex-1">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="flex items-center gap-1 text-xs font-semibold shrink-0 hover:underline"
        >
          <RotateCw size={13} /> Reintentar
        </button>
      )}
    </div>
  );
}

/** Placeholder while a list loads for the first time */
export function LoadingState({ message = 'Cargando…' }) {
  return (
    <div className="flex items-center justify-center gap-2 px-4 py-8 text-sm text-subtle" role="status">
      <Loader2 size={18} strokeWidth={1.75} className="animate-spin" />
      {message}
    </div>
  );
}
