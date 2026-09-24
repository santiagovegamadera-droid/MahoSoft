import { useState } from 'react';
import {
  Banknote,
  CalendarDays,
  CircleAlert,
  Check,
  CreditCard,
  FileText,
  Landmark,
  Mail,
  Paperclip,
  MapPin,
  Pencil,
  Phone,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Store,
  Trash2,
  Truck,
  User,
  X,
} from 'lucide-react';
import saleTotals from '@/features/sales/saleTotals';
import { ReceiptModal } from '@/features/sales/SaleReceipt';
import { registerSale as saveSale } from '@/features/sales/store';
import useProducts, { sortSizes, totalStock } from '@/features/products/store';
import useCategories, { isActiveCategory } from '@/features/categories/store';
import useSettings from '@/features/settings/store';
import { useCurrentUser } from '@/features/users/store';
import ProductCard from '@/features/pos/ProductCard';
import CartItem from '@/features/pos/CartItem';
import SendInvoice, { isEmail } from '@/features/pos/SendInvoice';
import TransferProof, { EMPTY_PROOF } from '@/features/pos/TransferProof';
import CustomerModal, { EMPTY_CUSTOMER, EMPTY_DELIVERY, deliveryMissing } from '@/features/pos/CustomerModal';

const PAYMENTS = [
  { id: 'efectivo', label: 'Efectivo', Icon: Banknote },
  { id: 'tarjeta', label: 'Tarjeta', Icon: CreditCard },
  { id: 'transferencia', label: 'Transferencia', Icon: Landmark },
];
const SALE_TYPES = [
  { id: 'tienda', label: 'En tienda', Icon: Store },
  { id: 'pedido', label: 'Pedido', Icon: Truck },
];
const fmtDate = (d) =>
  new Date(`${d}T00:00`).toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' });
const fullAddress = (d) => [d.direccion, d.barrio, d.ciudad].filter(Boolean).join(', ');
const PRICES = [
  { id: 'todos', label: 'Todos los precios', min: 0, max: Infinity },
  { id: 'bajo', label: 'Hasta $70.000', min: 0, max: 70000 },
  { id: 'medio', label: '$70.000 – $120.000', min: 70000, max: 120000 },
  { id: 'alto', label: 'Más de $120.000', min: 120000, max: Infinity },
];
const SORTS = [
  { id: 'relevancia', label: 'Relevancia', compare: () => 0 },
  { id: 'nombre', label: 'Nombre (A–Z)', compare: (a, b) => a.name.localeCompare(b.name, 'es') },
  { id: 'precio-asc', label: 'Menor precio', compare: (a, b) => a.precio - b.precio },
  { id: 'precio-desc', label: 'Mayor precio', compare: (a, b) => b.precio - a.precio },
  { id: 'stock', label: 'Más stock', compare: (a, b) => totalStock(b) - totalStock(a) },
];
const selectClass =
  'px-2.5 py-1.5 rounded-lg border text-xs font-semibold outline-none bg-white border-brand-150 text-brand-600 focus:border-brand-600';
const chipClass = (active) =>
  active ? 'bg-brand-800 border-brand-800 text-white' : 'bg-white border-brand-150 text-brand-600 hover:border-brand-300';

// Lowercase without accents, so "blusa" matches "Blúsa"
const normalize = (s) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

