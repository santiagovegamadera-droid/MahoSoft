// Sample sales shown in the history until the backend exists
const initialSales = [
  {
    id: 1,
    factura: 'VTA-2026-0842',
    fecha: '2026-09-21T10:24:00',
    cliente: 'Laura Gómez',
    vendedor: 'Carla Rodríguez',
    pago: 'tarjeta',
    items: [
      { name: 'Vestido Floral', talla: 'M', qty: 1, price: 89900 },
      { name: 'Blusa Seda Negra', talla: 'S', qty: 1, price: 65000 },
    ],
    descuento: 0,
  },
  {
    id: 2,
    factura: 'VTA-2026-0843',
    fecha: '2026-09-21T16:05:00',
    cliente: 'Cliente general',
    vendedor: 'Sofía Parra',
    pago: 'efectivo',
    items: [{ name: 'Falda Plisada', talla: 'M', qty: 2, price: 75000 }],
    descuento: 10,
  },
  {
    id: 3,
    factura: 'VTA-2026-0844',
    fecha: '2026-09-22T11:40:00',
    cliente: 'Daniela Torres',
    vendedor: 'Carla Rodríguez',
    pago: 'transferencia',
    items: [
      { name: 'Conjunto Lino', talla: 'L', qty: 1, price: 185000 },
      { name: 'Top Lentejuelas', talla: 'M', qty: 1, price: 98000 },
    ],
    descuento: 5,
  },
  {
    id: 4,
    factura: 'VTA-2026-0845',
    fecha: '2026-09-23T09:15:00',
    cliente: 'Marcela Ríos',
    vendedor: 'Ana Martínez',
    pago: 'tarjeta',
    items: [{ name: 'Cardigan Crema', talla: 'S', qty: 1, price: 145000 }],
    descuento: 0,
  },
  {
    id: 5,
    factura: 'VTA-2026-0846',
    fecha: '2026-09-23T10:02:00',
    cliente: 'Cliente general',
    vendedor: 'Sofía Parra',
    pago: 'efectivo',
    items: [
      { name: 'Jean Skinny', talla: 'M', qty: 1, price: 119000 },
      { name: 'Blusa Seda Negra', talla: 'M', qty: 1, price: 65000 },
    ],
    descuento: 0,
  },
];

export default initialSales;
