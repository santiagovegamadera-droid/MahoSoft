import { useEffect, useSyncExternalStore } from 'react';
import { api } from '@/shared/lib/api';

// Values used by "Restaurar predeterminados", and shown until the API answers
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

// Settings from the API (GET /api/configuracion), shared by every screen
let state = { settings: DEFAULT_SETTINGS, loaded: false, loading: false, error: '' };
const listeners = new Set();
const setState = (patch) => {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
};

let pending = null;
function load() {
  if (pending) return pending;
  setState({ loading: true });
  pending = api('/api/configuracion')
    .then((settings) => setState({ settings, loaded: true, loading: false, error: '' }))
    .catch((e) => setState({ loading: false, error: e.message }))
    .finally(() => (pending = null));
  return pending;
}

/**
 * Saves one section (PUT /api/configuracion/<section>: negocio, pos, inventario, tallas, tipos-documento).
 * The API answers with all the settings; throws ApiError with the server's message.
 */
export async function saveSettings(section, values) {
  const settings = await api(`/api/configuracion/${section}`, { method: 'PUT', body: values });
  setState({ settings, loaded: true, error: '' });
  return settings;
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
const getSettings = () => state.settings;
const getState = () => state;

/** The settings; the first screen that asks loads them from the API */
export default function useSettings() {
  const settings = useSyncExternalStore(subscribe, getSettings, getSettings);
  useEffect(() => {
    if (!state.loaded) load();
  }, []);
  return settings;
}

/** Loading state for the Configuración screen, which always refreshes the settings when it opens */
export function useSettingsStatus() {
  const { loaded, loading, error } = useSyncExternalStore(subscribe, getState, getState);
  useEffect(() => {
    load();
  }, []);
  return { loaded, loading, error, reload: load };
}
