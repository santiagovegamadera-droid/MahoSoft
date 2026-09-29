import { useState } from 'react';

/**
 * Splits `items` into pages. Pass the active filters as `resetKey` so the list goes back
 * to page 1 when they change; the page is also clamped when the list shrinks (e.g. a delete).
 */
export default function usePagination(items, resetKey = '', pageSize = 10) {
  const [state, setState] = useState({ page: 1, key: resetKey });
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const page = Math.min(state.key === resetKey ? state.page : 1, pageCount);
  const start = (page - 1) * pageSize;

  return {
    pageItems: items.slice(start, start + pageSize),
    page,
    pageCount,
    start,
    pageSize,
    total: items.length,
    setPage: (p) => setState({ page: p, key: resetKey }),
  };
}
