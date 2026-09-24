import { useState } from 'react';
import { PackagePlus, Search } from 'lucide-react';
import { purchaseTotal, purchaseUnits } from '@/features/purchases/store';
import Modal from '@/shared/components/Modal';
import { Button } from '@/shared/components/Form';

const fmt = (n) => `$${n.toLocaleString('es-CO')}`;
const fmtDate = (d) =>
  new Date(`${d}T00:00`).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });

function PurchaseDetail({ purchase, supplierName, productName, onClose }) {
  return (
    <Modal
      title={`Compra ${purchase.numero}`}
      size="lg"
      onClose={onClose}
      footer={
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
      }
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-xs">
        {[
          ['Proveedor', supplierName(purchase.proveedorId)],
          ['Fecha', fmtDate(purchase.fecha)],
          ['Factura proveedor', purchase.facturaProveedor || '—'],
          ['Registró', purchase.usuario],
        ].map(([label, value]) => (
          <div key={label}>
            <p className="text-[10px] uppercase tracking-wider text-brand-400">{label}</p>
            <p className="font-medium text-brand-800">{value}</p>
          </div>
        ))}
      </div>

      <table className="w-full text-xs">
        <thead>
          <tr className="text-[10px] uppercase tracking-wider text-left text-brand-400 border-b border-brand-150">
            <th className="py-2 font-semibold">Producto</th>
            <th className="py-2 font-semibold text-center">Talla</th>
            <th className="py-2 font-semibold text-center">Cant.</th>
            <th className="py-2 font-semibold text-right">Costo unit.</th>
            <th className="py-2 font-semibold text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {purchase.items.map((i, idx) => (
            <tr key={idx} className="border-b border-brand-50">
              <td className="py-2 text-brand-800">{productName(i.productId)}</td>
              <td className="py-2 text-center text-brand-600">{i.talla}</td>
              <td className="py-2 text-center text-brand-600">{i.cant}</td>
              <td className="py-2 text-right font-mono text-brand-600">{fmt(i.costo)}</td>
              <td className="py-2 text-right font-mono text-brand-800">{fmt(i.cant * i.costo)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end items-baseline gap-4 mt-3">
        <span className="text-xs text-brand-600">{purchaseUnits(purchase)} prendas</span>
        <span className="text-sm font-bold text-brand-800">Total</span>
        <span className="text-lg font-bold font-mono text-brand-800">{fmt(purchaseTotal(purchase))}</span>
      </div>
      {purchase.notas && <p className="mt-3 text-xs text-brand-600">Notas: {purchase.notas}</p>}
    </Modal>
  );
}

export default function PurchaseOrders({ purchases, suppliers, products, onNew }) {
  const [search, setSearch] = useState('');
  const [viewing, setViewing] = useState(null);
  const supplierName = (id) => suppliers.find((s) => s.id === id)?.name ?? 'Proveedor eliminado';
  const productName = (id) => products.find((p) => p.id === id)?.name ?? 'Producto eliminado';

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

  return (
    <>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: 'Compras del mes', val: thisMonth.length },
          { label: 'Prendas ingresadas (mes)', val: thisMonth.reduce((s, p) => s + purchaseUnits(p), 0) },
          { label: 'Invertido (mes)', val: fmt(thisMonth.reduce((s, p) => s + purchaseTotal(p), 0)) },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-xl px-4 py-3 border border-brand-150">
            <p className="text-[10px] uppercase tracking-wide mb-1 text-brand-600">{k.label}</p>
            <p className="text-lg font-bold text-brand-800">{k.val}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border overflow-hidden border-brand-150">
        <div className="px-4 py-3 border-b flex items-center justify-between gap-3 border-brand-50">
          <h3 className="text-sm font-semibold text-brand-800">Historial de compras</h3>
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-brand-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por número, proveedor o factura..."
              className="w-64 pl-7 pr-3 py-1.5 text-xs rounded-lg border outline-none border-brand-200 bg-white text-brand-800 focus:border-brand-600"
            />
          </div>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-brand-50">
              {['Número', 'Fecha', 'Proveedor', 'Factura proveedor', 'Prendas', 'Total'].map((h) => (
                <th key={h} className="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-brand-600">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-50">
            {rows.map((p) => (
              <tr key={p.id} onClick={() => setViewing(p)} className="cursor-pointer hover:bg-brand-25">
                <td className="px-4 py-2 font-mono font-semibold text-brand-800">{p.numero}</td>
                <td className="px-4 py-2 text-brand-600">{fmtDate(p.fecha)}</td>
                <td className="px-4 py-2 text-brand-800">{supplierName(p.proveedorId)}</td>
                <td className="px-4 py-2 font-mono text-brand-600">{p.facturaProveedor || '—'}</td>
                <td className="px-4 py-2 text-brand-600">{purchaseUnits(p)}</td>
                <td className="px-4 py-2 font-mono font-semibold text-brand-800">{fmt(purchaseTotal(p))}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <div className="px-4 py-10 text-center">
            <PackagePlus size={28} strokeWidth={1.5} className="mx-auto mb-2 text-brand-200" />
            <p className="text-xs text-brand-400">{q ? 'No hay compras que coincidan.' : 'Aún no hay compras registradas.'}</p>
            {!q && (
              <button onClick={onNew} className="mt-3 text-xs font-semibold text-brand-600 hover:text-brand-800">
                Registrar la primera compra
              </button>
            )}
          </div>
        )}
      </div>

      {viewing && (
        <PurchaseDetail
          purchase={viewing}
          supplierName={supplierName}
          productName={productName}
          onClose={() => setViewing(null)}
        />
      )}
    </>
  );
}
