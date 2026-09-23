import { useState } from 'react';

const catalog = [
  {
    id: 1,
    name: 'Vestido Floral',
    price: 89900,
    cat: 'Vestidos',
    img: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=80&h=80&fit=crop&auto=format',
  },
  {
    id: 2,
    name: 'Blusa Seda Negra',
    price: 65000,
    cat: 'Blusas',
    img: 'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=80&h=80&fit=crop&auto=format',
  },
  {
    id: 3,
    name: 'Jean Skinny',
    price: 119000,
    cat: 'Pantalones',
    img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=80&h=80&fit=crop&auto=format',
  },
  {
    id: 4,
    name: 'Falda Plisada',
    price: 75000,
    cat: 'Faldas',
    img: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=80&h=80&fit=crop&auto=format',
  },
  {
    id: 5,
    name: 'Cardigan Crema',
    price: 145000,
    cat: 'Abrigos',
    img: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=80&h=80&fit=crop&auto=format',
  },
  {
    id: 6,
    name: 'Top Lentejuelas',
    price: 98000,
    cat: 'Tops',
    img: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4017?w=80&h=80&fit=crop&auto=format',
  },
  {
    id: 7,
    name: 'Conjunto Lino',
    price: 185000,
    cat: 'Conjuntos',
    img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=80&h=80&fit=crop&auto=format',
  },
  {
    id: 8,
    name: 'Pantalón Palazzo',
    price: 109000,
    cat: 'Pantalones',
    img: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=80&h=80&fit=crop&auto=format',
  },
];

export default function POS() {
  const [cart, setCart] = useState([]);
  const [payment, setPayment] = useState('tarjeta');
  const [discount, setDiscount] = useState(0);
  const [catFilter, setCatFilter] = useState('Todos');
  const [completed, setCompleted] = useState(false);
  const [customer, setCustomer] = useState('');

  const cats = ['Todos', ...Array.from(new Set(catalog.map((p) => p.cat)))];
  const filtered = catFilter === 'Todos' ? catalog : catalog.filter((p) => p.cat === catFilter);

  function addToCart(p) {
    setCart((prev) => {
      const ex = prev.find((c) => c.id === p.id);
      if (ex) return prev.map((c) => (c.id === p.id ? { ...c, qty: c.qty + 1 } : c));
      return [...prev, { ...p, qty: 1, talla: 'M' }];
    });
  }
  function removeFromCart(id) {
    setCart((prev) => prev.filter((c) => c.id !== id));
  }
  function updateQty(id, d) {
    setCart((prev) => prev.map((c) => (c.id === id ? { ...c, qty: Math.max(1, c.qty + d) } : c)));
  }

  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const discountAmt = Math.round((subtotal * discount) / 100);
  const total = subtotal - discountAmt;
  const iva = Math.round(total * 0.19);
  const fmt = (n) => `$${n.toLocaleString('es-CO')}`;

  if (completed) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 text-4xl bg-brand-200">
            ✓
          </div>
          <h2 className="text-2xl mb-2 font-display text-brand-800">Venta registrada</h2>
          <p className="text-sm mb-1 text-brand-600">
            Total cobrado: <strong>{fmt(total)}</strong>
          </p>
          <p className="text-xs mb-6 text-brand-400">Factura #VTA-2026-0847 generada</p>
          <div className="flex gap-3 justify-center">
            <button className="px-4 py-2 rounded-xl text-sm font-semibold bg-brand-200 text-brand-800">
              Imprimir recibo
            </button>
            <button
              onClick={() => {
                setCart([]);
                setCompleted(false);
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
              return (
                <button
                  key={p.id}
                  onClick={() => addToCart(p)}
                  className={`text-left rounded-2xl border overflow-hidden transition-all hover:shadow-md bg-white ${
                    inCart ? 'border-brand-600 shadow-[0_0_0_2px_rgba(129,99,139,0.2)]' : 'border-brand-150 shadow-none'
                  }`}
                >
                  <div className="relative">
                    <img src={p.img} alt={p.name} className="w-full h-28 object-cover bg-brand-200" />
                    {inCart && (
                      <span className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white bg-brand-800">
                        {inCart.qty}
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-semibold leading-tight mb-1 text-brand-800">{p.name}</p>
                    <p className="text-xs text-brand-600 font-mono">{fmt(p.price)}</p>
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
            placeholder="Buscar cliente (opcional)..."
            className="w-full mt-2 px-3 py-2 rounded-xl border text-xs outline-none border-brand-200 text-brand-800"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-2xl mb-2 text-brand-200">🛍</p>
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
                    onChange={(e) =>
                      setCart((prev) => prev.map((c) => (c.id === item.id ? { ...c, talla: e.target.value } : c)))
                    }
                    className="text-[10px] border rounded-md px-1 py-0.5 outline-none mt-0.5 border-brand-200 text-brand-600"
                  >
                    {['XS', 'S', 'M', 'L', 'XL'].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <p className="text-xs font-bold text-brand-800 font-mono">{fmt(item.price * item.qty)}</p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="w-5 h-5 rounded flex items-center justify-center text-xs bg-brand-200 text-brand-800"
                    >
                      −
                    </button>
                    <span className="text-xs w-4 text-center font-semibold text-brand-800">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className="w-5 h-5 rounded flex items-center justify-center text-xs bg-brand-200 text-brand-800"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="w-5 h-5 rounded flex items-center justify-center text-xs ml-1 bg-danger-soft text-danger"
                    >
                      ×
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
                className={`flex-1 py-2 rounded-xl text-[10px] font-semibold border-2 capitalize transition-all ${
                  payment === m
                    ? 'bg-brand-600 border-brand-600 text-white'
                    : 'bg-white border-brand-200 text-brand-600'
                }`}
              >
                {m === 'efectivo' ? '💵' : m === 'tarjeta' ? '💳' : '🏦'} {m}
              </button>
            ))}
          </div>

          <button
            onClick={() => cart.length > 0 && setCompleted(true)}
            disabled={cart.length === 0}
            className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40 bg-brand-800 enabled:hover:bg-brand-600"
          >
            Registrar venta
          </button>
        </div>
      </div>
    </div>
  );
}
