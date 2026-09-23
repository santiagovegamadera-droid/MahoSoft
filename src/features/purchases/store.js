import createCollection from '@/shared/lib/createCollection';
import { adjustStock } from '@/features/products/store';

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

export default useMovements;
