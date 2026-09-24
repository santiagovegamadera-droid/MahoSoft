import { ChevronLeft, ChevronRight } from 'lucide-react';

// Page numbers to show: first, last and the ones around the current page; null marks a gap
function pageList(page, pageCount) {
  const pages = [];
  for (let p = 1; p <= pageCount; p++) {
    if (p === 1 || p === pageCount || Math.abs(p - page) <= 1) pages.push(p);
    else if (pages.at(-1) !== null) pages.push(null);
  }
  return pages;
}

const navClass =
  'w-7 h-7 flex items-center justify-center rounded-lg text-brand-600 enabled:hover:bg-brand-50 disabled:opacity-30';

// Footer for a table paginated with usePagination
export default function Pagination({ pager, label = 'registros' }) {
  const { page, pageCount, start, pageSize, total, setPage } = pager;
  if (total === 0) return null;

  return (
    <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-brand-50">
      <p className="text-xs text-brand-400">
        Mostrando {start + 1}–{Math.min(start + pageSize, total)} de {total} {label}
      </p>
      {pageCount > 1 && (
        <nav className="flex items-center gap-1" aria-label="Paginación">
          <button onClick={() => setPage(page - 1)} disabled={page === 1} className={navClass} aria-label="Anterior">
            <ChevronLeft size={16} />
          </button>
          {pageList(page, pageCount).map((p, i) =>
            p === null ? (
              <span key={`gap-${i}`} className="w-7 text-center text-xs text-brand-400">
                …
              </span>
            ) : (
              <button
                key={p}
                onClick={() => setPage(p)}
                aria-current={p === page ? 'page' : undefined}
                className={`min-w-7 h-7 px-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  p === page ? 'bg-brand-600 text-white' : 'text-brand-600 hover:bg-brand-50'
                }`}
              >
                {p}
              </button>
            ),
          )}
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === pageCount}
            className={navClass}
            aria-label="Siguiente"
          >
            <ChevronRight size={16} />
          </button>
        </nav>
      )}
    </div>
  );
}
