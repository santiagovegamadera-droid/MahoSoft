import { Plus } from 'lucide-react';

const titles = {
  dashboard: 'Dashboard',
  products: 'Productos',
  'product-detail': 'Detalle de Producto',
  purchases: 'Compras',
  pos: 'Punto de Venta',
  customers: 'Clientes',
  suppliers: 'Proveedores',
  users: 'Usuarios',
  reports: 'Reportes',
  categories: 'Categorías & Colecciones',
};

export default function Header({ current, onNewProduct }) {
  const today = new Date().toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="flex items-center justify-between px-8 py-4 border-b border-brand-150 bg-white sticky top-0 z-10">
      <div>
        <h1 className="text-xl font-semibold text-brand-800 font-display">{titles[current]}</h1>
        <p className="text-xs mt-0.5 capitalize text-brand-600">{today}</p>
      </div>
      <div className="flex items-center gap-3">
        {/* Action */}
        {current === 'products' && (
          <button
            onClick={onNewProduct}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all bg-brand-600 hover:bg-brand-800"
          >
            <Plus size={16} /> Nuevo Producto
          </button>
        )}
      </div>
    </header>
  );
}
