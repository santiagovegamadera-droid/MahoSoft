import { useState } from 'react';
import { Banknote, Check, CreditCard, Landmark, Minus, Plus, ShoppingBag, X } from 'lucide-react';
import saleTotals from '@/features/sales/saleTotals';
import { registerSale as saveSale } from '@/features/sales/store';
import useProducts, { totalStock } from '@/features/products/store';
import useCategories from '@/features/categories/store';

export default function POS() {
  const { items: products } = useProducts();
  const { items: categories } = useCategories();
  const [cart, setCart] = useState([]);
  const [payment, setPayment] = useState('tarjeta');
  const [discount, setDiscount] = useState(0);
  const [catFilter, setCatFilter] = useState('Todos');
  const [completed, setCompleted] = useState(null);
  const [customer, setCustomer] = useState('');

  const catalog = products.filter((p) => p.estado === 'Activo');
  const catName = (id) => categories.find((c) => c.id === id)?.name ?? 'Otros';
  const cats = ['Todos', ...Array.from(new Set(catalog.map((p) => catName(p.catId))))];
  const filtered = catFilter === 'Todos' ? catalog : catalog.filter((p) => catName(p.catId) === catFilter);

  // Units available for a product size, read from the live stock
  const available = (id, talla) => products.find((p) => p.id === id)?.stock[talla] ?? 0;
  const sizesInStock = (p) => Object.keys(p.stock).filter((t) => p.stock[t] > 0);

  function addToCart(p) {
    setCart((prev) => {
      const ex = prev.find((c) => c.id === p.id);
      if (ex) {
        return prev.map((c) => (c.id === p.id ? { ...c, qty: Math.min(c.qty + 1, available(c.id, c.talla)) } : c));
      }
      return [...prev, { id: p.id, name: p.name, price: p.precio, img: p.img, qty: 1, talla: sizesInStock(p)[0] }];
    });
  }
  function removeFromCart(id) {
    setCart((prev) => prev.filter((c) => c.id !== id));
  }
  function updateQty(id, d) {
    setCart((prev) =>
      prev.map((c) => (c.id === id ? { ...c, qty: Math.min(Math.max(1, c.qty + d), available(c.id, c.talla)) } : c)),
    );
  }
  function changeSize(id, talla) {
    setCart((prev) => prev.map((c) => (c.id === id ? { ...c, talla, qty: Math.min(c.qty, available(id, talla)) } : c)));
  }

  const { subtotal, descuentoAmt: discountAmt, total, iva } = saleTotals({ items: cart, descuento: discount });
  const fmt = (n) => `$${n.toLocaleString('es-CO')}`;

  function registerSale() {
    const sale = saveSale({
      cliente: customer.trim() || 'Cliente general',
      vendedor: 'Ana Martínez',
      pago: payment,
      descuento: discount,
      items: cart.map((c) => ({ productId: c.id, name: c.name, talla: c.talla, qty: c.qty, price: c.price })),
    });
    setCompleted({ factura: sale.factura, total });
  }

  if (completed) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 bg-brand-200 text-brand-800">
            <Check size={40} strokeWidth={2} />
          </div>
          <h2 className="text-2xl mb-2 font-display text-brand-800">Venta registrada</h2>
          <p className="text-sm mb-1 text-brand-600">
            Total cobrado: <strong>{fmt(completed.total)}</strong>
          </p>
          <p className="text-xs mb-6 text-brand-400">Factura #{completed.factura} generada</p>
          <div className="flex gap-3 justify-center">
            <button className="px-4 py-2 rounded-xl text-sm font-semibold bg-brand-200 text-brand-800">
              Imprimir recibo
            </button>
            <button
              onClick={() => {
                setCart([]);
                setCustomer('');
                setDiscount(0);
                setCompleted(null);
              }}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-brand-600"
            >
              Nueva venta
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-73px)]">
      {/* Products panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-5 pb-3 border-b border-brand-150 bg-white">
          <div className="flex gap-1 flex-wrap">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setCatFilter(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  catFilter === c ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-600'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map((p) => {
              const inCart = cart.find((c) => c.id === p.id);
              const soldOut = sizesInStock(p).length === 0;
              return (
                <button
                  key={p.id}
                  onClick={() => addToCart(p)}
                  disabled={soldOut}
                  className={`text-left rounded-2xl border overflow-hidden transition-all enabled:hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed bg-white ${
                    inCart ? 'border-brand-600 shadow-[0_0_0_2px_rgba(129,99,139,0.2)]' : 'border-brand-150 shadow-none'
                  }`}
                >
                  <div className="relative">
                    <div className="w-full h-28 bg-brand-200">
                      {p.img && <img src={p.img} alt={p.name} className="w-full h-full object-cover" />}
                    </div>
                    {inCart && (
                      <span className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white bg-brand-800">
                        {inCart.qty}
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-semibold leading-tight mb-1 text-brand-800">{p.name}</p>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-brand-600 font-mono">{fmt(p.precio)}</p>
                      <p className={`text-[10px] ${soldOut ? 'font-semibold text-danger' : 'text-brand-400'}`}>
                        {soldOut ? 'Agotado' : `${totalStock(p)} disp.`}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cart panel */}
      <div className="w-80 shrink-0 flex flex-col border-l bg-white border-brand-150">
        <div className="p-4 border-b border-brand-50">
          <h3 className="text-sm font-semibold text-brand-800">Carrito de venta</h3>
          <input
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            placeholder="Nombre del cliente (opcional)"
            className="w-full mt-2 px-3 py-2 rounded-xl border text-xs outline-none border-brand-200 text-brand-800 focus:border-brand-600"
            aria-label="Cliente"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag size={32} strokeWidth={1.5} className="mx-auto mb-2 text-brand-200" />
              <p className="text-xs text-brand-400">Selecciona productos del catálogo</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center gap-2 p-2 rounded-xl bg-brand-50">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-10 h-10 rounded-lg object-cover shrink-0 bg-brand-200"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate text-brand-800">{item.name}</p>
                  <select
                    value={item.talla}
                    onChange={(e) => changeSize(item.id, e.target.value)}
                    className="text-[10px] border rounded-md px-1 py-0.5 outline-none mt-0.5 border-brand-200 text-brand-600"
                  >
                    {Object.keys(products.find((p) => p.id === item.id)?.stock ?? {})
                      .filter((t) => available(item.id, t) > 0 || t === item.talla)
                      .map((t) => (
                        <option key={t} value={t}>
                          {t} ({available(item.id, t)})
                        </option>
                      ))}
                  </select>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <p className="text-xs font-bold text-brand-800 font-mono">{fmt(item.price * item.qty)}</p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="w-5 h-5 rounded flex items-center justify-center text-xs bg-brand-200 text-brand-800"
                      aria-label="Restar"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-xs w-4 text-center font-semibold text-brand-800">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className="w-5 h-5 rounded flex items-center justify-center text-xs bg-brand-200 text-brand-800"
                      aria-label="Sumar"
                    >
                      <Plus size={12} />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="w-5 h-5 rounded flex items-center justify-center text-xs ml-1 bg-danger-soft text-danger"
                      aria-label="Quitar"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        <div className="p-4 border-t space-y-3 border-brand-50">
          <div className="flex justify-between text-xs text-brand-600">
            <span>Subtotal</span>
            <span className="font-mono">{fmt(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-brand-600">Descuento</span>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={30}
                step={5}
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="w-20 accent-brand-600"
              />
              <span className="w-8 text-right font-semibold text-brand-800">{discount}%</span>
            </div>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-xs text-danger">
              <span>Desc. aplicado</span>
              <span className="font-mono">−{fmt(discountAmt)}</span>
            </div>
          )}
          <div className="flex justify-between text-xs text-brand-600">
            <span>IVA (19%)</span>
            <span className="font-mono">{fmt(iva)}</span>
          </div>
          <div className="flex justify-between font-bold text-base border-t pt-2 text-brand-800 border-brand-150">
            <span>Total</span>
            <span className="font-mono">{fmt(total)}</span>
          </div>

          {/* Payment method */}
          <div className="flex gap-1.5">
            {['efectivo', 'tarjeta', 'transferencia'].map((m) => (
              <button
                key={m}
                onClick={() => setPayment(m)}
                className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-[10px] font-semibold border-2 capitalize transition-all ${
                  payment === m
                    ? 'bg-brand-600 border-brand-600 text-white'
                    : 'bg-white border-brand-200 text-brand-600'
                }`}
              >
                {m === 'efectivo' ? (
                  <Banknote size={14} />
                ) : m === 'tarjeta' ? (
                  <CreditCard size={14} />
                ) : (
                  <Landmark size={14} />
                )}
                {m}
              </button>
            ))}
          </div>

          <button
            onClick={registerSale}
            disabled={cart.length === 0 || cart.some((c) => c.qty < 1)}
            className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40 bg-brand-800 enabled:hover:bg-brand-600"
          >
            Registrar venta
          </button>
        </div>
      </div>
    </div>
  );
}
