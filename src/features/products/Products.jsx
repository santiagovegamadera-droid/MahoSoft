import { useState } from 'react';
import { Plus } from 'lucide-react';
import useProducts, { totalStock } from '@/features/products/store';
import { useCategories } from '@/features/categories/store';
import useSuppliers from '@/features/suppliers/store';
import ConfirmDialog from '@/shared/components/ConfirmDialog';
import { Button, RowActions } from '@/shared/components/Form';

export default function Products({ onEdit, onNew }) {
  const { items: products, remove } = useProducts();
  const { items: categories } = useCategories();
  const { items: suppliers } = useSuppliers();
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

  return (
    <div className="p-8">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar producto..."
          className="px-4 py-2.5 text-sm rounded-xl border outline-none border-brand-200 bg-white text-brand-800 w-55 focus:border-brand-600"
        />
        <div className="flex gap-1 flex-wrap">
          {[{ id: 'all', name: 'Todas' }, ...categories].map((c) => (
            <button
              key={c.id}
              onClick={() => setCatId(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                catId === c.id ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-brand-600 border-brand-200'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
        <div className="ml-auto flex gap-2">
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border outline-none border-brand-200 bg-white text-brand-800"
          >
            <option value="Todos">Todos los estados</option>
            <option>Activo</option>
            <option>Inactivo</option>
          </select>
          <Button onClick={onNew}>
            <Plus size={16} /> Nuevo producto
          </Button>
        </div>
      </div>

      {/* Summary pills */}
      <div className="flex gap-3 mb-5">
        {[
          { label: 'Total productos', val: products.length },
          {
            label: 'Stock bajo',
            val: products.filter((p) => totalStock(p) > 0 && totalStock(p) <= 5).length,
            warn: true,
          },
          { label: 'Agotados', val: products.filter((p) => totalStock(p) === 0).length, danger: true },
          { label: 'Inactivos', val: products.filter((p) => p.estado === 'Inactivo').length },
        ].map((s) => (
          <div
            key={s.label}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 ${
              s.danger ? 'bg-danger-soft' : s.warn ? 'bg-warning-soft' : 'bg-brand-200'
            }`}
          >
            <span
              className={`text-lg font-bold ${s.danger ? 'text-danger' : s.warn ? 'text-warning' : 'text-brand-800'}`}
            >
              {s.val}
            </span>
            <span className={`text-xs ${s.danger ? 'text-danger' : s.warn ? 'text-warning' : 'text-brand-600'}`}>
              {s.label}
            </span>
          </div>
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
            {filtered.map((p) => {
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
                      {tallas.length > 3 && <span className="text-[10px] text-brand-400">+{tallas.length - 3}</span>}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`font-bold text-sm ${
                        stock === 0 ? 'text-danger' : stock <= 5 ? 'text-warning' : 'text-success-dark'
                      }`}
                    >
                      {stock}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-brand-600">{supplierName(p.proveedorId)}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                        p.estado === 'Activo' ? 'bg-success-soft text-success' : 'bg-muted-soft text-muted'
                      }`}
                    >
                      {p.estado}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <RowActions label={p.name} onEdit={() => onEdit(p.id)} onDelete={() => setDeleting(p)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="px-5 py-3 border-t border-brand-50">
          <p className="text-xs text-brand-400">
            Mostrando {filtered.length} de {products.length} productos
          </p>
        </div>
      </div>

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
