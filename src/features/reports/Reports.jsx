import { useEffect, useState } from 'react';
import { FileSpreadsheet, FileText, Loader2, ReceiptText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { api, apiBlob } from '@/shared/lib/api';
import { saveBlob } from '@/shared/lib/files';
import chartTheme from '@/shared/lib/chartTheme';
import StatCard from '@/shared/components/StatCard';
import { ErrorAlert, LoadingState } from '@/shared/components/Feedback';
import { Button } from '@/shared/components/Form';
import { EmptyState, Table, TableCard, TableTitle } from '@/shared/components/Table';
import { SegmentedTabs } from '@/shared/components/Toolbar';

const compact = (n) => new Intl.NumberFormat('es-CO', { notation: 'compact', maximumFractionDigits: 1 }).format(n);
const pesos = (n) => `$${Math.round(n).toLocaleString('es-CO')}`;
const iso = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const fmtLong = (ymd) =>
  new Date(`${ymd}T00:00`).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });

// Each period ends today (local date)
const PERIODS = {
  semana: { label: 'Últimos 7 días', from: (t) => new Date(t.getFullYear(), t.getMonth(), t.getDate() - 6) },
  mes: { label: 'Este mes', from: (t) => new Date(t.getFullYear(), t.getMonth(), 1) },
  año: { label: 'Últimos 12 meses', from: (t) => new Date(t.getFullYear(), t.getMonth() - 11, 1) },
};

function range(period) {
  const today = new Date();
  return { desde: iso(PERIODS[period].from(today)), hasta: iso(today) };
}

/** Label for a point of the series: a day (yyyy-MM-dd) or a month (yyyy-MM) */
function pointLabel(etiqueta, agrupacion) {
  const date = new Date(`${agrupacion === 'mes' ? `${etiqueta}-01` : etiqueta}T00:00`);
  return agrupacion === 'mes'
    ? date.toLocaleDateString('es-CO', { month: 'short' }).replace('.', '')
    : date.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric' }).replace('.', '');
}

/** Change against the previous period, as text */
function change(now, before, kind = 'pct') {
  if (kind === 'pp') {
    if (now == null || before == null) return 'Sin datos del periodo anterior';
    const pp = Math.round((now - before) * 1000) / 10;
    return `${pp >= 0 ? '+' : ''}${pp.toLocaleString('es-CO')} pp vs. periodo anterior`;
  }
  if (!before) return now ? 'Sin ventas en el periodo anterior' : 'Sin ventas';
  const pct = Math.round(((now - before) / before) * 100);
  return `${pct >= 0 ? '+' : ''}${pct}% vs. periodo anterior`;
}

