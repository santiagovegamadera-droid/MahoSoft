import { useSyncExternalStore } from 'react';

export const DEFAULT_SETTINGS = {
  // Store details shown on receipts; empty fields are simply left out
  nombre: 'Maho Boutique',
  nit: '',
  direccion: '',
  ciudad: '',
  telefono: '',
  correo: '',
  instagram: '',
  mensajeRecibo: 'Gracias por tu compra en Maho Boutique',
  // Point of sale
  descuentos: [0, 5, 10, 15, 20, 30],
  bancos: ['Nequi', 'Daviplata', 'Bancolombia', 'Davivienda', 'Banco de Bogotá', 'BBVA', 'Otro'],
  // Sizes a product can have, in display order; each size is a key of product.stock
  tallas: [
    { nombre: 'Letras', valores: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
    { nombre: 'Numéricas', valores: ['25', '26', '27', '28', '29', '30', '32'] },
  ],
  // Customer ID types offered in the forms
  tiposDocumento: ['CC', 'CE', 'NIT', 'TI', 'Pasaporte'],
  // Inventory alerts: a product or size at or below these units counts as low stock
  stockBajoProducto: 5,
  stockBajoTalla: 3,
};

const storageKey = 'mahosoft:settings';
const listeners = new Set();

let settings = DEFAULT_SETTINGS;
try {
  const saved = localStorage.getItem(storageKey);
  // Merge so settings added later get their default value
  if (saved) settings = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
} catch {
  // Storage unavailable or corrupt: fall back to the defaults
}

export function updateSettings(patch) {
  settings = { ...settings, ...patch };
  try {
    localStorage.setItem(storageKey, JSON.stringify(settings));
  } catch {
    // Ignore quota/privacy errors; settings still live in memory
  }
  listeners.forEach((l) => l());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
const getSnapshot = () => settings;

export default function useSettings() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
