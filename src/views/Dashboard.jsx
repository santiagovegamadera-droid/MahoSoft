import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

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
  { name: 'Vestido Floral Verano', cat: 'Vestidos', ventas: 48, ingresos: '$2.880.000', stock: 12 },
  { name: 'Blusa Seda Negra', cat: 'Blusas', ventas: 41, ingresos: '$1.845.000', stock: 8 },
  { name: 'Jean Skinny Azul', cat: 'Pantalones', ventas: 37, ingresos: '$2.035.000', stock: 3 },
  { name: 'Falda Plisada Beige', cat: 'Faldas', ventas: 29, ingresos: '$1.305.000', stock: 15 },
  { name: 'Conjunto Lino Blanco', cat: 'Conjuntos', ventas: 24, ingresos: '$1.920.000', stock: 0 },
];

const alerts = [
  { product: 'Jean Skinny Azul', talla: 'S', stock: 3, min: 5 },
  { product: 'Botas Cuero Café', talla: '37', stock: 2, min: 4 },
  { product: 'Conjunto Lino Blanco', talla: 'M', stock: 0, min: 5 },
  { product: 'Blusa Manga Globo', talla: 'XS', stock: 1, min: 5 },
];

const fmt = (n) => new Intl.NumberFormat('es-CO', { notation: 'compact', maximumFractionDigits: 1 }).format(n);

