import createCollection from '@/shared/lib/createCollection';

export const SIZE_GROUPS = [
  ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  ['25', '26', '27', '28', '29', '30', '32'],
];

const img = (id) => `https://images.unsplash.com/photo-${id}?w=300&h=300&fit=crop&auto=format`;

// catId / proveedorId / coleccionId reference the other stores; stock maps each size to units
const useProducts = createCollection('products', [
  {
    id: 1,
    name: 'Vestido Floral Verano',
    catId: 1,
    proveedorId: 1,
    coleccionId: 1,
    precio: 89900,
    costo: 45000,
    descripcion: 'Vestido floral de verano en tela fresca y liviana.',
    colores: ['Rosa', 'Azul'],
    stock: { XS: 4, S: 8, M: 10, L: 6 },
    estado: 'Activo',
    img: img('1572804013309-59a88b7e92f1'),
  },
  {
    id: 2,
    name: 'Blusa Seda Negra',
    catId: 2,
    proveedorId: 2,
    coleccionId: 2,
    precio: 65000,
    costo: 30000,
    descripcion: 'Blusa de seda con caída suave.',
    colores: ['Negro', 'Blanco'],
    stock: { XS: 2, S: 5, M: 5, L: 3, XL: 0 },
    estado: 'Activo',
    img: img('1485462537746-965f33f7f6a7'),
  },
  {
    id: 3,
    name: 'Jean Skinny Azul',
    catId: 3,
    proveedorId: 3,
    coleccionId: 2,
    precio: 119000,
    costo: 60000,
    descripcion: 'Jean tiro alto con elasticidad.',
    colores: ['Azul oscuro'],
    stock: { 25: 1, 26: 0, 28: 2, 30: 0 },
    estado: 'Activo',
    img: img('1541099649105-f69ad21f3246'),
  },
  {
    id: 4,
    name: 'Falda Plisada Beige',
    catId: 4,
    proveedorId: 1,
    coleccionId: 3,
    precio: 75000,
    costo: 35000,
    descripcion: 'Falda midi plisada.',
    colores: ['Beige', 'Negro'],
    stock: { XS: 3, S: 6, M: 8, L: 5 },
    estado: 'Activo',
    img: img('1583496661160-fb5886a0aaaa'),
  },
  {
    id: 5,
    name: 'Conjunto Lino Blanco',
    catId: 5,
    proveedorId: 4,
    coleccionId: 1,
    precio: 185000,
    costo: 90000,
    descripcion: 'Conjunto de dos piezas en lino.',
    colores: ['Blanco'],
    stock: { S: 0, M: 0, L: 0 },
    estado: 'Activo',
    img: img('1515886657613-9f3515b0c78f'),
  },
  {
    id: 6,
    name: 'Cardigan Tejido Crema',
    catId: 6,
    proveedorId: 5,
    coleccionId: null,
    precio: 145000,
    costo: 70000,
    descripcion: 'Cardigan tejido de punto grueso.',
    colores: ['Crema', 'Gris'],
    stock: { S: 3, M: 5, L: 4, XL: 6 },
    estado: 'Activo',
    img: img('1434389677669-e08b4cac3105'),
  },
  {
    id: 7,
    name: 'Top Crop Lentejuelas',
    catId: 7,
    proveedorId: 6,
    coleccionId: 4,
    precio: 98000,
    costo: 45000,
    descripcion: 'Top corto con lentejuelas para la noche.',
    colores: ['Dorado', 'Plateado'],
    stock: { XS: 3, S: 4, M: 2 },
    estado: 'Activo',
    img: img('1594938298603-c8148c4b4017'),
  },
  {
    id: 8,
    name: 'Pantalón Palazzo Rojo',
    catId: 3,
    proveedorId: 2,
    coleccionId: null,
    precio: 109000,
    costo: 52000,
    descripcion: 'Pantalón palazzo de pierna ancha.',
    colores: ['Rojo'],
    stock: { XS: 2, S: 4, M: 3, L: 2 },
    estado: 'Inactivo',
    img: img('1506629082955-511b1aa562c8'),
  },
]);

export const totalStock = (p) => Object.values(p.stock).reduce((a, b) => a + b, 0);

/** Adds delta units to one size of a product (negative to subtract), never below 0 */
export function adjustStock(productId, talla, delta) {
  const p = useProducts.api.getById(productId);
  if (!p) return;
  useProducts.api.update(productId, { stock: { ...p.stock, [talla]: Math.max(0, (p.stock[talla] ?? 0) + delta) } });
}

export default useProducts;
