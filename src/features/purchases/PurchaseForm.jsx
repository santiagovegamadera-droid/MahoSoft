import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import ProductSearch from '@/features/purchases/ProductSearch';
import { useCurrentUser } from '@/features/users/store';
import Modal from '@/shared/components/Modal';
import { Button, Field, inputClass } from '@/shared/components/Form';

const today = () => new Date().toISOString().slice(0, 10);
const fmt = (n) => `$${n.toLocaleString('es-CO')}`;
const cellClass =
  'w-full px-2 py-1.5 rounded-lg border text-xs outline-none bg-white border-brand-200 text-brand-800 focus:border-brand-600';

const newLine = (p) => ({ productId: p?.id ?? null, talla: Object.keys(p?.stock ?? {})[0] ?? '', cant: '', costo: p?.costo ?? '' });

export default function PurchaseForm({ products, suppliers, onSave, onClose }) {
  const user = useCurrentUser();
  const activeSuppliers = suppliers.filter((s) => s.estado === 'Activo');
  const [form, setForm] = useState({
    proveedorId: activeSuppliers[0]?.id ?? '',
    fecha: today(),
    facturaProveedor: '',
    notas: '',
  });
  const [lines, setLines] = useState([newLine(products[0])]);
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const productOf = (id) => products.find((p) => p.id === id);

  function setLine(i, patch) {
    setLines((ls) => ls.map((l, j) => (j === i ? { ...l, ...patch } : l)));
  }
  function selectProduct(i, id) {
    const p = productOf(Number(id));
    setLine(i, { productId: p.id, talla: Object.keys(p.stock)[0] ?? '', costo: p.costo ?? '' });
  }

  const total = lines.reduce((s, l) => s + (Number(l.cant) || 0) * (Number(l.costo) || 0), 0);
  const units = lines.reduce((s, l) => s + (Number(l.cant) || 0), 0);

  function submit(e) {
    e.preventDefault();
    if (!form.proveedorId) return setError('Elige un proveedor');
    const items = lines.map((l) => ({ ...l, cant: Number(l.cant), costo: Number(l.costo) }));
    if (items.some((i) => !i.productId || !i.talla)) return setError('Cada línea necesita producto y talla');
    if (items.some((i) => !Number.isInteger(i.cant) || i.cant <= 0))
      return setError('Las cantidades deben ser números enteros mayores a 0');
    if (lines.some((l) => l.costo === '') || items.some((i) => !(i.costo >= 0)))
      return setError('Ingresa el costo unitario de cada línea');
    onSave({
      ...form,
      proveedorId: Number(form.proveedorId),
      facturaProveedor: form.facturaProveedor.trim(),
      notas: form.notas.trim(),
      usuario: user.name,
      items,
    });
  }

  return (
    <Modal
      title="Nueva compra"
      size="lg"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="purchase-form">
            Registrar compra
          </Button>
        </>
      }
    >
      <form id="purchase-form" onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <Field label="Proveedor" className="col-span-3 sm:col-span-1">
            <select value={form.proveedorId} onChange={set('proveedorId')} className={inputClass}>
              {activeSuppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Fecha">
            <input type="date" value={form.fecha} onChange={set('fecha')} className={inputClass} />
          </Field>
          <Field label="Factura proveedor">
            <input
              value={form.facturaProveedor}
              onChange={set('facturaProveedor')}
              placeholder="N.º de su factura"
              className={inputClass}
            />
          </Field>
        </div>

        <div>
          <p className="text-xs font-semibold mb-1.5 uppercase tracking-wide text-brand-800">Productos</p>
          <div className="rounded-xl border border-brand-150 overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-brand-50 text-[10px] uppercase tracking-wide text-left text-brand-600">
                  <th className="px-2 py-2 font-semibold">Producto</th>
                  <th className="px-2 py-2 font-semibold w-24">Talla</th>
                  <th className="px-2 py-2 font-semibold w-20">Cant.</th>
                  <th className="px-2 py-2 font-semibold w-28">Costo unit.</th>
                  <th className="px-2 py-2 font-semibold w-24 text-right">Subtotal</th>
                  <th className="w-8" />
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-50">
                {lines.map((l, i) => {
                  const p = productOf(l.productId);
                  return (
                    <tr key={i}>
                      <td className="px-2 py-1.5">
                        <ProductSearch
                          products={products}
                          value={l.productId}
                          onChange={(id) => selectProduct(i, id)}
                          className={cellClass}
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <select
                          value={l.talla}
                          onChange={(e) => setLine(i, { talla: e.target.value })}
                          className={cellClass}
                          aria-label="Talla"
                        >
                          {Object.keys(p?.stock ?? {}).map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          type="number"
                          min={1}
                          value={l.cant}
                          onChange={(e) => setLine(i, { cant: e.target.value })}
                          className={`${cellClass} font-mono`}
                          aria-label="Cantidad"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          type="number"
                          min={0}
                          step={1000}
                          value={l.costo}
                          onChange={(e) => setLine(i, { costo: e.target.value })}
                          className={`${cellClass} font-mono`}
                          aria-label="Costo unitario"
                        />
                      </td>
                      <td className="px-2 py-1.5 text-right font-mono text-brand-800">
                        {fmt((Number(l.cant) || 0) * (Number(l.costo) || 0))}
                      </td>
                      <td className="pr-2">
                        <button
                          type="button"
                          onClick={() => setLines((ls) => ls.filter((_, j) => j !== i))}
                          disabled={lines.length === 1}
                          className="p-1 rounded-md text-brand-300 enabled:hover:text-danger enabled:hover:bg-danger-soft disabled:opacity-30"
                          aria-label="Quitar línea"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="flex items-center justify-between px-3 py-2 border-t border-brand-100 bg-brand-25">
              <button
                type="button"
                onClick={() => setLines((ls) => [...ls, newLine(products[0])])}
                className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-800"
              >
                <Plus size={13} /> Agregar producto
              </button>
              <p className="text-xs text-brand-600">
                {units} {units === 1 ? 'prenda' : 'prendas'} ·{' '}
                <span className="font-bold font-mono text-brand-800">{fmt(total)}</span>
              </p>
            </div>
          </div>
        </div>

        <Field label="Notas">
          <input value={form.notas} onChange={set('notas')} placeholder="Opcional" className={inputClass} />
        </Field>

        {error && <p className="text-xs text-danger">{error}</p>}
      </form>
    </Modal>
  );
}
