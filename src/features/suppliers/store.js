import createApiStore from '@/shared/lib/createApiStore';

/**
 * Suppliers from the API: { id, nombre, tipoDocumento, documento, direccion, ciudad, telefono, email, contacto,
 * ivaPorcentaje, activo, compras, productos, categorias: [{ id, nombre }] }. compras, productos and categorias
 * (what it supplies) come from its purchases.
 */
const useSuppliers = createApiStore('/api/proveedores', {
  sort: (a, b) => a.nombre.localeCompare(b.nombre, 'es'),
});

export default useSuppliers;
