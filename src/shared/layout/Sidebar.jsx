import {
  ChartColumn,
  Boxes,
  LayoutDashboard,
  LogOut,
  Shirt,
  ShoppingCart,
  Tags,
  Truck,
  UserCog,
  Users,
} from 'lucide-react';
import Logo from '@/shared/components/Logo';

const nav = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'Principal' },
  { id: 'pos', label: 'Punto de Venta', icon: ShoppingCart, group: 'Operaciones' },
  { id: 'products', label: 'Productos', icon: Shirt, group: 'Operaciones' },
  { id: 'inventory', label: 'Inventario', icon: Boxes, group: 'Operaciones' },
  { id: 'categories', label: 'Categorías', icon: Tags, group: 'Operaciones' },
  { id: 'customers', label: 'Clientes', icon: Users, group: 'Relaciones' },
  { id: 'suppliers', label: 'Proveedores', icon: Truck, group: 'Relaciones' },
  { id: 'users', label: 'Usuarios', icon: UserCog, group: 'Relaciones' },
  { id: 'reports', label: 'Reportes', icon: ChartColumn, group: 'Análisis' },
];

export default function Sidebar({ current, onChange, onLogout }) {
  const groups = [...new Set(nav.map((n) => n.group))];

  return (
    <aside className="flex flex-col w-60 shrink-0 h-screen sticky top-0 bg-brand-800">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/10">
        <Logo variant="light" size="md" />
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {groups.map((group) => (
          <div key={group} className="mb-5">
            <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-brand-200/55">{group}</p>
            {nav
              .filter((n) => n.group === group)
              .map((item) => {
                const active = current === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onChange(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm font-medium transition-all duration-150 text-left border-l-2 ${
                      active
                        ? 'bg-white/12 text-white border-brand-400'
                        : 'bg-transparent text-brand-200/75 border-transparent hover:bg-white/7 hover:text-brand-200'
                    }`}
                  >
                    <Icon size={18} strokeWidth={1.75} className={active ? 'opacity-100' : 'opacity-70'} />
                    {item.label}
                  </button>
                );
              })}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-brand-600 text-white">
            AM
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate text-white">Ana Martínez</p>
            <p className="text-[10px] truncate text-brand-200/55">Admin · Maho Boutique</p>
          </div>
          <button
            onClick={onLogout}
            className="p-1 rounded transition-colors text-brand-200/55 hover:text-white"
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
