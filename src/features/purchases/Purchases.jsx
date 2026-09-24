import { useState } from 'react';
import { Plus } from 'lucide-react';
import useMovements, {
  MOVEMENT_TYPES,
  createMovement,
  movementDelta,
  registerPurchase,
  removeMovement,
  updateMovement,
  usePurchases,
} from '@/features/purchases/store';
import PurchaseForm from '@/features/purchases/PurchaseForm';
import PurchaseOrders from '@/features/purchases/PurchaseOrders';
import useSuppliers from '@/features/suppliers/store';
import useProducts, { SIZE_GROUPS, totalStock } from '@/features/products/store';
import useCategories from '@/features/categories/store';
import Modal from '@/shared/components/Modal';
import ConfirmDialog from '@/shared/components/ConfirmDialog';
import { Button, Field, RowActions, inputClass } from '@/shared/components/Form';

const typeColors = {
  entrada: 'bg-success-soft text-success',
  salida: 'bg-danger-soft text-danger',
  ajuste: 'bg-warning-soft text-warning',
};

const today = () => new Date().toISOString().slice(0, 10);

function MovementForm({ movement, products, onSave, onClose }) {
  const [form, setForm] = useState(
    movement
      ? { ...movement, cant: String(movement.cant) }
      : {
          fecha: today(),
          tipo: 'entrada',
          productId: products[0]?.id ?? null,
          talla: Object.keys(products[0]?.stock ?? {})[0] ?? '',
          cant: '',
          ref: '',
          usuario: 'Ana Martínez',
        },
  );
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const product = products.find((p) => p.id === form.productId);
  const sizes = Object.keys(product?.stock ?? {});

  function selectProduct(e) {
    const p = products.find((x) => x.id === Number(e.target.value));
    setForm((f) => ({ ...f, productId: p.id, talla: Object.keys(p.stock)[0] ?? '' }));
  }

  function submit(e) {
    e.preventDefault();
    const cant = Number(form.cant);
    if (!product || !form.talla) return setError('Elige un producto con tallas');
    if (!Number.isInteger(cant) || cant === 0) return setError('Ingresa una cantidad entera distinta de 0');
    if (form.tipo !== 'ajuste' && cant < 0)
      return setError('Usa una cantidad positiva; el tipo define si suma o resta');
    onSave({ ...form, cant });
  }

  return (
    <Modal
      title={movement ? 'Editar movimiento' : 'Registrar movimiento'}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="movement-form">
            Guardar
          </Button>
        </>
      }
    >
      <form id="movement-form" onSubmit={submit} className="space-y-4">
        <Field label="Tipo de movimiento" group>
          <div className="flex gap-2">
            {MOVEMENT_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setForm((f) => ({ ...f, tipo: t }))}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 capitalize transition-all ${
                  form.tipo === t
                    ? 'bg-brand-600 border-brand-600 text-white'
                    : 'bg-white border-brand-200 text-brand-600'
                }`}
                aria-pressed={form.tipo === t}
              >
                {t}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Producto">
          <select value={form.productId ?? ''} onChange={selectProduct} className={inputClass}>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Talla">
            <select value={form.talla} onChange={set('talla')} className={inputClass}>
              {sizes.map((s) => (
                <option key={s} value={s}>
                  {s} ({product.stock[s]} en stock)
                </option>
              ))}
            </select>
          </Field>
          <Field label={form.tipo === 'ajuste' ? 'Cantidad (+/−)' : 'Cantidad'} error={error}>
            <input type="number" value={form.cant} onChange={set('cant')} className={`${inputClass} font-mono`} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Fecha">
            <input type="date" value={form.fecha} onChange={set('fecha')} className={inputClass} />
          </Field>
          <Field label="Referencia / Nota">
            <input value={form.ref} onChange={set('ref')} placeholder="OC-2026-046" className={inputClass} />
          </Field>
        </div>
      </form>
    </Modal>
  );
}

export default function Purchases() {
  const { items: movements } = useMovements();
  const { items: products } = useProducts();
  const { items: categories } = useCategories();
  const { items: purchases } = usePurchases();
  const { items: suppliers } = useSuppliers();
  const [tab, setTab] = useState('compras');
  const [buying, setBuying] = useState(false);
  const [typeFilter, setTypeFilter] = useState('todos');
  const [editing, setEditing] = useState(null); // null | 'new' | movement
  const [deleting, setDeleting] = useState(null);

  const productName = (id) => products.find((p) => p.id === id)?.name ?? 'Producto eliminado';
  const catName = (id) => categories.find((c) => c.id === id)?.name ?? '—';

  // Only show size columns that some product uses, in the usual size order
  const usedSizes = SIZE_GROUPS.flat().filter((s) => products.some((p) => s in p.stock));
  const allSizes = products.flatMap((p) => Object.values(p.stock));
  const inventoryValue = products.reduce((sum, p) => sum + totalStock(p) * (p.costo || 0), 0);

  const sortedMovements = [...movements]
    .filter((m) => typeFilter === 'todos' || m.tipo === typeFilter)
    .sort((a, b) => b.fecha.localeCompare(a.fecha));

  function save(data) {
    if (editing === 'new') createMovement(data);
    else updateMovement(editing.id, data);
    setEditing(null);
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-1 p-1 rounded-xl w-fit bg-brand-50">
          {[
            ['compras', 'Compras'],
            ['stock', 'Stock actual'],
            ['movimientos', 'Movimientos'],
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
        {tab === 'compras' ? (
          <Button onClick={() => setBuying(true)} disabled={products.length === 0}>
            <Plus size={16} /> Nueva compra
          </Button>
        ) : (
          <Button onClick={() => setEditing('new')} disabled={products.length === 0}>
            <Plus size={16} /> Registrar movimiento
          </Button>
        )}
      </div>

      {tab === 'compras' && (
        <PurchaseOrders
          purchases={purchases}
          suppliers={suppliers}
          products={products}
          onNew={() => setBuying(true)}
        />
      )}

      {tab === 'stock' && (
        <>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total prendas', val: allSizes.reduce((a, b) => a + b, 0), color: 'text-brand-800' },
              {
                label: 'Stock bajo (≤3)',
                val: `${allSizes.filter((v) => v > 0 && v <= 3).length} tallas`,
                color: 'text-warning',
              },
              { label: 'Sin stock', val: `${allSizes.filter((v) => v === 0).length} tallas`, color: 'text-danger' },
              {
                label: 'Valor inventario (costo)',
                val: `$${inventoryValue.toLocaleString('es-CO')}`,
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
            <div className="px-5 py-4 border-b border-brand-50">
              <h3 className="text-sm font-semibold text-brand-800">Inventario por talla</h3>
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
                    {usedSizes.map((t) => (
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
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-brand-25">
                      <td className="px-5 py-3 font-medium text-brand-800">{p.name}</td>
                      <td className="px-5 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-brand-200 text-brand-800">
                          {catName(p.catId)}
                        </span>
                      </td>
                      {usedSizes.map((t) => {
                        const v = p.stock[t];
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
                        <span className="font-bold text-sm text-brand-800">{totalStock(p)}</span>
                      </td>
                    </tr>
                  ))}
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
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border outline-none border-brand-200 bg-white text-brand-800"
            >
              <option value="todos">Todos los tipos</option>
              <option value="entrada">Entradas</option>
              <option value="salida">Salidas</option>
              <option value="ajuste">Ajustes</option>
            </select>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-50">
                {['Fecha', 'Tipo', 'Producto', 'Talla', 'Cantidad', 'Referencia', 'Usuario', ''].map((h) => (
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
              {sortedMovements.map((m) => {
                const delta = movementDelta(m);
                const missing = !products.some((p) => p.id === m.productId);
                return (
                  <tr key={m.id} className="hover:bg-brand-25">
                    <td className="px-5 py-3 text-xs font-mono text-brand-600">{m.fecha}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${typeColors[m.tipo]}`}
                      >
                        {m.tipo}
                      </span>
                    </td>
                    <td className={`px-5 py-3 font-medium ${missing ? 'text-brand-400 italic' : 'text-brand-800'}`}>
                      {productName(m.productId)}
                    </td>
                    <td className="px-5 py-3 text-xs text-brand-600">{m.talla}</td>
                    <td className="px-5 py-3">
                      <span className={`font-bold font-mono ${delta < 0 ? 'text-danger' : 'text-success'}`}>
                        {delta > 0 ? '+' : ''}
                        {delta}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs font-mono text-brand-600">{m.ref}</td>
                    <td className="px-5 py-3 text-xs text-brand-600">{m.usuario}</td>
                    <td className="px-5 py-3">
                      {/* Movements of deleted products can't be edited or reverted */}
                      {!missing && (
                        <RowActions
                          label={`movimiento ${m.ref || m.fecha}`}
                          onEdit={() => setEditing(m)}
                          onDelete={() => setDeleting(m)}
                        />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {sortedMovements.length === 0 && (
            <p className="px-5 py-10 text-center text-sm text-brand-400">No hay movimientos.</p>
          )}
        </div>
      )}

      {buying && (
        <PurchaseForm
          products={products}
          suppliers={suppliers}
          onClose={() => setBuying(false)}
          onSave={(data) => {
            registerPurchase(data);
            setBuying(false);
          }}
        />
      )}
      {editing && (
        <MovementForm
          movement={editing === 'new' ? null : editing}
          products={products}
          onSave={save}
          onClose={() => setEditing(null)}
        />
      )}
      {deleting && (
        <ConfirmDialog
          title="Eliminar movimiento"
          message={`¿Eliminar este movimiento? Se revertirán ${Math.abs(movementDelta(deleting))} unidades en la talla ${deleting.talla} de ${productName(deleting.productId)}.`}
          onCancel={() => setDeleting(null)}
          onConfirm={() => {
            removeMovement(deleting.id);
            setDeleting(null);
          }}
        />
      )}
    </div>
  );
}
