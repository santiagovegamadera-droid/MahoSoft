import createCollection from '@/shared/lib/createCollection';
import { adjustStock, setPurchaseCost } from '@/features/products/store';

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

export const purchaseTotal = (p) => p.items.reduce((s, i) => s + i.cant * i.costo, 0);
export const purchaseUnits = (p) => p.items.reduce((s, i) => s + i.cant, 0);

/** Saves a purchase with the next OC number and adds its units to stock through entrada movements */
export function registerPurchase(data) {
  const last = Math.max(0, ...usePurchases.api.getAll().map((p) => Number(p.numero.split('-').pop())));
  const purchase = usePurchases.api.create({
    ...data,
    numero: `OC-${new Date().getFullYear()}-${String(last + 1).padStart(3, '0')}`,
  });
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
    if (!newer) setPurchaseCost(i.productId, i.costo);
  });
  return purchase;
}

export default useMovements;
