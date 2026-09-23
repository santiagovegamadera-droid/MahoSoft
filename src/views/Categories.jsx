import { useState } from 'react';

const categories = [
  {
    id: 1,
    name: 'Vestidos',
    productos: 48,
    activos: 44,
    descripcion: 'Vestidos de día, noche y ocasión especial',
    temporada: 'Primavera 2026',
    img: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=80&h=80&fit=crop&auto=format',
  },
  {
    id: 2,
    name: 'Blusas',
    productos: 61,
    activos: 58,
    descripcion: 'Tops, blusas y camisetas',
    temporada: 'Básicos',
    img: 'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=80&h=80&fit=crop&auto=format',
  },
  {
    id: 3,
    name: 'Pantalones',
    productos: 35,
    activos: 30,
    descripcion: 'Jeans, pantalones formales y casuales',
    temporada: 'Básicos',
    img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=80&h=80&fit=crop&auto=format',
  },
  {
    id: 4,
    name: 'Faldas',
    productos: 27,
    activos: 25,
    descripcion: 'Faldas mini, midi y maxi',
    temporada: 'Verano 2026',
    img: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=80&h=80&fit=crop&auto=format',
  },
  {
    id: 5,
    name: 'Conjuntos',
    productos: 19,
    activos: 14,
    descripcion: 'Sets de dos y tres piezas',
    temporada: 'Primavera 2026',
    img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=80&h=80&fit=crop&auto=format',
  },
  {
    id: 6,
    name: 'Abrigos',
    productos: 22,
    activos: 20,
    descripcion: 'Cardigans, blazers y abrigos',
    temporada: 'Otoño 2026',
    img: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=80&h=80&fit=crop&auto=format',
  },
];

const collections = [
  { name: 'Colección Primavera 2026', productos: 67, estado: 'Activa', color: '#503459' },
  { name: 'Básicos Ella', productos: 96, estado: 'Activa', color: '#81638b' },
  { name: 'Edición Verano 2026', productos: 31, estado: 'Activa', color: '#b695c0' },
  { name: 'Colección Noche', productos: 24, estado: 'Borrador', color: '#dac9df' },
  { name: 'Otoño — Invierno 2026', productos: 0, estado: 'Próximamente', color: '#f5f0f7' },
];

export default function Categories() {
  const [tab, setTab] = useState('categorias');

  return (
    <div className="p-8">
      <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit" style={{ background: '#f5f0f7' }}>
        {[
          ['categorias', 'Categorías'],
          ['colecciones', 'Colecciones'],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              background: tab === id ? '#fff' : 'transparent',
              color: tab === id ? '#503459' : '#81638b',
              boxShadow: tab === id ? '0 1px 3px rgba(80,52,89,0.1)' : 'none',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'categorias' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border overflow-hidden hover:shadow-md transition-shadow"
              style={{ borderColor: '#e8dff0' }}
            >
              <div className="relative h-32 overflow-hidden">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                  style={{ background: '#dac9df' }}
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to bottom, transparent 30%, rgba(80,52,89,0.7) 100%)' }}
                />
                <div className="absolute bottom-3 left-4 right-4">
                  <p
                    className="text-white font-semibold"
                    style={{ fontFamily: 'DM Serif Display, serif', fontSize: 18 }}
                  >
                    {cat.name}
                  </p>
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs mb-3" style={{ color: '#81638b' }}>
                  {cat.descripcion}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-center">
                    <p className="text-xl font-bold" style={{ color: '#503459' }}>
                      {cat.productos}
                    </p>
                    <p className="text-[10px] uppercase tracking-wide" style={{ color: '#b695c0' }}>
                      Productos
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold" style={{ color: '#1a7a45' }}>
                      {cat.activos}
                    </p>
                    <p className="text-[10px] uppercase tracking-wide" style={{ color: '#b695c0' }}>
                      Activos
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold" style={{ color: '#c0392b' }}>
                      {cat.productos - cat.activos}
                    </p>
                    <p className="text-[10px] uppercase tracking-wide" style={{ color: '#b695c0' }}>
                      Inactivos
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: '#dac9df', color: '#503459' }}
                  >
                    {cat.temporada}
                  </span>
                  <button
                    className="text-xs px-3 py-1.5 rounded-lg font-semibold"
                    style={{ background: '#f5f0f7', color: '#81638b' }}
                  >
                    Editar
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add new */}
          <button
            className="rounded-2xl border-2 border-dashed h-48 flex flex-col items-center justify-center gap-2 transition-all"
            style={{ borderColor: '#b695c0' }}
          >
            <span className="text-3xl" style={{ color: '#b695c0' }}>
              +
            </span>
            <span className="text-sm font-semibold" style={{ color: '#b695c0' }}>
              Nueva categoría
            </span>
          </button>
        </div>
      )}

      {tab === 'colecciones' && (
        <div className="space-y-3">
          {collections.map((c) => (
            <div
              key={c.name}
              className="bg-white rounded-2xl border flex items-center gap-5 p-5"
              style={{ borderColor: '#e8dff0' }}
            >
              <div className="w-12 h-12 rounded-xl shrink-0" style={{ background: c.color }} />
              <div className="flex-1">
                <p className="font-semibold" style={{ color: '#503459' }}>
                  {c.name}
                </p>
                <p className="text-xs" style={{ color: '#81638b' }}>
                  {c.productos} productos
                </p>
              </div>
              <span
                className="text-xs px-2.5 py-1 rounded-full font-semibold"
                style={{
                  background: c.estado === 'Activa' ? '#d1f5e0' : c.estado === 'Borrador' ? '#fef3e2' : '#f0f0f0',
                  color: c.estado === 'Activa' ? '#1a7a45' : c.estado === 'Borrador' ? '#a0640a' : '#666',
                }}
              >
                {c.estado}
              </span>
              <button
                className="text-xs px-3 py-1.5 rounded-lg font-semibold"
                style={{ background: '#dac9df', color: '#503459' }}
              >
                Gestionar
              </button>
            </div>
          ))}

          <button
            className="w-full py-4 rounded-2xl border-2 border-dashed text-sm font-semibold transition-all"
            style={{ borderColor: '#b695c0', color: '#b695c0' }}
          >
            + Nueva colección
          </button>
        </div>
      )}
    </div>
  );
}
