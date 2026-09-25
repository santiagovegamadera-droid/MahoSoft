import { useState } from 'react';
import { AlertTriangle, CheckCircle2, FileText, PackagePlus, Plus } from 'lucide-react';
import {
  PAYMENT_TERMS,
  isPending,
  matchesInvoice,
  purchaseFileKey,
  purchaseTotals,
  usePurchases,
} from '@/features/purchases/store';
import { formatSize, openFile } from '@/shared/lib/fileStore';
import { formatDocument } from '@/shared/components/DocumentInput';
import Modal from '@/shared/components/Modal';
import { Button } from '@/shared/components/Form';
import usePagination from '@/shared/lib/usePagination';
import Pagination from '@/shared/components/Pagination';
import StatCard from '@/shared/components/StatCard';
import { ClickableRow, EmptyState, Table, TableCard } from '@/shared/components/Table';
import { SearchInput, Toolbar } from '@/shared/components/Toolbar';

const fmt = (n) => `$${Math.round(n).toLocaleString('es-CO')}`;
const fmtDate = (d) =>
  new Date(`${d}T00:00`).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });

function PaymentBadge({ purchase }) {
  return isPending(purchase) ? (
    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-warning-soft text-warning">Pendiente</span>
  ) : (
    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-success-soft text-success">Pagada</span>
  );
}

