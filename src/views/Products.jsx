import { useState } from 'react';

const products = [
  {
    id: 1,
    name: 'Vestido Floral Verano',
    cat: 'Vestidos',
    precio: 89900,
    tallas: ['XS', 'S', 'M', 'L'],
    colores: ['Rosa', 'Azul'],
    proveedor: 'Textiles Bogotá',
    stock: 28,
    estado: 'Activo',
    img: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=60&h=60&fit=crop&auto=format',
  },
  {
    id: 2,
    name: 'Blusa Seda Negra',
    cat: 'Blusas',
    precio: 65000,
    tallas: ['XS', 'S', 'M', 'L', 'XL'],
    colores: ['Negro', 'Blanco'],
    proveedor: 'ModaCali S.A.',
    stock: 15,
    estado: 'Activo',
    img: 'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=60&h=60&fit=crop&auto=format',
  },
  {
    id: 3,
    name: 'Jean Skinny Azul',
    cat: 'Pantalones',
    precio: 119000,
    tallas: ['25', '26', '28', '30'],
    colores: ['Azul oscuro'],
    proveedor: 'DenimCo',
    stock: 3,
    estado: 'Activo',
    img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=60&h=60&fit=crop&auto=format',
  },
  {
    id: 4,
    name: 'Falda Plisada Beige',
    cat: 'Faldas',
    precio: 75000,
    tallas: ['XS', 'S', 'M', 'L'],
    colores: ['Beige', 'Negro'],
    proveedor: 'Textiles Bogotá',
    stock: 22,
    estado: 'Activo',
    img: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=60&h=60&fit=crop&auto=format',
  },
  {
    id: 5,
    name: 'Conjunto Lino Blanco',
    cat: 'Conjuntos',
    precio: 185000,
    tallas: ['S', 'M', 'L'],
    colores: ['Blanco'],
    proveedor: 'LuxFashion',
    stock: 0,
    estado: 'Activo',
    img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=60&h=60&fit=crop&auto=format',
  },
  {
    id: 6,
    name: 'Cardigan Tejido Crema',
    cat: 'Abrigos',
    precio: 145000,
    tallas: ['S', 'M', 'L', 'XL'],
    colores: ['Crema', 'Gris'],
    proveedor: 'KnitCo',
    stock: 18,
    estado: 'Activo',
    img: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=60&h=60&fit=crop&auto=format',
  },
  {
    id: 7,
    name: 'Top Crop Lentejuelas',
    cat: 'Tops',
    precio: 98000,
    tallas: ['XS', 'S', 'M'],
    colores: ['Dorado', 'Plateado'],
    proveedor: 'GlamourBtq',
    stock: 9,
    estado: 'Activo',
    img: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4017?w=60&h=60&fit=crop&auto=format',
  },
  {
    id: 8,
    name: 'Pantalón Palazzo Rojo',
    cat: 'Pantalones',
    precio: 109000,
    tallas: ['XS', 'S', 'M', 'L'],
    colores: ['Rojo'],
    proveedor: 'ModaCali S.A.',
    stock: 11,
    estado: 'Inactivo',
    img: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=60&h=60&fit=crop&auto=format',
  },
];

const categories = ['Todas', 'Vestidos', 'Blusas', 'Pantalones', 'Faldas', 'Conjuntos', 'Abrigos', 'Tops'];

