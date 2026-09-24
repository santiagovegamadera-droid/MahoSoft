import { useState } from 'react';
import { Plus, Shirt } from 'lucide-react';

// Shows the product photo, or a placeholder when there is none or it fails to load
export function ProductImage({ src, alt, className = '' }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className={`flex items-center justify-center bg-brand-100 text-brand-300 ${className}`}>
        <Shirt size={22} strokeWidth={1.5} />
      </div>
    );
  }
  return <img src={src} alt={alt} onError={() => setFailed(true)} className={`object-cover ${className}`} />;
}

export default function ProductCard({ product, category, price, stockLeft, inCartQty, sizes, onAdd }) {
  const soldOut = stockLeft === 0 && inCartQty === 0;
  const lowStock = !soldOut && stockLeft <= 3;

  return (
    <div
      className={`group flex flex-col rounded-xl border bg-white overflow-hidden transition-all ${
        soldOut
          ? 'border-brand-150 opacity-60'
          : inCartQty
            ? 'border-brand-600 ring-2 ring-brand-200'
            : 'border-brand-150 hover:border-brand-300 hover:shadow-md'
      }`}
    >
      <button
        type="button"
        onClick={() => onAdd()}
        disabled={stockLeft === 0}
        className="relative text-left disabled:cursor-not-allowed"
        aria-label={`Agregar ${product.name}`}
      >
        <ProductImage src={product.img} alt={product.name} className="w-full h-24" />

        <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-white/90 text-brand-700 backdrop-blur">
          {category}
        </span>

        {inCartQty > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-5 h-5 px-1 rounded-full flex items-center justify-center text-[10px] font-bold text-white bg-brand-800 shadow">
            {inCartQty}
          </span>
        )}

        {soldOut ? (
          <span className="absolute inset-x-0 bottom-0 py-1 text-center text-[10px] font-bold uppercase tracking-wider text-white bg-brand-900/70">
            Agotado
          </span>
        ) : (
          stockLeft > 0 && (
            <span className="absolute bottom-1.5 right-1.5 w-7 h-7 rounded-full flex items-center justify-center text-white bg-brand-800 shadow-md opacity-0 translate-y-1 transition-all group-hover:opacity-100 group-hover:translate-y-0">
              <Plus size={14} />
            </span>
          )
        )}
      </button>

      <div className="flex flex-col gap-1.5 p-2 flex-1">
        <p className="text-xs font-semibold leading-tight text-brand-800 line-clamp-2">{product.name}</p>

        <div className="flex items-end justify-between gap-2 mt-auto">
          <p className="text-xs font-bold text-brand-800 font-mono">{price}</p>
          {!soldOut && (
            <p className={`text-[10px] font-medium ${lowStock ? 'text-warning' : 'text-brand-400'}`}>
              {lowStock ? `Quedan ${stockLeft}` : `${stockLeft} disp.`}
            </p>
          )}
        </div>

        {sizes.length > 0 && (
          <div className="flex flex-wrap gap-0.5">
            {sizes.map(({ talla, left }) => (
              <button
                key={talla}
                type="button"
                onClick={() => onAdd(talla)}
                disabled={left === 0}
                title={left === 0 ? 'Sin unidades' : `Agregar talla ${talla}`}
                className="min-w-6 px-1 py-0.5 rounded border text-[10px] font-semibold transition-colors border-brand-150 text-brand-600 enabled:hover:bg-brand-800 enabled:hover:border-brand-800 enabled:hover:text-white disabled:text-brand-200 disabled:line-through disabled:cursor-not-allowed"
              >
                {talla}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
