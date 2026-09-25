import { useState } from 'react';
import { AlertTriangle, CheckCircle2, FileText, Loader2, PackagePlus, Plus } from 'lucide-react';
import { PAYMENT_TERMS, isPending, markPurchasePaid, matchesInvoice } from '@/features/purchases/store';
import { apiBlob } from '@/shared/lib/api';
import { formatSize, openBlob } from '@/shared/lib/files';
import { formatDocument } from '@/shared/components/DocumentInput';
import { ErrorAlert, LoadingState } from '@/shared/components/Feedback';
import Modal from '@/shared/components/Modal';
import { Button } from '@/shared/components/Form';
import usePagination from '@/shared/lib/usePagination';
import Pagination from '@/shared/components/Pagination';
import StatCard from '@/shared/components/StatCard';
import { ClickableRow, EmptyState, Table, TableCard } from '@/shared/components/Table';
import { SearchInput, Toolbar } from '@/shared/components/Toolbar';

const fmt = (n) => `$${Math.round(n).toLocaleString('es-CO')}`;
// Dates come as YYYY-MM-DD (the invoice's own date, no time zone)
const fmtDate = (d) =>
  new Date(`${d}T00:00`).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });

function PaymentBadge({ purchase }) {
  return isPending(purchase) ? (
    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-warning-soft text-warning">Pendiente</span>
  ) : (
    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-success-soft text-success">Pagada</span>
  );
}

