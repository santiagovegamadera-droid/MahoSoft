import { useState } from 'react';
import { Ban, Banknote, CreditCard, FileText, Landmark, ReceiptText } from 'lucide-react';
import saleTotals from '@/features/sales/saleTotals';
import { ReceiptModal } from '@/features/sales/SaleReceipt';
import useSales, { voidSale } from '@/features/sales/store';
import ConfirmDialog from '@/shared/components/ConfirmDialog';
import usePagination from '@/shared/lib/usePagination';
import Pagination from '@/shared/components/Pagination';
import StatCard from '@/shared/components/StatCard';
import { Button } from '@/shared/components/Form';
import { ClickableRow, EmptyState, Table, TableCard } from '@/shared/components/Table';
import { FilterSelect, SearchInput, Toolbar } from '@/shared/components/Toolbar';

const paymentIcons = { efectivo: Banknote, tarjeta: CreditCard, transferencia: Landmark };

const fmt = (n) => `$${n.toLocaleString('es-CO')}`;
const fmtDate = (iso) =>
  new Date(iso).toLocaleString('es-CO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
const fmtDay = (iso) => new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' });
const fmtTime = (iso) => new Date(iso).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
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
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Ventas de hoy" value={today.length} />
        <StatCard label="Vendido hoy" value={fmt(todayTotal)} />
        <StatCard label="Ventas registradas" value={rows.length} />
      </div>

      <Toolbar>
        <SearchInput value={search} onChange={setSearch} placeholder="Buscar por factura o cliente..." />
        <FilterSelect
          value={payment}
          onChange={setPayment}
          label="Método de pago"
          options={[
            ['todos', 'Todos los pagos'],
            ['efectivo', 'Efectivo'],
            ['tarjeta', 'Tarjeta'],
            ['transferencia', 'Transferencia'],
          ]}
        />
      </Toolbar>

      <div className="flex gap-4 items-start">
        <TableCard className="flex-1 min-w-0">
          <Table columns={['Factura', 'Fecha', 'Cliente', 'Prendas', 'Pago', 'Total']}>
            {pager.pageItems.map((s) => {
              const PayIcon = paymentIcons[s.pago];
              return (
                <ClickableRow key={s.id} onOpen={() => setSelectedId(s.id)} selected={selectedId === s.id}>
                  <td className="px-4 py-2.5 whitespace-nowrap font-mono font-semibold text-brand-800">{s.factura}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <p className="text-brand-800">{fmtDay(s.fecha)}</p>
                    <p className="text-xs text-subtle">{fmtTime(s.fecha)}</p>
                  </td>
                  <td className="px-4 py-2.5 text-brand-800">{s.cliente}</td>
                  <td className="px-4 py-2.5 text-brand-600">{s.items.reduce((n, i) => n + i.qty, 0)}</td>
                  <td className="px-4 py-2.5">
                    <span className="inline-flex items-center gap-1.5 capitalize text-brand-600">
                      <PayIcon size={14} />
                      {s.pago}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap font-mono font-semibold text-brand-800">{fmt(s.total)}</td>
                </ClickableRow>
              );
            })}
          </Table>
          {filtered.length === 0 && (
            <EmptyState icon={ReceiptText} message="No hay ventas que coincidan con la búsqueda." />
          )}
          <Pagination pager={pager} label="ventas" />
        </TableCard>

        {/* Detail */}
        <div className="w-64 shrink-0 bg-white rounded-2xl border border-brand-150">
          {selected ? (
            <>
              <div className="p-4 border-b border-brand-50">
                <p className="font-mono text-sm font-semibold text-brand-800">{selected.factura}</p>
                <p className="text-xs mt-0.5 text-subtle">{fmtDate(selected.fecha)}</p>
                <div className="mt-2 space-y-0.5 text-xs text-brand-600">
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
              <div className="p-4 space-y-1.5 border-b border-brand-50">
                {selected.items.map((i) => (
                  <div key={i.name + i.talla} className="flex justify-between gap-2 text-xs">
                    <span className="text-brand-800">
                      {i.qty} × {i.name} <span className="text-subtle">· {i.talla}</span>
                    </span>
                    <span className="font-mono text-brand-800">{fmt(i.price * i.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="p-4 space-y-1.5 text-xs">
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
                <div className="pt-2 space-y-1">
                  <Button variant="soft" onClick={() => setReceipt(selected)} className="w-full">
                    <FileText size={16} /> Ver comprobante
                  </Button>
                  <Button variant="dangerGhost" onClick={() => setVoiding(selected)} className="w-full">
                    <Ban size={16} /> Anular venta
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <EmptyState icon={ReceiptText} message="Selecciona una venta para ver el detalle" />
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
