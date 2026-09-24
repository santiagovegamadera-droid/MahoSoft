import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import useProducts, { totalStock } from '@/features/products/store';
import useCategories from '@/features/categories/store';
import useSuppliers from '@/features/suppliers/store';
import StockOverview from '@/features/products/StockOverview';
import useSettings from '@/features/settings/store';
import ConfirmDialog from '@/shared/components/ConfirmDialog';
import { Button, RowActions, StatusToggle } from '@/shared/components/Form';
import usePagination from '@/shared/lib/usePagination';
import Pagination from '@/shared/components/Pagination';

export default function Products({ onEdit, onNew }) {
  const { items: products, update, remove } = useProducts();
  const { items: categories } = useCategories();
  const { items: suppliers } = useSuppliers();
  const { stockBajoProducto } = useSettings();
  const [tab, setTab] = useState('productos');
  const [catId, setCatId] = useState('all');
  const [estado, setEstado] = useState('Todos');
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState(null);

  const catName = (id) => categories.find((c) => c.id === id)?.name ?? '—';
  const supplierName = (id) => suppliers.find((s) => s.id === id)?.name ?? 'Sin proveedor';

  const filtered = products.filter(
    (p) =>
      (catId === 'all' || p.catId === catId) &&
      (estado === 'Todos' || p.estado === estado) &&
      p.name.toLowerCase().includes(search.toLowerCase()),
  );
  const pager = usePagination(filtered, `${catId}|${estado}|${search}`);

  return (
    <div className="p-8">
      <div className="flex gap-1 p-1 rounded-xl w-fit mb-6 bg-brand-50">
        {[
          ['productos', 'Productos'],
          ['stock', 'Stock actual'],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === id
                ? 'bg-white text-brand-800 shadow-[0_1px_3px_rgba(80,52,89,0.1)]'
                : 'bg-transparent text-brand-600 shadow-none'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'stock' && <StockOverview products={products} catName={catName} />}

      {tab === 'productos' && (
        <>
          {/* Filters */}
          <div className="flex items-center gap-3 mb-3">
            <div className="relative flex-1 max-w-sm">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-400 pointer-events-none"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar producto..."
                aria-label="Buscar producto"
                className="w-full h-10 pl-10 pr-4 text-sm rounded-xl border outline-none border-brand-200 bg-white text-brand-800 focus:border-brand-600"
              />
            </div>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              aria-label="Estado"
              className="h-10 px-3 text-sm rounded-xl border outline-none border-brand-200 bg-white text-brand-800 focus:border-brand-600"
            >
              <option value="Todos">Todos los estados</option>
              <option>Activo</option>
              <option>Inactivo</option>
            </select>
            <Button onClick={onNew} className="ml-auto h-10 py-0">
              <Plus size={16} /> Nuevo producto
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-6">
            {[{ id: 'all', name: 'Todas' }, ...categories].map((c) => (
              <button
                key={c.id}
                onClick={() => setCatId(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  catId === c.id
                    ? 'bg-brand-600 text-white border-brand-600'
                    : 'bg-white text-brand-600 border-brand-200 hover:border-brand-400'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border overflow-hidden border-brand-150">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-brand-50">
                  {['Producto', 'Categoría', 'Precio', 'Tallas', 'Stock', 'Proveedor', 'Estado', ''].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-600"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-50">
                {pager.pageItems.map((p) => {
                  const tallas = Object.keys(p.stock);
                  const stock = totalStock(p);
                  return (
                    <tr
                      key={p.id}
                      onClick={() => onEdit(p.id)}
                      className="transition-colors cursor-pointer hover:bg-brand-25"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-brand-200">
                            {p.img && <img src={p.img} alt={p.name} className="w-full h-full object-cover" />}
                          </div>
                          <span className="font-medium text-brand-800">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs px-2 py-1 rounded-full font-medium bg-brand-200 text-brand-800">
                          {catName(p.catId)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-brand-800 font-mono">
                        ${p.precio.toLocaleString('es-CO')}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex gap-1 flex-wrap">
                          {tallas.slice(0, 3).map((t) => (
                            <span
                              key={t}
                              className="text-[10px] px-1.5 py-0.5 rounded border font-medium border-brand-400 text-brand-600"
                            >
                              {t}
                            </span>
                          ))}
                          {tallas.length > 3 && (
                            <span className="text-[10px] text-brand-400">+{tallas.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`font-bold text-sm ${
                            stock === 0 ? 'text-danger' : stock <= stockBajoProducto ? 'text-warning' : 'text-success-dark'
                          }`}
                        >
                          {stock}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-brand-600">{supplierName(p.proveedorId)}</td>
                      <td className="px-5 py-3.5">
                        <StatusToggle
                          value={p.estado}
                          label={p.name}
                          onChange={(estado) => update(p.id, { estado })}
                        />
                      </td>
                      <td className="px-5 py-3.5">
                        <RowActions label={p.name} onEdit={() => onEdit(p.id)} onDelete={() => setDeleting(p)} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <p className="px-5 py-10 text-center text-sm text-brand-400">No hay productos que coincidan.</p>
            )}
            <Pagination pager={pager} label="productos" />
          </div>
        </>
      )}

      {deleting && (
        <ConfirmDialog
          title="Eliminar producto"
          message={`¿Eliminar ${deleting.name}? Esta acción no se puede deshacer.`}
          onCancel={() => setDeleting(null)}
          onConfirm={() => {
            remove(deleting.id);
            setDeleting(null);
          }}
        />
      )}
    </div>
  );
}
