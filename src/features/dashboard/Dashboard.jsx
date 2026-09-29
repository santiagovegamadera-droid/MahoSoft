import { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Minus, PackageCheck, TrendingDown, TrendingUp } from 'lucide-react';
import { api } from '@/shared/lib/api';
import chartTheme from '@/shared/lib/chartTheme';
import StatCard from '@/shared/components/StatCard';
import { ErrorAlert, LoadingState } from '@/shared/components/Feedback';
import { Button } from '@/shared/components/Form';
import { EmptyState } from '@/shared/components/Table';

const compact = (n) => new Intl.NumberFormat('es-CO', { notation: 'compact', maximumFractionDigits: 1 }).format(n);
const pesos = (n) => `$${Math.round(n).toLocaleString('es-CO')}`;
const monthLabel = (ym) => new Date(`${ym}-01T00:00`).toLocaleDateString('es-CO', { month: 'short' }).replace('.', '');

/** Change against the previous period; nothing to compare when that period had no sales */
function delta(now, before, { money = true } = {}) {
  if (!before) return now ? { text: 'Sin ventas antes', up: null } : { text: 'Sin cambios', up: null };
  const diff = now - before;
  const text = money
    ? `${diff >= 0 ? '+' : ''}${Math.round((diff / before) * 100)}%`
    : `${diff >= 0 ? '+' : ''}${diff}`;
  return { text, up: diff === 0 ? null : diff > 0 };
}

function Delta({ change, sub }) {
  const Icon = change.up === null ? Minus : change.up ? TrendingUp : TrendingDown;
  const color =
    change.up === null
      ? 'bg-brand-50 text-brand-600'
      : change.up
        ? 'bg-brand-200 text-brand-800'
        : 'bg-rose-soft text-rose';
  return (
    <div className="flex items-center gap-1.5">
      <span className={`flex items-center gap-1 text-xs font-semibold px-1.5 py-0.5 rounded ${color}`}>
        <Icon size={12} />
        {change.text}
      </span>
      <span className="text-xs text-subtle">{sub}</span>
    </div>
  );
}

// The pie keeps the four biggest categories and groups the rest, so each slice has its own color
function categorySlices(categorias) {
  const total = categorias.reduce((s, c) => s + c.ingresos, 0);
  if (!total) return [];
  const top = categorias.slice(0, 4);
  const rest = categorias.slice(4).reduce((s, c) => s + c.ingresos, 0);
  const slices = rest ? [...top, { categoria: 'Otros', ingresos: rest }] : top;
  return slices.map((c) => ({
    name: c.categoria,
    value: Math.round((c.ingresos / total) * 100),
    ingresos: c.ingresos,
  }));
}

