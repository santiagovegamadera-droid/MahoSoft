import { sortSizes, totalStock } from '@/features/products/store';
import useSettings from '@/features/settings/store';
import usePagination from '@/shared/lib/usePagination';
import Pagination from '@/shared/components/Pagination';

export default function StockOverview({ products, catName }) {
  const { stockBajoTalla, tallas } = useSettings();
  // Only show size columns that some product uses, in the configured size order
  const usedSizes = sortSizes(products.flatMap((p) => Object.keys(p.stock)), tallas);
  const allSizes = products.flatMap((p) => Object.values(p.stock));
  const inventoryValue = products.reduce((sum, p) => sum + totalStock(p) * (p.costo || 0), 0);
  const pager = usePagination(products);

  return (
    <>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total prendas', val: allSizes.reduce((a, b) => a + b, 0), color: 'text-brand-800' },
          {
            label: `Stock bajo (≤${stockBajoTalla})`,
            val: `${allSizes.filter((v) => v > 0 && v <= stockBajoTalla).length} tallas`,
            color: 'text-warning',
          },
          { label: 'Sin stock', val: `${allSizes.filter((v) => v === 0).length} tallas`, color: 'text-danger' },
          {
            label: 'Valor inventario (costo)',
            val: `$${inventoryValue.toLocaleString('es-CO')}`,
            color: 'text-success-dark',
          },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-2xl p-4 border border-brand-150">
            <p className="text-xs uppercase tracking-wide mb-1 text-brand-600">{k.label}</p>
            <p className={`text-2xl font-bold ${k.color}`}>{k.val}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden border-brand-150">
        <div className="px-5 py-4 border-b border-brand-50">
          <h3 className="text-sm font-semibold text-brand-800">Inventario por talla</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-50">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-600">
                  Producto
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-600">
                  Categoría
                </th>
                {usedSizes.map((t) => (
                  <th
                    key={t}
                    className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-brand-600"
                  >
                    {t}
                  </th>
                ))}
                <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-brand-600">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {pager.pageItems.map((p) => (
                <tr key={p.id} className="hover:bg-brand-25">
                  <td className="px-5 py-3 font-medium text-brand-800">{p.name}</td>
                  <td className="px-5 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-brand-200 text-brand-800">
                      {catName(p.catId)}
                    </span>
                  </td>
                  {usedSizes.map((t) => {
                    const v = p.stock[t];
                    return (
                      <td key={t} className="px-3 py-3 text-center">
                        {v !== undefined ? (
                          <span
                            className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold ${
                              v === 0
                                ? 'bg-danger-soft text-danger'
                                : v <= stockBajoTalla
                                  ? 'bg-warning-soft text-warning'
                                  : 'bg-brand-200 text-brand-800'
                            }`}
                          >
                            {v}
                          </span>
                        ) : (
                          <span className="text-brand-150">—</span>
                        )}
                      </td>
                    );
                  })}
                  <td className="px-5 py-3 text-center">
                    <span className="font-bold text-sm text-brand-800">{totalStock(p)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination pager={pager} label="productos" />
      </div>
    </>
  );
}
