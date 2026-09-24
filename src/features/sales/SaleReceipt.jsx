import logoSrc from '@/assets/public/logo.png';
import Modal from '@/shared/components/Modal';
import { Button } from '@/shared/components/Form';
import saleTotals from '@/features/sales/saleTotals';

// Store details shown on every receipt; empty fields are simply left out
export const BUSINESS = {
  nombre: 'Maho Boutique',
  nit: '',
  direccion: '',
  ciudad: '',
  telefono: '',
  correo: '',
  instagram: '',
};

const fmt = (n) => `$${n.toLocaleString('es-CO')}`;
const fmtDateTime = (iso) =>
  new Date(iso).toLocaleString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
const fmtDate = (d) =>
  new Date(`${d}T00:00`).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });

function Info({ label, value, className = '' }) {
  if (!value) return null;
  return (
    <div className={className}>
      <p className="text-[10px] uppercase tracking-wider text-brand-400">{label}</p>
      <p className="text-xs font-medium text-brand-800 wrap-break-word">{value}</p>
    </div>
  );
}

// Sale receipt shown after a sale, from the history, and sent by email
export default function SaleReceipt({ sale }) {
  const { subtotal, descuentoAmt, envio, total } = saleTotals(sale);
  const proof = sale.comprobante;
  const storeLines = [
    BUSINESS.nit && `NIT ${BUSINESS.nit}`,
    [BUSINESS.direccion, BUSINESS.ciudad].filter(Boolean).join(', '),
    [BUSINESS.telefono, BUSINESS.correo].filter(Boolean).join(' · '),
    BUSINESS.instagram,
  ].filter(Boolean);

  return (
    <div className="bg-white text-brand-800">
      {/* Store + receipt number */}
      <div className="flex items-start justify-between gap-6 pb-5 border-b-2 border-brand-800">
        <div className="flex items-center gap-3 min-w-0">
          <img src={logoSrc} alt={BUSINESS.nombre} className="w-16 h-16 object-contain shrink-0" />
          <div className="min-w-0 text-[11px] leading-relaxed text-brand-600">
            <p className="text-base font-display text-brand-800">{BUSINESS.nombre}</p>
            {storeLines.map((l) => (
              <p key={l}>{l}</p>
            ))}
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-400">Comprobante de venta</p>
          <p className="text-lg font-bold font-mono">{sale.factura}</p>
          <p className="text-[11px] text-brand-600">{fmtDateTime(sale.fecha)}</p>
          {sale.tipo === 'pedido' && (
            <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-100 text-brand-700">
              Pedido
            </span>
          )}
        </div>
      </div>

      {/* Customer + payment */}
      <div className="grid grid-cols-2 gap-4 py-4 border-b border-brand-100">
        <div className="space-y-2">
          <p className="text-[11px] font-semibold text-brand-800">Cliente</p>
          <div className="grid grid-cols-2 gap-2">
            <Info label="Nombre" value={sale.cliente || 'Cliente general'} className="col-span-2" />
            <Info label="Cédula / NIT" value={sale.documento} />
            <Info label="Teléfono" value={sale.telefono} />
            <Info label="Correo" value={sale.correo} className="col-span-2" />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-[11px] font-semibold text-brand-800">Pago</p>
          <div className="grid grid-cols-2 gap-2">
            <Info label="Medio" value={<span className="capitalize">{sale.pago}</span>} />
            <Info label="Vendedor" value={sale.vendedor} />
            {proof && (
              <>
                <Info label="Banco" value={proof.banco} />
                <Info label="Referencia" value={proof.referencia} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Delivery, only for orders */}
      {sale.entrega && (
        <div className="py-4 border-b border-brand-100">
          <p className="text-[11px] font-semibold mb-2 text-brand-800">Entrega</p>
          <div className="grid grid-cols-3 gap-2">
            <Info
              label="Dirección"
              value={[sale.entrega.direccion, sale.entrega.barrio, sale.entrega.ciudad].filter(Boolean).join(', ')}
              className="col-span-2"
            />
            <Info label="Fecha" value={sale.entrega.fecha && fmtDate(sale.entrega.fecha)} />
            <Info label="Notas" value={sale.entrega.notas} className="col-span-3" />
          </div>
        </div>
      )}

      {/* Items */}
      <table className="w-full mt-4 text-xs">
        <thead>
          <tr className="text-[10px] uppercase tracking-wider text-left text-brand-400 border-b border-brand-150">
            <th className="py-2 font-semibold">Producto</th>
            <th className="py-2 font-semibold text-center">Talla</th>
            <th className="py-2 font-semibold text-center">Cant.</th>
            <th className="py-2 font-semibold text-right">Precio</th>
            <th className="py-2 font-semibold text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {sale.items.map((i) => (
            <tr key={`${i.name}-${i.talla}`} className="border-b border-brand-50">
              <td className="py-2 text-brand-800">{i.name}</td>
              <td className="py-2 text-center text-brand-600">{i.talla}</td>
              <td className="py-2 text-center text-brand-600">{i.qty}</td>
              <td className="py-2 text-right font-mono text-brand-600">{fmt(i.price)}</td>
              <td className="py-2 text-right font-mono text-brand-800">{fmt(i.price * i.qty)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mt-4">
        <div className="w-56 space-y-1 text-xs">
          <div className="flex justify-between text-brand-600">
            <span>Subtotal</span>
            <span className="font-mono">{fmt(subtotal)}</span>
          </div>
          {descuentoAmt > 0 && (
            <div className="flex justify-between text-danger">
              <span>Descuento ({sale.descuento}%)</span>
              <span className="font-mono">−{fmt(descuentoAmt)}</span>
            </div>
          )}
          {envio > 0 && (
            <div className="flex justify-between text-brand-600">
              <span>Envío</span>
              <span className="font-mono">{fmt(envio)}</span>
            </div>
          )}
          <div className="flex justify-between items-baseline pt-2 mt-1 border-t-2 border-brand-800">
            <span className="font-bold">Total</span>
            <span className="text-lg font-bold font-mono">{fmt(total)}</span>
          </div>
        </div>
      </div>

      <p className="mt-6 pt-3 border-t border-brand-100 text-center text-[10px] text-brand-400">
        Gracias por tu compra en {BUSINESS.nombre}
      </p>
    </div>
  );
}

export function ReceiptModal({ sale, onClose }) {
  return (
    <Modal
      title="Comprobante de venta"
      size="lg"
      onClose={onClose}
      footer={
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
      }
    >
      <SaleReceipt sale={sale} />
    </Modal>
  );
}