function PurchaseDetail({ purchase, supplier, onClose }) {
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');
  const rate = purchase.ivaPorcentaje / 100;
  // Line total as the invoice prints it: with IVA
  const lineTotal = (i) => i.cantidad * i.precioUnitario * (purchase.preciosIncluyenIva ? 1 : 1 + rate);

  async function run(action) {
    setError('');
    try {
      await action();
    } catch (err) {
      setError(err.message);
    }
  }

  async function markPaid() {
    setPaying(true);
    await run(() => markPurchasePaid(purchase.id));
    setPaying(false);
  }

  const openDocument = () => run(() => openBlob(apiBlob(`/api/compras/${purchase.id}/documento`)));

  return (
    <Modal
      title={`Compra ${purchase.numero}`}
      size="lg"
      onClose={onClose}
      footer={
        <>
          {isPending(purchase) && (
            <Button variant="soft" onClick={markPaid} disabled={paying}>
              {paying ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />} Marcar como
              pagada
            </Button>
          )}
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
        </>
      }
    >
      <ErrorAlert message={error} className="mb-4" />
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <p className="text-xs uppercase tracking-wide text-subtle mb-1">Proveedor</p>
          <p className="font-semibold text-brand-800">{purchase.proveedor}</p>
          {supplier && (
            <div className="text-xs text-brand-600 space-y-0.5 mt-0.5">
              <p>{formatDocument(supplier.tipoDocumento, supplier.documento)}</p>
              <p>{[supplier.direccion, supplier.ciudad].filter(Boolean).join(' · ')}</p>
              <p>{supplier.telefono}</p>
            </div>
          )}
        </div>
        <div className="rounded-xl border border-brand-150 p-3 text-xs space-y-1">
          <p className="text-brand-600">{purchase.tipoComprobante}</p>
          <p className="text-sm font-semibold text-brand-800">{purchase.numeroComprobante}</p>
          <p className="text-brand-600">
            Fecha: <span className="text-brand-800">{fmtDate(purchase.fecha)}</span>
            {purchase.hora && <span className="text-brand-800"> · {purchase.hora}</span>}
          </p>
          {purchase.vendedorProveedor && (
            <p className="text-brand-600">
              Vendedor: <span className="text-brand-800">{purchase.vendedorProveedor}</span>
            </p>
          )}
          {purchase.cufe && (
            <p className="text-brand-600 truncate" title={purchase.cufe}>
              CUFE/UUID: <span className="font-mono text-brand-800">{purchase.cufe}</span>
            </p>
          )}
          <p className="flex items-center gap-2 text-brand-600">
            Pago: <span className="text-brand-800">{PAYMENT_TERMS[purchase.condicionPago]}</span>
            <PaymentBadge purchase={purchase} />
          </p>
          {purchase.fechaVencimiento && (
            <p className="text-brand-600">
              Vence: <span className="text-brand-800">{fmtDate(purchase.fechaVencimiento)}</span>
            </p>
          )}
        </div>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs uppercase tracking-wide text-left text-subtle border-b border-brand-150">
            <th className="py-2 font-semibold">Ref.</th>
            <th className="py-2 font-semibold">Producto</th>
            <th className="py-2 font-semibold text-center">Talla</th>
            <th className="py-2 font-semibold text-center">Cant.</th>
            <th className="py-2 font-semibold text-right">Precio</th>
            <th className="py-2 font-semibold text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {purchase.items.map((i) => (
            <tr key={i.id} className="border-b border-brand-50">
              <td className="py-2 font-mono text-xs text-brand-600">{i.referenciaProveedor || '—'}</td>
              <td className="py-2 text-brand-800">{i.producto}</td>
              <td className="py-2 text-center text-brand-600">{i.talla}</td>
              <td className="py-2 text-center text-brand-600">{i.cantidad}</td>
              <td className="py-2 text-right font-mono text-brand-600">{fmt(i.precioUnitario)}</td>
              <td className="py-2 text-right font-mono text-brand-800">{fmt(lineTotal(i))}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between gap-6 mt-4">
        <div className="text-xs text-brand-600 space-y-1">
          <p>
            {purchase.items.length} artículos · {purchase.unidades} prendas
          </p>
          <p>Registró: {purchase.usuario}</p>
          {purchase.notas && <p>Notas: {purchase.notas}</p>}
          {purchase.documento && (
            <button
              type="button"
              onClick={openDocument}
              className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg border border-brand-150 text-left hover:bg-brand-25"
            >
              <FileText size={16} className="text-brand-600 shrink-0" />
              <span className="min-w-0">
                <span className="block text-sm font-medium truncate text-brand-800">{purchase.documento.nombre}</span>
                <span className="block text-xs text-subtle">
                  Ver documento · {formatSize(purchase.documento.tamano)}
                </span>
              </span>
            </button>
          )}
        </div>
        <dl className="w-60 text-sm space-y-1">
          <div className="flex justify-between text-brand-600">
            <dt>Subtotal</dt>
            <dd className="font-mono">{fmt(purchase.subtotal)}</dd>
          </div>
          {purchase.descuento > 0 && (
            <div className="flex justify-between text-brand-600">
              <dt>Descuento</dt>
              <dd className="font-mono">−{fmt(purchase.descuento)}</dd>
            </div>
          )}
          <div className="flex justify-between text-brand-600">
            <dt>IVA</dt>
            <dd className={purchase.ivaPorcentaje ? 'font-mono' : 'text-subtle'}>
              {purchase.ivaPorcentaje ? `${fmt(purchase.iva)} (${purchase.ivaPorcentaje}%)` : 'Sin IVA'}
            </dd>
          </div>
          <div className="flex justify-between items-baseline pt-1 border-t border-brand-150">
            <dt className="font-semibold text-brand-800">Total neto</dt>
            <dd className="text-lg font-bold font-mono text-brand-800">{fmt(purchase.total)}</dd>
          </div>
          {purchase.valorComprobante > 0 && (
            <div
              className={`flex items-center gap-1.5 pt-1 text-xs font-medium ${
                matchesInvoice(purchase) ? 'text-success' : 'text-warning'
              }`}
            >
              {matchesInvoice(purchase) ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
              {matchesInvoice(purchase)
                ? 'Cuadra con el comprobante'
                : `El comprobante dice ${fmt(purchase.valorComprobante)}`}
            </div>
          )}
        </dl>
      </div>
    </Modal>
  );
}

export default function PurchaseOrders({ purchases, loaded, loading, suppliers, onNew, canCreate }) {
  const [search, setSearch] = useState('');
  const [viewingId, setViewingId] = useState(null);
  const supplierOf = (id) => suppliers.find((s) => s.id === id);
  const viewing = purchases.find((p) => p.id === viewingId);

  const q = search.trim().toLowerCase();
  const rows = purchases.filter(
    (p) =>
      !q ||
      p.numero.toLowerCase().includes(q) ||
      p.proveedor.toLowerCase().includes(q) ||
      p.numeroComprobante.toLowerCase().includes(q),
  );

  const month = new Date().toISOString().slice(0, 7);
  const thisMonth = purchases.filter((p) => p.fecha.startsWith(month));
  const pending = purchases.filter(isPending);
  const pager = usePagination(rows, q);

  return (
    <>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Compras del mes" value={thisMonth.length} />
        <StatCard label="Invertido (mes)" value={fmt(thisMonth.reduce((s, p) => s + p.total, 0))} />
        <StatCard
          label="Por pagar"
          value={fmt(pending.reduce((s, p) => s + p.total, 0))}
          valueClassName={pending.length ? 'text-warning' : 'text-brand-800'}
        >
          <p className="text-xs text-subtle">
            {pending.length === 1 ? '1 factura pendiente' : `${pending.length} facturas pendientes`}
          </p>
        </StatCard>
      </div>

      <Toolbar>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Buscar por número, proveedor o factura..."
          className="w-80"
        />
        <Button onClick={onNew} disabled={!canCreate} className="ml-auto">
          <Plus size={16} /> Nueva compra
        </Button>
      </Toolbar>

      <TableCard>
        <Table
          columns={[
            'Número',
            'Fecha',
            'Proveedor',
            'Factura proveedor',
            'Prendas',
            'Total',
            { label: 'Pago', align: 'center' },
          ]}
        >
          {pager.pageItems.map((p) => (
            <ClickableRow key={p.id} onOpen={() => setViewingId(p.id)}>
              <td className="px-4 py-2.5 font-mono font-semibold text-brand-800">{p.numero}</td>
              <td className="px-4 py-2.5 text-brand-600">{fmtDate(p.fecha)}</td>
              <td className="px-4 py-2.5 text-brand-800">{p.proveedor}</td>
              <td className="px-4 py-2.5 font-mono text-brand-600">{p.numeroComprobante}</td>
              <td className="px-4 py-2.5 text-brand-600">{p.unidades}</td>
              <td className="px-4 py-2.5 font-mono font-semibold text-brand-800">{fmt(p.total)}</td>
              <td className="px-4 py-2.5 text-center">
                <PaymentBadge purchase={p} />
              </td>
            </ClickableRow>
          ))}
        </Table>
        {!loaded && loading && <LoadingState message="Cargando compras…" />}
        {loaded && rows.length === 0 && (
          <EmptyState
            icon={PackagePlus}
            message={q ? 'No hay compras que coincidan.' : 'Aún no hay compras registradas.'}
          >
            {!q && canCreate && (
              <Button variant="secondary" onClick={onNew} className="mx-auto">
                Registrar la primera compra
              </Button>
            )}
          </EmptyState>
        )}
        <Pagination pager={pager} label="compras" />
      </TableCard>

      {viewing && (
        <PurchaseDetail
          purchase={viewing}
          supplier={supplierOf(viewing.proveedorId)}
          onClose={() => setViewingId(null)}
        />
      )}
    </>
  );
}
