import { useState } from 'react';
import {
  ChartColumn,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  ReceiptText,
  Settings,
  Shirt,
  ShoppingBasket,
  ShoppingCart,
  Tags,
  Truck,
  UserCog,
} from 'lucide-react';
import useSettings from '@/features/settings/store';
import { initials, useCurrentUser } from '@/features/users/store';
import Logo from '@/shared/components/Logo';
import { canView } from '@/features/auth/access';

const nav = [
  { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard, group: 'Principal' },
  {
    id: 'purchases',
    label: 'Compras',
    icon: ShoppingBasket,
    group: 'Operaciones',
    children: [
      { id: 'products', label: 'Productos', icon: Shirt, match: ['product-detail'] },
      { id: 'categories', label: 'Categorías', icon: Tags },
      { id: 'suppliers', label: 'Proveedores', icon: Truck },
    ],
  },
  {
    id: 'pos',
    label: 'Punto de venta',
    icon: ShoppingCart,
    group: 'Operaciones',
    children: [{ id: 'sales-history', label: 'Historial de ventas', icon: ReceiptText }],
  },
  { id: 'users', label: 'Usuarios', icon: UserCog, group: 'Relaciones' },
  { id: 'reports', label: 'Reportes', icon: ChartColumn, group: 'Análisis' },
  { id: 'settings', label: 'Configuración', icon: Settings, group: 'Sistema' },
];

// Menu entries the user may open; a parent they can't open still shows when some child is allowed
function visibleNav(user) {
  return nav
    .map((item) => ({ ...item, children: item.children?.filter((c) => canView(user, c.id)) }))
    .filter((item) => canView(user, item.id) || item.children?.length);
}

const isActive = (item, current) => item.id === current || (item.match?.includes(current) ?? false);

function NavButton({ item, active, onClick, nested = false }) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 pl-3 rounded-lg mb-0.5 text-sm font-medium transition-all duration-150 text-left border-l-2 ${
        nested ? 'py-1.5 pr-3' : 'py-2 pr-10'
      } ${
        active
          ? 'bg-white/12 text-white border-brand-400'
          : 'bg-transparent text-brand-200/75 border-transparent hover:bg-white/7 hover:text-brand-200'
      }`}
    >
      <Icon size={nested ? 15 : 17} strokeWidth={1.75} className={active ? 'opacity-100' : 'opacity-70'} />
      {item.label}
    </button>
  );
}

export default function Sidebar({ current, onChange, onLogout }) {
  const { nombre } = useSettings();
  const user = useCurrentUser();
  const items = visibleNav(user);
  const groups = [...new Set(items.map((n) => n.group))];
  // Explicit open/closed per dropdown; when unset, a dropdown is open while one of its children is active
  const [openMenus, setOpenMenus] = useState({});

  return (
    <aside className="flex flex-col w-60 shrink-0 h-screen sticky top-0 bg-brand-800">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-white/10">
        <Logo variant="light" size="md" />
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-3">
        {groups.map((group) => (
          <div key={group} className="mb-4">
            <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-brand-200/55">{group}</p>
            {items
              .filter((n) => n.group === group)
              .map((item) => {
                if (!item.children?.length) {
                  return (
                    <NavButton
                      key={item.id}
                      item={item}
                      active={isActive(item, current)}
                      onClick={() => onChange(item.id)}
                    />
                  );
                }

                const childActive = item.children.some((c) => isActive(c, current));
                const open = openMenus[item.id] ?? childActive;
                return (
                  <div key={item.id}>
                    <div className="relative">
                      <NavButton
                        item={item}
                        active={isActive(item, current) || (childActive && !open)}
                        onClick={() => onChange(canView(user, item.id) ? item.id : item.children[0].id)}
                      />
                      <button
                        onClick={() => setOpenMenus((prev) => ({ ...prev, [item.id]: !open }))}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-brand-200/75 transition-colors hover:bg-white/10 hover:text-white"
                        aria-label={open ? `Ocultar opciones de ${item.label}` : `Mostrar opciones de ${item.label}`}
                        aria-expanded={open}
                      >
                        <ChevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                    {open && (
                      <div className="ml-4 pl-2 border-l border-white/10">
                        {item.children.map((child) => (
                          <NavButton
                            key={child.id}
                            item={child}
                            nested
                            active={isActive(child, current)}
                            onClick={() => onChange(child.id)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onChange('profile')}
            aria-current={current === 'profile' ? 'page' : undefined}
            title="Mi perfil"
            className={`flex-1 min-w-0 flex items-center gap-3 p-1.5 -m-1.5 rounded-lg text-left transition-colors ${
              current === 'profile' ? 'bg-white/12' : 'hover:bg-white/7'
            }`}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-brand-600 text-white">
              {initials(user.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate text-white">{user.name}</p>
              <p className="text-xs truncate text-brand-200/55">
                {user.rol} · {nombre}
              </p>
            </div>
          </button>
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
