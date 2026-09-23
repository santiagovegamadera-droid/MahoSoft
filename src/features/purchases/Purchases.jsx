import { useState } from 'react';

const movements = [
  {
    fecha: '2026-09-23',
    tipo: 'entrada',
    producto: 'Vestido Floral Verano',
    talla: 'M',
    color: 'Rosa',
    cant: 20,
    ref: 'OC-2026-045',
    empleado: 'Ana M.',
  },
  {
    fecha: '2026-09-23',
    tipo: 'salida',
    producto: 'Jean Skinny Azul',
    talla: '28',
    color: 'Azul',
    cant: 3,
    ref: 'VTA-0845',
    empleado: 'Carla R.',
  },
  {
    fecha: '2026-09-22',
    tipo: 'salida',
    producto: 'Blusa Seda Negra',
    talla: 'S',
    color: 'Negro',
    cant: 2,
    ref: 'VTA-0844',
    empleado: 'Carla R.',
  },
  {
    fecha: '2026-09-22',
    tipo: 'ajuste',
    producto: 'Falda Plisada Beige',
    talla: 'L',
    color: 'Beige',
    cant: -1,
    ref: 'AJ-0091',
    empleado: 'Ana M.',
  },
  {
    fecha: '2026-09-21',
    tipo: 'entrada',
    producto: 'Cardigan Tejido Crema',
    talla: 'XL',
    color: 'Crema',
    cant: 12,
    ref: 'OC-2026-044',
    empleado: 'Bodega',
  },
  {
    fecha: '2026-09-21',
    tipo: 'salida',
    producto: 'Conjunto Lino Blanco',
    talla: 'M',
    color: 'Blanco',
    cant: 4,
    ref: 'VTA-0843',
    empleado: 'Sofía P.',
  },
];

const stockTable = [
  {
    producto: 'Vestido Floral Verano',
    tallas: { XS: 4, S: 8, M: 10, L: 6, XL: 0 },
    cat: 'Vestidos',
  },
  {
    producto: 'Blusa Seda Negra',
    tallas: { XS: 2, S: 5, M: 5, L: 3, XL: 0 },
    cat: 'Blusas',
  },
  {
    producto: 'Jean Skinny Azul',
    tallas: { 25: 1, 26: 0, 28: 2, 30: 0 },
    cat: 'Pantalones',
  },
  {
    producto: 'Falda Plisada Beige',
    tallas: { XS: 3, S: 6, M: 8, L: 5, XL: 0 },
    cat: 'Faldas',
  },
  {
    producto: 'Conjunto Lino Blanco',
    tallas: { S: 0, M: 0, L: 0 },
    cat: 'Conjuntos',
  },
  {
    producto: 'Cardigan Tejido Crema',
    tallas: { S: 3, M: 5, L: 4, XL: 6 },
    cat: 'Abrigos',
  },
];

