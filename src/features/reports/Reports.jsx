import { useState } from 'react';
import { FileSpreadsheet, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import chartTheme from '@/shared/lib/chartTheme';
import StatCard from '@/shared/components/StatCard';
import { Button } from '@/shared/components/Form';
import { Table, TableCard, TableTitle } from '@/shared/components/Table';
import { SegmentedTabs } from '@/shared/components/Toolbar';

const weeklyData = [
  { dia: 'Lun', ventas: 1850000, transacciones: 22 },
  { dia: 'Mar', ventas: 2340000, transacciones: 31 },
  { dia: 'Mié', ventas: 1620000, transacciones: 18 },
  { dia: 'Jue', ventas: 2780000, transacciones: 35 },
  { dia: 'Vie', ventas: 3450000, transacciones: 48 },
  { dia: 'Sáb', ventas: 4120000, transacciones: 62 },
  { dia: 'Dom', ventas: 3890000, transacciones: 55 },
];

const topProducts = [
  { nombre: 'Vestido Floral Verano', uds: 48, ingresos: 2880000 },
  { nombre: 'Jean Skinny Azul', uds: 41, ingresos: 2045000 },
  { nombre: 'Conjunto Lino Blanco', uds: 24, ingresos: 1920000 },
  { nombre: 'Blusa Seda Negra', uds: 37, ingresos: 1845000 },
  { nombre: 'Cardigan Tejido Crema', uds: 31, ingresos: 1740000 },
];

const fmt = (n) =>
  new Intl.NumberFormat('es-CO', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(n);
const fmtFull = (n) => `$${n.toLocaleString('es-CO')}`;

export default function Reports() {
  const [period, setPeriod] = useState('semana');
  const chart = chartTheme();

  return (
    <div className="p-6 space-y-5">
      {/* Header controls */}
      <div className="flex items-center justify-between">
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
        <div className="flex gap-2">
          <Button variant="secondary">
            <FileText size={16} /> Exportar PDF
          </Button>
          <Button>
            <FileSpreadsheet size={16} /> Exportar Excel
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: 'Total ventas',
            val: '$20.050.000',
            sub: '+18% vs. semana pasada',
          },
          { label: 'Transacciones', val: '271', sub: '+24% vs. semana pasada' },
          { label: 'Margen bruto', val: '52%', sub: '+2pp vs. semana pasada' },
        ].map((k) => (
          <StatCard key={k.label} label={k.label} value={k.val}>
            <p className="text-xs text-subtle">{k.sub}</p>
          </StatCard>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-brand-150">
          <h3 className="text-sm font-semibold mb-1 text-brand-800">Ventas diarias</h3>
          <p className="text-xs mb-4 text-subtle">Esta semana</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} />
              <XAxis dataKey="dia" tick={chart.tick} axisLine={false} tickLine={false} />
              <YAxis tick={chart.tick} axisLine={false} tickLine={false} tickFormatter={fmt} />
              <Tooltip formatter={(v) => [fmtFull(v), 'Ventas']} contentStyle={chart.tooltip} />
              <Bar dataKey="ventas" fill={chart.primary} radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-brand-150">
          <h3 className="text-sm font-semibold mb-1 text-brand-800">Transacciones diarias</h3>
          <p className="text-xs mb-4 text-subtle">Esta semana</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} />
              <XAxis dataKey="dia" tick={chart.tick} axisLine={false} tickLine={false} />
              <YAxis tick={chart.tick} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={chart.tooltip} />
              <Line
                type="monotone"
                dataKey="transacciones"
                stroke={chart.dark}
                strokeWidth={2.5}
                dot={{ fill: chart.dark, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top products table */}
      <TableCard>
        <TableTitle title={`Productos más vendidos — ${period}`} />
        <Table columns={['#', 'Producto', 'Unidades vendidas', 'Ingresos', 'Part. de ventas']}>
          {topProducts.map((p, i) => {
            const totalIngresos = topProducts.reduce((s, x) => s + x.ingresos, 0);
            const pct = Math.round((p.ingresos / totalIngresos) * 100);
            return (
              <tr key={p.nombre} className="hover:bg-brand-25">
                <td className="px-4 py-2.5">
                  <span
                    className={`w-6 h-6 rounded-lg inline-flex items-center justify-center text-xs font-bold ${
                      i === 0 ? 'bg-brand-800 text-white' : 'bg-brand-200 text-brand-800'
                    }`}
                  >
                    {i + 1}
                  </span>
                </td>
                <td className="px-4 py-2.5 font-medium text-brand-800">{p.nombre}</td>
                <td className="px-4 py-2.5 font-mono font-semibold text-brand-800">{p.uds}</td>
                <td className="px-4 py-2.5 font-mono font-semibold text-brand-800">{fmtFull(p.ingresos)}</td>
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
      </TableCard>
    </div>
  );
}
