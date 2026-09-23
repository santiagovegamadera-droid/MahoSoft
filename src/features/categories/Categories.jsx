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
  {
    name: 'Colección Primavera 2026',
    productos: 67,
    estado: 'Activa',
    color: 'bg-brand-800',
  },
  {
    name: 'Básicos Ella',
    productos: 96,
    estado: 'Activa',
    color: 'bg-brand-600',
  },
  {
    name: 'Edición Verano 2026',
    productos: 31,
    estado: 'Activa',
    color: 'bg-brand-400',
  },
  {
    name: 'Colección Noche',
    productos: 24,
    estado: 'Borrador',
    color: 'bg-brand-200',
  },
  {
    name: 'Otoño — Invierno 2026',
    productos: 0,
    estado: 'Próximamente',
    color: 'bg-brand-50',
  },
];

export default function Categories() {
  const [tab, setTab] = useState('categorias');

  return (
    <div className="p-8">
      <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit bg-brand-50">
        {[
          ['categorias', 'Categorías'],
          ['colecciones', 'Colecciones'],
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

      {tab === 'categorias' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border overflow-hidden hover:shadow-md transition-shadow border-brand-150"
            >
              <div className="relative h-32 overflow-hidden">
                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover bg-brand-200" />
                <div className="absolute inset-0 bg-linear-to-b from-transparent from-30% to-brand-800/70" />
                <div className="absolute bottom-3 left-4 right-4">
                  <p className="text-white font-semibold font-display text-lg">{cat.name}</p>
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs mb-3 text-brand-600">{cat.descripcion}</p>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-center">
                    <p className="text-xl font-bold text-brand-800">{cat.productos}</p>
                    <p className="text-[10px] uppercase tracking-wide text-brand-400">Productos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-success">{cat.activos}</p>
                    <p className="text-[10px] uppercase tracking-wide text-brand-400">Activos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-danger">{cat.productos - cat.activos}</p>
                    <p className="text-[10px] uppercase tracking-wide text-brand-400">Inactivos</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-brand-200 text-brand-800">{cat.temporada}</span>
                  <button className="text-xs px-3 py-1.5 rounded-lg font-semibold bg-brand-50 text-brand-600">
                    Editar
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add new */}
          <button className="rounded-2xl border-2 border-dashed h-48 flex flex-col items-center justify-center gap-2 transition-all border-brand-400">
            <span className="text-3xl text-brand-400">+</span>
            <span className="text-sm font-semibold text-brand-400">Nueva categoría</span>
          </button>
        </div>
      )}

      {tab === 'colecciones' && (
        <div className="space-y-3">
          {collections.map((c) => (
            <div key={c.name} className="bg-white rounded-2xl border flex items-center gap-5 p-5 border-brand-150">
              <div className={`w-12 h-12 rounded-xl shrink-0 ${c.color}`} />
              <div className="flex-1">
                <p className="font-semibold text-brand-800">{c.name}</p>
                <p className="text-xs text-brand-600">{c.productos} productos</p>
              </div>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                  c.estado === 'Activa'
                    ? 'bg-success-soft text-success'
                    : c.estado === 'Borrador'
                      ? 'bg-warning-soft text-warning'
                      : 'bg-muted-soft text-muted'
                }`}
              >
                {c.estado}
              </span>
              <button className="text-xs px-3 py-1.5 rounded-lg font-semibold bg-brand-200 text-brand-800">
                Gestionar
              </button>
            </div>
          ))}

          <button className="w-full py-4 rounded-2xl border-2 border-dashed text-sm font-semibold transition-all border-brand-400 text-brand-400">
            + Nueva colección
          </button>
        </div>
      )}
    </div>
  );
}
