import { useState } from 'react';
import Sidebar from '@/shared/layout/Sidebar';
import Header from '@/shared/layout/Header';
import Login from '@/features/auth/Login';
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

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [view, setView] = useState('dashboard');
  const [editingProduct, setEditingProduct] = useState(undefined);

  if (!authenticated) {
    return <Login onLogin={() => setAuthenticated(true)} />;
  }

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
  function logout() {
    setAuthenticated(false);
    setView('dashboard');
    setEditingProduct(undefined);
  }

  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar current={view} onChange={setView} onLogout={logout} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header current={view} />
        <main className="flex-1 overflow-y-auto">
          {view === 'dashboard' && <Dashboard />}
          {view === 'products' && <Products onEdit={editProduct} onNew={newProduct} />}
          {view === 'product-detail' && (
            <ProductDetail key={editingProduct ?? 'new'} productId={editingProduct} onBack={goToProducts} />
          )}
          {view === 'purchases' && <Purchases />}
          {view === 'pos' && <POS />}
          {view === 'sales-history' && <SalesHistory />}
          {view === 'suppliers' && <Suppliers />}
          {view === 'users' && <Users />}
          {view === 'reports' && <Reports />}
          {view === 'categories' && <Categories />}
        </main>
      </div>
    </div>
  );
}
