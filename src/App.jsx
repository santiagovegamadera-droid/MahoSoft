import { useState } from 'react';
import Sidebar from '@/shared/layout/Sidebar';
import Header from '@/shared/layout/Header';
import Login from '@/features/auth/Login';
import Dashboard from '@/features/dashboard/Dashboard';
import Products from '@/features/products/Products';
import ProductDetail from '@/features/products/ProductDetail';
import Purchases from '@/features/purchases/Purchases';
import POS from '@/features/pos/POS';
import Customers from '@/features/customers/Customers';
import Suppliers from '@/features/suppliers/Suppliers';
import Users from '@/features/users/Users';
import Reports from '@/features/reports/Reports';
import Categories from '@/features/categories/Categories';
import SalesHistory from '@/features/sales/SalesHistory';
import initialSales from '@/features/sales/initialSales';

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [view, setView] = useState('dashboard');
  const [editingProduct, setEditingProduct] = useState(undefined);
  const [sales, setSales] = useState(initialSales);

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
  // Stores a sale made in the POS with the next invoice number and returns it
  function registerSale(data) {
    const lastNumber = Math.max(0, ...sales.map((s) => Number(s.factura.split('-').pop())));
    const sale = {
      ...data,
      id: Date.now(),
      factura: `VTA-${new Date().getFullYear()}-${String(lastNumber + 1).padStart(4, '0')}`,
      fecha: new Date().toISOString(),
      vendedor: 'Ana Martínez',
    };
    setSales((prev) => [...prev, sale]);
    return sale;
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
        <Header current={view} onNewProduct={newProduct} />
        <main className="flex-1 overflow-y-auto">
          {view === 'dashboard' && <Dashboard />}
          {view === 'products' && <Products onEdit={editProduct} />}
          {view === 'product-detail' && <ProductDetail onBack={goToProducts} />}
          {view === 'purchases' && <Purchases />}
          {view === 'pos' && <POS onRegisterSale={registerSale} />}
          {view === 'sales-history' && <SalesHistory sales={sales} />}
          {view === 'customers' && <Customers />}
          {view === 'suppliers' && <Suppliers />}
          {view === 'users' && <Users />}
          {view === 'reports' && <Reports />}
          {view === 'categories' && <Categories />}
        </main>
      </div>
    </div>
  );
}
