import createApiStore from '@/shared/lib/createApiStore';
import { api } from '@/shared/lib/api';

// Sizes in the order configured in Settings (`tallas` groups); sizes no longer configured go last
export function sortSizes(sizes, groups) {
  const order = groups.flatMap((g) => g.valores);
  const unique = [...new Set(sizes)];
  return [...order.filter((s) => unique.includes(s)), ...unique.filter((s) => !order.includes(s))];
}

/**
 * Products from the API: { id, nombre, categoriaId, precioVenta, costo, descripcion, colores,
 * stock: { talla: units }, activo, imagenId, imagenUrl, proveedores: [{ id, nombre }],
 * ultimaCompra: { numero, fecha, proveedorId, proveedor } }.
 * costo, proveedores and ultimaCompra come from purchases. Saving a different stock records an adjustment.
 */
const useProducts = createApiStore('/api/productos', {
  sort: (a, b) => a.nombre.localeCompare(b.nombre, 'es'),
});

/** Fields the API takes when saving a product */
export const toProductRequest = (p) => ({
  nombre: p.nombre,
  categoriaId: p.categoriaId,
  precioVenta: p.precioVenta,
  descripcion: p.descripcion,
  colores: p.colores,
  stock: p.stock,
  imagenId: p.imagenId,
  activo: p.activo,
});

/** Uploads a product photo; save the product with the returned id to use it. Returns { id, url } */
export function uploadProductImage(file) {
  const body = new FormData();
  body.append('archivo', file);
  return api('/api/productos/imagenes', { method: 'POST', body });
}

export const totalStock = (p) => Object.values(p.stock).reduce((a, b) => a + b, 0);

export default useProducts;
