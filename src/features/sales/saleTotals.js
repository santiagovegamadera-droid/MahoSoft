// Totals for a sale from its items, discount percentage and shipping (same math as the POS summary)
export default function saleTotals({ items, descuento, envio = 0 }) {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const descuentoAmt = Math.round((subtotal * descuento) / 100);
  const total = subtotal - descuentoAmt + envio;
  return { subtotal, descuentoAmt, envio, total };
}
