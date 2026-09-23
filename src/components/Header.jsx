const titles = {
  dashboard: 'Dashboard',
  products: 'Productos',
  'product-detail': 'Detalle de Producto',
  inventory: 'Inventario',
  pos: 'Punto de Venta',
  customers: 'Clientes',
  suppliers: 'Proveedores',
  employees: 'Empleados & Usuarios',
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
    <header
      className="flex items-center justify-between px-8 py-4 border-b bg-white sticky top-0 z-10"
      style={{ borderColor: '#e8dff0' }}
    >
      <div>
        <h1 className="text-xl font-semibold" style={{ color: '#503459', fontFamily: 'DM Serif Display, serif' }}>
          {titles[current]}
        </h1>
        <p className="text-xs mt-0.5 capitalize" style={{ color: '#81638b' }}>
          {today}
        </p>
      </div>
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <input
            placeholder="Buscar..."
            className="pl-8 pr-4 py-2 text-sm rounded-lg border outline-none transition-all"
            style={{
              borderColor: '#dac9df',
              background: '#f5f0f7',
              color: '#503459',
              width: 200,
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#81638b';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(129,99,139,0.15)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#dac9df';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          <span className="absolute left-2.5 top-2.5 text-xs" style={{ color: '#b695c0' }}>
            ⌕
          </span>
        </div>

        {/* Notifications */}
        <button
          className="relative w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
          style={{ background: '#f5f0f7', color: '#503459' }}
        >
          <span>🔔</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: '#81638b' }} />
        </button>

        {/* Action */}
        {current === 'products' && (
          <button
            onClick={onNewProduct}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all"
            style={{ background: '#81638b' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#503459')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#81638b')}
          >
            <span>+</span> Nuevo Producto
          </button>
        )}
        {current === 'pos' && (
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{ background: '#dac9df', color: '#503459' }}
          >
            POS Activo
          </span>
        )}
      </div>
    </header>
  );
}
