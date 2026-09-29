import { Menu } from 'lucide-react';

const titles = {
  dashboard: 'Inicio',
  products: 'Productos',
  'product-detail': 'Detalle de producto',
  purchases: 'Compras',
  pos: 'Punto de venta',
  'sales-history': 'Historial de ventas',
  suppliers: 'Proveedores',
  reports: 'Reportes',
  categories: 'Categorías',
  settings: 'Configuración',
  profile: 'Mi perfil',
};

/** Page title and date; below 1024 px it also has the button that opens the menu */
export default function Header({ current, onMenu }) {
  const date = new Date().toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  // Capitalize only the weekday; the rest of the Spanish date stays lowercase
  const today = date.charAt(0).toUpperCase() + date.slice(1);

  return (
    <header className="flex items-center gap-3 px-4 sm:px-6 py-3 border-b border-brand-150 bg-white sticky top-0 z-10">
      <button
        onClick={onMenu}
        className="-ml-1 p-2 rounded-lg text-brand-800 hover:bg-brand-50 lg:hidden"
        aria-label="Abrir menú"
      >
        <Menu size={20} />
      </button>
      <div className="min-w-0">
        <h1 className="text-lg font-semibold truncate text-brand-800 font-display">{titles[current]}</h1>
        <p className="text-xs mt-0.5 truncate text-brand-600">{today}</p>
      </div>
    </header>
  );
}
