const titles = {
  dashboard: 'Inicio',
  products: 'Productos',
  'product-detail': 'Detalle de producto',
  purchases: 'Compras',
  pos: 'Punto de venta',
  'sales-history': 'Historial de ventas',
  suppliers: 'Proveedores',
  users: 'Usuarios',
  reports: 'Reportes',
  categories: 'Categorías',
  settings: 'Configuración',
  profile: 'Mi perfil',
};

export default function Header({ current }) {
  const date = new Date().toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  // Capitalize only the weekday; the rest of the Spanish date stays lowercase
  const today = date.charAt(0).toUpperCase() + date.slice(1);

  return (
    <header className="px-6 py-3 border-b border-brand-150 bg-white sticky top-0 z-10">
      <h1 className="text-lg font-semibold text-brand-800 font-display">{titles[current]}</h1>
      <p className="text-xs mt-0.5 text-brand-600">{today}</p>
    </header>
  );
}
