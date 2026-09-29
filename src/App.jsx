import { useEffect, useState } from 'react';
import Sidebar from '@/shared/layout/Sidebar';
import Header from '@/shared/layout/Header';
import Login from '@/features/auth/Login';
import { logout, refreshUser, useSession } from '@/features/auth/session';
import { canView, homeView } from '@/features/auth/access';
import { useCurrentUser } from '@/features/users/store';
import Dashboard from '@/features/dashboard/Dashboard';
import Products from '@/features/products/Products';
import ProductDetail from '@/features/products/ProductDetail';
import Purchases from '@/features/purchases/Purchases';
import POS from '@/features/pos/POS';
import Suppliers from '@/features/suppliers/Suppliers';
import Users from '@/features/users/Users';
import Reports from '@/features/reports/Reports';
import Categories from '@/features/categories/Categories';
import SalesHistory from '@/features/sales/SalesHistory';
import Settings from '@/features/settings/Settings';
import Profile from '@/features/profile/Profile';

export default function App() {
  const session = useSession();
  if (!session) return <Login />;
  // Keyed by user so signing in as someone else starts on their own home screen
  return <Workspace key={session.usuario.id} />;
}

function Workspace() {
  const user = useCurrentUser();
  const [view, setView] = useState(() => homeView(user));
  const [editingProduct, setEditingProduct] = useState(undefined);
  // "Pedir" on a stock alert opens a new purchase with that product and size
  const [order, setOrder] = useState(null);
  // Menu drawer on screens below 1024 px
  const [menuOpen, setMenuOpen] = useState(false);

  function navigate(next) {
    setView(next);
    setMenuOpen(false);
  }

  // Permissions may have changed since the session started; an invalid session signs out on its own
  useEffect(() => {
    refreshUser().catch(() => {});
  }, []);

  // Never show a screen the user lost access to
  const current = canView(user, view) ? view : homeView(user);

  function goToProducts() {
    setView('products');
    setEditingProduct(undefined);
  }
  function editProduct(id) {
    setEditingProduct(id);
    setView('product-detail');
  }
  function newProduct() {
    setEditingProduct(undefined);
    setView('product-detail');
  }
  function orderProduct(line) {
    setOrder(line);
    setView('purchases');
  }

  return (
    <div className="flex h-dvh bg-canvas">
      <Sidebar
        current={current}
        onChange={navigate}
        onLogout={logout}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header current={current} onMenu={() => setMenuOpen(true)} />
        <main className="flex-1 min-h-0 overflow-y-auto">
          {current === 'dashboard' && <Dashboard onOrder={canView(user, 'purchases') ? orderProduct : undefined} />}
          {current === 'products' && <Products onEdit={editProduct} onNew={newProduct} />}
          {current === 'product-detail' && (
            <ProductDetail key={editingProduct ?? 'new'} productId={editingProduct} onBack={goToProducts} />
          )}
          {current === 'purchases' && <Purchases order={order} onOrderUsed={() => setOrder(null)} />}
          {current === 'pos' && <POS />}
          {current === 'sales-history' && <SalesHistory />}
          {current === 'suppliers' && <Suppliers />}
          {current === 'users' && <Users />}
          {current === 'reports' && <Reports />}
          {current === 'categories' && <Categories />}
          {current === 'settings' && <Settings />}
          {current === 'profile' && <Profile />}
        </main>
      </div>
    </div>
  );
}
