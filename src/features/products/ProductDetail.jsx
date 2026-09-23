import { useState } from 'react';
import { ArrowLeft, Check, ImagePlus, Plus, X } from 'lucide-react';

const sizeGroups = {
  ropa: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  zapatos: ['35', '36', '37', '38', '39', '40'],
  pantalones: ['25', '26', '27', '28', '29', '30', '32'],
};

export default function ProductDetail({ onBack }) {
  const [name, setName] = useState('Vestido Floral Verano');
  const [cat, setCat] = useState('Vestidos');
  const [price, setPrice] = useState('89900');
  const [status, setStatus] = useState('Activo');
  const [selectedSizes, setSelectedSizes] = useState(['XS', 'S', 'M', 'L']);
  const [colors, setColors] = useState(['Rosa', 'Azul']);
  const [newColor, setNewColor] = useState('');
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState('general');

  function toggleSize(s) {
    setSelectedSizes((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  }
  function addColor() {
    if (newColor.trim()) {
      setColors((prev) => [...prev, newColor.trim()]);
      setNewColor('');
    }
  }
  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const tabs = [
    { id: 'general', label: 'Información general' },
    { id: 'inventario', label: 'Inventario por talla' },
    { id: 'imagenes', label: 'Imágenes' },
  ];

  return (
    <div className="p-8 max-w-4xl">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm mb-6 font-medium transition-colors text-brand-600"
      >
        <ArrowLeft size={16} /> Volver a productos
      </button>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit bg-brand-50">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === t.id
                ? 'bg-white text-brand-800 shadow-[0_1px_3px_rgba(80,52,89,0.1)]'
                : 'bg-transparent text-brand-600 shadow-none'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'general' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Main form */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-brand-150">
              <h3 className="text-sm font-semibold mb-4 text-brand-800">Datos del producto</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide text-brand-800">
                    Nombre
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none border-brand-200 text-brand-800 focus:border-brand-600"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide text-brand-800">
                      Categoría
                    </label>
                    <select
                      value={cat}
                      onChange={(e) => setCat(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none border-brand-200 text-brand-800"
                    >
                      {['Vestidos', 'Blusas', 'Pantalones', 'Faldas', 'Conjuntos', 'Abrigos', 'Tops', 'Accesorios'].map(
                        (c) => (
                          <option key={c}>{c}</option>
                        ),
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide text-brand-800">
                      Proveedor
                    </label>
                    <select className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none border-brand-200 text-brand-800">
                      {['Textiles Bogotá', 'ModaCali S.A.', 'DenimCo', 'LuxFashion', 'KnitCo'].map((p) => (
                        <option key={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide text-brand-800">
                      Precio de venta
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-sm text-brand-400">$</span>
                      <input
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full pl-7 pr-4 py-2.5 rounded-xl border text-sm outline-none font-mono border-brand-200 text-brand-800"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide text-brand-800">
                      Precio de costo
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-sm text-brand-400">$</span>
                      <input
                        defaultValue="45000"
                        className="w-full pl-7 pr-4 py-2.5 rounded-xl border text-sm outline-none font-mono border-brand-200 text-brand-800"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide text-brand-800">
                    Descripción
                  </label>
                  <textarea
                    rows={3}
                    defaultValue="Vestido floral de verano en tela fresca y liviana. Ideal para ocasiones casuales y de playa."
                    className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none resize-none border-brand-200 text-brand-800 focus:border-brand-600"
                  />
                </div>
              </div>
            </div>

            {/* Tallas */}
            <div className="bg-white rounded-2xl p-6 border border-brand-150">
              <h3 className="text-sm font-semibold mb-4 text-brand-800">Tallas disponibles</h3>
              <div className="flex gap-2 flex-wrap">
                {sizeGroups.ropa.map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleSize(s)}
                    className={`w-12 h-10 rounded-xl text-sm font-semibold border-2 transition-all ${
                      selectedSizes.includes(s)
                        ? 'bg-brand-600 border-brand-600 text-white'
                        : 'bg-white border-brand-200 text-brand-600'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Colores */}
            <div className="bg-white rounded-2xl p-6 border border-brand-150">
              <h3 className="text-sm font-semibold mb-4 text-brand-800">Colores</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {colors.map((c) => (
                  <span
                    key={c}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-brand-200 text-brand-800"
                  >
                    {c}
                    <button
                      onClick={() => setColors((prev) => prev.filter((x) => x !== c))}
                      className="ml-1 text-brand-600"
                      aria-label={`Quitar ${c}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addColor()}
                  placeholder="Agregar color..."
                  className="flex-1 px-3 py-2 rounded-xl border text-sm outline-none border-brand-200 text-brand-800"
                />
                <button
                  onClick={addColor}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-brand-200 text-brand-800"
                >
                  <Plus size={16} /> Agregar
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-brand-150">
              <h3 className="text-sm font-semibold mb-4 text-brand-800">Estado</h3>
              <div className="flex gap-2">
                {['Activo', 'Inactivo'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                      status === s
                        ? 'bg-brand-600 border-brand-600 text-white'
                        : 'bg-white border-brand-200 text-brand-600'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-brand-150">
              <h3 className="text-sm font-semibold mb-4 text-brand-800">Colección</h3>
              <select className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none border-brand-200 text-brand-800">
                <option>Temporada Primavera 2026</option>
                <option>Colección Noche</option>
                <option>Básicos</option>
                <option>Edición Limitada</option>
              </select>
            </div>

            <div className="rounded-2xl p-5 border bg-brand-200 border-brand-400">
              <p className="text-xs font-semibold mb-2 uppercase tracking-wide text-brand-800">Margen de ganancia</p>
              <p className="text-3xl font-bold text-brand-800">50%</p>
              <p className="text-xs mt-1 text-brand-600">Costo: $45.000 → Precio: $89.900</p>
            </div>

            <button
              onClick={save}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all ${
                saved ? 'bg-success-dark' : 'bg-brand-600'
              }`}
            >
              {saved ? (
                <>
                  <Check size={16} /> Guardado
                </>
              ) : (
                'Guardar cambios'
              )}
            </button>
            <button className="w-full py-2.5 rounded-xl text-sm font-semibold border transition-all border-brand-200 text-brand-600">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {tab === 'inventario' && (
        <div className="bg-white rounded-2xl border overflow-hidden border-brand-150">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-50">
                {['Talla', 'Color', 'Stock actual', 'Stock mínimo', 'Precio especial', 'Acciones'].map((h) => (
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
              {selectedSizes
                .flatMap((s) =>
                  colors.map((c) => ({
                    s,
                    c,
                    stock: Math.floor(Math.random() * 15),
                  })),
                )
                .map((row) => (
                  <tr key={row.s + row.c}>
                    <td className="px-5 py-3">
                      <span className="font-semibold text-brand-800">{row.s}</span>
                    </td>
                    <td className="px-5 py-3 text-xs text-brand-600">{row.c}</td>
                    <td className="px-5 py-3">
                      <input
                        defaultValue={row.stock}
                        type="number"
                        className="w-20 px-3 py-1.5 rounded-lg border text-sm outline-none text-center font-mono border-brand-200 text-brand-800"
                      />
                    </td>
                    <td className="px-5 py-3">
                      <input
                        defaultValue={5}
                        type="number"
                        className="w-20 px-3 py-1.5 rounded-lg border text-sm outline-none text-center border-brand-200 text-brand-800"
                      />
                    </td>
                    <td className="px-5 py-3">
                      <input
                        placeholder="—"
                        className="w-28 px-3 py-1.5 rounded-lg border text-sm outline-none font-mono border-brand-200 text-brand-800"
                      />
                    </td>
                    <td className="px-5 py-3">
                      <button className="text-xs px-2 py-1 rounded-lg bg-brand-200 text-brand-800">Ajustar</button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'imagenes' && (
        <div className="grid grid-cols-3 gap-4">
          <img
            src="https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=300&h=300&fit=crop&auto=format"
            alt="Producto 1"
            className="rounded-2xl object-cover w-full aspect-square"
          />
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=300&fit=crop&auto=format"
            alt="Producto 2"
            className="rounded-2xl object-cover w-full aspect-square"
          />
          <div className="rounded-2xl aspect-square flex flex-col items-center justify-center gap-2 border-2 border-dashed cursor-pointer transition-all border-brand-400">
            <ImagePlus size={28} strokeWidth={1.5} className="text-brand-400" />
            <span className="text-xs font-medium text-brand-400">Agregar imagen</span>
          </div>
        </div>
      )}
    </div>
  );
}
