import { useState } from 'react';
import { Loader2, Plus, Tags } from 'lucide-react';
import useCategories from '@/features/categories/store';
import Modal from '@/shared/components/Modal';
import ConfirmDialog from '@/shared/components/ConfirmDialog';
import { ErrorAlert, LoadingState } from '@/shared/components/Feedback';
import { Button, Field, RowActions, StatusToggle, inputClass } from '@/shared/components/Form';
import usePagination from '@/shared/lib/usePagination';
import Pagination from '@/shared/components/Pagination';
import { EmptyState, Table, TableCard } from '@/shared/components/Table';
import { Toolbar } from '@/shared/components/Toolbar';

const emptyCategory = { nombre: '', descripcion: '', activo: true };
const toRequest = (c) => ({ nombre: c.nombre, descripcion: c.descripcion ?? '', activo: c.activo });
const estadoOf = (activo) => (activo ? 'Activo' : 'Inactivo');

function CategoryForm({ category, onSave, onClose }) {
  const [form, setForm] = useState(category ? toRequest(category) : emptyCategory);
  const [error, setError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    if (!form.nombre.trim()) return setError('El nombre es obligatorio');
    setError('');
    setSaveError('');
    setSaving(true);
    try {
      await onSave({ ...form, nombre: form.nombre.trim() });
    } catch (err) {
      setSaveError(err.message);
      setSaving(false);
    }
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
          <Button type="submit" form="category-form" disabled={saving}>
            {saving && <Loader2 size={16} className="animate-spin" />}
            {saving ? 'Guardando…' : 'Guardar'}
          </Button>
        </>
      }
    >
      <form id="category-form" onSubmit={submit} className="space-y-4">
        <Field label="Nombre" error={error}>
          <input value={form.nombre} onChange={set('nombre')} maxLength={100} className={inputClass} autoFocus />
        </Field>
        <Field label="Descripción">
          <textarea
            rows={2}
            value={form.descripcion}
            onChange={set('descripcion')}
            maxLength={500}
            className={`${inputClass} resize-none`}
          />
        </Field>
        <Field label="Estado" group>
          <StatusToggle
            value={estadoOf(form.activo)}
            onChange={(estado) => setForm((f) => ({ ...f, activo: estado === 'Activo' }))}
          />
        </Field>
        <ErrorAlert message={saveError} />
      </form>
    </Modal>
  );
}

export default function Categories() {
  const { items: categories, loaded, loading, error, reload, create, update, remove } = useCategories();
  const [editing, setEditing] = useState(null); // null | 'new' | category
  const [deleting, setDeleting] = useState(null);
  const [actionError, setActionError] = useState('');

  const pager = usePagination(categories);

  async function save(data) {
    if (editing === 'new') await create(data);
    else await update(editing.id, data);
    setEditing(null);
  }

  // Row actions (toggle, delete) report failures above the table
  async function run(action) {
    setActionError('');
    try {
      await action();
    } catch (err) {
      setActionError(err.message);
    }
  }

  const toggle = (cat, estado) => run(() => update(cat.id, { ...toRequest(cat), activo: estado === 'Activo' }));

  function confirmDelete() {
    const cat = deleting;
    setDeleting(null);
    run(() => remove(cat.id));
  }

  return (
    <div className="p-6">
      <Toolbar>
        <Button onClick={() => setEditing('new')} className="ml-auto">
          <Plus size={16} /> Nueva categoría
        </Button>
      </Toolbar>

      <ErrorAlert message={error} onRetry={reload} className="mb-4" />
      <ErrorAlert message={actionError} className="mb-4" />

      <TableCard>
        <Table columns={['Categoría', 'Productos', 'Activos', 'Inactivos', 'Estado', '']}>
          {pager.pageItems.map((cat) => {
            const inactivos = cat.productos - cat.productosActivos;
            return (
              <tr key={cat.id} className="transition-colors hover:bg-brand-25">
                <td className="px-4 py-2.5">
                  <p className="font-medium text-brand-800">{cat.nombre}</p>
                  <p className="max-w-md text-xs truncate text-subtle" title={cat.descripcion ?? ''}>
                    {cat.descripcion || 'Sin descripción'}
                  </p>
                </td>
                <td className="px-4 py-2.5 font-semibold text-brand-800">{cat.productos}</td>
                <td
                  className={`px-4 py-2.5 font-semibold ${cat.productosActivos > 0 ? 'text-success' : 'text-subtle'}`}
                >
                  {cat.productosActivos}
                </td>
                <td className={`px-4 py-2.5 font-semibold ${inactivos > 0 ? 'text-danger' : 'text-subtle'}`}>
                  {inactivos}
                </td>
                <td className="px-4 py-2.5">
                  <StatusToggle
                    value={estadoOf(cat.activo)}
                    label={cat.nombre}
                    onChange={(estado) => toggle(cat, estado)}
                  />
                </td>
                <td className="px-4 py-2.5">
                  <RowActions label={cat.nombre} onEdit={() => setEditing(cat)} onDelete={() => setDeleting(cat)} />
                </td>
              </tr>
            );
          })}
        </Table>
        {!loaded && loading && <LoadingState message="Cargando categorías…" />}
        {loaded && categories.length === 0 && <EmptyState icon={Tags} message="No hay categorías." />}
        <Pagination pager={pager} label="categorías" />
      </TableCard>

      {editing && (
        <CategoryForm category={editing === 'new' ? null : editing} onSave={save} onClose={() => setEditing(null)} />
      )}

      {/* A category can't be removed while products still belong to it (the server checks it too) */}
      {deleting &&
        (deleting.productos > 0 ? (
          <Modal
            title="No se puede eliminar"
            onClose={() => setDeleting(null)}
            footer={<Button onClick={() => setDeleting(null)}>Entendido</Button>}
          >
            <p className="text-sm text-brand-600">
              La categoría {deleting.nombre} tiene {deleting.productos} productos. Muévelos a otra categoría antes de
              eliminarla, o desactívala.
            </p>
          </Modal>
        ) : (
          <ConfirmDialog
            title="Eliminar categoría"
            message={`¿Eliminar ${deleting.nombre}?`}
            onCancel={() => setDeleting(null)}
            onConfirm={confirmDelete}
          />
        ))}
    </div>
  );
}
