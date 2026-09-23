import createCollection from '@/shared/lib/createCollection';
import { adjustStock } from '@/features/products/store';

export const PAYMENT_METHODS = ['efectivo', 'tarjeta', 'transferencia'];

// Sample sales have no productId, so they never touch stock
const useSales = createCollection('sales', [
  {
    id: 1,
    factura: 'VTA-2026-0842',
    fecha: '2026-09-21T10:24:00',
    cliente: 'Laura Gómez',
    vendedor: 'Carla Rodríguez',
    pago: 'tarjeta',
    descuento: 0,
    items: [
      { name: 'Vestido Floral Verano', talla: 'M', qty: 1, price: 89900 },
      { name: 'Blusa Seda Negra', talla: 'S', qty: 1, price: 65000 },
    ],
  },
  {
    id: 2,
    factura: 'VTA-2026-0843',
    fecha: '2026-09-21T16:05:00',
    cliente: 'Cliente general',
    vendedor: 'Sofía Parra',
    pago: 'efectivo',
    descuento: 10,
    items: [{ name: 'Falda Plisada Beige', talla: 'M', qty: 2, price: 75000 }],
  },
  {
    id: 3,
    factura: 'VTA-2026-0844',
    fecha: '2026-09-22T11:40:00',
    cliente: 'Daniela Torres',
    vendedor: 'Carla Rodríguez',
    pago: 'transferencia',
    descuento: 5,
    items: [
      { name: 'Conjunto Lino Blanco', talla: 'L', qty: 1, price: 185000 },
      { name: 'Top Crop Lentejuelas', talla: 'M', qty: 1, price: 98000 },
    ],
  },
  {
    id: 4,
    factura: 'VTA-2026-0845',
    fecha: '2026-09-23T09:15:00',
    cliente: 'Marcela Ríos',
    vendedor: 'Ana Martínez',
    pago: 'tarjeta',
    descuento: 0,
    items: [{ name: 'Cardigan Tejido Crema', talla: 'S', qty: 1, price: 145000 }],
  },
  {
    id: 5,
    factura: 'VTA-2026-0846',
    fecha: '2026-09-23T10:02:00',
    cliente: 'Cliente general',
    vendedor: 'Sofía Parra',
    pago: 'efectivo',
    descuento: 0,
    items: [
      { name: 'Jean Skinny Azul', talla: '28', qty: 1, price: 119000 },
      { name: 'Blusa Seda Negra', talla: 'M', qty: 1, price: 65000 },
    ],
  },
]);

/** Saves a POS sale with the next invoice number and takes its units out of stock */
export function registerSale(data) {
  const sales = useSales.api.getAll();
  const lastNumber = Math.max(0, ...sales.map((s) => Number(s.factura.split('-').pop())));
  const sale = useSales.api.create({
    ...data,
    factura: `VTA-${new Date().getFullYear()}-${String(lastNumber + 1).padStart(4, '0')}`,
    fecha: new Date().toISOString(),
  });
  sale.items.forEach((i) => i.productId && adjustStock(i.productId, i.talla, -i.qty));
  return sale;
}

/** Deletes (voids) a sale and returns its units to stock */
export function voidSale(id) {
  const sale = useSales.api.getById(id);
  sale.items.forEach((i) => i.productId && adjustStock(i.productId, i.talla, i.qty));
  useSales.api.remove(id);
}

export default useSales;
