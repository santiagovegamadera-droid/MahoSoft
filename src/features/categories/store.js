import createCollection from '@/shared/lib/createCollection';

// Categories saved before estado existed count as Activo
export const isActiveCategory = (c) => (c?.estado ?? 'Activo') === 'Activo';

const useCategories = createCollection('categories', [
  {
    id: 1,
    name: 'Vestidos',
    descripcion: 'Vestidos de día, noche y ocasión especial',
    estado: 'Activo',
  },
  {
    id: 2,
    name: 'Blusas',
    descripcion: 'Tops, blusas y camisetas',
    estado: 'Activo',
  },
  {
    id: 3,
    name: 'Pantalones',
    descripcion: 'Jeans, pantalones formales y casuales',
    estado: 'Activo',
  },
  {
    id: 4,
    name: 'Faldas',
    descripcion: 'Faldas mini, midi y maxi',
    estado: 'Activo',
  },
  {
    id: 5,
    name: 'Conjuntos',
    descripcion: 'Sets de dos y tres piezas',
    estado: 'Activo',
  },
  {
    id: 6,
    name: 'Abrigos',
    descripcion: 'Cardigans, blazers y abrigos',
    estado: 'Activo',
  },
  {
    id: 7,
    name: 'Tops',
    descripcion: 'Tops de fiesta y crop tops',
    estado: 'Activo',
  },
]);

export default useCategories;
