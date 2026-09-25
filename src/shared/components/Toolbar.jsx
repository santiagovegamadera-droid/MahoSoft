import { Search } from 'lucide-react';

const controlClass =
  'h-9 text-sm rounded-xl border outline-none border-brand-200 bg-white text-brand-800 focus:border-brand-600 focus:ring-3 focus:ring-brand-600/15';

/** Row above a list with filters on the left; give the page action `className="ml-auto"` */
export function Toolbar({ children }) {
  return <div className="flex flex-wrap items-center gap-2.5 mb-4">{children}</div>;
}

export function SearchInput({ value, onChange, placeholder, label = placeholder, className = 'w-72' }) {
  return (
    <div className={`relative ${className}`}>
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle pointer-events-none" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
        className={`w-full pl-9 pr-3 ${controlClass}`}
      />
    </div>
  );
}

/** Pill-style tab switcher; `options` are [value, label] pairs */
export function SegmentedTabs({ value, onChange, options, label }) {
  return (
    <div role="tablist" aria-label={label} className="flex gap-1 p-1 rounded-xl w-fit bg-brand-50">
      {options.map(([v, text]) => (
        <button
          key={v}
          type="button"
          role="tab"
          aria-selected={value === v}
          onClick={() => onChange(v)}
          className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
            value === v
              ? 'bg-white text-brand-800 shadow-[0_1px_3px_rgba(80,52,89,0.1)]'
              : 'text-brand-600 hover:text-brand-800'
          }`}
        >
          {text}
        </button>
      ))}
    </div>
  );
}

/** Filter dropdown; `options` are strings or [value, label] pairs */
export function FilterSelect({ value, onChange, options, label }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      className={`px-3 ${controlClass}`}
    >
      {options.map((o) => {
        const [v, text] = Array.isArray(o) ? o : [o, o];
        return (
          <option key={v} value={v}>
            {text}
          </option>
        );
      })}
    </select>
  );
}
