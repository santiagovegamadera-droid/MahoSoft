import { useSession } from '@/features/auth/session';

export const PASSWORD_MIN = 8;

/**
 * The signed-in user as the session has it: { id, name, email, rol, permisos }. The system has a single user, the
 * administrator; phone and document are in Mi perfil (GET /api/perfil).
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
