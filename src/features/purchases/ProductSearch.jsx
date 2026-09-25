import { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';

// Searchable product picker. The list is `fixed` so the modal's scroll area doesn't clip it.
export default function ProductSearch({ products, value, onChange, className }) {
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [rect, setRect] = useState(null);

  const selected = products.find((p) => p.id === value);
  const results = products.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()));

  useEffect(() => {
    if (!open) return;
    const place = () => setRect(inputRef.current.getBoundingClientRect());
    place();
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    return () => {
      window.removeEventListener('scroll', place, true);
      window.removeEventListener('resize', place);
    };
  }, [open]);

  function openList() {
    setQuery('');
    setActive(0);
    setOpen(true);
  }

  function pick(p) {
    onChange(p.id);
    setOpen(false);
    inputRef.current.blur();
  }

  function onKeyDown(e) {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[active]) pick(results[active]);
    } else if (e.key === 'Escape') {
      // Close the list without closing the modal
      e.stopPropagation();
      setOpen(false);
      inputRef.current.blur();
    }
  }

  return (
    <div className="relative">
      <Search size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-subtle pointer-events-none" />
      <input
        ref={inputRef}
        value={open ? query : (selected?.name ?? '')}
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(0);
        }}
        onFocus={openList}
        onBlur={() => setOpen(false)}
        onKeyDown={onKeyDown}
        placeholder={selected?.name ?? 'Buscar producto...'}
        className={`${className} pl-7`}
        role="combobox"
        aria-expanded={open}
        aria-label="Producto"
      />
      {open && rect && (
        <ul
          role="listbox"
          className="fixed z-60 max-h-56 overflow-y-auto rounded-lg border bg-white shadow-lg border-brand-150 py-1"
          style={{ top: rect.bottom + 4, left: rect.left, width: Math.max(rect.width, 220) }}
        >
          {results.map((p, i) => (
            <li
              key={p.id}
              role="option"
              aria-selected={p.id === value}
              // mousedown instead of click so the input's blur doesn't close the list first
              onMouseDown={(e) => {
                e.preventDefault();
                pick(p);
              }}
              onMouseEnter={() => setActive(i)}
              className={`px-3 py-1.5 text-xs cursor-pointer ${
                i === active ? 'bg-brand-50 text-brand-800' : 'text-brand-800'
              } ${p.id === value ? 'font-semibold' : ''}`}
            >
              {p.name}
            </li>
          ))}
          {results.length === 0 && <li className="px-3 py-2 text-xs text-subtle">Sin resultados</li>}
        </ul>
      )}
    </div>
  );
}
