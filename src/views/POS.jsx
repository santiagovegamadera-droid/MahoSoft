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
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 text-4xl"
            style={{ background: '#dac9df' }}
          >
            ✓
          </div>
          <h2 className="text-2xl mb-2" style={{ fontFamily: 'DM Serif Display, serif', color: '#503459' }}>
            Venta registrada
          </h2>
          <p className="text-sm mb-1" style={{ color: '#81638b' }}>
            Total cobrado: <strong>{fmt(total)}</strong>
          </p>
          <p className="text-xs mb-6" style={{ color: '#b695c0' }}>
            Factura #VTA-2026-0847 generada
          </p>
          <div className="flex gap-3 justify-center">
            <button
              className="px-4 py-2 rounded-xl text-sm font-semibold"
              style={{ background: '#dac9df', color: '#503459' }}
            >
              Imprimir recibo
            </button>
            <button
              onClick={() => {
                setCart([]);
                setCompleted(false);
              }}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
              style={{ background: '#81638b' }}
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
        <div className="p-5 pb-3 border-b" style={{ borderColor: '#e8dff0', background: '#fff' }}>
          <div className="flex gap-1 flex-wrap">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setCatFilter(c)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: catFilter === c ? '#81638b' : '#f5f0f7',
                  color: catFilter === c ? '#fff' : '#81638b',
                }}
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
                  className="text-left rounded-2xl border overflow-hidden transition-all hover:shadow-md"
                  style={{
                    background: '#fff',
                    borderColor: inCart ? '#81638b' : '#e8dff0',
                    boxShadow: inCart ? '0 0 0 2px rgba(129,99,139,0.2)' : 'none',
                  }}
                >
                  <div className="relative">
                    <img
                      src={p.img}
                      alt={p.name}
                      className="w-full h-28 object-cover"
                      style={{ background: '#dac9df' }}
                    />
                    {inCart && (
                      <span
                        className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{ background: '#503459' }}
                      >
                        {inCart.qty}
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-semibold leading-tight mb-1" style={{ color: '#503459' }}>
                      {p.name}
                    </p>
                    <p className="text-xs" style={{ color: '#81638b', fontFamily: 'DM Mono, monospace' }}>
                      {fmt(p.price)}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cart panel */}
      <div className="w-80 shrink-0 flex flex-col border-l" style={{ background: '#fff', borderColor: '#e8dff0' }}>
        <div className="p-4 border-b" style={{ borderColor: '#f5f0f7' }}>
          <h3 className="text-sm font-semibold" style={{ color: '#503459' }}>
            Carrito de venta
          </h3>
          <input
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            placeholder="Buscar cliente (opcional)..."
            className="w-full mt-2 px-3 py-2 rounded-xl border text-xs outline-none"
            style={{ borderColor: '#dac9df', color: '#503459' }}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-2xl mb-2" style={{ color: '#dac9df' }}>
                🛍
              </p>
              <p className="text-xs" style={{ color: '#b695c0' }}>
                Selecciona productos del catálogo
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center gap-2 p-2 rounded-xl" style={{ background: '#f5f0f7' }}>
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-10 h-10 rounded-lg object-cover shrink-0"
                  style={{ background: '#dac9df' }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: '#503459' }}>
                    {item.name}
                  </p>
                  <select
                    value={item.talla}
                    onChange={(e) =>
                      setCart((prev) => prev.map((c) => (c.id === item.id ? { ...c, talla: e.target.value } : c)))
                    }
                    className="text-[10px] border rounded-md px-1 py-0.5 outline-none mt-0.5"
                    style={{ borderColor: '#dac9df', color: '#81638b' }}
                  >
                    {['XS', 'S', 'M', 'L', 'XL'].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <p className="text-xs font-bold" style={{ color: '#503459', fontFamily: 'DM Mono, monospace' }}>
                    {fmt(item.price * item.qty)}
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="w-5 h-5 rounded flex items-center justify-center text-xs"
                      style={{ background: '#dac9df', color: '#503459' }}
                    >
                      −
                    </button>
                    <span className="text-xs w-4 text-center font-semibold" style={{ color: '#503459' }}>
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className="w-5 h-5 rounded flex items-center justify-center text-xs"
                      style={{ background: '#dac9df', color: '#503459' }}
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="w-5 h-5 rounded flex items-center justify-center text-xs ml-1"
                      style={{ background: '#fde8ea', color: '#c0392b' }}
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
        <div className="p-4 border-t space-y-3" style={{ borderColor: '#f5f0f7' }}>
          <div className="flex justify-between text-xs" style={{ color: '#81638b' }}>
            <span>Subtotal</span>
            <span style={{ fontFamily: 'DM Mono, monospace' }}>{fmt(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span style={{ color: '#81638b' }}>Descuento</span>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={30}
                step={5}
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="w-20 accent-[#81638b]"
              />
              <span className="w-8 text-right font-semibold" style={{ color: '#503459' }}>
                {discount}%
              </span>
            </div>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-xs" style={{ color: '#c0392b' }}>
              <span>Desc. aplicado</span>
              <span style={{ fontFamily: 'DM Mono, monospace' }}>−{fmt(discountAmt)}</span>
            </div>
          )}
          <div className="flex justify-between text-xs" style={{ color: '#81638b' }}>
            <span>IVA (19%)</span>
            <span style={{ fontFamily: 'DM Mono, monospace' }}>{fmt(iva)}</span>
          </div>
          <div
            className="flex justify-between font-bold text-base border-t pt-2"
            style={{ color: '#503459', borderColor: '#e8dff0' }}
          >
            <span>Total</span>
            <span style={{ fontFamily: 'DM Mono, monospace' }}>{fmt(total)}</span>
          </div>

          {/* Payment method */}
          <div className="flex gap-1.5">
            {['efectivo', 'tarjeta', 'transferencia'].map((m) => (
              <button
                key={m}
                onClick={() => setPayment(m)}
                className="flex-1 py-2 rounded-xl text-[10px] font-semibold border-2 capitalize transition-all"
                style={{
                  background: payment === m ? '#81638b' : '#fff',
                  borderColor: payment === m ? '#81638b' : '#dac9df',
                  color: payment === m ? '#fff' : '#81638b',
                }}
              >
                {m === 'efectivo' ? '💵' : m === 'tarjeta' ? '💳' : '🏦'} {m}
              </button>
            ))}
          </div>

          <button
            onClick={() => cart.length > 0 && setCompleted(true)}
            disabled={cart.length === 0}
            className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40"
            style={{ background: '#503459' }}
            onMouseEnter={(e) => {
              if (cart.length > 0) e.currentTarget.style.background = '#81638b';
            }}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#503459')}
          >
            Registrar venta
          </button>
        </div>
      </div>
    </div>
  );
}
