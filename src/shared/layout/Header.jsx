const titles = {
  dashboard: 'Dashboard',
  products: 'Productos',
  'product-detail': 'Detalle de Producto',
  purchases: 'Compras',
  pos: 'Punto de Venta',
  'sales-history': 'Historial de ventas',
  suppliers: 'Proveedores',
  users: 'Usuarios',
  reports: 'Reportes',
  categories: 'Categorías',
};

export default function Header({ current }) {
  const today = new Date().toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="px-8 py-4 border-b border-brand-150 bg-white sticky top-0 z-10">
      <h1 className="text-xl font-semibold text-brand-800 font-display">{titles[current]}</h1>
      <p className="text-xs mt-0.5 capitalize text-brand-600">{today}</p>
    </header>
  );
}
