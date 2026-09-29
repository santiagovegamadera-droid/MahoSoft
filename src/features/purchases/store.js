import createApiStore from '@/shared/lib/createApiStore';
import { api } from '@/shared/lib/api';

/**
 * Supplier purchases from the API, newest invoice first: { id, numero, proveedorId, proveedor, tipoComprobante,
 * numeroComprobante, fecha, hora, vendedorProveedor, cufe, condicionPago, fechaVencimiento, estadoPago,
 * ivaPorcentaje, preciosIncluyenIva, subtotal, descuento, iva, total, valorComprobante, notas, usuario,
 * documento: { nombre, tipoMime, tamano }, unidades, items: [{ productoId, producto, talla, referenciaProveedor,
 * cantidad, precioUnitario, costoUnitario }] }. Totals, stock and product costs are computed by the server.
 */
export const usePurchases = createApiStore('/api/compras', {
  sort: (a, b) => b.fecha.localeCompare(a.fecha) || (b.hora ?? '').localeCompare(a.hora ?? '') || b.id - a.id,
});

export const IVA_RATES = [0, 5, 19];
export const ivaLabel = (rate) => (rate ? `${rate}%` : 'Sin IVA');
export const PAYMENT_TERMS = { Contado: 'Contado', Credito: 'Crédito' };
// "Tipo de comprobante" as suppliers' e-invoicing systems name it
export const DOCUMENT_TYPES = [
  'Factura electrónica de venta',
  'Documento de venta',
  'Documento equivalente POS',
  'Remisión',
  'Cuenta de cobro',
];

/** Whether the typed invoice amount matches the computed total (±$1 for rounding) */
export const matchesInvoice = (p) => !p.valorComprobante || Math.abs(p.valorComprobante - p.total) <= 1;

/**
 * Preview of the invoice totals while typing, same math as the server. Item `precio` is the unit price as typed:
 * without IVA, or with IVA when `ivaIncluido`. `descuento` is an amount off the subtotal (before IVA).
 */
export function purchaseTotals(p) {
  const rate = (p.iva ?? 0) / 100;
  const bruto = p.items.reduce((s, i) => s + i.cant * i.precio, 0);
  const subtotal = p.ivaIncluido ? bruto / (1 + rate) : bruto;
  const descuento = Math.min(p.descuento ?? 0, subtotal);
  const base = subtotal - descuento;
  const iva = base * rate;
  return {
    articulos: p.items.length,
    unidades: p.items.reduce((s, i) => s + i.cant, 0),
    subtotal: Math.round(subtotal),
    descuento: Math.round(descuento),
    iva: Math.round(iva),
    total: Math.round(base + iva),
  };
}

export const isPending = (p) => p.estadoPago === 'Pendiente';

/**
 * Registers a purchase: the server numbers it, adds its units to stock and updates product costs.
 * `file` is the supplier's invoice (PDF or photo), saved together with it. Throws ApiError.
 */
export async function registerPurchase(data, file) {
  const body = new FormData();
  body.append('datos', JSON.stringify(data));
  if (file) body.append('documento', file);
  return usePurchases.put(await api('/api/compras', { method: 'POST', body }));
}

export async function markPurchasePaid(id) {
  return usePurchases.put(await api(`/api/compras/${id}/pagada`, { method: 'POST' }));
}