export default function Reports() {
  const [period, setPeriod] = useState('semana');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(null); // 'pdf' | 'excel'
  const chart = chartTheme();

  function load() {
    const { desde, hasta } = range(period);
    const controller = new AbortController();
    setLoading(true);
    setError('');
    api(`/api/reportes?desde=${desde}&hasta=${hasta}`, { signal: controller.signal })
      .then(setData)
      .catch((err) => err.name !== 'AbortError' && setError(err.message))
      .finally(() => !controller.signal.aborted && setLoading(false));
    return () => controller.abort();
  }
  useEffect(load, [period]);

  async function exportFile(kind) {
    const { desde, hasta } = range(period);
    setExporting(kind);
    setError('');
    try {
      const blob = await apiBlob(`/api/reportes/${kind}?desde=${desde}&hasta=${hasta}`);
      saveBlob(blob, `reporte-ventas-${desde}-a-${hasta}.${kind === 'excel' ? 'xlsx' : 'pdf'}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setExporting(null);
    }
  }

  const series = (data?.serie ?? []).map((p) => ({ ...p, label: pointLabel(p.etiqueta, data.agrupacion) }));
  const byMonth = data?.agrupacion === 'mes';
  const totalTop = (data?.topProductos ?? []).reduce((s, p) => s + p.ingresos, 0);

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <SegmentedTabs
            value={period}
            onChange={setPeriod}
            label="Periodo"
            options={[
              ['semana', 'Semana'],
              ['mes', 'Mes'],
              ['año', 'Año'],
            ]}
          />
          {data && (
            <span className="text-xs text-subtle">
              {fmtLong(data.desde)} – {fmtLong(data.hasta)} · sin ventas anuladas
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => exportFile('pdf')} disabled={!data || exporting !== null}>
            {exporting === 'pdf' ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />} Exportar PDF
          </Button>
          <Button onClick={() => exportFile('excel')} disabled={!data || exporting !== null}>
            {exporting === 'excel' ? <Loader2 size={16} className="animate-spin" /> : <FileSpreadsheet size={16} />}{' '}
            Exportar Excel
          </Button>
        </div>
      </div>

      <ErrorAlert message={error} onRetry={data ? undefined : load} />
      {!data && loading && <LoadingState message="Calculando el reporte…" />}

      {data && (
        <div className={`space-y-5 transition-opacity ${loading ? 'opacity-50' : ''}`}>
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: 'Total ventas',
                val: pesos(data.actual.ventas),
                sub: change(data.actual.ventas, data.anterior.ventas),
              },
              {
                label: 'Transacciones',
                val: data.actual.transacciones,
                sub: change(data.actual.transacciones, data.anterior.transacciones),
              },
              {
                label: 'Ticket promedio',
                val: pesos(data.actual.ticketPromedio),
                sub: change(data.actual.ticketPromedio, data.anterior.ticketPromedio),
              },
              {
                label: 'Margen bruto',
                val:
                  data.actual.margenBruto == null
                    ? '—'
                    : `${(data.actual.margenBruto * 100).toLocaleString('es-CO', { maximumFractionDigits: 1 })}%`,
                sub: change(data.actual.margenBruto, data.anterior.margenBruto, 'pp'),
              },
            ].map((k) => (
              <StatCard key={k.label} label={k.label} value={k.val}>
                <p className="text-xs text-subtle">{k.sub}</p>
              </StatCard>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-4 border border-brand-150">
              <h3 className="text-sm font-semibold mb-1 text-brand-800">
                {byMonth ? 'Ventas por mes' : 'Ventas diarias'}
              </h3>
              <p className="text-xs mb-4 text-subtle">{PERIODS[period].label}</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={series} barSize={byMonth ? 18 : 28}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} />
                  <XAxis
                    dataKey="label"
                    tick={chart.tick}
                    axisLine={false}
                    tickLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis tick={chart.tick} axisLine={false} tickLine={false} tickFormatter={compact} />
                  <Tooltip formatter={(v) => [pesos(v), 'Ventas']} contentStyle={chart.tooltip} />
                  <Bar dataKey="ventas" fill={chart.primary} radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-brand-150">
              <h3 className="text-sm font-semibold mb-1 text-brand-800">
                {byMonth ? 'Transacciones por mes' : 'Transacciones diarias'}
              </h3>
              <p className="text-xs mb-4 text-subtle">{PERIODS[period].label}</p>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={series}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} />
                  <XAxis
                    dataKey="label"
                    tick={chart.tick}
                    axisLine={false}
                    tickLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis tick={chart.tick} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip formatter={(v) => [v, 'Transacciones']} contentStyle={chart.tooltip} />
                  <Line
                    type="monotone"
                    dataKey="transacciones"
                    stroke={chart.dark}
                    strokeWidth={2.5}
                    dot={{ fill: chart.dark, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top products table */}
          <TableCard>
            <TableTitle title="Productos más vendidos" subtitle={`${PERIODS[period].label}, por ingresos`} />
            <Table columns={['#', 'Producto', 'Categoría', 'Unidades vendidas', 'Ingresos', 'Part. de ventas']}>
              {data.topProductos.map((p, i) => {
                const pct = totalTop ? Math.round((p.ingresos / totalTop) * 100) : 0;
                return (
                  <tr key={p.productoId} className="hover:bg-brand-25">
                    <td className="px-4 py-2.5">
                      <span
                        className={`w-6 h-6 rounded-lg inline-flex items-center justify-center text-xs font-bold ${
                          i === 0 ? 'bg-brand-800 text-white' : 'bg-brand-200 text-brand-800'
                        }`}
                      >
                        {i + 1}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-medium text-brand-800">{p.producto}</td>
                    <td className="px-4 py-2.5 text-brand-600">{p.categoria}</td>
                    <td className="px-4 py-2.5 font-mono font-semibold text-brand-800">{p.unidades}</td>
                    <td className="px-4 py-2.5 font-mono font-semibold text-brand-800">{pesos(p.ingresos)}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-brand-100">
                          <div className="h-full rounded-full bg-brand-600" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs font-semibold w-8 text-brand-800">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </Table>
            {data.topProductos.length === 0 && (
              <EmptyState icon={ReceiptText} message="No hay ventas en este periodo." />
            )}
          </TableCard>
        </div>
      )}
    </div>
  );
}
