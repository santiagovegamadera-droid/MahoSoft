const alignClass = { left: 'text-left', center: 'text-center', right: 'text-right' };

/** White card that holds a table, an optional title bar and its pagination */
export function TableCard({ children, className = '' }) {
  return <div className={`bg-white rounded-2xl border overflow-hidden border-brand-150 ${className}`}>{children}</div>;
}

/** Title bar at the top of a TableCard; `actions` sits on the right (e.g. a search box) */
export function TableTitle({ title, subtitle, actions }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-brand-50">
      <div>
        <h3 className="text-sm font-semibold text-brand-800">{title}</h3>
        {subtitle && <p className="text-xs text-subtle">{subtitle}</p>}
      </div>
      {actions}
    </div>
  );
}

/**
 * Standard data table. `columns` are header labels, or { label, align, className } objects.
 * Rows go in as children; give each <td> the `cellClass` padding (px-4 py-2.5) so it lines up with the header.
 */
export const cellClass = 'px-4 py-2.5';

export function Table({ columns, children }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-brand-50">
            {columns.map((c, i) => {
              const col = typeof c === 'string' ? { label: c } : c;
              return (
                <th
                  key={col.label || i}
                  className={`${cellClass} whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-brand-600 ${
                    alignClass[col.align ?? 'left']
                  } ${col.className ?? ''}`}
                >
                  {col.label}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-50">{children}</tbody>
      </table>
    </div>
  );
}

/** Row that opens something on click, or on Enter/Space when focused with the keyboard */
export function ClickableRow({ onOpen, selected = false, children }) {
  return (
    <tr
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        // Only the row itself: keys pressed on buttons inside it keep their own behavior
        if (e.target !== e.currentTarget || (e.key !== 'Enter' && e.key !== ' ')) return;
        e.preventDefault();
        onOpen();
      }}
      className={`cursor-pointer transition-colors outline-none hover:bg-brand-25 focus-visible:bg-brand-50 focus-visible:shadow-[inset_3px_0_0_var(--color-brand-600)] ${
        selected ? 'bg-brand-25' : ''
      }`}
    >
      {children}
    </tr>
  );
}

/** Message shown when a list has nothing to display, with an optional icon and action */
export function EmptyState({ icon: Icon, message, children }) {
  return (
    <div className="px-4 py-8 text-center">
      {Icon && <Icon size={28} strokeWidth={1.5} className="mx-auto mb-2 text-brand-200" />}
      <p className="text-sm text-subtle">{message}</p>
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}
