import { useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  CheckCircle2,
  FileText,
  Plus,
  ShoppingBag,
  Store,
  Trash2,
} from 'lucide-react';
import ProductSearch from '@/features/purchases/ProductSearch';
import InvoiceFile from '@/features/purchases/InvoiceFile';
import { DOCUMENT_TYPES, IVA_RATES, PAYMENT_TERMS, ivaLabel, purchaseTotals } from '@/features/purchases/store';
import useSettings from '@/features/settings/store';
import { useCurrentUser } from '@/features/users/store';
import { formatDocument } from '@/shared/components/DocumentInput';
import { Button, Field, inputClass } from '@/shared/components/Form';
import { SegmentedTabs } from '@/shared/components/Toolbar';

const today = () => new Date().toISOString().slice(0, 10);
const fmt = (n) => `$${Math.round(n).toLocaleString('es-CO')}`;
const cellClass =
  'w-full px-2.5 py-1.5 rounded-lg border text-sm outline-none bg-white border-brand-200 text-brand-800 focus:border-brand-600';

const newLine = (p) => ({
  ref: '',
  productId: p?.id ?? null,
  talla: Object.keys(p?.stock ?? {})[0] ?? '',
  cant: '1',
  costo: '',
});

// White card with an icon title, used for each block of the invoice
function Section({ icon: Icon, title, subtitle, actions, children, className = '' }) {
  return (
    <section className={`bg-white rounded-2xl border border-brand-150 ${className}`}>
      <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-brand-50">
        <div className="flex items-center gap-2.5">
          <Icon size={16} className="text-brand-600" />
          <div>
            <h3 className="text-sm font-semibold text-brand-800">{title}</h3>
            {subtitle && <p className="text-xs text-subtle">{subtitle}</p>}
          </div>
        </div>
        {actions}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

// Label/value pair for read-only details
function Detail({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-subtle">{label}</p>
      <p className="text-sm text-brand-800 truncate" title={value || undefined}>
        {value || '—'}
      </p>
    </div>
  );
}

export default function PurchaseForm({ products, suppliers, onSave, onClose }) {
  const user = useCurrentUser();
  const business = useSettings();
  const activeSuppliers = suppliers.filter((s) => s.estado === 'Activo');
  const [form, setForm] = useState({
    proveedorId: activeSuppliers[0]?.id ?? '',
    facturaProveedor: '',
    fecha: today(),
    hora: '',
    vendedorProveedor: '',
    cufe: '',
    tipoComprobante: DOCUMENT_TYPES[0],
    valorComprobante: '',
    condicionPago: 'contado',
    vence: '',
    estadoPago: 'pagada',
    // Starts on what the supplier usually charges; each invoice can still say otherwise
    iva: activeSuppliers[0]?.iva ?? 0,
    ivaIncluido: false,
    descuento: '',
    notas: '',
  });
  const [lines, setLines] = useState([newLine(products[0])]);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const productOf = (id) => products.find((p) => p.id === id);
  const supplier = suppliers.find((s) => s.id === Number(form.proveedorId));

  function setLine(i, patch) {
    setLines((ls) => ls.map((l, j) => (j === i ? { ...l, ...patch } : l)));
  }
  function selectProduct(i, id) {
    const p = productOf(Number(id));
    setLine(i, { productId: p.id, talla: Object.keys(p.stock)[0] ?? '' });
  }

  const rate = Number(form.iva) / 100;
  const hasIva = rate > 0;
  const draft = {
    iva: Number(form.iva),
    ivaIncluido: form.ivaIncluido,
    descuento: Number(form.descuento) || 0,
    items: lines.map((l) => ({ cant: Number(l.cant) || 0, costo: Number(l.costo) || 0 })),
  };
  const totals = purchaseTotals(draft);
  // Compare with the "Valor" printed on the invoice / e-invoice email
  const valor = Number(form.valorComprobante) || 0;
  const diferencia = valor ? valor - totals.total : 0;
  // Line total as the invoice prints it: with IVA
  const lineTotal = (l) => (Number(l.cant) || 0) * (Number(l.costo) || 0) * (form.ivaIncluido ? 1 : 1 + rate);

  function submit(e) {
    e.preventDefault();
    if (!form.proveedorId) return setError('Elige un proveedor');
    if (!form.facturaProveedor.trim()) return setError('Escribe el número de la factura del proveedor');
    const items = lines.map((l) => ({
      ref: l.ref.trim(),
      productId: l.productId,
      talla: l.talla,
      cant: Number(l.cant),
      costo: Number(l.costo),
    }));
    if (items.some((i) => !i.productId || !i.talla)) return setError('Cada línea necesita producto y talla');
    if (items.some((i) => !Number.isInteger(i.cant) || i.cant <= 0))
      return setError('Las cantidades deben ser números enteros mayores a 0');
    if (lines.some((l) => l.costo === '') || items.some((i) => !(i.costo >= 0)))
      return setError('Ingresa el precio unitario de cada línea');
    if (!(draft.descuento >= 0)) return setError('El descuento no puede ser negativo');
    if (form.condicionPago === 'credito' && !form.vence) return setError('Indica cuándo vence el crédito');
    onSave(
      {
        ...form,
        proveedorId: Number(form.proveedorId),
        facturaProveedor: form.facturaProveedor.trim(),
        vendedorProveedor: form.vendedorProveedor.trim(),
        cufe: form.cufe.trim(),
        vence: form.condicionPago === 'credito' ? form.vence : '',
        iva: draft.iva,
        descuento: draft.descuento,
        valorComprobante: valor,
        notas: form.notas.trim(),
        usuario: user.name,
        items,
      },
      file,
    );
  }

  return (
    <form onSubmit={submit} className="max-w-6xl space-y-5">
      <div>
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-2 text-sm mb-3 font-medium transition-colors text-brand-600 hover:text-brand-800"
        >
          <ArrowLeft size={16} /> Volver a compras
        </button>
        <h2 className="text-lg font-display text-brand-800">Nueva compra</h2>
        <p className="text-sm text-subtle">
          Copia los datos de la factura del proveedor. Al registrarla, las prendas entran al inventario y se actualiza
          el costo de cada producto.
        </p>
      </div>

      {/* Supplier (top-left of the invoice) and invoice data (top-right box) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Section icon={Building2} title="Proveedor" subtitle="Quién te vende">
          {activeSuppliers.length === 0 ? (
            <p className="text-sm text-subtle">No hay proveedores activos. Crea uno en Compras → Proveedores.</p>
          ) : (
            <div className="space-y-4">
              <select
                value={form.proveedorId}
                onChange={(e) => {
                  const next = suppliers.find((s) => s.id === Number(e.target.value));
                  setForm((f) => ({ ...f, proveedorId: e.target.value, iva: next?.iva ?? 0, ivaIncluido: false }));
                }}
                className={inputClass}
                aria-label="Proveedor"
              >
                {activeSuppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              {supplier && (
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  <Detail label="Documento" value={formatDocument(supplier.tipoDocumento, supplier.documento)} />
                  <Detail label="Teléfono" value={supplier.tel} />
                  <Detail label="Dirección" value={supplier.direccion} />
                  <Detail label="Ciudad" value={supplier.ciudad} />
                  <Detail label="Email" value={supplier.email} />
                  <Detail label="Contacto" value={supplier.contacto} />
                </div>
              )}
            </div>
          )}
        </Section>

        <Section icon={FileText} title="Factura del proveedor" subtitle="Datos del recuadro de la factura">
          <div className="grid grid-cols-6 gap-3">
            <Field label="Tipo de comprobante" className="col-span-3">
              <select value={form.tipoComprobante} onChange={set('tipoComprobante')} className={inputClass}>
                {DOCUMENT_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>
            <Field label="Número" className="col-span-3">
              <input
                value={form.facturaProveedor}
                onChange={set('facturaProveedor')}
                placeholder="GEN51363"
                className={inputClass}
              />
            </Field>
            <Field label="Fecha" className="col-span-3">
              <input type="date" value={form.fecha} onChange={set('fecha')} className={inputClass} />
            </Field>
            <Field label="Hora" className="col-span-3">
              <input type="time" value={form.hora} onChange={set('hora')} className={inputClass} />
            </Field>
            <Field label="Vendedor / atendido por" className="col-span-3">
              <input
                value={form.vendedorProveedor}
                onChange={set('vendedorProveedor')}
                placeholder={supplier?.contacto || 'Opcional'}
                className={inputClass}
              />
            </Field>
            <Field label="CUFE / UUID" className="col-span-3">
              <input
                value={form.cufe}
                onChange={set('cufe')}
                placeholder="Opcional"
                className={`${inputClass} font-mono`}
              />
            </Field>
            <Field label="Condición de pago" className="col-span-3" group>
              <SegmentedTabs
                value={form.condicionPago}
                onChange={(condicionPago) =>
                  setForm((f) => ({
                    ...f,
                    condicionPago,
                    estadoPago: condicionPago === 'credito' ? 'pendiente' : 'pagada',
                  }))
                }
                label="Condición de pago"
                options={Object.entries(PAYMENT_TERMS)}
              />
            </Field>
            {form.condicionPago === 'credito' ? (
              <Field label="Vence" className="col-span-3">
                <input type="date" value={form.vence} onChange={set('vence')} className={inputClass} />
              </Field>
            ) : (
              <div className="col-span-3" />
            )}
            <Field label="Documento (opcional)" className="col-span-6" group>
              <InvoiceFile file={file} onChange={setFile} onError={setError} />
            </Field>
          </div>
        </Section>
      </div>

      {/* Buyer: the business itself, as printed on the invoice */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 px-5 py-3 rounded-2xl border border-dashed border-brand-200 bg-brand-25 text-sm">
        <span className="flex items-center gap-2 font-semibold text-brand-800">
          <Store size={15} className="text-brand-600" /> Comprador: {business.nombre}
        </span>
        {[
          business.nit && `NIT ${business.nit}`,
          business.direccion,
          business.ciudad,
          business.telefono,
          business.correo,
        ]
          .filter(Boolean)
          .map((v) => (
            <span key={v} className="text-brand-600">
              {v}
            </span>
          ))}
        <span className="ml-auto text-xs text-subtle">Tus datos se editan en Configuración → Datos del negocio</span>
      </div>

      {/* Items (the invoice table) */}
      <Section
        icon={ShoppingBag}
        title="Productos comprados"
        subtitle="Una línea por referencia y talla"
        actions={
          <div className="flex items-center gap-4 text-sm">
            {hasIva && (
              <label className="flex items-center gap-2 text-brand-600">
                <input
                  type="checkbox"
                  checked={form.ivaIncluido}
                  onChange={(e) => setForm((f) => ({ ...f, ivaIncluido: e.target.checked }))}
                  className="w-4 h-4 accent-brand-600"
                />
                Los precios ya incluyen IVA
              </label>
            )}
            <span className="flex items-center gap-2 text-brand-600">
              ¿Tiene IVA?
              <SegmentedTabs
                value={String(form.iva)}
                onChange={(v) =>
                  setForm((f) => ({ ...f, iva: Number(v), ivaIncluido: Number(v) ? f.ivaIncluido : false }))
                }
                label="IVA de la factura"
                options={IVA_RATES.map((r) => [String(r), ivaLabel(r)])}
              />
            </span>
          </div>
        }
      >
        <div className="-mx-5 -mt-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-50 text-xs uppercase tracking-wide text-left text-brand-600">
                <th className="pl-5 pr-2 py-2.5 font-semibold w-10">N.º</th>
                <th className="px-2 py-2.5 font-semibold w-36">Ref. proveedor</th>
                <th className="px-2 py-2.5 font-semibold">Producto</th>
                <th className="px-2 py-2.5 font-semibold w-24">Talla</th>
                <th className="px-2 py-2.5 font-semibold w-20">Cant.</th>
                <th className="px-2 py-2.5 font-semibold w-36 whitespace-nowrap">
                  {!hasIva ? 'Precio unit.' : form.ivaIncluido ? 'Precio con IVA' : 'Precio sin IVA'}
                </th>
                <th className="px-2 py-2.5 font-semibold w-32 text-right">Total</th>
                <th className="w-10 pr-5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {lines.map((l, i) => {
                const p = productOf(l.productId);
                return (
                  <tr key={i}>
                    <td className="pl-5 pr-2 py-2 text-subtle">{i + 1}</td>
                    <td className="px-2 py-2">
                      <input
                        value={l.ref}
                        onChange={(e) => setLine(i, { ref: e.target.value })}
                        placeholder="AM49306LT"
                        className={`${cellClass} font-mono`}
                        aria-label="Referencia del proveedor"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <ProductSearch
                        products={products}
                        value={l.productId}
                        onChange={(id) => selectProduct(i, id)}
                        className={cellClass}
                      />
                    </td>
                    <td className="px-2 py-2">
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
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        min={1}
                        value={l.cant}
                        onChange={(e) => setLine(i, { cant: e.target.value })}
                        className={`${cellClass} font-mono`}
                        aria-label="Cantidad"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        min={0}
                        step="any"
                        value={l.costo}
                        onChange={(e) => setLine(i, { costo: e.target.value })}
                        placeholder="0"
                        className={`${cellClass} font-mono`}
                        aria-label="Precio unitario"
                      />
                    </td>
                    <td className="px-2 py-2 text-right font-mono text-brand-800">{fmt(lineTotal(l))}</td>
                    <td className="pr-5">
                      <button
                        type="button"
                        onClick={() => setLines((ls) => ls.filter((_, j) => j !== i))}
                        disabled={lines.length === 1}
                        className="p-1.5 rounded-md text-subtle enabled:hover:text-danger enabled:hover:bg-danger-soft disabled:opacity-30"
                        aria-label="Quitar línea"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          onClick={() => setLines((ls) => [...ls, newLine(products[0])])}
          className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-800"
        >
          <Plus size={15} /> Agregar línea
        </button>
      </Section>

      {/* Notes and totals (bottom of the invoice) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_22rem] gap-5 items-start">
        <div className="space-y-5">
          <Field label="Notas">
            <textarea
              rows={3}
              value={form.notas}
              onChange={set('notas')}
              placeholder="Ej. llegó completo, pendiente cambio de una talla…"
              className={`${inputClass} resize-none`}
            />
          </Field>
          {error && <p className="text-sm text-danger">{error}</p>}
        </div>

        <section className="bg-white rounded-2xl border border-brand-150 p-5 space-y-2 text-sm">
          <div className="flex justify-between text-brand-600">
            <span>Artículos</span>
            <span className="font-mono">{totals.articulos}</span>
          </div>
          <div className="flex justify-between text-brand-600">
            <span>Unidades</span>
            <span className="font-mono">{totals.unidades}</span>
          </div>
          <div className="flex justify-between text-brand-600 pt-2 border-t border-brand-50">
            <span>{hasIva ? 'Subtotal (sin IVA)' : 'Subtotal'}</span>
            <span className="font-mono">{fmt(totals.subtotal)}</span>
          </div>
          <label className="flex items-center justify-between gap-3 text-brand-600">
            <span>Descuento</span>
            <input
              type="number"
              min={0}
              step="any"
              value={form.descuento}
              onChange={set('descuento')}
              placeholder="0"
              className="w-32 px-2.5 py-1 rounded-lg border text-sm text-right font-mono outline-none bg-white border-brand-200 text-brand-800 focus:border-brand-600"
            />
          </label>
          <div className="flex justify-between text-brand-600">
            <span>IVA</span>
            <span className={hasIva ? 'font-mono' : 'text-subtle'}>
              {hasIva ? `${fmt(totals.iva)} (${form.iva}%)` : 'Sin IVA'}
            </span>
          </div>
          <div className="flex justify-between items-baseline pt-2 border-t border-brand-150">
            <span className="font-semibold text-brand-800">Total neto</span>
            <span className="text-2xl font-bold font-mono text-brand-800">{fmt(totals.total)}</span>
          </div>
          <label className="flex items-center justify-between gap-3 text-brand-600">
            <span>Valor en el comprobante</span>
            <input
              type="number"
              min={0}
              step="any"
              value={form.valorComprobante}
              onChange={set('valorComprobante')}
              placeholder="322000"
              className="w-32 px-2.5 py-1 rounded-lg border text-sm text-right font-mono outline-none bg-white border-brand-200 text-brand-800 focus:border-brand-600"
            />
          </label>
          {valor > 0 &&
            (Math.abs(diferencia) <= 1 ? (
              <p className="flex items-center gap-1.5 text-xs font-medium text-success">
                <CheckCircle2 size={14} /> Cuadra con el comprobante
              </p>
            ) : (
              <p className="flex items-start gap-1.5 text-xs font-medium text-warning">
                <AlertTriangle size={14} className="shrink-0 mt-px" />
                No cuadra: diferencia de {fmt(Math.abs(diferencia))}. Revisa precios, cantidades o el IVA.
              </p>
            ))}
          <div className="flex items-center justify-between pt-1">
            <span className="text-brand-600">Estado</span>
            <SegmentedTabs
              value={form.estadoPago}
              onChange={(estadoPago) => setForm((f) => ({ ...f, estadoPago }))}
              label="Estado del pago"
              options={[
                ['pagada', 'Pagada'],
                ['pendiente', 'Pendiente'],
              ]}
            />
          </div>
          <div className="flex gap-2 pt-3">
            <Button variant="secondary" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Registrar compra
            </Button>
          </div>
        </section>
      </div>
    </form>
  );
}
