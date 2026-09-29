import { useEffect, useState } from 'react';
import { ArrowLeftRight, Loader2, Plus } from 'lucide-react';
import useProducts, { sortSizes } from '@/features/products/store';
import useSettings from '@/features/settings/store';
import { api } from '@/shared/lib/api';
import { ErrorAlert, LoadingState } from '@/shared/components/Feedback';
import Modal from '@/shared/components/Modal';
import { Button, Field, inputClass } from '@/shared/components/Form';
import usePagination from '@/shared/lib/usePagination';
import Pagination from '@/shared/components/Pagination';
import { EmptyState, Table, TableCard } from '@/shared/components/Table';
import { FilterSelect, SegmentedTabs, Toolbar } from '@/shared/components/Toolbar';

// Why stock is changed by hand; the server decides the movement type and sign from it
const REASONS = [
  ['Conteo', 'Conteo físico'],
  ['Danado', 'Dañada o perdida'],
  ['DevolucionProveedor', 'Devolución a proveedor'],
  ['Ingreso', 'Ingreso sin compra'],
];
const TYPES = { Entrada: 'Entrada', Salida: 'Salida', Ajuste: 'Ajuste' };
const typeClass = {
  Entrada: 'bg-success-soft text-success',
  Salida: 'bg-danger-soft text-danger',
  Ajuste: 'bg-warning-soft text-warning',
};
const fmtDate = (iso) =>
  new Date(iso).toLocaleString('es-CO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

/** What the size will have after the change, to show before saving */
function resulting(reason, stock, qty) {
  if (reason === 'Conteo') return qty;
  return reason === 'Ingreso' ? stock + qty : stock - qty;
}

function AdjustForm({ products, onSaved, onClose }) {
  const { tallas } = useSettings();
  const [productId, setProductId] = useState('');
  const [talla, setTalla] = useState('');
  const [reason, setReason] = useState('Conteo');
  const [qty, setQty] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const product = products.find((p) => p.id === Number(productId));
  const sizes = product ? sortSizes(Object.keys(product.stock), tallas) : [];
  const stock = product && talla ? (product.stock[talla] ?? 0) : null;
  const units = Number(qty);
  const valid = qty !== '' && Number.isInteger(units) && (reason === 'Conteo' ? units >= 0 : units > 0);
  const after = stock != null && valid ? resulting(reason, stock, units) : null;

  function pickProduct(id) {
    setProductId(id);
    const p = products.find((x) => x.id === Number(id));
    setTalla(p ? (sortSizes(Object.keys(p.stock), tallas)[0] ?? '') : '');
  }

  async function submit(e) {
    e.preventDefault();
    if (!product || !talla) return setError('Elige el producto y la talla');
    if (!valid)
      return setError(
        reason === 'Conteo' ? 'Escribe cuántas unidades contaste' : 'La cantidad debe ser un número entero mayor a 0',
      );
    setError('');
    setSaving(true);
    try {
      await api('/api/inventario/ajustes', {
        method: 'POST',
        body: { productoId: product.id, talla, motivo: reason, cantidad: units, nota: note.trim() },
      });
      onSaved();
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <Modal
      title="Registrar ajuste de inventario"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="adjust-form" disabled={saving}>
            {saving && <Loader2 size={16} className="animate-spin" />}
            {saving ? 'Guardando…' : 'Registrar'}
          </Button>
        </>
      }
    >
      <form id="adjust-form" onSubmit={submit} className="space-y-4">
        <Field label="Motivo" group>
          <SegmentedTabs value={reason} onChange={setReason} label="Motivo" options={REASONS} />
        </Field>
        <div className="grid grid-cols-[2fr_1fr] gap-3">
          <Field label="Producto">
            <select value={productId} onChange={(e) => pickProduct(e.target.value)} className={inputClass}>
              <option value="">Elegir…</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                  {p.activo ? '' : ' (inactivo)'}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Talla">
            <select value={talla} onChange={(e) => setTalla(e.target.value)} className={inputClass} disabled={!product}>
              {sizes.map((s) => (
                <option key={s} value={s}>
                  {s} · {product.stock[s]} und.
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label={reason === 'Conteo' ? 'Unidades contadas' : 'Cantidad'}>
          <input
            type="number"
            min={reason === 'Conteo' ? 0 : 1}
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            className={`${inputClass} font-mono`}
          />
          {after != null && (
            <span className={`block mt-1 text-xs ${after < 0 ? 'text-danger' : 'text-subtle'}`}>
              Stock actual {stock} → queda {after}
              {after < 0 && ': no hay tantas unidades'}
            </span>
          )}
        </Field>
        <Field label="Nota (opcional)">
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={150}
            placeholder={reason === 'Danado' ? 'Ej. mancha en la tela' : 'Detalle para el historial'}
            className={inputClass}
          />
        </Field>
        <ErrorAlert message={error} />
      </form>
    </Modal>
  );
}

/** Every stock change (purchases, sales, voids and adjustments), newest first, and adjustments made by hand */
export default function InventoryMovements() {
  const { items: products, reload: reloadProducts } = useProducts();
  const [productId, setProductId] = useState('todos');
  const [type, setType] = useState('todos');
  const [movements, setMovements] = useState(null);
  const [error, setError] = useState('');
  const [adjusting, setAdjusting] = useState(false);
  const pager = usePagination(movements ?? [], `${productId}|${type}`);

  function load() {
    const params = new URLSearchParams();
    if (productId !== 'todos') params.set('productoId', productId);
    if (type !== 'todos') params.set('tipo', type);
    setError('');
    api(`/api/inventario/movimientos?${params}`)
      .then(setMovements)
      .catch((err) => setError(err.message));
  }
  useEffect(load, [productId, type]);

  function saved() {
    setAdjusting(false);
    load();
    reloadProducts(); // the stock shown in the other tabs changed
  }

  return (
    <>
      <Toolbar>
        <FilterSelect
          value={productId}
          onChange={setProductId}
          label="Producto"
          options={[['todos', 'Todos los productos'], ...products.map((p) => [String(p.id), p.nombre])]}
        />
        <FilterSelect
          value={type}
          onChange={setType}
          label="Tipo"
          options={[['todos', 'Todos los tipos'], ...Object.entries(TYPES)]}
        />
        <Button onClick={() => setAdjusting(true)} className="ml-auto">
          <Plus size={16} /> Registrar ajuste
        </Button>
      </Toolbar>

      <ErrorAlert message={error} onRetry={load} className="mb-4" />

      <TableCard>
        <Table
          columns={[
            'Fecha',
            'Producto',
            'Talla',
            'Tipo',
            { label: 'Cantidad', align: 'right' },
            'Motivo',
            'Referencia',
            'Usuario',
          ]}
        >
          {pager.pageItems.map((m) => (
            <tr key={m.id} className="hover:bg-brand-25">
              <td className="px-4 py-2.5 whitespace-nowrap text-brand-600">{fmtDate(m.fecha)}</td>
              <td className="px-4 py-2.5 font-medium text-brand-800">{m.producto}</td>
              <td className="px-4 py-2.5 text-brand-600">{m.talla}</td>
              <td className="px-4 py-2.5">
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${typeClass[m.tipo]}`}>{m.tipo}</span>
              </td>
              <td
                className={`px-4 py-2.5 text-right font-mono font-semibold ${m.cantidad > 0 ? 'text-success' : 'text-danger'}`}
              >
                {m.cantidad > 0 ? `+${m.cantidad}` : m.cantidad}
              </td>
              <td className="px-4 py-2.5 text-brand-800">{m.motivo}</td>
              <td className="px-4 py-2.5 font-mono text-xs text-brand-600">{m.compra ?? m.venta ?? '—'}</td>
              <td className="px-4 py-2.5 text-xs text-brand-600">{m.usuario}</td>
            </tr>
          ))}
        </Table>
        {!movements && !error && <LoadingState message="Cargando movimientos…" />}
        {movements?.length === 0 && (
          <EmptyState icon={ArrowLeftRight} message="No hay movimientos con estos filtros." />
        )}
        <Pagination pager={pager} label="movimientos" />
      </TableCard>
      {movements?.length === 300 && (
        <p className="mt-2 text-xs text-subtle">
          Se muestran los 300 movimientos más recientes. Filtra por producto para ver más.
        </p>
      )}

      {adjusting && <AdjustForm products={products} onSaved={saved} onClose={() => setAdjusting(false)} />}
    </>
  );
}
