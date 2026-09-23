import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import Products from './views/Products';
import ProductDetail from './views/ProductDetail';
import Inventory from './views/Inventory';
import POS from './views/POS';
import Customers from './views/Customers';
import Suppliers from './views/Suppliers';
import Employees from './views/Employees';
import Reports from './views/Reports';
import Categories from './views/Categories';

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

  return (
    <div className="flex min-h-screen" style={{ background: '#f8f5fa' }}>
      <Sidebar current={view} onChange={setView} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header current={view} onNewProduct={newProduct} />
        <main className="flex-1 overflow-y-auto">
          {view === 'dashboard' && <Dashboard />}
          {view === 'products' && <Products onEdit={editProduct} />}
          {view === 'product-detail' && <ProductDetail onBack={goToProducts} />}
          {view === 'inventory' && <Inventory />}
          {view === 'pos' && <POS />}
          {view === 'customers' && <Customers />}
          {view === 'suppliers' && <Suppliers />}
          {view === 'employees' && <Employees />}
          {view === 'reports' && <Reports />}
          {view === 'categories' && <Categories />}
        </main>
      </div>
    </div>
  );
}