export default function Dashboard() {
  return (
    <div className="p-8 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Ventas de hoy', value: '$1.245.000', delta: '+12%', sub: 'vs. ayer', icon: '↑' },
          { label: 'Ventas del mes', value: '$15.100.000', delta: '+16%', sub: 'vs. sep anterior', icon: '↑' },
          { label: 'Transacciones hoy', value: '34', delta: '+5', sub: 'vs. ayer', icon: '↑' },
          { label: 'Ticket promedio', value: '$366.000', delta: '-3%', sub: 'vs. mes anterior', icon: '↓' },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-5 border" style={{ borderColor: '#e8dff0' }}>
            <p className="text-xs font-medium uppercase tracking-wide mb-3" style={{ color: '#81638b' }}>
              {card.label}
            </p>
            <p className="text-2xl font-bold mb-1" style={{ color: '#503459' }}>
              {card.value}
            </p>
            <div className="flex items-center gap-1.5">
              <span
                className="text-xs font-semibold px-1.5 py-0.5 rounded"
                style={{
                  background: card.icon === '↑' ? '#dac9df' : '#f5dde0',
                  color: card.icon === '↑' ? '#503459' : '#a0404a',
                }}
              >
                {card.delta}
              </span>
              <span className="text-xs" style={{ color: '#b695c0' }}>
                {card.sub}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Area chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border" style={{ borderColor: '#e8dff0' }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold" style={{ color: '#503459' }}>
                Ingresos vs. Meta
              </h3>
              <p className="text-xs" style={{ color: '#b695c0' }}>
                Últimos 6 meses
              </p>
            </div>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1.5" style={{ color: '#81638b' }}>
                <span className="inline-block w-3 h-0.5 rounded" style={{ background: '#81638b' }} />
                Ventas
              </span>
              <span className="flex items-center gap-1.5" style={{ color: '#dac9df' }}>
                <span
                  className="inline-block w-3 h-0.5 rounded border border-dashed"
                  style={{ borderColor: '#b695c0' }}
                />
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
                contentStyle={{ border: '1px solid #e8dff0', borderRadius: 10, fontSize: 12, color: '#503459' }}
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
        <div className="bg-white rounded-2xl p-5 border" style={{ borderColor: '#e8dff0' }}>
          <h3 className="text-sm font-semibold mb-1" style={{ color: '#503459' }}>
            Ventas por categoría
          </h3>
          <p className="text-xs mb-4" style={{ color: '#b695c0' }}>
            Mes actual
          </p>
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
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e8dff0' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-3">
            {categoryData.map((c, i) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ background: COLORS[i] }} />
                  <span style={{ color: '#503459' }}>{c.name}</span>
                </div>
                <span className="font-semibold" style={{ color: '#81638b' }}>
                  {c.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top products */}
        <div className="bg-white rounded-2xl border" style={{ borderColor: '#e8dff0' }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: '#f0e8f5' }}>
            <h3 className="text-sm font-semibold" style={{ color: '#503459' }}>
              Productos más vendidos
            </h3>
            <p className="text-xs" style={{ color: '#b695c0' }}>
              Este mes
            </p>
          </div>
          <div className="divide-y" style={{ borderColor: '#f5f0f7' }}>
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <span
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ background: i === 0 ? '#503459' : '#dac9df', color: i === 0 ? '#fff' : '#503459' }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#503459' }}>
                      {p.name}
                    </p>
                    <p className="text-xs" style={{ color: '#b695c0' }}>
                      {p.cat}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold" style={{ color: '#503459' }}>
                    {p.ingresos}
                  </p>
                  <p className="text-xs" style={{ color: '#b695c0' }}>
                    {p.ventas} uds.
                  </p>
                </div>
                <span
                  className="ml-3 text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{
                    background: p.stock === 0 ? '#fde8ea' : p.stock <= 3 ? '#fef3e2' : '#dac9df',
                    color: p.stock === 0 ? '#c0392b' : p.stock <= 3 ? '#a0640a' : '#503459',
                  }}
                >
                  {p.stock === 0 ? 'Agotado' : `${p.stock} left`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stock alerts */}
        <div className="bg-white rounded-2xl border" style={{ borderColor: '#e8dff0' }}>
          <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: '#f0e8f5' }}>
            <div>
              <h3 className="text-sm font-semibold" style={{ color: '#503459' }}>
                Alertas de stock bajo
              </h3>
              <p className="text-xs" style={{ color: '#b695c0' }}>
                Requieren reabastecimiento
              </p>
            </div>
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: '#fde8ea', color: '#c0392b' }}
            >
              {alerts.length} alertas
            </span>
          </div>
          <div className="p-5 space-y-3">
            {alerts.map((a) => (
              <div
                key={a.product + a.talla}
                className="flex items-center justify-between p-3 rounded-xl"
                style={{
                  background: a.stock === 0 ? '#fff5f5' : '#fffbf0',
                  border: `1px solid ${a.stock === 0 ? '#fdd8d8' : '#fde8c0'}`,
                }}
              >
                <div>
                  <p className="text-sm font-medium" style={{ color: '#503459' }}>
                    {a.product}
                  </p>
                  <p className="text-xs" style={{ color: '#b695c0' }}>
                    Talla {a.talla}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold" style={{ color: a.stock === 0 ? '#c0392b' : '#a0640a' }}>
                    {a.stock}
                  </p>
                  <p className="text-xs" style={{ color: '#b695c0' }}>
                    / mín. {a.min}
                  </p>
                </div>
                <button
                  className="ml-3 text-xs px-3 py-1.5 rounded-lg font-semibold"
                  style={{ background: '#81638b', color: '#fff' }}
                >
                  Pedir
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="bg-white rounded-2xl p-5 border" style={{ borderColor: '#e8dff0' }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: '#503459' }}>
          Ventas por hora — hoy
        </h3>
        <p className="text-xs mb-4" style={{ color: '#b695c0' }}>
          Distribución del día actual
        </p>
        <ResponsiveContainer width="100%" height={130}>
          <BarChart
            data={[
              { h: '8am', v: 120000 },
              { h: '9am', v: 280000 },
              { h: '10am', v: 410000 },
              { h: '11am', v: 390000 },
              { h: '12pm', v: 510000 },
              { h: '1pm', v: 300000 },
              { h: '2pm', v: 190000 },
              { h: '3pm', v: 420000 },
              { h: '4pm', v: 580000 },
              { h: '5pm', v: 340000 },
              { h: '6pm', v: 210000 },
              { h: '7pm', v: 90000 },
            ]}
            barSize={18}
          >
            <XAxis dataKey="h" tick={{ fontSize: 11, fill: '#b695c0' }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip
              formatter={(v) => [`$${fmt(v)}`, '']}
              contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e8dff0' }}
            />
            <Bar dataKey="v" fill="#b695c0" radius={[4, 4, 0, 0]}>
              {[...Array(12)].map((_, i) => (
                <Cell key={i} fill={i === 8 ? '#503459' : '#b695c0'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
