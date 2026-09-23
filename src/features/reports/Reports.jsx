import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

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

  return (
    <div className="p-8 space-y-6">
      {/* Header controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 p-1 rounded-xl bg-brand-50">
          {['semana', 'mes', 'año'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                period === p
                  ? 'bg-white text-brand-800 shadow-[0_1px_3px_rgba(80,52,89,0.1)]'
                  : 'bg-transparent text-brand-600 shadow-none'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all border-brand-200 text-brand-800">
            📄 Exportar PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all bg-brand-600">
            📊 Exportar Excel
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total ventas',
            val: '$20.050.000',
            sub: '+18% vs. semana pasada',
          },
          { label: 'Transacciones', val: '271', sub: '+24% vs. semana pasada' },
          {
            label: 'Ticket promedio',
            val: '$74.000',
            sub: '−5% vs. semana pasada',
          },
          { label: 'Margen bruto', val: '52%', sub: '+2pp vs. semana pasada' },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-2xl p-5 border border-brand-150">
            <p className="text-xs uppercase tracking-wide mb-2 text-brand-600">{k.label}</p>
            <p className="text-2xl font-bold mb-1 text-brand-800">{k.val}</p>
            <p className="text-xs text-brand-400">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-brand-150">
          <h3 className="text-sm font-semibold mb-1 text-brand-800">Ventas diarias</h3>
          <p className="text-xs mb-4 text-brand-400">Esta semana</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0e8f5" />
              <XAxis dataKey="dia" tick={{ fontSize: 11, fill: '#b695c0' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#b695c0' }} axisLine={false} tickLine={false} tickFormatter={fmt} />
              <Tooltip
                formatter={(v) => [fmtFull(v), 'Ventas']}
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: '1px solid #e8dff0',
                }}
              />
              <Bar dataKey="ventas" fill="#81638b" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-brand-150">
          <h3 className="text-sm font-semibold mb-1 text-brand-800">Transacciones diarias</h3>
          <p className="text-xs mb-4 text-brand-400">Esta semana</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0e8f5" />
              <XAxis dataKey="dia" tick={{ fontSize: 11, fill: '#b695c0' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#b695c0' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: '1px solid #e8dff0',
                }}
              />
              <Line
                type="monotone"
                dataKey="transacciones"
                stroke="#503459"
                strokeWidth={2.5}
                dot={{ fill: '#503459', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top products table */}
      <div className="bg-white rounded-2xl border overflow-hidden border-brand-150">
        <div className="px-5 py-4 border-b border-brand-50">
          <h3 className="text-sm font-semibold text-brand-800">Productos más vendidos — {period}</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-brand-50">
              {['#', 'Producto', 'Unidades vendidas', 'Ingresos', 'Part. de ventas'].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-600"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-50">
            {topProducts.map((p, i) => {
              const totalIngresos = topProducts.reduce((s, x) => s + x.ingresos, 0);
              const pct = Math.round((p.ingresos / totalIngresos) * 100);
              return (
                <tr key={p.nombre} className="hover:bg-brand-25">
                  <td className="px-5 py-3">
                    <span
                      className={`w-6 h-6 rounded-lg inline-flex items-center justify-center text-xs font-bold ${
                        i === 0 ? 'bg-brand-800 text-white' : 'bg-brand-200 text-brand-800'
                      }`}
                    >
                      {i + 1}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-medium text-brand-800">{p.nombre}</td>
                  <td className="px-5 py-3 font-mono font-semibold text-brand-800">{p.uds}</td>
                  <td className="px-5 py-3 font-mono font-semibold text-brand-800">{fmtFull(p.ingresos)}</td>
                  <td className="px-5 py-3">
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
          </tbody>
        </table>
      </div>

      {/* Empleado performance */}
      <div className="bg-white rounded-2xl border overflow-hidden border-brand-150">
        <div className="px-5 py-4 border-b border-brand-50">
          <h3 className="text-sm font-semibold text-brand-800">Rendimiento por vendedor — {period}</h3>
        </div>
        <div className="p-5 grid grid-cols-3 gap-4">
          {[
            {
              name: 'Carla Rodríguez',
              ventas: '$8.450.000',
              trans: 98,
              avg: '$86.224',
            },
            {
              name: 'Sofía Parra',
              ventas: '$6.320.000',
              trans: 74,
              avg: '$85.405',
            },
            {
              name: 'Valentina Ruiz',
              ventas: '$5.280.000',
              trans: 99,
              avg: '$53.333',
            },
          ].map((e, i) => (
            <div
              key={e.name}
              className={`p-4 rounded-xl border border-brand-150 ${i === 0 ? 'bg-brand-50' : 'bg-white'}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${
                    i === 0 ? 'bg-brand-800' : 'bg-brand-600'
                  }`}
                >
                  {e.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-800">{e.name}</p>
                  {i === 0 && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-brand-200 text-brand-800">
                      Top vendedora
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-brand-600">Ventas</span>
                  <span className="font-mono font-semibold text-brand-800">{e.ventas}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-brand-600">Transacciones</span>
                  <span className="font-semibold text-brand-800">{e.trans}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-brand-600">Ticket prom.</span>
                  <span className="font-mono font-semibold text-brand-800">{e.avg}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
