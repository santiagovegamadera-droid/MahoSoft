// Totals for a sale from its items and discount percentage (same math as the POS summary)
export default function saleTotals({ items, descuento }) {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const descuentoAmt = Math.round((subtotal * descuento) / 100);
  const total = subtotal - descuentoAmt;
  const iva = Math.round(total * 0.19);
  return { subtotal, descuentoAmt, total, iva };
}
