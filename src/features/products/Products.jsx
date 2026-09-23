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
          className="px-4 py-2.5 text-sm rounded-xl border outline-none border-brand-200 bg-white text-brand-800 w-[220px]"
        />
        <div className="flex gap-1 flex-wrap">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                cat === c ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-brand-600 border-brand-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="ml-auto flex gap-2">
          <select className="px-3 py-2 text-xs rounded-xl border outline-none border-brand-200 text-brand-800">
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
          {
            label: 'Stock bajo',
            val: products.filter((p) => p.stock > 0 && p.stock <= 5).length,
            warn: true,
          },
          {
            label: 'Agotados',
            val: products.filter((p) => p.stock === 0).length,
            danger: true,
          },
          {
            label: 'Inactivos',
            val: products.filter((p) => p.estado === 'Inactivo').length,
          },
        ].map((s) => (
          <div
            key={s.label}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 ${
              s.danger ? 'bg-danger-soft' : s.warn ? 'bg-warning-soft' : 'bg-brand-200'
            }`}
          >
            <span
              className={`text-lg font-bold ${s.danger ? 'text-danger' : s.warn ? 'text-warning' : 'text-brand-800'}`}
            >
              {s.val}
            </span>
            <span className={`text-xs ${s.danger ? 'text-danger' : s.warn ? 'text-warning' : 'text-brand-600'}`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border overflow-hidden border-brand-150">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-brand-50">
              {['Producto', 'Categoría', 'Precio', 'Tallas', 'Stock', 'Proveedor', 'Estado', ''].map((h) => (
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
            {filtered.map((p) => (
              <tr key={p.id} className="transition-colors cursor-pointer hover:bg-brand-25">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <img src={p.img} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-brand-200" />
                    <span className="font-medium text-brand-800">{p.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-xs px-2 py-1 rounded-full font-medium bg-brand-200 text-brand-800">
                    {p.cat}
                  </span>
                </td>
                <td className="px-5 py-3.5 font-semibold text-brand-800 font-mono">
                  ${p.precio.toLocaleString('es-CO')}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-1 flex-wrap">
                    {p.tallas.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-1.5 py-0.5 rounded border font-medium border-brand-400 text-brand-600"
                      >
                        {t}
                      </span>
                    ))}
                    {p.tallas.length > 3 && <span className="text-[10px] text-brand-400">+{p.tallas.length - 3}</span>}
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`font-bold text-sm ${
                      p.stock === 0 ? 'text-danger' : p.stock <= 5 ? 'text-warning' : 'text-success-dark'
                    }`}
                  >
                    {p.stock}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-xs text-brand-600">{p.proveedor}</td>
                <td className="px-5 py-3.5">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                      p.estado === 'Activo' ? 'bg-success-soft text-success' : 'bg-muted-soft text-muted'
                    }`}
                  >
                    {p.estado}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <button
                    onClick={() => onEdit(p.id)}
                    className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-all bg-brand-200 text-brand-800 hover:bg-brand-400"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-5 py-3 flex items-center justify-between border-t border-brand-50">
          <p className="text-xs text-brand-400">
            Mostrando {filtered.length} de {products.length} productos
          </p>
          <div className="flex gap-1">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all ${
                  n === 1 ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-600'
                }`}
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
