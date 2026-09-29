import logoSrc from '@/assets/public/logo.png';
import { PAYMENT_LABELS, isVoided } from '@/features/sales/store';
import useSettings from '@/features/settings/store';
import { formatDocument } from '@/shared/components/DocumentInput';

const fmt = (n) => `$${Math.round(n).toLocaleString('es-CO')}`;
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

function Row({ label, value, strong = false }) {
  return (
    <div className={`flex justify-between gap-2 ${strong ? 'font-bold text-[13px]' : ''}`}>
      <span>{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}

const Rule = () => <div className="my-1.5 border-t border-dashed border-black" />;

/**
 * Sale receipt for an 80 mm thermal printer: one narrow column in black, as a till receipt.
 * Only used when printing (see .print-area in index.css).
 */
export default function ThermalReceipt({ sale }) {
  const business = useSettings();
  const cliente = sale.cliente;
  const proof = sale.comprobante;
  const storeLines = [
    business.nit && `NIT ${business.nit}`,
    business.direccion,
    business.ciudad,
    business.telefono && `Tel. ${business.telefono}`,
    business.instagram,
  ].filter(Boolean);

  return (
    <div className="w-[72mm] text-[11px] leading-snug text-black">
      <div className="text-center">
        <img src={logoSrc} alt="" className="w-14 h-14 mx-auto object-contain grayscale" />
        <p className="text-[14px] font-bold">{business.nombre}</p>
        {storeLines.map((l) => (
          <p key={l}>{l}</p>
        ))}
      </div>
      <Rule />
      <div className="text-center">
        <p className="font-bold">COMPROBANTE DE VENTA</p>
        <p className="font-bold text-[13px]">{sale.numeroFactura}</p>
        <p>{fmtDateTime(sale.fecha)}</p>
        {sale.tipo === 'Pedido' && <p className="font-bold">PEDIDO</p>}
        {isVoided(sale) && <p className="font-bold text-[13px]">*** ANULADA ***</p>}
      </div>
      <Rule />
      <p>Cliente: {cliente?.nombre || 'Cliente general'}</p>
      {cliente?.documento && <p>{formatDocument(cliente.tipoDocumento, cliente.documento)}</p>}
      {cliente?.telefono && <p>Tel. {cliente.telefono}</p>}
      <p>Atendió: {sale.vendedor}</p>
      <Rule />
      {sale.items.map((i) => (
        <div key={i.id} className="mb-1">
          <p>
            {i.producto} · Talla {i.talla}
          </p>
          <Row label={`  ${i.cantidad} x ${fmt(i.precioUnitario)}`} value={fmt(i.cantidad * i.precioUnitario)} />
        </div>
      ))}
      <Rule />
      <Row label="Subtotal" value={fmt(sale.subtotal)} />
      {sale.descuento > 0 && <Row label={`Descuento ${sale.descuentoPorcentaje}%`} value={`-${fmt(sale.descuento)}`} />}
      {sale.envio > 0 && <Row label="Envío" value={fmt(sale.envio)} />}
      <Row label="TOTAL" value={fmt(sale.total)} strong />
      <Rule />
      <Row label="Pago" value={PAYMENT_LABELS[sale.metodoPago]} />
      {proof?.banco && <Row label="Banco" value={proof.banco} />}
      {proof?.referencia && <Row label="Referencia" value={proof.referencia} />}
      <p className="mt-0.5">Prendas: {sale.unidades}</p>
      {sale.entrega && (
        <>
          <Rule />
          <p className="font-bold">Entrega</p>
          <p>{[sale.entrega.direccion, sale.entrega.barrio, sale.entrega.ciudad].filter(Boolean).join(', ')}</p>
          {sale.entrega.fechaEntrega && <p>Fecha: {fmtDate(sale.entrega.fechaEntrega)}</p>}
          {sale.entrega.notas && <p>{sale.entrega.notas}</p>}
        </>
      )}
      <Rule />
      {business.mensajeRecibo && <p className="text-center">{business.mensajeRecibo}</p>}
    </div>
  );
}
