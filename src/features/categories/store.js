import createApiStore from '@/shared/lib/createApiStore';

// A category not loaded yet counts as active, so screens don't hide products while the list arrives
export const isActiveCategory = (c) => c?.activo !== false;

/** Categories from the API: { id, nombre, descripcion, activo, productos, productosActivos } */
const useCategories = createApiStore('/api/categorias', {
  sort: (a, b) => a.nombre.localeCompare(b.nombre, 'es'),
});

export default useCategories;
