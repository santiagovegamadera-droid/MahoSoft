import createApiStore from '@/shared/lib/createApiStore';
import { api } from '@/shared/lib/api';
import useProducts from '@/features/products/store';

/**
 * Sales from the API, newest first, voided ones included: { id, numeroFactura, fecha, tipo, cliente: { id, nombre,
 * tipoDocumento, documento, telefono, correo }, vendedorId, vendedor, metodoPago, descuentoPorcentaje, subtotal,
 * descuento, envio, total, estado, anuladaEn, anuladaPor, motivoAnulacion, entrega: { direccion, barrio, ciudad,
 * fechaEntrega, notas }, comprobante: { banco, referencia, archivo }, unidades, items: [{ productoId, producto, talla,
 * cantidad, precioUnitario }] }. Prices, totals and stock are set by the server.
 */
const useSales = createApiStore('/api/ventas', {
  sort: (a, b) => new Date(b.fecha) - new Date(a.fecha) || b.id - a.id,
});

export const PAYMENT_LABELS = { Efectivo: 'Efectivo', Tarjeta: 'Tarjeta', Transferencia: 'Transferencia' };
export const isVoided = (s) => s.estado === 'Anulada';

/**
 * Registers a POS sale: the server numbers it, takes its units out of stock and keeps prices and costs.
 * `file` is the transfer receipt, saved together with it. Throws ApiError (e.g. when a size ran out).
 */
export async function registerSale(data, file) {
  const body = new FormData();
  body.append('datos', JSON.stringify(data));
  if (file) body.append('comprobante', file);
  const sale = useSales.put(await api('/api/ventas', { method: 'POST', body }));
  useProducts.reload(); // stock changed
  return sale;
}

/** Voids a sale: it stays in the history as Anulada, and its units go back to stock */
export async function voidSale(id, motivo) {
  const sale = useSales.put(await api(`/api/ventas/${id}/anular`, { method: 'POST', body: { motivo } }));
  useProducts.reload();
  return sale;
}

export default useSales;