function PurchaseDetail({ purchase, supplier, productName, onMarkPaid, onClose }) {
  const t = purchaseTotals(purchase);
  const rate = (purchase.iva ?? 0) / 100;
  const [missingFile, setMissingFile] = useState(false);
  const openDocument = async () => setMissingFile(!(await openFile(purchaseFileKey(purchase))));
  const lineTotal = (i) => i.cant * i.costo * (purchase.ivaIncluido ? 1 : 1 + rate);

  return (
    <Modal
      title={`Compra ${purchase.numero}`}
      size="lg"
      onClose={onClose}
      footer={
        <>
          {isPending(purchase) && (
            <Button variant="soft" onClick={onMarkPaid}>
              <CheckCircle2 size={16} /> Marcar como pagada
            </Button>
          )}
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <p className="text-xs uppercase tracking-wide text-subtle mb-1">Proveedor</p>
          <p className="font-semibold text-brand-800">{supplier?.name ?? 'Proveedor eliminado'}</p>
          {supplier && (
            <div className="text-xs text-brand-600 space-y-0.5 mt-0.5">
              <p>{formatDocument(supplier.tipoDocumento, supplier.documento)}</p>
              <p>{[supplier.direccion, supplier.ciudad].filter(Boolean).join(' · ')}</p>
              <p>{supplier.tel}</p>
            </div>
          )}
        </div>
        <div className="rounded-xl border border-brand-150 p-3 text-xs space-y-1">
          <p className="text-brand-600">{purchase.tipoComprobante ?? 'Factura'}</p>
          <p className="text-sm font-semibold text-brand-800">{purchase.facturaProveedor || '—'}</p>
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
            Pago: <span className="text-brand-800">{PAYMENT_TERMS[purchase.condicionPago ?? 'contado']}</span>
            <PaymentBadge purchase={purchase} />
          </p>
          {purchase.vence && (
            <p className="text-brand-600">
              Vence: <span className="text-brand-800">{fmtDate(purchase.vence)}</span>
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
          {purchase.items.map((i, idx) => (
            <tr key={idx} className="border-b border-brand-50">
              <td className="py-2 font-mono text-xs text-brand-600">{i.ref || '—'}</td>
              <td className="py-2 text-brand-800">{productName(i.productId)}</td>
              <td className="py-2 text-center text-brand-600">{i.talla}</td>
              <td className="py-2 text-center text-brand-600">{i.cant}</td>
              <td className="py-2 text-right font-mono text-brand-600">{fmt(i.costo)}</td>
              <td className="py-2 text-right font-mono text-brand-800">{fmt(lineTotal(i))}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between gap-6 mt-4">
        <div className="text-xs text-brand-600 space-y-1">
          <p>
            {t.articulos} artículos · {t.unidades} prendas
          </p>
          <p>Registró: {purchase.usuario}</p>
          {purchase.notas && <p>Notas: {purchase.notas}</p>}
          {purchase.adjunto && (
            <button
              type="button"
              onClick={openDocument}
              className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg border border-brand-150 text-left hover:bg-brand-25"
            >
              <FileText size={16} className="text-brand-600 shrink-0" />
              <span className="min-w-0">
                <span className="block text-sm font-medium truncate text-brand-800">{purchase.adjunto.nombre}</span>
                <span className="block text-xs text-subtle">Ver documento · {formatSize(purchase.adjunto.tamano)}</span>
              </span>
            </button>
          )}
          {missingFile && <p className="text-warning">El documento ya no está guardado en este navegador.</p>}
        </div>
        <dl className="w-60 text-sm space-y-1">
          <div className="flex justify-between text-brand-600">
            <dt>Subtotal</dt>
            <dd className="font-mono">{fmt(t.subtotal)}</dd>
          </div>
          {t.descuento > 0 && (
            <div className="flex justify-between text-brand-600">
              <dt>Descuento</dt>
              <dd className="font-mono">−{fmt(t.descuento)}</dd>
            </div>
          )}
          <div className="flex justify-between text-brand-600">
            <dt>IVA</dt>
            <dd className={purchase.iva ? 'font-mono' : 'text-subtle'}>
              {purchase.iva ? `${fmt(t.iva)} (${purchase.iva}%)` : 'Sin IVA'}
            </dd>
          </div>
          <div className="flex justify-between items-baseline pt-1 border-t border-brand-150">
            <dt className="font-semibold text-brand-800">Total neto</dt>
            <dd className="text-lg font-bold font-mono text-brand-800">{fmt(t.total)}</dd>
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

export default function PurchaseOrders({ purchases, suppliers, products, onNew, canCreate }) {
  const { update } = usePurchases();
  const [search, setSearch] = useState('');
  const [viewingId, setViewingId] = useState(null);
  const supplierOf = (id) => suppliers.find((s) => s.id === id);
  const supplierName = (id) => supplierOf(id)?.name ?? 'Proveedor eliminado';
  const productName = (id) => products.find((p) => p.id === id)?.name ?? 'Producto eliminado';
  const viewing = purchases.find((p) => p.id === viewingId);

  const q = search.trim().toLowerCase();
  const rows = [...purchases]
    .sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id - a.id)
    .filter(
      (p) =>
        !q ||
        p.numero.toLowerCase().includes(q) ||
        supplierName(p.proveedorId).toLowerCase().includes(q) ||
        p.facturaProveedor.toLowerCase().includes(q),
    );

  const month = new Date().toISOString().slice(0, 7);
  const thisMonth = purchases.filter((p) => p.fecha.startsWith(month));
  const pending = purchases.filter(isPending);
  const pager = usePagination(rows, q);

  return (
    <>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Compras del mes" value={thisMonth.length} />
        <StatCard label="Invertido (mes)" value={fmt(thisMonth.reduce((s, p) => s + purchaseTotals(p).total, 0))} />
        <StatCard
          label="Por pagar"
          value={fmt(pending.reduce((s, p) => s + purchaseTotals(p).total, 0))}
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
          {pager.pageItems.map((p) => {
            const t = purchaseTotals(p);
            return (
              <ClickableRow key={p.id} onOpen={() => setViewingId(p.id)}>
                <td className="px-4 py-2.5 font-mono font-semibold text-brand-800">{p.numero}</td>
                <td className="px-4 py-2.5 text-brand-600">{fmtDate(p.fecha)}</td>
                <td className="px-4 py-2.5 text-brand-800">{supplierName(p.proveedorId)}</td>
                <td className="px-4 py-2.5 font-mono text-brand-600">{p.facturaProveedor || '—'}</td>
                <td className="px-4 py-2.5 text-brand-600">{t.unidades}</td>
                <td className="px-4 py-2.5 font-mono font-semibold text-brand-800">{fmt(t.total)}</td>
                <td className="px-4 py-2.5 text-center">
                  <PaymentBadge purchase={p} />
                </td>
              </ClickableRow>
            );
          })}
        </Table>
        {rows.length === 0 && (
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
          productName={productName}
          onMarkPaid={() => update(viewing.id, { estadoPago: 'pagada' })}
          onClose={() => setViewingId(null)}
        />
      )}
    </>
  );
}
