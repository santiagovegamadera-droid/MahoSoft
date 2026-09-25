import { useState } from 'react';
import { Plus, Shirt } from 'lucide-react';
import useProducts, { totalStock } from '@/features/products/store';
import useCategories from '@/features/categories/store';
import useSuppliers from '@/features/suppliers/store';
import { lastPurchaseOf, usePurchases } from '@/features/purchases/store';
import StockOverview from '@/features/products/StockOverview';
import useSettings from '@/features/settings/store';
import ConfirmDialog from '@/shared/components/ConfirmDialog';
import { Button, RowActions, StatusToggle } from '@/shared/components/Form';
import usePagination from '@/shared/lib/usePagination';
import Pagination from '@/shared/components/Pagination';
import { ClickableRow, EmptyState, Table, TableCard } from '@/shared/components/Table';
import { FilterSelect, SearchInput, SegmentedTabs, Toolbar } from '@/shared/components/Toolbar';
import ProductImage from '@/shared/components/ProductImage';

export default function Products({ onEdit, onNew }) {
  const { items: products, update, remove } = useProducts();
  const { items: categories } = useCategories();
  const { items: suppliers } = useSuppliers();
  const { items: purchases } = usePurchases();
  const { stockBajoProducto } = useSettings();
  const [tab, setTab] = useState('productos');
  const [catId, setCatId] = useState('all');
  const [estado, setEstado] = useState('Todos');
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState(null);

  const catName = (id) => categories.find((c) => c.id === id)?.name ?? '—';
  // Who the product was last bought from, according to Compras
  const lastSupplier = (p) => {
    const last = lastPurchaseOf(purchases, p.id);
    return last && (suppliers.find((s) => s.id === last.proveedorId)?.name ?? 'Proveedor eliminado');
  };

  const filtered = products.filter(
    (p) =>
      (catId === 'all' || p.catId === catId) &&
      (estado === 'Todos' || p.estado === estado) &&
      p.name.toLowerCase().includes(search.toLowerCase()),
  );
  const pager = usePagination(filtered, `${catId}|${estado}|${search}`);

  return (
    <div className="p-6">
      <div className="mb-6">
        <SegmentedTabs
          value={tab}
          onChange={setTab}
          label="Vista"
          options={[
            ['productos', 'Productos'],
            ['stock', 'Stock actual'],
          ]}
        />
      </div>

      {tab === 'stock' && <StockOverview products={products} catName={catName} />}

      {tab === 'productos' && (
        <>
          {/* Filters */}
          <Toolbar>
            <SearchInput value={search} onChange={setSearch} placeholder="Buscar producto..." />
            <FilterSelect
              value={estado}
              onChange={setEstado}
              label="Estado"
              options={[['Todos', 'Todos los estados'], 'Activo', 'Inactivo']}
            />
            <Button onClick={onNew} className="ml-auto">
              <Plus size={16} /> Nuevo producto
            </Button>
          </Toolbar>
          <div className="flex flex-wrap gap-1.5 mb-5">
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
          <TableCard>
            <Table columns={['Producto', 'Categoría', 'Precio', 'Tallas', 'Stock', 'Último proveedor', 'Estado', '']}>
              {pager.pageItems.map((p) => {
                const tallas = Object.keys(p.stock);
                const stock = totalStock(p);
                return (
                  <ClickableRow key={p.id} onOpen={() => onEdit(p.id)}>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-3">
                        <ProductImage src={p.img} alt={p.name} className="w-9 h-9 rounded-lg shrink-0" />
                        <span className="font-medium text-brand-800">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-xs px-2 py-1 rounded-full font-medium bg-brand-200 text-brand-800">
                        {catName(p.catId)}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-semibold text-brand-800 font-mono">
                      ${p.precio.toLocaleString('es-CO')}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex gap-1 flex-wrap">
                        {tallas.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="text-xs px-1.5 py-0.5 rounded border font-medium border-brand-400 text-brand-600"
                          >
                            {t}
                          </span>
                        ))}
                        {tallas.length > 3 && <span className="text-xs text-subtle">+{tallas.length - 3}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`font-bold text-sm ${
                          stock === 0
                            ? 'text-danger'
                            : stock <= stockBajoProducto
                              ? 'text-warning'
                              : 'text-success-dark'
                        }`}
                      >
                        {stock}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-brand-600">
                      {lastSupplier(p) ?? <span className="text-subtle">Sin compras</span>}
                    </td>
                    <td className="px-4 py-2.5">
                      <StatusToggle value={p.estado} label={p.name} onChange={(estado) => update(p.id, { estado })} />
                    </td>
                    <td className="px-4 py-2.5">
                      <RowActions label={p.name} onEdit={() => onEdit(p.id)} onDelete={() => setDeleting(p)} />
                    </td>
                  </ClickableRow>
                );
              })}
            </Table>
            {filtered.length === 0 && <EmptyState icon={Shirt} message="No hay productos que coincidan." />}
            <Pagination pager={pager} label="productos" />
          </TableCard>
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