export default function Purchases() {
  const [tab, setTab] = useState('stock');

  return (
    <div className="p-8">
      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit bg-brand-50">
        {[
          ['stock', 'Stock actual'],
          ['movimientos', 'Movimientos'],
          ['nuevo', 'Registrar movimiento'],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === id
                ? 'bg-white text-brand-800 shadow-[0_1px_3px_rgba(80,52,89,0.1)]'
                : 'bg-transparent text-brand-600 shadow-none'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'stock' && (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total prendas', val: '312', color: 'text-brand-800' },
              { label: 'Stock bajo (≤5)', val: '8 SKU', color: 'text-warning' },
              { label: 'Sin stock', val: '3 SKU', color: 'text-danger' },
              {
                label: 'Valor inventario',
                val: '$24.8M',
                color: 'text-success-dark',
              },
            ].map((k) => (
              <div key={k.label} className="bg-white rounded-2xl p-4 border border-brand-150">
                <p className="text-xs uppercase tracking-wide mb-1 text-brand-600">{k.label}</p>
                <p className={`text-2xl font-bold ${k.color}`}>{k.val}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border overflow-hidden border-brand-150">
            <div className="px-5 py-4 flex items-center justify-between border-b border-brand-50">
              <h3 className="text-sm font-semibold text-brand-800">Inventario por talla</h3>
              <button className="text-xs px-3 py-1.5 rounded-lg font-semibold bg-brand-200 text-brand-800">
                Exportar Excel
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-brand-50">
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-600">
                      Producto
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-600">
                      Categoría
                    </th>
                    {['XS', 'S', 'M', 'L', 'XL', '26', '28', '30'].map((t) => (
                      <th
                        key={t}
                        className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-brand-600"
                      >
                        {t}
                      </th>
                    ))}
                    <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-brand-600">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-50">
                  {stockTable.map((row) => {
                    const tallas = ['XS', 'S', 'M', 'L', 'XL', '26', '28', '30'];
                    const total = Object.values(row.tallas).reduce((a, b) => a + b, 0);
                    return (
                      <tr key={row.producto} className="hover:bg-brand-25">
                        <td className="px-5 py-3 font-medium text-brand-800">{row.producto}</td>
                        <td className="px-5 py-3">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-brand-200 text-brand-800">
                            {row.cat}
                          </span>
                        </td>
                        {tallas.map((t) => {
                          const v = row.tallas[t];
                          return (
                            <td key={t} className="px-3 py-3 text-center">
                              {v !== undefined ? (
                                <span
                                  className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold ${
                                    v === 0
                                      ? 'bg-danger-soft text-danger'
                                      : v <= 3
                                        ? 'bg-warning-soft text-warning'
                                        : 'bg-brand-200 text-brand-800'
                                  }`}
                                >
                                  {v}
                                </span>
                              ) : (
                                <span className="text-brand-150">—</span>
                              )}
                            </td>
                          );
                        })}
                        <td className="px-5 py-3 text-center">
                          <span className="font-bold text-sm text-brand-800">{total}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === 'movimientos' && (
        <div className="bg-white rounded-2xl border overflow-hidden border-brand-150">
          <div className="px-5 py-4 border-b flex items-center justify-between border-brand-50">
            <h3 className="text-sm font-semibold text-brand-800">Historial de movimientos</h3>
            <div className="flex gap-2">
              <select className="px-3 py-1.5 text-xs rounded-xl border outline-none border-brand-200 text-brand-800">
                <option>Todos los tipos</option>
                <option>Entradas</option>
                <option>Salidas</option>
                <option>Ajustes</option>
              </select>
            </div>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-50">
                {['Fecha', 'Tipo', 'Producto', 'Talla', 'Color', 'Cantidad', 'Referencia', 'Empleado'].map((h) => (
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
              {movements.map((m, i) => (
                <tr key={i} className="hover:bg-brand-25">
                  <td className="px-5 py-3 text-xs font-mono text-brand-600">{m.fecha}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        m.tipo === 'entrada'
                          ? 'bg-success-soft text-success'
                          : m.tipo === 'salida'
                            ? 'bg-danger-soft text-danger'
                            : 'bg-warning-soft text-warning'
                      }`}
                    >
                      {m.tipo}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-medium text-brand-800">{m.producto}</td>
                  <td className="px-5 py-3 text-xs text-brand-600">{m.talla}</td>
                  <td className="px-5 py-3 text-xs text-brand-600">{m.color}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`font-bold font-mono ${
                        m.cant < 0 ? 'text-danger' : m.tipo === 'entrada' ? 'text-success' : 'text-brand-800'
                      }`}
                    >
                      {m.cant > 0 ? '+' : ''}
                      {m.cant}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs font-mono text-brand-600">{m.ref}</td>
                  <td className="px-5 py-3 text-xs text-brand-600">{m.empleado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'nuevo' && (
        <div className="max-w-lg">
          <div className="bg-white rounded-2xl p-6 border space-y-4 border-brand-150">
            <h3 className="text-sm font-semibold text-brand-800">Nuevo movimiento de inventario</h3>
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide text-brand-800">
                Tipo de movimiento
              </label>
              <div className="flex gap-2">
                {['Entrada', 'Salida', 'Ajuste'].map((t) => (
                  <button
                    key={t}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                      t === 'Entrada'
                        ? 'bg-brand-600 border-brand-600 text-white'
                        : 'bg-white border-brand-200 text-brand-600'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            {[
              {
                label: 'Producto',
                type: 'select',
                opts: ['Vestido Floral Verano', 'Blusa Seda Negra', 'Jean Skinny Azul'],
              },
              {
                label: 'Talla',
                type: 'select',
                opts: ['XS', 'S', 'M', 'L', 'XL'],
              },
              {
                label: 'Color',
                type: 'select',
                opts: ['Rosa', 'Azul', 'Negro', 'Blanco'],
              },
              { label: 'Cantidad', type: 'number' },
              { label: 'Referencia / Nota', type: 'text' },
            ].map((f) => (
              <div key={f.label}>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide text-brand-800">
                  {f.label}
                </label>
                {f.type === 'select' ? (
                  <select className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none border-brand-200 text-brand-800">
                    {f.opts?.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={f.type}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none border-brand-200 text-brand-800"
                  />
                )}
              </div>
            ))}
            <button className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-brand-600">
              Registrar movimiento
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
