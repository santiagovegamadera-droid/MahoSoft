import { useState } from 'react';
import { Ban, Banknote, CreditCard, FileText, Landmark, ReceiptText } from 'lucide-react';
import saleTotals from '@/features/sales/saleTotals';
import { ReceiptModal } from '@/features/sales/SaleReceipt';
import useSales, { voidSale } from '@/features/sales/store';
import ConfirmDialog from '@/shared/components/ConfirmDialog';
import usePagination from '@/shared/lib/usePagination';
import Pagination from '@/shared/components/Pagination';

const paymentIcons = { efectivo: Banknote, tarjeta: CreditCard, transferencia: Landmark };

const fmt = (n) => `$${n.toLocaleString('es-CO')}`;
const fmtDate = (iso) =>
  new Date(iso).toLocaleString('es-CO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
const isToday = (iso) => new Date(iso).toDateString() === new Date().toDateString();

export default function SalesHistory() {
  const { items: sales } = useSales();
  const [search, setSearch] = useState('');
  const [payment, setPayment] = useState('todos');
  const [selectedId, setSelectedId] = useState(null);
  const [voiding, setVoiding] = useState(null);
  const [receipt, setReceipt] = useState(null);

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
  const pager = usePagination(filtered, `${search}|${payment}`);

  const today = rows.filter((s) => isToday(s.fecha));
  const todayTotal = today.reduce((sum, s) => sum + s.total, 0);

  return (
    <div className="p-5 space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: 'Ventas de hoy', value: today.length },
          { label: 'Vendido hoy', value: fmt(todayTotal) },
          { label: 'Ventas registradas', value: rows.length },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-xl px-4 py-3 border border-brand-150">
            <p className="text-[10px] font-medium uppercase tracking-wide mb-1 text-brand-600">{k.label}</p>
            <p className="text-lg font-bold text-brand-800">{k.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-4 items-start">
        <div className="flex-1 min-w-0">
          {/* Filters */}
          <div className="flex items-center gap-2 mb-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por factura o cliente..."
              className="px-3 py-1.5 text-xs rounded-lg border outline-none border-brand-200 bg-white text-brand-800 w-56 focus:border-brand-600"
            />
            <select
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg border outline-none border-brand-200 bg-white text-brand-800"
            >
              <option value="todos">Todos los pagos</option>
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="transferencia">Transferencia</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border overflow-hidden border-brand-150">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-brand-50">
                  {['Factura', 'Fecha', 'Cliente', 'Prendas', 'Pago', 'Total'].map((h) => (
                    <th
                      key={h}
                      className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-brand-600"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-50">
                {pager.pageItems.map((s) => {
                  const PayIcon = paymentIcons[s.pago];
                  return (
                    <tr
                      key={s.id}
                      onClick={() => setSelectedId(s.id)}
                      className={`cursor-pointer transition-colors hover:bg-brand-25 ${
                        selectedId === s.id ? 'bg-brand-25' : ''
                      }`}
                    >
                      <td className="px-3 py-2 font-mono text-[11px] font-semibold text-brand-800">{s.factura}</td>
                      <td className="px-3 py-2 text-[11px] text-brand-600">{fmtDate(s.fecha)}</td>
                      <td className="px-3 py-2 text-brand-800">{s.cliente}</td>
                      <td className="px-3 py-2 text-brand-600">{s.items.reduce((n, i) => n + i.qty, 0)}</td>
                      <td className="px-3 py-2">
                        <span className="inline-flex items-center gap-1 text-[11px] capitalize text-brand-600">
                          <PayIcon size={12} />
                          {s.pago}
                        </span>
                      </td>
                      <td className="px-3 py-2 font-mono font-semibold text-brand-800">{fmt(s.total)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <p className="px-4 py-8 text-center text-xs text-brand-400">
                No hay ventas que coincidan con la búsqueda.
              </p>
            )}
            <Pagination pager={pager} label="ventas" />
          </div>
        </div>

        {/* Detail */}
        <div className="w-64 shrink-0 bg-white rounded-xl border border-brand-150">
          {selected ? (
            <>
              <div className="p-3 border-b border-brand-50">
                <p className="font-mono text-xs font-semibold text-brand-800">{selected.factura}</p>
                <p className="text-[11px] mt-0.5 text-brand-400">{fmtDate(selected.fecha)}</p>
                <div className="mt-2 space-y-0.5 text-[11px] text-brand-600">
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
              <div className="p-3 space-y-1.5 border-b border-brand-50">
                {selected.items.map((i) => (
                  <div key={i.name + i.talla} className="flex justify-between gap-2 text-[11px]">
                    <span className="text-brand-800">
                      {i.qty} × {i.name} <span className="text-brand-400">· {i.talla}</span>
                    </span>
                    <span className="font-mono text-brand-800">{fmt(i.price * i.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="p-3 space-y-1.5 text-[11px]">
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
                {selected.envio > 0 && (
                  <div className="flex justify-between text-brand-600">
                    <span>Envío</span>
                    <span className="font-mono">{fmt(selected.envio)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm border-t pt-1.5 text-brand-800 border-brand-150">
                  <span>Total</span>
                  <span className="font-mono">{fmt(selected.total)}</span>
                </div>
                <button
                  onClick={() => setReceipt(selected)}
                  className="w-full mt-2 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold bg-brand-200 text-brand-800 hover:bg-brand-400"
                >
                  <FileText size={13} /> Ver comprobante
                </button>
                <button
                  onClick={() => setVoiding(selected)}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold text-danger hover:bg-danger-soft"
                >
                  <Ban size={13} /> Anular venta
                </button>
              </div>
            </>
          ) : (
            <div className="p-6 text-center">
              <ReceiptText size={26} strokeWidth={1.5} className="mx-auto mb-2 text-brand-200" />
              <p className="text-xs text-brand-400">Selecciona una venta para ver el detalle</p>
            </div>
          )}
        </div>
      </div>

      {receipt && <ReceiptModal sale={receipt} onClose={() => setReceipt(null)} />}

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
