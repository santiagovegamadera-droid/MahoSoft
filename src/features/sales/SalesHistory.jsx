import { useState } from 'react';
import { Ban, Banknote, CreditCard, Landmark, Pencil, Printer, ReceiptText } from 'lucide-react';
import saleTotals from '@/features/sales/saleTotals';
import useSales, { PAYMENT_METHODS, voidSale } from '@/features/sales/store';
import useCustomers from '@/features/customers/store';
import Modal from '@/shared/components/Modal';
import ConfirmDialog from '@/shared/components/ConfirmDialog';
import { Button, Field, inputClass } from '@/shared/components/Form';

const paymentIcons = { efectivo: Banknote, tarjeta: CreditCard, transferencia: Landmark };

const fmt = (n) => `$${n.toLocaleString('es-CO')}`;
const fmtDate = (iso) =>
  new Date(iso).toLocaleString('es-CO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
const isToday = (iso) => new Date(iso).toDateString() === new Date().toDateString();

// Only the customer and payment method are editable; items and totals stay as sold
function SaleForm({ sale, customers, onSave, onClose }) {
  const [form, setForm] = useState({ cliente: sale.cliente, pago: sale.pago });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const names = ['Cliente general', ...customers.map((c) => c.name)];
  if (!names.includes(sale.cliente)) names.push(sale.cliente);

  return (
    <Modal
      title={`Editar ${sale.factura}`}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={() => onSave(form)}>Guardar</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Cliente">
          <select value={form.cliente} onChange={set('cliente')} className={inputClass}>
            {names.map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </Field>
        <Field label="Método de pago">
          <select value={form.pago} onChange={set('pago')} className={`${inputClass} capitalize`}>
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </Field>
      </div>
    </Modal>
  );
}

export default function SalesHistory() {
  const { items: sales, update } = useSales();
  const { items: customers } = useCustomers();
  const [search, setSearch] = useState('');
  const [payment, setPayment] = useState('todos');
  const [selectedId, setSelectedId] = useState(null);
  const [editing, setEditing] = useState(null);
  const [voiding, setVoiding] = useState(null);

  // Newest first
  const rows = [...sales]
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .map((s) => ({ ...s, ...saleTotals(s) }));

  const q = search.toLowerCase();
  const filtered = rows.filter(
    (s) =>
      (payment === 'todos' || s.pago === payment) &&
      (s.factura.toLowerCase().includes(q) || s.cliente.toLowerCase().includes(q)),
  );
  const selected = rows.find((s) => s.id === selectedId);

  const today = rows.filter((s) => isToday(s.fecha));
  const todayTotal = today.reduce((sum, s) => sum + s.total, 0);

  return (
    <div className="p-8 space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Ventas de hoy', value: today.length },
          { label: 'Vendido hoy', value: fmt(todayTotal) },
          { label: 'Ventas registradas', value: rows.length },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-2xl p-5 border border-brand-150">
            <p className="text-xs font-medium uppercase tracking-wide mb-2 text-brand-600">{k.label}</p>
            <p className="text-2xl font-bold text-brand-800">{k.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-6 items-start">
        <div className="flex-1 min-w-0">
          {/* Filters */}
          <div className="flex items-center gap-3 mb-5">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por factura o cliente..."
              className="px-4 py-2.5 text-sm rounded-xl border outline-none border-brand-200 bg-white text-brand-800 w-65 focus:border-brand-600"
            />
            <select
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
              className="px-3 py-2.5 text-sm rounded-xl border outline-none border-brand-200 bg-white text-brand-800"
            >
              <option value="todos">Todos los pagos</option>
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="transferencia">Transferencia</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border overflow-hidden border-brand-150">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-brand-50">
                  {['Factura', 'Fecha', 'Cliente', 'Prendas', 'Pago', 'Total'].map((h) => (
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
                {filtered.map((s) => {
                  const PayIcon = paymentIcons[s.pago];
                  return (
                    <tr
                      key={s.id}
                      onClick={() => setSelectedId(s.id)}
                      className={`cursor-pointer transition-colors hover:bg-brand-25 ${
                        selectedId === s.id ? 'bg-brand-25' : ''
                      }`}
                    >
                      <td className="px-5 py-3.5 font-mono text-xs font-semibold text-brand-800">{s.factura}</td>
                      <td className="px-5 py-3.5 text-xs text-brand-600">{fmtDate(s.fecha)}</td>
                      <td className="px-5 py-3.5 text-brand-800">{s.cliente}</td>
                      <td className="px-5 py-3.5 text-brand-600">{s.items.reduce((n, i) => n + i.qty, 0)}</td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1.5 text-xs capitalize text-brand-600">
                          <PayIcon size={14} />
                          {s.pago}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-mono font-semibold text-brand-800">{fmt(s.total)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <p className="px-5 py-10 text-center text-sm text-brand-400">
                No hay ventas que coincidan con la búsqueda.
              </p>
            )}
          </div>
        </div>

        {/* Detail */}
        <div className="w-80 shrink-0 bg-white rounded-2xl border border-brand-150">
          {selected ? (
            <>
              <div className="p-5 border-b border-brand-50">
                <p className="font-mono text-sm font-semibold text-brand-800">{selected.factura}</p>
                <p className="text-xs mt-0.5 text-brand-400">{fmtDate(selected.fecha)}</p>
                <div className="mt-3 space-y-1 text-xs text-brand-600">
                  <p>
                    Cliente: <span className="font-medium text-brand-800">{selected.cliente}</span>
                  </p>
                  <p>
                    Vendedor: <span className="font-medium text-brand-800">{selected.vendedor}</span>
                  </p>
                  <p>
                    Pago: <span className="font-medium capitalize text-brand-800">{selected.pago}</span>
                  </p>
                </div>
              </div>
              <div className="p-5 space-y-2 border-b border-brand-50">
                {selected.items.map((i) => (
                  <div key={i.name + i.talla} className="flex justify-between gap-3 text-xs">
                    <span className="text-brand-800">
                      {i.qty} × {i.name} <span className="text-brand-400">· {i.talla}</span>
                    </span>
                    <span className="font-mono text-brand-800">{fmt(i.price * i.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="p-5 space-y-2 text-xs">
                <div className="flex justify-between text-brand-600">
                  <span>Subtotal</span>
                  <span className="font-mono">{fmt(selected.subtotal)}</span>
                </div>
                {selected.descuento > 0 && (
                  <div className="flex justify-between text-danger">
                    <span>Descuento ({selected.descuento}%)</span>
                    <span className="font-mono">−{fmt(selected.descuentoAmt)}</span>
                  </div>
                )}
                <div className="flex justify-between text-brand-600">
                  <span>IVA (19%)</span>
                  <span className="font-mono">{fmt(selected.iva)}</span>
                </div>
                <div className="flex justify-between font-bold text-base border-t pt-2 text-brand-800 border-brand-150">
                  <span>Total</span>
                  <span className="font-mono">{fmt(selected.total)}</span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Button variant="soft" onClick={() => setEditing(selected)}>
                    <Pencil size={15} /> Editar
                  </Button>
                  <Button variant="soft">
                    <Printer size={15} /> Imprimir
                  </Button>
                </div>
                <button
                  onClick={() => setVoiding(selected)}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold text-danger hover:bg-danger-soft"
                >
                  <Ban size={15} /> Anular venta
                </button>
              </div>
            </>
          ) : (
            <div className="p-8 text-center">
              <ReceiptText size={32} strokeWidth={1.5} className="mx-auto mb-2 text-brand-200" />
              <p className="text-xs text-brand-400">Selecciona una venta para ver el detalle</p>
            </div>
          )}
        </div>
      </div>

      {editing && (
        <SaleForm
          sale={editing}
          customers={customers}
          onClose={() => setEditing(null)}
          onSave={(data) => {
            update(editing.id, data);
            setEditing(null);
          }}
        />
      )}
      {voiding && (
        <ConfirmDialog
          title="Anular venta"
          message={`¿Anular la venta ${voiding.factura} por ${fmt(voiding.total)}? Se eliminará del historial y las prendas vendidas en el POS volverán al stock.`}
          confirmLabel="Anular venta"
          onCancel={() => setVoiding(null)}
          onConfirm={() => {
            voidSale(voiding.id);
            setSelectedId(null);
            setVoiding(null);
          }}
        />
      )}
    </div>
  );
}
