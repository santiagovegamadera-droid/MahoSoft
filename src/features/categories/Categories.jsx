import { useState } from 'react';
import { Plus, Tags } from 'lucide-react';
import useCategories, { isActiveCategory } from '@/features/categories/store';
import useProducts from '@/features/products/store';
import Modal from '@/shared/components/Modal';
import ConfirmDialog from '@/shared/components/ConfirmDialog';
import { Button, Field, RowActions, StatusToggle, inputClass } from '@/shared/components/Form';
import usePagination from '@/shared/lib/usePagination';
import Pagination from '@/shared/components/Pagination';
import { EmptyState, Table, TableCard } from '@/shared/components/Table';
import { Toolbar } from '@/shared/components/Toolbar';

const emptyCategory = { name: '', descripcion: '', estado: 'Activo' };

function CategoryForm({ category, onSave, onClose }) {
  const [form, setForm] = useState(category ? { estado: 'Activo', ...category } : emptyCategory);
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function submit(e) {
    e.preventDefault();
    if (!form.name.trim()) return setError('El nombre es obligatorio');
    onSave({ ...form, name: form.name.trim() });
  }

  return (
    <Modal
      title={category ? 'Editar categoría' : 'Nueva categoría'}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="category-form">
            Guardar
          </Button>
        </>
      }
    >
      <form id="category-form" onSubmit={submit} className="space-y-4">
        <Field label="Nombre" error={error}>
          <input value={form.name} onChange={set('name')} className={inputClass} autoFocus />
        </Field>
        <Field label="Descripción">
          <textarea
            rows={2}
            value={form.descripcion}
            onChange={set('descripcion')}
            className={`${inputClass} resize-none`}
          />
        </Field>
        <Field label="Estado" group>
          <StatusToggle value={form.estado} onChange={(estado) => setForm((f) => ({ ...f, estado }))} />
        </Field>
      </form>
    </Modal>
  );
}

export default function Categories() {
  const { items: categories, create, update, remove } = useCategories();
  const { items: products } = useProducts();
  const [editing, setEditing] = useState(null); // null | 'new' | category
  const [deleting, setDeleting] = useState(null);

  const categoryProducts = (cat) => products.filter((p) => p.catId === cat.id);
  const pager = usePagination(categories);

  function save(data) {
    if (editing === 'new') create(data);
    else update(editing.id, data);
    setEditing(null);
  }

  // A category can't be removed while products still belong to it
  const blocked = deleting && categoryProducts(deleting).length > 0;

  return (
    <div className="p-6">
      <Toolbar>
        <Button onClick={() => setEditing('new')} className="ml-auto">
          <Plus size={16} /> Nueva categoría
        </Button>
      </Toolbar>

      <TableCard>
        <Table columns={['Categoría', 'Productos', 'Activos', 'Inactivos', 'Estado', '']}>
          {pager.pageItems.map((cat) => {
            const catProducts = categoryProducts(cat);
            const activos = catProducts.filter((p) => p.estado === 'Activo').length;
            const inactivos = catProducts.length - activos;
            return (
              <tr key={cat.id} className="transition-colors hover:bg-brand-25">
                <td className="px-4 py-2.5">
                  <p className="font-medium text-brand-800">{cat.name}</p>
                  <p className="max-w-md text-xs truncate text-subtle" title={cat.descripcion}>
                    {cat.descripcion || 'Sin descripción'}
                  </p>
                </td>
                <td className="px-4 py-2.5 font-semibold text-brand-800">{catProducts.length}</td>
                <td className={`px-4 py-2.5 font-semibold ${activos > 0 ? 'text-success' : 'text-subtle'}`}>{activos}</td>
                <td className={`px-4 py-2.5 font-semibold ${inactivos > 0 ? 'text-danger' : 'text-subtle'}`}>
                  {inactivos}
                </td>
                <td className="px-4 py-2.5">
                  <StatusToggle
                    value={isActiveCategory(cat) ? 'Activo' : 'Inactivo'}
                    label={cat.name}
                    onChange={(estado) => update(cat.id, { estado })}
                  />
                </td>
                <td className="px-4 py-2.5">
                  <RowActions label={cat.name} onEdit={() => setEditing(cat)} onDelete={() => setDeleting(cat)} />
                </td>
              </tr>
            );
          })}
        </Table>
        {categories.length === 0 && <EmptyState icon={Tags} message="No hay categorías." />}
        <Pagination pager={pager} label="categorías" />
      </TableCard>

      {editing && (
        <CategoryForm category={editing === 'new' ? null : editing} onSave={save} onClose={() => setEditing(null)} />
      )}

      {deleting &&
        (blocked ? (
          <Modal
            title="No se puede eliminar"
            onClose={() => setDeleting(null)}
            footer={<Button onClick={() => setDeleting(null)}>Entendido</Button>}
          >
            <p className="text-sm text-brand-600">
              La categoría {deleting.name} tiene {categoryProducts(deleting).length} productos. Muévelos a otra
              categoría antes de eliminarla.
            </p>
          </Modal>
        ) : (
          <ConfirmDialog
            title="Eliminar categoría"
            message={`¿Eliminar ${deleting.name}?`}
            onCancel={() => setDeleting(null)}
            onConfirm={() => {
              remove(deleting.id);
              setDeleting(null);
            }}
          />
        ))}
    </div>
  );
}
