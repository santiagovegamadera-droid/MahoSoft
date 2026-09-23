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
import { TrendingDown, TrendingUp } from 'lucide-react';

const salesData = [
  { mes: 'Abr', ventas: 8200000, meta: 9000000 },
  { mes: 'May', ventas: 11400000, meta: 10000000 },
  { mes: 'Jun', ventas: 9800000, meta: 10000000 },
  { mes: 'Jul', ventas: 13200000, meta: 12000000 },
  { mes: 'Ago', ventas: 10600000, meta: 11000000 },
  { mes: 'Sep', ventas: 15100000, meta: 13000000 },
];

const categoryData = [
  { name: 'Vestidos', value: 34 },
  { name: 'Blusas', value: 26 },
  { name: 'Pantalones', value: 18 },
  { name: 'Faldas', value: 13 },
  { name: 'Otros', value: 9 },
];

const COLORS = ['#503459', '#81638b', '#b695c0', '#dac9df', '#e8dff0'];

const topProducts = [
  {
    name: 'Vestido Floral Verano',
    cat: 'Vestidos',
    ventas: 48,
    ingresos: '$2.880.000',
    stock: 12,
  },
  {
    name: 'Blusa Seda Negra',
    cat: 'Blusas',
    ventas: 41,
    ingresos: '$1.845.000',
    stock: 8,
  },
  {
    name: 'Jean Skinny Azul',
    cat: 'Pantalones',
    ventas: 37,
    ingresos: '$2.035.000',
    stock: 3,
  },
  {
    name: 'Falda Plisada Beige',
    cat: 'Faldas',
    ventas: 29,
    ingresos: '$1.305.000',
    stock: 15,
  },
  {
    name: 'Conjunto Lino Blanco',
    cat: 'Conjuntos',
    ventas: 24,
    ingresos: '$1.920.000',
    stock: 0,
  },
];

const alerts = [
  { product: 'Jean Skinny Azul', talla: 'S', stock: 3, min: 5 },
  { product: 'Botas Cuero Café', talla: '37', stock: 2, min: 4 },
  { product: 'Conjunto Lino Blanco', talla: 'M', stock: 0, min: 5 },
  { product: 'Blusa Manga Globo', talla: 'XS', stock: 1, min: 5 },
];

const fmt = (n) =>
  new Intl.NumberFormat('es-CO', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(n);

export default function Dashboard() {
  return (
    <div className="p-8 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Ventas de hoy',
            value: '$1.245.000',
            delta: '+12%',
            sub: 'vs. ayer',
            up: true,
          },
          {
            label: 'Ventas del mes',
            value: '$15.100.000',
            delta: '+16%',
            sub: 'vs. sep anterior',
            up: true,
          },
          {
            label: 'Transacciones hoy',
            value: '34',
            delta: '+5',
            sub: 'vs. ayer',
            up: true,
          },
          {
            label: 'Ticket promedio',
            value: '$366.000',
            delta: '-3%',
            sub: 'vs. mes anterior',
            up: false,
          },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-5 border border-brand-150">
            <p className="text-xs font-medium uppercase tracking-wide mb-3 text-brand-600">{card.label}</p>
            <p className="text-2xl font-bold mb-1 text-brand-800">{card.value}</p>
            <div className="flex items-center gap-1.5">
              <span
                className={`flex items-center gap-1 text-xs font-semibold px-1.5 py-0.5 rounded ${
                  card.up ? 'bg-brand-200 text-brand-800' : 'bg-rose-soft text-rose'
                }`}
              >
                {card.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {card.delta}
              </span>
              <span className="text-xs text-brand-400">{card.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Area chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-brand-150">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-brand-800">Ingresos vs. Meta</h3>
              <p className="text-xs text-brand-400">Últimos 6 meses</p>
            </div>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-brand-600">
                <span className="inline-block w-3 h-0.5 rounded bg-brand-600" />
                Ventas
              </span>
              <span className="flex items-center gap-1.5 text-brand-200">
                <span className="inline-block w-3 h-0.5 rounded border border-dashed border-brand-400" />
                Meta
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="gVentas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#81638b" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#81638b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0e8f5" />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#b695c0' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#b695c0' }} axisLine={false} tickLine={false} tickFormatter={fmt} />
              <Tooltip
                formatter={(v) => [`$${fmt(v)}`, '']}
                contentStyle={{
                  border: '1px solid #e8dff0',
                  borderRadius: 10,
                  fontSize: 12,
                  color: '#503459',
                }}
              />
              <Area
                type="monotone"
                dataKey="meta"
                stroke="#dac9df"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                fill="none"
              />
              <Area type="monotone" dataKey="ventas" stroke="#81638b" strokeWidth={2.5} fill="url(#gVentas)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="bg-white rounded-2xl p-5 border border-brand-150">
          <h3 className="text-sm font-semibold mb-1 text-brand-800">Ventas por categoría</h3>
          <p className="text-xs mb-4 text-brand-400">Mes actual</p>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={65}
                dataKey="value"
                paddingAngle={2}
              >
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v) => [`${v}%`, '']}
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: '1px solid #e8dff0',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-3">
            {categoryData.map((c, i) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ background: COLORS[i] }} />
                  <span className="text-brand-800">{c.name}</span>
                </div>
                <span className="font-semibold text-brand-600">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top products */}
        <div className="bg-white rounded-2xl border border-brand-150">
          <div className="px-5 py-4 border-b border-brand-100">
            <h3 className="text-sm font-semibold text-brand-800">Productos más vendidos</h3>
            <p className="text-xs text-brand-400">Este mes</p>
          </div>
          <div className="divide-y divide-brand-50">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                      i === 0 ? 'bg-brand-800 text-white' : 'bg-brand-200 text-brand-800'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-brand-800">{p.name}</p>
                    <p className="text-xs text-brand-400">{p.cat}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-brand-800">{p.ingresos}</p>
                  <p className="text-xs text-brand-400">{p.ventas} uds.</p>
                </div>
                <span
                  className={`ml-3 text-xs px-2 py-0.5 rounded-full font-medium ${
                    p.stock === 0
                      ? 'bg-danger-soft text-danger'
                      : p.stock <= 3
                        ? 'bg-warning-soft text-warning'
                        : 'bg-brand-200 text-brand-800'
                  }`}
                >
                  {p.stock === 0 ? 'Agotado' : `${p.stock} left`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stock alerts */}
        <div className="bg-white rounded-2xl border border-brand-150">
          <div className="px-5 py-4 border-b flex items-center justify-between border-brand-100">
            <div>
              <h3 className="text-sm font-semibold text-brand-800">Alertas de stock bajo</h3>
              <p className="text-xs text-brand-400">Requieren reabastecimiento</p>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-danger-soft text-danger">
              {alerts.length} alertas
            </span>
          </div>
          <div className="p-5 space-y-3">
            {alerts.map((a) => (
              <div
                key={a.product + a.talla}
                className={`flex items-center justify-between p-3 rounded-xl border ${
                  a.stock === 0 ? 'bg-danger-tint border-danger-line' : 'bg-warning-tint border-warning-line'
                }`}
              >
                <div>
                  <p className="text-sm font-medium text-brand-800">{a.product}</p>
                  <p className="text-xs text-brand-400">Talla {a.talla}</p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${a.stock === 0 ? 'text-danger' : 'text-warning'}`}>{a.stock}</p>
                  <p className="text-xs text-brand-400">/ mín. {a.min}</p>
                </div>
                <button className="ml-3 text-xs px-3 py-1.5 rounded-lg font-semibold bg-brand-600 text-white">
                  Pedir
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
