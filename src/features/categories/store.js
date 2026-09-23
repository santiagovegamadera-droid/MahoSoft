import createCollection from '@/shared/lib/createCollection';

// Categories saved before estado existed count as Activo
export const isActiveCategory = (c) => (c?.estado ?? 'Activo') === 'Activo';

const useCategories = createCollection('categories', [
  {
    id: 1,
    name: 'Vestidos',
    descripcion: 'Vestidos de día, noche y ocasión especial',
    img: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=200&fit=crop&auto=format',
    estado: 'Activo',
  },
  {
    id: 2,
    name: 'Blusas',
    descripcion: 'Tops, blusas y camisetas',
    img: 'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=400&h=200&fit=crop&auto=format',
    estado: 'Activo',
  },
  {
    id: 3,
    name: 'Pantalones',
    descripcion: 'Jeans, pantalones formales y casuales',
    img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=200&fit=crop&auto=format',
    estado: 'Activo',
  },
  {
    id: 4,
    name: 'Faldas',
    descripcion: 'Faldas mini, midi y maxi',
    img: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&h=200&fit=crop&auto=format',
    estado: 'Activo',
  },
  {
    id: 5,
    name: 'Conjuntos',
    descripcion: 'Sets de dos y tres piezas',
    img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=200&fit=crop&auto=format',
    estado: 'Activo',
  },
  {
    id: 6,
    name: 'Abrigos',
    descripcion: 'Cardigans, blazers y abrigos',
    img: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=200&fit=crop&auto=format',
    estado: 'Activo',
  },
  {
    id: 7,
    name: 'Tops',
    descripcion: 'Tops de fiesta y crop tops',
    img: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4017?w=400&h=200&fit=crop&auto=format',
    estado: 'Activo',
  },
]);

export default useCategories;
