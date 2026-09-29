/** KPI tile: label, big value and an optional line underneath (children) */
export default function StatCard({ label, value, valueClassName = 'text-brand-800', children }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-brand-150">
      <p className="text-xs font-medium uppercase tracking-wide mb-1 text-brand-600">{label}</p>
      <p className={`text-xl font-bold ${valueClassName}`}>{value}</p>
      {children && <div className="mt-1">{children}</div>}
    </div>
  );
}
