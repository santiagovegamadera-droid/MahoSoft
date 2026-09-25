import createCollection from '@/shared/lib/createCollection';
import { adjustStock, setPurchaseCost } from '@/features/products/store';
import { fileInfo, saveFile } from '@/shared/lib/fileStore';

export const MOVEMENT_TYPES = ['entrada', 'salida', 'ajuste'];

// Sample movements are already reflected in the product stock
const useMovements = createCollection('movements', [
  {
    id: 1,
    fecha: '2026-09-23',
    tipo: 'entrada',
    productId: 1,
    talla: 'M',
    cant: 20,
    ref: 'OC-2026-045',
    usuario: 'Ana Martínez',
  },
  {
    id: 2,
    fecha: '2026-09-22',
    tipo: 'salida',
    productId: 2,
    talla: 'S',
    cant: 2,
    ref: 'Devolución proveedor',
    usuario: 'Jorge Mejía',
  },
  {
    id: 3,
    fecha: '2026-09-22',
    tipo: 'ajuste',
    productId: 4,
    talla: 'L',
    cant: -1,
    ref: 'AJ-0091',
    usuario: 'Ana Martínez',
  },
  {
    id: 4,
    fecha: '2026-09-21',
    tipo: 'entrada',
    productId: 6,
    talla: 'XL',
    cant: 12,
    ref: 'OC-2026-044',
    usuario: 'Jorge Mejía',
  },
]);

// Entradas add units, salidas remove them, ajustes carry their own sign
export const movementDelta = (m) => (m.tipo === 'entrada' ? m.cant : m.tipo === 'salida' ? -m.cant : m.cant);

export function createMovement(data) {
  const m = useMovements.api.create(data);
  adjustStock(m.productId, m.talla, movementDelta(m));
}

export function updateMovement(id, data) {
  const old = useMovements.api.getById(id);
  adjustStock(old.productId, old.talla, -movementDelta(old));
  useMovements.api.update(id, data);
  const next = useMovements.api.getById(id);
  adjustStock(next.productId, next.talla, movementDelta(next));
}

export function removeMovement(id) {
  const old = useMovements.api.getById(id);
  adjustStock(old.productId, old.talla, -movementDelta(old));
  useMovements.api.remove(id);
}

// Supplier purchases; each item became an 'entrada' movement referencing the purchase number.
// Sample purchases match the sample movements, so they are already in the stock.
export const usePurchases = createCollection('purchases', [
  {
    id: 1,
    numero: 'OC-2026-044',
    fecha: '2026-09-21',
    proveedorId: 4,
    facturaProveedor: 'LF-10233',
    notas: '',
    usuario: 'Jorge Mejía',
    items: [{ productId: 6, talla: 'XL', cant: 12, costo: 72000 }],
  },
  {
    id: 2,
    numero: 'OC-2026-045',
    fecha: '2026-09-23',
    proveedorId: 1,
    facturaProveedor: 'TB-8841',
    notas: 'Llegó completo',
    usuario: 'Ana Martínez',
    items: [{ productId: 1, talla: 'M', cant: 20, costo: 45000 }],
  },
]);

export const IVA_RATES = [0, 5, 19];
export const ivaLabel = (rate) => (rate ? `${rate}%` : 'Sin IVA');
export const PAYMENT_TERMS = { contado: 'Contado', credito: 'Crédito' };
// "Tipo de comprobante" as suppliers' e-invoicing systems name it
export const DOCUMENT_TYPES = [
  'Factura electrónica de venta',
  'Documento de venta',
  'Documento equivalente POS',
  'Remisión',
  'Cuenta de cobro',
];

/** Whether the typed invoice amount matches the computed total (±$1 for rounding) */
export const matchesInvoice = (p) => !p.valorComprobante || Math.abs(p.valorComprobante - purchaseTotals(p).total) <= 1;

/**
 * Invoice totals, same layout as a supplier invoice. Item `costo` is the unit price as typed:
 * without IVA, or with IVA when `ivaIncluido`. `descuento` is an amount off the subtotal (before IVA).
 * Purchases saved before these fields existed have no IVA, so their total is the plain sum.
 */
export function purchaseTotals(p) {
  const rate = (p.iva ?? 0) / 100;
  const bruto = p.items.reduce((s, i) => s + i.cant * i.costo, 0);
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

export const purchaseTotal = (p) => purchaseTotals(p).total;
export const purchaseUnits = (p) => p.items.reduce((s, i) => s + i.cant, 0);

/** Product cost of one unit: price without IVA (the business doesn't count IVA as cost), less its share of the discount */
export function unitCost(p, item) {
  const rate = (p.iva ?? 0) / 100;
  const base = p.ivaIncluido ? item.costo / (1 + rate) : item.costo;
  const { subtotal, descuento } = purchaseTotals(p);
  const share = subtotal > 0 ? 1 - descuento / subtotal : 1;
  return Math.round(base * share);
}

export const isPending = (p) => p.estadoPago === 'pendiente';

// A product's suppliers come from its purchases, not from the product itself
const newestFirst = (purchases) => [...purchases].sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id - a.id);
const buys = (p, productId) => p.items.some((i) => i.productId === productId);

/** Latest purchase that included the product, or undefined if it was never bought */
export const lastPurchaseOf = (purchases, productId) => newestFirst(purchases).find((p) => buys(p, productId));

/** Ids of every supplier the product was bought from, most recent first */
export const suppliersOfProduct = (purchases, productId) => [
  ...new Set(
    newestFirst(purchases)
      .filter((p) => buys(p, productId))
      .map((p) => p.proveedorId),
  ),
];

/** Ids of the distinct products bought from a supplier */
export const productsOfSupplier = (purchases, supplierId) => [
  ...new Set(purchases.filter((p) => p.proveedorId === supplierId).flatMap((p) => p.items.map((i) => i.productId))),
];

// Key of a purchase's attached invoice file in the browser file store
export const purchaseFileKey = (p) => `purchase-${p.id}`;

/**
 * Saves a purchase with the next OC number and adds its units to stock through entrada movements.
 * `file` is the supplier's invoice (PDF or photo); the record keeps only its name, type and size.
 */
export function registerPurchase(data, file) {
  const last = Math.max(0, ...usePurchases.api.getAll().map((p) => Number(p.numero.split('-').pop())));
  const purchase = usePurchases.api.create({
    ...data,
    adjunto: file ? fileInfo(file) : null,
    numero: `OC-${new Date().getFullYear()}-${String(last + 1).padStart(3, '0')}`,
  });
  // If the browser can't store the file, don't leave a link to it
  if (file)
    saveFile(purchaseFileKey(purchase), file).catch(() => usePurchases.api.update(purchase.id, { adjunto: null }));
  purchase.items.forEach((i) =>
    createMovement({
      fecha: purchase.fecha,
      tipo: 'entrada',
      productId: i.productId,
      talla: i.talla,
      cant: i.cant,
      ref: purchase.numero,
      usuario: purchase.usuario,
    }),
  );
  // Update each product's cost unless a later-dated purchase already set it
  const others = usePurchases.api.getAll().filter((p) => p.id !== purchase.id);
  purchase.items.forEach((i) => {
    const newer = others.some((p) => p.fecha > purchase.fecha && p.items.some((x) => x.productId === i.productId));
    if (!newer) setPurchaseCost(i.productId, unitCost(purchase, i));
  });
  return purchase;
}

export default useMovements;