export default function Products({ onEdit }) {
  const [cat, setCat] = useState('Todas');
  const [search, setSearch] = useState('');

  const filtered = products.filter(
    (p) => (cat === 'Todas' || p.cat === cat) && p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-8">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar producto..."
          className="px-4 py-2.5 text-sm rounded-xl border outline-none"
          style={{ borderColor: '#dac9df', background: '#fff', color: '#503459', width: 220 }}
        />
        <div className="flex gap-1 flex-wrap">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: cat === c ? '#81638b' : '#fff',
                color: cat === c ? '#fff' : '#81638b',
                border: `1px solid ${cat === c ? '#81638b' : '#dac9df'}`,
              }}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="ml-auto flex gap-2">
          <select
            className="px-3 py-2 text-xs rounded-xl border outline-none"
            style={{ borderColor: '#dac9df', color: '#503459' }}
          >
            <option>Todos los estados</option>
            <option>Activo</option>
            <option>Inactivo</option>
          </select>
        </div>
      </div>

      {/* Summary pills */}
      <div className="flex gap-3 mb-5">
        {[
          { label: 'Total productos', val: products.length },
          { label: 'Stock bajo', val: products.filter((p) => p.stock > 0 && p.stock <= 5).length, warn: true },
          { label: 'Agotados', val: products.filter((p) => p.stock === 0).length, danger: true },
          { label: 'Inactivos', val: products.filter((p) => p.estado === 'Inactivo').length },
        ].map((s) => (
          <div
            key={s.label}
            className="px-4 py-2.5 rounded-xl flex items-center gap-2"
            style={{ background: s.danger ? '#fde8ea' : s.warn ? '#fef3e2' : '#dac9df' }}
          >
            <span
              className="text-lg font-bold"
              style={{ color: s.danger ? '#c0392b' : s.warn ? '#a0640a' : '#503459' }}
            >
              {s.val}
            </span>
            <span className="text-xs" style={{ color: s.danger ? '#c0392b' : s.warn ? '#a0640a' : '#81638b' }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#e8dff0' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#f5f0f7' }}>
              {['Producto', 'Categoría', 'Precio', 'Tallas', 'Stock', 'Proveedor', 'Estado', ''].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                  style={{ color: '#81638b' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: '#f5f0f7' }}>
            {filtered.map((p) => (
              <tr
                key={p.id}
                className="transition-colors"
                style={{ cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#faf7fc')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '')}
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.img}
                      alt={p.name}
                      className="w-10 h-10 rounded-lg object-cover"
                      style={{ background: '#dac9df' }}
                    />
                    <span className="font-medium" style={{ color: '#503459' }}>
                      {p.name}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className="text-xs px-2 py-1 rounded-full font-medium"
                    style={{ background: '#dac9df', color: '#503459' }}
                  >
                    {p.cat}
                  </span>
                </td>
                <td
                  className="px-5 py-3.5 font-semibold"
                  style={{ color: '#503459', fontFamily: 'DM Mono, monospace' }}
                >
                  ${p.precio.toLocaleString('es-CO')}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-1 flex-wrap">
                    {p.tallas.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-1.5 py-0.5 rounded border font-medium"
                        style={{ borderColor: '#b695c0', color: '#81638b' }}
                      >
                        {t}
                      </span>
                    ))}
                    {p.tallas.length > 3 && (
                      <span className="text-[10px]" style={{ color: '#b695c0' }}>
                        +{p.tallas.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className="font-bold text-sm"
                    style={{ color: p.stock === 0 ? '#c0392b' : p.stock <= 5 ? '#a0640a' : '#2d6a4f' }}
                  >
                    {p.stock}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-xs" style={{ color: '#81638b' }}>
                  {p.proveedor}
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className="text-xs px-2.5 py-1 rounded-full font-semibold"
                    style={{
                      background: p.estado === 'Activo' ? '#d1f5e0' : '#f0f0f0',
                      color: p.estado === 'Activo' ? '#1a7a45' : '#666',
                    }}
                  >
                    {p.estado}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <button
                    onClick={() => onEdit(p.id)}
                    className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-all"
                    style={{ background: '#dac9df', color: '#503459' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#b695c0')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#dac9df')}
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-5 py-3 flex items-center justify-between border-t" style={{ borderColor: '#f5f0f7' }}>
          <p className="text-xs" style={{ color: '#b695c0' }}>
            Mostrando {filtered.length} de {products.length} productos
          </p>
          <div className="flex gap-1">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                className="w-7 h-7 rounded-lg text-xs font-semibold transition-all"
                style={{ background: n === 1 ? '#81638b' : '#f5f0f7', color: n === 1 ? '#fff' : '#81638b' }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
