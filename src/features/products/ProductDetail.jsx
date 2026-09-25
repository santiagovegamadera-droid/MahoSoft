import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, X } from 'lucide-react';
import useProducts, { sortSizes } from '@/features/products/store';
import useCategories, { isActiveCategory } from '@/features/categories/store';
import useSuppliers from '@/features/suppliers/store';
import { lastPurchaseOf, suppliersOfProduct, usePurchases } from '@/features/purchases/store';
import useSettings from '@/features/settings/store';
import ImageUpload from '@/features/products/ImageUpload';
import ConfirmDialog from '@/shared/components/ConfirmDialog';
import { Button, Field, StatusToggle, inputClass } from '@/shared/components/Form';

const emptyProduct = {
  name: '',
  catId: null,
  precio: 0,
  costo: 0,
  descripcion: '',
  colores: [],
  stock: {},
  estado: 'Activo',
  img: '',
};

// Form keeps the price as a string while typing; ids come from selects as strings.
// costo isn't edited here: it comes from the product's latest purchase
const toForm = (p) => ({ ...p, precio: String(p.precio || '') });
const toId = (v) => (v === '' ? null : Number(v));
const fmtDate = (d) =>
  new Date(`${d}T00:00`).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });

export default function ProductDetail({ productId, onBack }) {
  const { getById, create, update, remove } = useProducts();
  const { items: categories } = useCategories();
  const { items: suppliers } = useSuppliers();
  const { items: purchases } = usePurchases();
  const { tallas } = useSettings();
  const existing = productId != null ? getById(productId) : null;

  const [form, setForm] = useState(() => toForm(existing ?? { ...emptyProduct, catId: categories[0]?.id ?? null }));
  const [newColor, setNewColor] = useState('');
  const [errors, setErrors] = useState({});
  const [tab, setTab] = useState('general');
  const [deleting, setDeleting] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setId = (k) => (e) => setForm((f) => ({ ...f, [k]: toId(e.target.value) }));

  // Sizes this product has that are no longer configured stay visible so they can be removed
  const configured = tallas.flatMap((g) => g.valores);
  const otherSizes = Object.keys(form.stock).filter((s) => !configured.includes(s));
  const sizeGroups = otherSizes.length ? [...tallas, { nombre: 'Otras', valores: otherSizes }] : tallas;

  function toggleSize(s) {
    setForm((f) => {
      const stock = { ...f.stock };
      if (s in stock) delete stock[s];
      else stock[s] = 0;
      return { ...f, stock };
    });
  }
  function setSizeStock(s, value) {
    setForm((f) => ({ ...f, stock: { ...f.stock, [s]: Math.max(0, Number(value) || 0) } }));
  }
  function addColor() {
    const c = newColor.trim();
    if (c && !form.colores.includes(c)) setForm((f) => ({ ...f, colores: [...f.colores, c] }));
    setNewColor('');
  }

  function save() {
    const next = {};
    if (!form.name.trim()) next.name = 'El nombre es obligatorio';
    if (!form.catId) next.catId = 'Elige una categoría';
    if (!(Number(form.precio) > 0)) next.precio = 'Ingresa un precio mayor a 0';
    setErrors(next);
    if (Object.keys(next).length > 0) return setTab('general');

    const data = { ...form, name: form.name.trim(), precio: Number(form.precio), costo: existing?.costo ?? 0 };
    if (existing) update(existing.id, data);
    else create(data);
    onBack();
  }

  const precio = Number(form.precio) || 0;
  const costo = existing?.costo || 0;
  const supplierIds = existing ? suppliersOfProduct(purchases, existing.id) : [];
  const lastPurchase = existing ? lastPurchaseOf(purchases, existing.id) : null;
  const supplierName = (id) => suppliers.find((s) => s.id === id)?.name ?? 'Proveedor eliminado';
  const margin = precio > 0 ? Math.round(((precio - costo) / precio) * 100) : 0;
  const sizes = sortSizes(Object.keys(form.stock), tallas);

  const tabs = [
    { id: 'general', label: 'Información general' },
    { id: 'inventario', label: 'Inventario por talla' },
  ];

  return (
    <div className="p-6 max-w-4xl">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm mb-6 font-medium transition-colors text-brand-600 hover:text-brand-800"
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 space-y-4">
          {tab === 'general' && (
            <>
              <div className="bg-white rounded-2xl p-5 border border-brand-150 space-y-4">
                <h3 className="text-sm font-semibold text-brand-800">Datos del producto</h3>
                <div className="flex gap-5">
                  <ImageUpload
                    value={form.img}
                    onChange={(img) => setForm((f) => ({ ...f, img }))}
                    alt={form.name}
                  />
                  <div className="flex-1 min-w-0 space-y-4">
                    <Field label="Nombre" error={errors.name}>
                      <input value={form.name} onChange={set('name')} className={inputClass} />
                    </Field>
                    <Field label="Categoría" error={errors.catId}>
                      <select value={form.catId ?? ''} onChange={setId('catId')} className={inputClass}>
                        <option value="">Elegir…</option>
                        {categories
                          .filter((c) => isActiveCategory(c) || c.id === form.catId)
                          .map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                      </select>
                    </Field>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Precio de venta" error={errors.precio}>
                    <input
                      type="number"
                      min="0"
                      value={form.precio}
                      onChange={set('precio')}
                      className={`${inputClass} font-mono`}
                    />
                  </Field>
                </div>
                <Field label="Descripción">
                  <textarea
                    rows={3}
                    value={form.descripcion}
                    onChange={set('descripcion')}
                    className={`${inputClass} resize-none`}
                  />
                </Field>
              </div>

              {/* Tallas */}
              <div className="bg-white rounded-2xl p-5 border border-brand-150">
                <h3 className="text-sm font-semibold mb-4 text-brand-800">Tallas disponibles</h3>
                <div className="space-y-2">
                  {sizeGroups.map((group) => (
                    <div key={group.nombre} className="flex gap-2 flex-wrap">
                      {group.valores.map((s) => (
                        <button
                          key={s}
                          onClick={() => toggleSize(s)}
                          className={`min-w-12 px-2 h-10 rounded-xl text-sm font-semibold border-2 transition-all ${
                            s in form.stock
                              ? 'bg-brand-600 border-brand-600 text-white'
                              : 'bg-white border-brand-200 text-brand-600'
                          }`}
                          aria-pressed={s in form.stock}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Colores */}
              <div className="bg-white rounded-2xl p-5 border border-brand-150">
                <h3 className="text-sm font-semibold mb-4 text-brand-800">Colores</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {form.colores.map((c) => (
                    <span
                      key={c}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-brand-200 text-brand-800"
                    >
                      {c}
                      <button
                        onClick={() => setForm((f) => ({ ...f, colores: f.colores.filter((x) => x !== c) }))}
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
                    className={inputClass}
                  />
                  <Button variant="soft" onClick={addColor}>
                    <Plus size={16} /> Agregar
                  </Button>
                </div>
              </div>
            </>
          )}

          {tab === 'inventario' && (
            <div className="bg-white rounded-2xl border overflow-hidden border-brand-150">
              {sizes.length === 0 ? (
                <p className="px-5 py-10 text-center text-sm text-subtle">
                  Elige las tallas en «Información general» para cargar su stock.
                </p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-brand-50">
                      {['Talla', 'Stock actual'].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-brand-600"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-50">
                    {sizes.map((s) => (
                      <tr key={s}>
                        <td className="px-4 py-2.5 font-semibold text-brand-800">{s}</td>
                        <td className="px-4 py-2.5">
                          <input
                            type="number"
                            min="0"
                            value={form.stock[s]}
                            onChange={(e) => setSizeStock(s, e.target.value)}
                            className="w-24 px-3 py-1.5 rounded-lg border text-sm outline-none text-center font-mono border-brand-200 text-brand-800 focus:border-brand-600"
                            aria-label={`Stock talla ${s}`}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-brand-150">
            <h3 className="text-sm font-semibold mb-4 text-brand-800">Estado</h3>
            <StatusToggle value={form.estado} onChange={(estado) => setForm((f) => ({ ...f, estado }))} />
          </div>

          <div className="rounded-2xl p-4 border bg-brand-200 border-brand-400">
            <p className="text-xs font-semibold mb-2 uppercase tracking-wide text-brand-800">Margen de ganancia</p>
            {costo > 0 ? (
              <>
                <p className="text-3xl font-bold text-brand-800">{margin}%</p>
                <p className="text-xs mt-1 text-brand-800">
                  Costo (última compra): ${costo.toLocaleString('es-CO')} → Precio: ${precio.toLocaleString('es-CO')}
                </p>
              </>
            ) : (
              <>
                <p className="text-3xl font-bold text-brand-800">—</p>
                <p className="text-xs mt-1 text-brand-800">
                  Sin compras aún. El costo se toma de la primera compra que registres.
                </p>
              </>
            )}
          </div>

          {/* Suppliers come from purchases, so they are shown here instead of being picked */}
          <div className="bg-white rounded-2xl p-4 border border-brand-150">
            <h3 className="text-sm font-semibold mb-2 text-brand-800">Proveedores</h3>
            {supplierIds.length > 0 ? (
              <ul className="space-y-1.5">
                {supplierIds.map((id, i) => (
                  <li key={id} className="text-sm">
                    <p className="text-brand-800">{supplierName(id)}</p>
                    {i === 0 && (
                      <p className="text-xs text-subtle">
                        Última compra: {fmtDate(lastPurchase.fecha)} · {lastPurchase.numero}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-subtle">
                Se asignan solos cuando registras una compra de este producto en Compras.
              </p>
            )}
          </div>

          <Button size="lg" className="w-full" onClick={save}>
            {existing ? 'Guardar cambios' : 'Crear producto'}
          </Button>
          <Button variant="secondary" className="w-full" onClick={onBack}>
            Cancelar
          </Button>
          {existing && (
            <button
              onClick={() => setDeleting(true)}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold text-danger hover:bg-danger-soft"
            >
              <Trash2 size={15} /> Eliminar producto
            </button>
          )}
        </div>
      </div>

      {deleting && (
        <ConfirmDialog
          title="Eliminar producto"
          message={`¿Eliminar ${existing.name}? Esta acción no se puede deshacer.`}
          onCancel={() => setDeleting(false)}
          onConfirm={() => {
            remove(existing.id);
            onBack();
          }}
        />
      )}
    </div>
  );
}
