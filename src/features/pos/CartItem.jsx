import { Minus, Plus, Trash2 } from 'lucide-react';
import ProductImage from '@/shared/components/ProductImage';

export default function CartItem({ item, total, sizeOptions, maxQty, onQty, onSize, onRemove }) {
  return (
    <div className="flex gap-2 p-2 rounded-xl border border-brand-100 bg-brand-25">
      <ProductImage src={item.img} alt={item.name} className="w-10 h-10 rounded-lg shrink-0" />

      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-semibold leading-tight text-brand-800 line-clamp-2">{item.name}</p>
          <button
            onClick={onRemove}
            className="shrink-0 p-1 -m-1 rounded-md text-subtle hover:text-danger hover:bg-danger-soft transition-colors"
            aria-label="Quitar"
          >
            <Trash2 size={14} />
          </button>
        </div>

        <div className="flex items-center justify-between gap-2">
          <select
            value={item.talla}
            onChange={(e) => onSize(e.target.value)}
            className="text-xs font-semibold rounded-md border px-1 py-0.5 outline-none bg-white border-brand-150 text-brand-600 focus:border-brand-600"
            aria-label="Talla"
          >
            {sizeOptions.map(({ talla, left }) => (
              <option key={talla} value={talla}>
                Talla {talla} ({left})
              </option>
            ))}
          </select>

          <div className="flex items-center rounded-lg border border-brand-150 bg-white">
            <button
              onClick={() => onQty(-1)}
              disabled={item.qty <= 1}
              className="w-5 h-5 flex items-center justify-center text-brand-600 disabled:text-brand-200"
              aria-label="Restar"
            >
              <Minus size={12} />
            </button>
            <span className="w-5 text-center text-xs font-bold text-brand-800">{item.qty}</span>
            <button
              onClick={() => onQty(1)}
              disabled={item.qty >= maxQty}
              className="w-5 h-5 flex items-center justify-center text-brand-600 disabled:text-brand-200"
              aria-label="Sumar"
            >
              <Plus size={12} />
            </button>
          </div>
        </div>

        <p className="text-xs font-bold text-right text-brand-800 font-mono">{total}</p>
      </div>
    </div>
  );
}