/** Home screen with the real figures (GET /api/tablero); `onOrder` opens a purchase for a low-stock size */
export default function Dashboard({ onOrder }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const chart = chartTheme();

  function load() {
    setError('');
    api('/api/tablero')
      .then(setData)
      .catch((err) => setError(err.message));
  }
  useEffect(load, []);

  if (!data) {
    return (
      <div className="p-4 sm:p-6">
        {error ? <ErrorAlert message={error} onRetry={load} /> : <LoadingState message="Cargando indicadores…" />}
      </div>
    );
  }

  const monthName = new Date().toLocaleDateString('es-CO', { month: 'long' });
  const cards = [
    {
      label: 'Ventas de hoy',
      value: pesos(data.hoy.ventas),
      change: delta(data.hoy.ventas, data.ayer.ventas),
      sub: 'vs. ayer',
    },
    {
      label: 'Ventas del mes',
      value: pesos(data.mes.ventas),
      change: delta(data.mes.ventas, data.mesAnteriorALaFecha.ventas),
      sub: 'vs. mes anterior a la fecha',
    },
    {
      label: 'Transacciones hoy',
      value: data.hoy.transacciones,
      change: delta(data.hoy.transacciones, data.ayer.transacciones, { money: false }),
      sub: 'vs. ayer',
    },
  ];
  const months = data.ingresosPorMes.map((m) => ({ mes: monthLabel(m.mes), ventas: m.ventas }));
  const slices = categorySlices(data.ventasPorCategoria);

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((card) => (
          <StatCard key={card.label} label={card.label} value={card.value}>
            <Delta change={card.change} sub={card.sub} />
          </StatCard>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl p-4 border border-brand-150">
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-brand-800">Ingresos por mes</h3>
            <p className="text-xs text-subtle">Últimos 6 meses · sin ventas anuladas</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={months}>
              <defs>
                <linearGradient id="gVentas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chart.primary} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={chart.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} />
              <XAxis dataKey="mes" tick={chart.tick} axisLine={false} tickLine={false} />
              <YAxis tick={chart.tick} axisLine={false} tickLine={false} tickFormatter={compact} />
              <Tooltip formatter={(v) => [pesos(v), 'Ventas']} contentStyle={chart.tooltip} />
              <Area type="monotone" dataKey="ventas" stroke={chart.primary} strokeWidth={2.5} fill="url(#gVentas)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-brand-150">
          <h3 className="text-sm font-semibold mb-1 text-brand-800">Ventas por categoría</h3>
          <p className="text-xs mb-4 text-subtle capitalize">{monthName}</p>
          {slices.length === 0 ? (
            <EmptyState message="Aún no hay ventas este mes." />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie
                    data={slices}
                    cx="50%"
                    cy="50%"
                    innerRadius={42}
                    outerRadius={65}
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {slices.map((_, i) => (
                      <Cell key={i} fill={chart.series[i]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v, _, p) => [`${v}% · ${pesos(p.payload.ingresos)}`, '']}
                    contentStyle={chart.tooltip}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-3">
                {slices.map((c, i) => (
                  <div key={c.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-sm" style={{ background: chart.series[i] }} />
                      <span className="text-brand-800">{c.name}</span>
                    </div>
                    <span className="font-semibold text-brand-600">{c.value}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-brand-150">
          <div className="px-4 py-3 border-b border-brand-100">
            <h3 className="text-sm font-semibold text-brand-800">Productos más vendidos</h3>
            <p className="text-xs text-subtle">Este mes, por ingresos</p>
          </div>
          {data.topProductos.length === 0 ? (
            <EmptyState message="Aún no hay ventas este mes." />
          ) : (
            <div className="divide-y divide-brand-50">
              {data.topProductos.map((p, i) => (
                <div key={p.productoId} className="flex items-center justify-between px-4 py-2.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                        i === 0 ? 'bg-brand-800 text-white' : 'bg-brand-200 text-brand-800'
                      }`}
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate text-brand-800">{p.producto}</p>
                      <p className="text-xs text-subtle">{p.categoria}</p>
                    </div>
                  </div>
                  <div className="text-right ml-auto">
                    <p className="text-sm font-semibold text-brand-800">{pesos(p.ingresos)}</p>
                    <p className="text-xs text-subtle">{p.unidades} uds.</p>
                  </div>
                  <span
                    className={`ml-3 text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${
                      p.stock === 0
                        ? 'bg-danger-soft text-danger'
                        : p.stock <= 3
                          ? 'bg-warning-soft text-warning'
                          : 'bg-brand-200 text-brand-800'
                    }`}
                  >
                    {p.stock === 0 ? 'Agotado' : `${p.stock} disp.`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-brand-150">
          <div className="px-4 py-3 border-b flex items-center justify-between border-brand-100">
            <div>
              <h3 className="text-sm font-semibold text-brand-800">Alertas de stock bajo</h3>
              <p className="text-xs text-subtle">
                Tallas con {data.alertas[0]?.minimo ?? 'pocas'} unidades o menos · productos activos
              </p>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-danger-soft text-danger">
              {data.totalAlertas} {data.totalAlertas === 1 ? 'alerta' : 'alertas'}
            </span>
          </div>
          {data.alertas.length === 0 ? (
            <EmptyState icon={PackageCheck} message="Todo el stock está por encima del mínimo." />
          ) : (
            <div className="p-4 space-y-2.5">
              {data.alertas.map((a) => (
                <div
                  key={`${a.productoId}-${a.talla}`}
                  className={`flex items-center justify-between p-3 rounded-xl border ${
                    a.stock === 0 ? 'bg-danger-tint border-danger-line' : 'bg-warning-tint border-warning-line'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate text-brand-800">{a.producto}</p>
                    <p className="text-xs text-subtle">Talla {a.talla}</p>
                  </div>
                  <div className="text-right ml-auto">
                    <p className={`text-lg font-bold ${a.stock === 0 ? 'text-danger' : 'text-warning'}`}>{a.stock}</p>
                    <p className="text-xs text-subtle">/ mín. {a.minimo}</p>
                  </div>
                  {onOrder && (
                    <Button
                      size="sm"
                      className="ml-3"
                      onClick={() => onOrder({ productoId: a.productoId, talla: a.talla })}
                    >
                      Pedir
                    </Button>
                  )}
                </div>
              ))}
              {data.totalAlertas > data.alertas.length && (
                <p className="text-xs text-center text-subtle">
                  Y {data.totalAlertas - data.alertas.length} más. Revísalas en Productos → Stock actual.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
