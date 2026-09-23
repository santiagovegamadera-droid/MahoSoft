import createCollection from '@/shared/lib/createCollection';

export const ROLES = ['Administradora', 'Vendedora', 'Bodega'];
export const PERMISSIONS = ['Dashboard', 'POS', 'Compras', 'Clientes', 'Proveedores', 'Usuarios', 'Reportes'];

const useUsers = createCollection('users', [
  {
    id: 1,
    name: 'Ana Martínez',
    email: 'ana@ellaboutique.co',
    rol: 'Administradora',
    permisos: PERMISSIONS,
    estado: 'Activo',
    ultimo: '2026-09-23 08:15',
  },
  {
    id: 2,
    name: 'Carla Rodríguez',
    email: 'carla@ellaboutique.co',
    rol: 'Vendedora',
    permisos: ['POS', 'Clientes'],
    estado: 'Activo',
    ultimo: '2026-09-23 09:02',
  },
  {
    id: 3,
    name: 'Sofía Parra',
    email: 'sofia@ellaboutique.co',
    rol: 'Vendedora',
    permisos: ['POS', 'Clientes'],
    estado: 'Activo',
    ultimo: '2026-09-22 18:45',
  },
  {
    id: 4,
    name: 'Valentina Ruiz',
    email: 'vale@ellaboutique.co',
    rol: 'Vendedora',
    permisos: ['POS', 'Clientes'],
    estado: 'Inactivo',
    ultimo: '2026-09-10 12:30',
  },
  {
    id: 5,
    name: 'Jorge Mejía',
    email: 'jorge@ellaboutique.co',
    rol: 'Bodega',
    permisos: ['Compras'],
    estado: 'Activo',
    ultimo: '2026-09-23 07:58',
  },
]);

export default useUsers;
