import { useState } from 'react';
import { Ban, Banknote, CreditCard, FileText, Landmark, Loader2, Paperclip, ReceiptText } from 'lucide-react';
import { ReceiptModal } from '@/features/sales/SaleReceipt';
import useSales, { PAYMENT_LABELS, isVoided, voidSale } from '@/features/sales/store';
import { apiBlob } from '@/shared/lib/api';
import { openBlob } from '@/shared/lib/files';
import { ErrorAlert, LoadingState } from '@/shared/components/Feedback';
import Modal from '@/shared/components/Modal';
import usePagination from '@/shared/lib/usePagination';
import Pagination from '@/shared/components/Pagination';
import StatCard from '@/shared/components/StatCard';
import { Button, Field, inputClass } from '@/shared/components/Form';
import { ClickableRow, EmptyState, Table, TableCard } from '@/shared/components/Table';
import { FilterSelect, SearchInput, Toolbar } from '@/shared/components/Toolbar';

const paymentIcons = { Efectivo: Banknote, Tarjeta: CreditCard, Transferencia: Landmark };

const fmt = (n) => `$${n.toLocaleString('es-CO')}`;
const fmtDate = (iso) =>
  new Date(iso).toLocaleString('es-CO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
const fmtDay = (iso) => new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' });
const fmtTime = (iso) => new Date(iso).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
const isToday = (iso) => new Date(iso).toDateString() === new Date().toDateString();
const customerName = (s) => s.cliente?.nombre || 'Cliente general';

function VoidedBadge() {
  return (
    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-danger-soft text-danger">Anulada</span>
  );
}

/** Asks why the sale is voided; the server keeps the reason, who voided it and when */
function VoidSale({ sale, onClose }) {
  const [motivo, setMotivo] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function confirm() {
    if (!motivo.trim()) return setError('Escribe el motivo de la anulación');
    setError('');
    setSaving(true);
    try {
      await voidSale(sale.id, motivo.trim());
      onClose();
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <Modal
      title="Anular venta"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirm} disabled={saving}>
            {saving && <Loader2 size={16} className="animate-spin" />}
            {saving ? 'Anulando…' : 'Anular venta'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-brand-600">
          La venta {sale.numeroFactura} por {fmt(sale.total)} quedará en el historial como anulada y sus{' '}
          {sale.unidades === 1 ? 'prenda vuelve' : `${sale.unidades} prendas vuelven`} al stock.
        </p>
        <Field label="Motivo">
          <textarea
            rows={2}
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            maxLength={300}
            placeholder="Ej. la clienta devolvió la prenda, error al cobrar…"
            className={`${inputClass} resize-none`}
            autoFocus
          />
        </Field>
        <ErrorAlert message={error} />
      </div>
    </Modal>
  );
}

export default function SalesHistory() {
  const { items: sales, loaded, loading, error, reload } = useSales();
  const [search, setSearch] = useState('');
  const [payment, setPayment] = useState('todos');
  const [selectedId, setSelectedId] = useState(null);
  const [voiding, setVoiding] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [fileError, setFileError] = useState('');

  async function openTransferProof(sale) {
    setFileError('');
    try {
      await openBlob(apiBlob(`/api/ventas/${sale.id}/comprobante`));
    } catch (err) {
      setFileError(err.message);
    }
  }

  const q = search.toLowerCase();
  const filtered = sales.filter(
    (s) =>
      (payment === 'todos' || s.metodoPago === payment) &&
      (s.numeroFactura.toLowerCase().includes(q) || customerName(s).toLowerCase().includes(q)),
  );
  const selected = sales.find((s) => s.id === selectedId);
  const pager = usePagination(filtered, `${search}|${payment}`);

  // Voided sales stay in the list but don't count
  const valid = sales.filter((s) => !isVoided(s));
  const today = valid.filter((s) => isToday(s.fecha));
  const todayTotal = today.reduce((sum, s) => sum + s.total, 0);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Ventas de hoy" value={today.length} />
        <StatCard label="Vendido hoy" value={fmt(todayTotal)} />
        <StatCard label="Ventas registradas" value={valid.length} />
      </div>

      <ErrorAlert message={error} onRetry={reload} className="mb-4" />

      <Toolbar>
        <SearchInput value={search} onChange={setSearch} placeholder="Buscar por factura o cliente..." />
        <FilterSelect
          value={payment}
          onChange={setPayment}
          label="Método de pago"
          options={[['todos', 'Todos los pagos'], ...Object.entries(PAYMENT_LABELS)]}
        />
      </Toolbar>

      <div className="flex gap-4 items-start">
        <TableCard className="flex-1 min-w-0">
          <Table columns={['Factura', 'Fecha', 'Cliente', 'Prendas', 'Pago', 'Total']}>
            {pager.pageItems.map((s) => {
              const PayIcon = paymentIcons[s.metodoPago];
              const voided = isVoided(s);
              return (
                <ClickableRow
                  key={s.id}
                  onOpen={() => {
                    setSelectedId(s.id);
                    setFileError('');
                  }}
                  selected={selectedId === s.id}
                >
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <p className={`font-mono font-semibold ${voided ? 'text-subtle line-through' : 'text-brand-800'}`}>
                      {s.numeroFactura}
                    </p>
                    {voided && <VoidedBadge />}
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <p className="text-brand-800">{fmtDay(s.fecha)}</p>
                    <p className="text-xs text-subtle">{fmtTime(s.fecha)}</p>
                  </td>
                  <td className="px-4 py-2.5 text-brand-800">{customerName(s)}</td>
                  <td className="px-4 py-2.5 text-brand-600">{s.unidades}</td>
                  <td className="px-4 py-2.5">
                    <span className="inline-flex items-center gap-1.5 text-brand-600">
                      <PayIcon size={14} />
                      {PAYMENT_LABELS[s.metodoPago]}
                    </span>
                  </td>
                  <td
                    className={`px-4 py-2.5 whitespace-nowrap font-mono font-semibold ${
                      voided ? 'text-subtle line-through' : 'text-brand-800'
                    }`}
                  >
                    {fmt(s.total)}
                  </td>
                </ClickableRow>
              );
            })}
          </Table>
          {!loaded && loading && <LoadingState message="Cargando ventas…" />}
          {loaded && filtered.length === 0 && (
            <EmptyState icon={ReceiptText} message="No hay ventas que coincidan con la búsqueda." />
          )}
          <Pagination pager={pager} label="ventas" />
        </TableCard>

        {/* Detail */}
        <div className="w-64 shrink-0 bg-white rounded-2xl border border-brand-150">
          {selected ? (
            <>
              <div className="p-4 border-b border-brand-50">
                <div className="flex items-center gap-2">
                  <p className="font-mono text-sm font-semibold text-brand-800">{selected.numeroFactura}</p>
                  {isVoided(selected) && <VoidedBadge />}
                </div>
                <p className="text-xs mt-0.5 text-subtle">{fmtDate(selected.fecha)}</p>
                <div className="mt-2 space-y-0.5 text-xs text-brand-600">
                  <p>
                    Cliente: <span className="font-medium text-brand-800">{customerName(selected)}</span>
                  </p>
                  <p>
                    Vendedor: <span className="font-medium text-brand-800">{selected.vendedor}</span>
                  </p>
                  <p>
                    Pago: <span className="font-medium text-brand-800">{PAYMENT_LABELS[selected.metodoPago]}</span>
                    {selected.comprobante?.banco && ` · ${selected.comprobante.banco}`}
                  </p>
                </div>
                {selected.comprobante?.archivo && (
                  <button
                    type="button"
                    onClick={() => openTransferProof(selected)}
                    className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-800"
                  >
                    <Paperclip size={13} /> Ver comprobante de transferencia
                  </button>
                )}
                <ErrorAlert message={fileError} className="mt-2" />
                {isVoided(selected) && (
                  <div className="mt-3 p-2 rounded-lg text-xs bg-danger-tint text-danger space-y-0.5">
                    <p className="font-semibold">
                      Anulada por {selected.anuladaPor} · {fmtDate(selected.anuladaEn)}
                    </p>
                    <p>{selected.motivoAnulacion}</p>
                  </div>
                )}
              </div>
              <div className="p-4 space-y-1.5 border-b border-brand-50">
                {selected.items.map((i) => (
                  <div key={i.id} className="flex justify-between gap-2 text-xs">
                    <span className="text-brand-800">
                      {i.cantidad} × {i.producto} <span className="text-subtle">· {i.talla}</span>
                    </span>
                    <span className="font-mono text-brand-800">{fmt(i.precioUnitario * i.cantidad)}</span>
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
                    <span>Descuento ({selected.descuentoPorcentaje}%)</span>
                    <span className="font-mono">−{fmt(selected.descuento)}</span>
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
                  {!isVoided(selected) && (
                    <Button variant="dangerGhost" onClick={() => setVoiding(selected)} className="w-full">
                      <Ban size={16} /> Anular venta
                    </Button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <EmptyState icon={ReceiptText} message="Selecciona una venta para ver el detalle" />
          )}
        </div>
      </div>

      {receipt && <ReceiptModal sale={receipt} onClose={() => setReceipt(null)} />}
      {voiding && <VoidSale sale={voiding} onClose={() => setVoiding(null)} />}
    </div>
  );
}