export default function POS() {
  const { items: products } = useProducts();
  const { items: categories } = useCategories();
  const { descuentos, tallas } = useSettings();
  const user = useCurrentUser();
  const [cart, setCart] = useState([]);
  const [payment, setPayment] = useState('tarjeta');
  const [discount, setDiscount] = useState(0);
  const [catFilter, setCatFilter] = useState('Todos');
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sizeFilter, setSizeFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('todos');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sort, setSort] = useState('relevancia');
  const [completed, setCompleted] = useState(null);
  const [saleType, setSaleType] = useState('tienda');
  const [customer, setCustomer] = useState(EMPTY_CUSTOMER);
  const [delivery, setDelivery] = useState(EMPTY_DELIVERY);
  const [editingCustomer, setEditingCustomer] = useState(false);
  const [proof, setProof] = useState(EMPTY_PROOF);
  const [showReceipt, setShowReceipt] = useState(false);

  // Only active products from active categories can be sold
  const catalog = products.filter(
    (p) => p.estado === 'Activo' && isActiveCategory(categories.find((c) => c.id === p.catId)),
  );
  const catName = (id) => categories.find((c) => c.id === id)?.name ?? 'Otros';
  const cats = ['Todos', ...Array.from(new Set(catalog.map((p) => catName(p.catId))))];
  const countIn = (c) => (c === 'Todos' ? catalog.length : catalog.filter((p) => catName(p.catId) === c).length);
  const allSizes = sortSizes(catalog.flatMap((p) => Object.keys(p.stock)), tallas);
  const priceRange = PRICES.find((r) => r.id === priceFilter);
  const activeFilters = [sizeFilter, priceFilter !== 'todos', onlyAvailable, sort !== 'relevancia'].filter(Boolean).length;

  // Search matches name, category and colors, ignoring accents
  const terms = normalize(query.trim()).split(/\s+/).filter(Boolean);
  const matchesQuery = (p) => {
    const text = normalize([p.name, catName(p.catId), ...(p.colores ?? [])].join(' '));
    return terms.every((t) => text.includes(t));
  };
  const filtered = catalog
    .filter(
      (p) =>
        (catFilter === 'Todos' || catName(p.catId) === catFilter) &&
        matchesQuery(p) &&
        (!sizeFilter || (p.stock[sizeFilter] ?? 0) > 0) &&
        p.precio >= priceRange.min &&
        p.precio <= priceRange.max &&
        (!onlyAvailable || totalStock(p) > 0),
    )
    .sort(SORTS.find((s) => s.id === sort).compare);

  function clearFilters() {
    setSizeFilter('');
    setPriceFilter('todos');
    setOnlyAvailable(false);
    setSort('relevancia');
  }
  function showAll() {
    setQuery('');
    setCatFilter('Todos');
    clearFilters();
  }

  // Units available for a product size, read from the live stock
  const available = (id, talla) => products.find((p) => p.id === id)?.stock[talla] ?? 0;
  const inCart = (id, talla) => cart.find((c) => c.id === id && c.talla === talla)?.qty ?? 0;
  const leftOf = (id, talla) => available(id, talla) - inCart(id, talla);
  const sizesOf = (p) => Object.keys(p.stock).map((talla) => ({ talla, left: leftOf(p.id, talla) }));

  // Each cart line is one product in one size
  function addToCart(p, talla) {
    const size = talla ?? sizesOf(p).find((s) => s.left > 0)?.talla;
    if (!size || leftOf(p.id, size) <= 0) return;
    setCart((prev) => {
      const ex = prev.find((c) => c.id === p.id && c.talla === size);
      if (ex) return prev.map((c) => (c === ex ? { ...c, qty: c.qty + 1 } : c));
      return [...prev, { id: p.id, name: p.name, price: p.precio, img: p.img, qty: 1, talla: size }];
    });
  }
  function removeLine(line) {
    setCart((prev) => prev.filter((c) => c !== line));
  }
  function updateQty(line, d) {
    setCart((prev) =>
      prev.map((c) => (c === line ? { ...c, qty: Math.min(Math.max(1, c.qty + d), available(c.id, c.talla)) } : c)),
    );
  }
  // Switching to a size already in the cart merges both lines
  function changeSize(line, talla) {
    setCart((prev) => {
      const target = prev.find((c) => c.id === line.id && c.talla === talla);
      if (target) {
        return prev
          .filter((c) => c !== line)
          .map((c) => (c === target ? { ...c, qty: Math.min(c.qty + line.qty, available(c.id, talla)) } : c));
      }
      return prev.map((c) => (c === line ? { ...c, talla, qty: Math.min(c.qty, available(c.id, talla)) } : c));
    });
  }

  const isOrder = saleType === 'pedido';
  const {
    subtotal,
    descuentoAmt: discountAmt,
    envio,
    total,
  } = saleTotals({ items: cart, descuento: discount, envio: isOrder ? delivery.envio : 0 });
  const fmt = (n) => `$${n.toLocaleString('es-CO')}`;
  const units = cart.reduce((s, c) => s + c.qty, 0);
  // The invoice goes out on its own when the customer left a valid email
  const sendsInvoice = isEmail(customer.correo);
  const missingDelivery = isOrder && deliveryMissing(customer, delivery);
  const missingFields = [
    !customer.nombre && 'nombre',
    !customer.telefono && 'teléfono',
    !delivery.direccion && 'dirección',
  ].filter(Boolean);
  const hasCustomer = Boolean(customer.nombre || customer.telefono || customer.documento || customer.correo);
  const canCharge =
    cart.length > 0 && cart.every((c) => c.qty >= 1) && !missingDelivery;

  function registerSale() {
    const sale = saveSale({
      tipo: saleType,
      cliente: customer.nombre.trim() || 'Cliente general',
      tipoDocumento: customer.documento.trim() ? customer.tipoDocumento : '',
      documento: customer.documento.trim(),
      telefono: customer.telefono.trim(),
      vendedor: user.name,
      pago: payment,
      descuento: discount,
      correo: customer.correo.trim(),
      entrega: isOrder ? delivery : null,
      // Only the file's details are kept until the backend can store the file itself
      comprobante:
        payment === 'transferencia'
          ? {
              archivo: proof.file && { nombre: proof.file.name, tipo: proof.file.type, tamano: proof.file.size },
              banco: proof.banco,
              referencia: proof.referencia.trim(),
            }
          : null,
      envio,
      items: cart.map((c) => ({ productId: c.id, name: c.name, talla: c.talla, qty: c.qty, price: c.price })),
    });
    setCompleted({ ...sale, total, units, sendNow: sendsInvoice });
  }

  function newSale() {
    setCart([]);
    setSaleType('tienda');
    setCustomer(EMPTY_CUSTOMER);
    setDelivery(EMPTY_DELIVERY);
    setProof(EMPTY_PROOF);
    setDiscount(0);
    setShowReceipt(false);
    setCompleted(null);
  }

  if (completed) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-73px)] bg-canvas p-6">
        <div className="w-full max-w-sm rounded-3xl bg-white border border-brand-150 shadow-xl p-8 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 bg-success-soft text-success">
            <Check size={32} strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-display text-brand-800">
            {completed.tipo === 'pedido' ? 'Pedido registrado' : 'Venta registrada'}
          </h2>
          <p className="text-xs mt-1 text-brand-400">Factura #{completed.factura}</p>

          <div className="my-6 py-4 border-y border-dashed border-brand-200">
            <p className="text-xs uppercase tracking-wider text-brand-400">Total cobrado</p>
            <p className="text-3xl font-bold mt-1 text-brand-800 font-mono">{fmt(completed.total)}</p>
            <p className="text-xs mt-2 text-brand-600 capitalize">
              {completed.units} {completed.units === 1 ? 'prenda' : 'prendas'} · {completed.pago}
            </p>
            {completed.comprobante &&
              (completed.comprobante.archivo ? (
                <p className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-success-soft text-success">
                  <Paperclip size={11} />
                  Comprobante adjunto
                  {completed.comprobante.banco && ` · ${completed.comprobante.banco}`}
                </p>
              ) : (
                <p className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-warning-soft text-warning">
                  <CircleAlert size={11} />
                  Transferencia pendiente de verificar
                </p>
              ))}
          </div>

          {completed.entrega && (
            <div className="mb-3 p-3 rounded-xl border text-left border-brand-150 bg-brand-25">
              <p className="flex items-center gap-1.5 text-xs font-semibold mb-1.5 text-brand-800">
                <Truck size={14} />
                Entregar a {completed.cliente}
              </p>
              <div className="space-y-1 text-[11px] text-brand-600">
                <p className="flex items-start gap-1.5">
                  <MapPin size={12} className="shrink-0 mt-px" />
                  {fullAddress(completed.entrega)}
                </p>
                <p className="flex items-center gap-1.5">
                  <Phone size={12} className="shrink-0" />
                  {completed.telefono}
                </p>
                {completed.entrega.fecha && (
                  <p className="flex items-center gap-1.5 capitalize">
                    <CalendarDays size={12} className="shrink-0" />
                    {fmtDate(completed.entrega.fecha)}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="mb-4">
            <SendInvoice factura={completed.factura} email={completed.correo} sendNow={completed.sendNow} />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowReceipt(true)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-brand-100 text-brand-800 hover:bg-brand-150"
            >
              <FileText size={16} />
              Ver comprobante
            </button>
            <button
              onClick={newSale}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand-800 hover:bg-brand-600"
            >
              Nueva venta
            </button>
          </div>
        </div>

        {showReceipt && <ReceiptModal sale={completed} onClose={() => setShowReceipt(false)} />}
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-73px)] bg-canvas">
      {/* Products panel */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <div className="px-4 pt-3 pb-3 space-y-2.5 border-b border-brand-150 bg-white">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nombre, categoría o color..."
                className="w-full pl-9 pr-9 py-2 rounded-xl border text-xs outline-none transition-colors bg-brand-25 border-brand-150 text-brand-800 placeholder:text-brand-400 focus:bg-white focus:border-brand-600"
                aria-label="Buscar producto"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-brand-400 hover:text-brand-800"
                  aria-label="Limpiar búsqueda"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters((v) => !v)}
              aria-expanded={showFilters}
              className={`flex items-center gap-1.5 px-3 rounded-xl border text-xs font-semibold transition-colors ${chipClass(
                showFilters || activeFilters > 0,
              )}`}
            >
              <SlidersHorizontal size={14} />
              Filtros
              {activeFilters > 0 && (
                <span className="min-w-4 h-4 px-1 rounded-full flex items-center justify-center text-[10px] bg-white text-brand-800">
                  {activeFilters}
                </span>
              )}
            </button>
          </div>

          {showFilters && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 p-3 rounded-xl border border-brand-150 bg-brand-25">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold text-brand-400">Talla</span>
                <div className="flex flex-wrap gap-0.5">
                  {allSizes.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSizeFilter(sizeFilter === t ? '' : t)}
                      className={`min-w-7 px-1.5 py-1 rounded-md border text-[11px] font-semibold transition-colors ${chipClass(
                        sizeFilter === t,
                      )}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold text-brand-400">Precio</span>
                <select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)} className={selectClass}>
                  {PRICES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold text-brand-400">Ordenar</span>
                <select value={sort} onChange={(e) => setSort(e.target.value)} className={selectClass}>
                  {SORTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer text-brand-600">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                  className="accent-brand-600"
                />
                Solo disponibles
              </label>

              {activeFilters > 0 && (
                <button
                  onClick={clearFilters}
                  className="ml-auto flex items-center gap-1 text-xs font-semibold text-brand-400 hover:text-danger"
                >
                  <X size={13} />
                  Limpiar filtros
                </button>
              )}
            </div>
          )}

          <div className="flex gap-1.5 overflow-x-auto pb-1 -mb-1">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setCatFilter(c)}
                className={`shrink-0 flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full text-xs font-semibold border transition-colors ${chipClass(
                  catFilter === c,
                )}`}
              >
                {c}
                <span
                  className={`min-w-5 px-1 py-px rounded-full text-[10px] ${
                    catFilter === c ? 'bg-white/20 text-white' : 'bg-brand-50 text-brand-400'
                  }`}
                >
                  {countIn(c)}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Search size={36} strokeWidth={1.5} className="mb-3 text-brand-200" />
              <p className="text-sm font-semibold text-brand-600">No hay productos que coincidan</p>
              <p className="text-xs mt-1 text-brand-400">Prueba con otro nombre, categoría o filtro</p>
              {(query || activeFilters > 0 || catFilter !== 'Todos') && (
                <button
                  onClick={showAll}
                  className="mt-4 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-100 text-brand-800 hover:bg-brand-150"
                >
                  Ver todos los productos
                </button>
              )}
            </div>
          ) : (
            <>
              <p className="mb-2 text-[11px] text-brand-400">
                {filtered.length} {filtered.length === 1 ? 'producto' : 'productos'}
              </p>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3">
                {filtered.map((p) => {
                  const sizes = sizesOf(p);
                  return (
                    <ProductCard
                      key={p.id}
                      product={p}
                      category={catName(p.catId)}
                      price={fmt(p.precio)}
                      sizes={sizes}
                      stockLeft={sizes.reduce((s, x) => s + x.left, 0)}
                      inCartQty={cart.filter((c) => c.id === p.id).reduce((s, c) => s + c.qty, 0)}
                      onAdd={(talla) => addToCart(p, talla)}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Cart panel */}
      <aside className="w-72 shrink-0 flex flex-col border-l bg-white border-brand-150">
        <div className="px-4 pt-3 pb-3 border-b border-brand-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag size={15} className="text-brand-800" />
              <h3 className="text-sm font-semibold text-brand-800">Venta actual</h3>
              {units > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-brand-100 text-brand-700">
                  {units}
                </span>
              )}
            </div>
            {cart.length > 0 && (
              <button
                onClick={() => setCart([])}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold text-brand-400 hover:text-danger hover:bg-danger-soft transition-colors"
              >
                <Trash2 size={13} />
                Vaciar
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-1 p-0.5 mt-2 rounded-lg bg-brand-50">
            {SALE_TYPES.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setSaleType(id)}
                aria-pressed={saleType === id}
                className={`flex items-center justify-center gap-1.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                  saleType === id ? 'bg-white text-brand-800 shadow-sm' : 'text-brand-400 hover:text-brand-600'
                }`}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>

          {hasCustomer || (isOrder && delivery.direccion) ? (
            <div className="mt-2 p-2 rounded-lg border border-brand-150 bg-brand-25">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 space-y-0.5">
                  <p className="flex items-center gap-1.5 text-xs font-semibold truncate text-brand-800">
                    <User size={12} className="shrink-0" />
                    {customer.nombre || 'Sin nombre'}
                  </p>
                  {customer.telefono && (
                    <p className="flex items-center gap-1.5 text-[11px] text-brand-600">
                      <Phone size={11} className="shrink-0" />
                      {customer.telefono}
                    </p>
                  )}
                  {sendsInvoice && (
                    <p className="flex items-center gap-1.5 text-[11px] text-brand-600" title="La factura se enviará a este correo">
                      <Mail size={11} className="shrink-0" />
                      <span className="truncate">{customer.correo}</span>
                    </p>
                  )}
                  {isOrder && delivery.direccion && (
                    <p className="flex items-start gap-1.5 text-[11px] text-brand-600">
                      <MapPin size={11} className="shrink-0 mt-px" />
                      <span className="line-clamp-2">{fullAddress(delivery)}</span>
                    </p>
                  )}
                  {isOrder && delivery.fecha && (
                    <p className="flex items-center gap-1.5 text-[11px] capitalize text-brand-600">
                      <CalendarDays size={11} className="shrink-0" />
                      {fmtDate(delivery.fecha)}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setEditingCustomer(true)}
                  className="shrink-0 p-1 rounded-md text-brand-400 hover:text-brand-800 hover:bg-brand-100"
                  aria-label="Editar datos del cliente"
                >
                  <Pencil size={13} />
                </button>
              </div>
              {missingDelivery && (
                <p className="mt-1.5 text-[10px] font-semibold text-warning">Faltan: {missingFields.join(', ')}</p>
              )}
            </div>
          ) : (
            <button
              onClick={() => setEditingCustomer(true)}
              className={`w-full flex items-center justify-center gap-1.5 mt-2 py-2 rounded-lg border border-dashed text-xs font-semibold transition-colors ${
                isOrder
                  ? 'border-warning-line bg-warning-tint text-warning hover:border-warning'
                  : 'border-brand-200 text-brand-600 hover:border-brand-400 hover:bg-brand-25'
              }`}
            >
              {isOrder ? <Truck size={13} /> : <User size={13} />}
              {isOrder ? 'Agregar datos de entrega' : 'Agregar cliente (opcional)'}
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3 bg-brand-50 text-brand-300">
                <ShoppingBag size={28} strokeWidth={1.5} />
              </div>
              <p className="text-sm font-semibold text-brand-600">El carrito está vacío</p>
              <p className="text-xs mt-1 text-brand-400">Toca un producto o una talla para agregarlo</p>
            </div>
          ) : (
            cart.map((item) => (
              <CartItem
                key={`${item.id}-${item.talla}`}
                item={item}
                total={fmt(item.price * item.qty)}
                maxQty={available(item.id, item.talla)}
                sizeOptions={Object.keys(products.find((p) => p.id === item.id)?.stock ?? {})
                  .filter((t) => available(item.id, t) > 0 || t === item.talla)
                  .map((t) => ({ talla: t, left: available(item.id, t) }))}
                onQty={(d) => updateQty(item, d)}
                onSize={(t) => changeSize(item, t)}
                onRemove={() => removeLine(item)}
              />
            ))
          )}
        </div>

        {/* Summary */}
        <div className="p-4 space-y-3 border-t border-brand-100 bg-brand-25">
          <div>
            <p className="text-[11px] font-semibold mb-1.5 text-brand-600">Descuento</p>
            <div className="grid grid-cols-6 gap-1">
              {descuentos.map((d) => (
                <button
                  key={d}
                  onClick={() => setDiscount(d)}
                  className={`py-1 rounded-md text-[11px] font-semibold border transition-colors ${chipClass(
                    discount === d,
                  )}`}
                >
                  {d}%
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex justify-between text-brand-600">
              <span>Subtotal</span>
              <span className="font-mono">{fmt(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-danger">
                <span>Descuento ({discount}%)</span>
                <span className="font-mono">−{fmt(discountAmt)}</span>
              </div>
            )}
            {isOrder && (
              <div className="flex justify-between text-brand-600">
                <span>Envío</span>
                <span className="font-mono">{envio > 0 ? fmt(envio) : 'Gratis'}</span>
              </div>
            )}
            <div className="flex justify-between items-baseline pt-2 mt-1 border-t border-brand-150">
              <span className="font-semibold text-brand-800">Total</span>
              <span className="text-lg font-bold text-brand-800 font-mono">{fmt(total)}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {PAYMENTS.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setPayment(id)}
                className={`flex flex-col items-center gap-0.5 py-1.5 rounded-lg text-[10px] font-semibold border transition-colors ${
                  payment === id
                    ? 'bg-brand-100 border-brand-600 text-brand-800'
                    : 'bg-white border-brand-150 text-brand-400 hover:border-brand-300'
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>

          {payment === 'transferencia' && <TransferProof value={proof} onChange={setProof} />}

          <button
            onClick={registerSale}
            disabled={!canCharge}
            className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-colors shadow-md disabled:opacity-40 disabled:shadow-none bg-brand-800 enabled:hover:bg-brand-600"
          >
            {cart.length === 0
              ? 'Agrega productos para cobrar'
              : missingDelivery
                ? 'Faltan datos de entrega'
                : `Cobrar ${fmt(total)}`}
          </button>
        </div>
      </aside>

      {editingCustomer && (
        <CustomerModal
          isOrder={isOrder}
          customer={customer}
          delivery={delivery}
          onClose={() => setEditingCustomer(false)}
          onSave={(c, d) => {
            setCustomer(c);
            setDelivery(d);
            setEditingCustomer(false);
          }}
        />
      )}
    </div>
  );
}
