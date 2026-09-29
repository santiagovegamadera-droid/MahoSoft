// Which permission opens each screen. The system has a single user, the administrator, who has them all;
// the checks stay so a screen never opens for a session without the permission.
const VIEW_PERMISSION = {
  dashboard: 'Dashboard',
  pos: 'POS',
  'sales-history': 'POS',
  purchases: 'Compras',
  products: 'Compras',
  'product-detail': 'Compras',
  categories: 'Compras',
  suppliers: 'Proveedores',
  reports: 'Reportes',
};

/** Whether the user can open a screen. Configuración is for the administrator only. */
export function canView(user, view) {
  if (!user) return false;
  if (view === 'settings') return user.rol === 'Administradora';
  const permiso = VIEW_PERMISSION[view];
  return !permiso || user.permisos.includes(permiso);
}

/** Screen to land on after signing in: the first one the user may open */
export const homeView = (user) =>
  ['dashboard', 'pos', 'purchases', 'products', 'suppliers', 'reports'].find((v) => canView(user, v)) ?? 'profile';
