import createCollection from '@/shared/lib/createCollection';
import { useSession } from '@/features/auth/session';

export const ROLES = ['Administradora', 'Vendedora', 'Bodega'];
export const PERMISSIONS = ['Dashboard', 'POS', 'Compras', 'Proveedores', 'Usuarios', 'Reportes'];

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
    permisos: ['POS'],
    estado: 'Activo',
    ultimo: '2026-09-23 09:02',
  },
  {
    id: 3,
    name: 'Sofía Parra',
    email: 'sofia@ellaboutique.co',
    rol: 'Vendedora',
    permisos: ['POS'],
    estado: 'Activo',
    ultimo: '2026-09-22 18:45',
  },
  {
    id: 4,
    name: 'Valentina Ruiz',
    email: 'vale@ellaboutique.co',
    rol: 'Vendedora',
    permisos: ['POS'],
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

/**
 * The signed-in user. Identity, role and permissions come from the API session; the rest (phone,
 * document…) still comes from the local record until the Usuarios module moves to the API.
 */
export function useCurrentUser() {
  const session = useSession();
  const { items } = useUsers();
  if (!session) return null;
  const { id, nombre, email, rol, permisos } = session.usuario;
  const local = items.find((u) => u.id === id);
  return { ...local, id, name: nombre, email, rol, permisos };
}

export const initials = (name) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

export default useUsers;
