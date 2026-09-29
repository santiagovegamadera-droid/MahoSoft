import createApiStore from '@/shared/lib/createApiStore';
import { api } from '@/shared/lib/api';
import { useSession } from '@/features/auth/session';

export const ROLES = ['Administradora', 'Vendedora', 'Bodega'];
export const PERMISSIONS = ['Dashboard', 'POS', 'Compras', 'Proveedores', 'Usuarios', 'Reportes'];
export const PASSWORD_MIN = 8;

/**
 * Users from the API (Usuarios permission only): { id, nombre, email, rol, telefono, tipoDocumento, documento,
 * activo, ultimoAcceso, creadoEn, permisos }. Users are deactivated, never deleted.
 */
const useUsers = createApiStore('/api/usuarios', {
  sort: (a, b) => a.nombre.localeCompare(b.nombre, 'es'),
});

/** Sets a new password for a user (e.g. one who forgot it) */
export const resetPassword = (id, nueva) => api(`/api/usuarios/${id}/password`, { method: 'POST', body: { nueva } });

/**
 * The signed-in user as the session has it: { id, name, email, rol, permisos }. Phone and document are in
 * Mi perfil (GET /api/perfil); reading the user list here would need the Usuarios permission.
 */
export function useCurrentUser() {
  const session = useSession();
  if (!session) return null;
  const { id, nombre, email, rol, permisos } = session.usuario;
  return { id, name: nombre, email, rol, permisos };
}

export const initials = (name) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

export default useUsers;
