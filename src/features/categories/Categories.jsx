import { useState } from 'react';
import { Plus } from 'lucide-react';
import { COLLECTION_COLORS, COLLECTION_STATES, useCategories, useCollections } from '@/features/categories/store';
import useProducts from '@/features/products/store';
import Modal from '@/shared/components/Modal';
import ConfirmDialog from '@/shared/components/ConfirmDialog';
import { Button, Field, RowActions, inputClass } from '@/shared/components/Form';

const emptyCategory = { name: '', descripcion: '', temporada: '', img: '' };
const emptyCollection = { name: '', estado: 'Borrador', color: COLLECTION_COLORS[0] };

const collectionStateColors = {
  Activa: 'bg-success-soft text-success',
  Borrador: 'bg-warning-soft text-warning',
  Próximamente: 'bg-muted-soft text-muted',
};

function FormModal({ title, formId, onClose, children }) {
  return (
    <Modal
      title={title}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form={formId}>
            Guardar
          </Button>
        </>
      }
    >
      {children}
    </Modal>
  );
}

function CategoryForm({ category, onSave, onClose }) {
  const [form, setForm] = useState(category ?? emptyCategory);
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function submit(e) {
    e.preventDefault();
    if (!form.name.trim()) return setError('El nombre es obligatorio');
    onSave({ ...form, name: form.name.trim() });
  }

  return (
    <FormModal title={category ? 'Editar categoría' : 'Nueva categoría'} formId="category-form" onClose={onClose}>
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
        <Field label="Temporada">
          <input
            value={form.temporada}
            onChange={set('temporada')}
            placeholder="Ej. Verano 2026"
            className={inputClass}
          />
        </Field>
        <Field label="URL de la imagen">
          <input value={form.img} onChange={set('img')} placeholder="https://..." className={inputClass} />
        </Field>
      </form>
    </FormModal>
  );
}

function CollectionForm({ collection, onSave, onClose }) {
  const [form, setForm] = useState(collection ?? emptyCollection);
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function submit(e) {
    e.preventDefault();
    if (!form.name.trim()) return setError('El nombre es obligatorio');
    onSave({ ...form, name: form.name.trim() });
  }

  return (
    <FormModal title={collection ? 'Editar colección' : 'Nueva colección'} formId="collection-form" onClose={onClose}>
      <form id="collection-form" onSubmit={submit} className="space-y-4">
        <Field label="Nombre" error={error}>
          <input value={form.name} onChange={set('name')} className={inputClass} autoFocus />
        </Field>
        <Field label="Estado">
          <select value={form.estado} onChange={set('estado')} className={inputClass}>
            {COLLECTION_STATES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
        <Field label="Color" group>
          <div className="flex gap-2">
            {COLLECTION_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setForm((f) => ({ ...f, color: c }))}
                className={`w-9 h-9 rounded-lg border-2 ${c} ${form.color === c ? 'border-brand-900' : 'border-brand-150'}`}
                aria-label={`Color ${c}`}
                aria-pressed={form.color === c}
              />
            ))}
          </div>
        </Field>
      </form>
    </FormModal>
  );
}

export default function Categories() {
  const categoriesStore = useCategories();
  const collectionsStore = useCollections();
  const { items: products, update: updateProduct } = useProducts();
  const [tab, setTab] = useState('categorias');
  const [editing, setEditing] = useState(null); // { type, item: null | object }
  const [deleting, setDeleting] = useState(null); // { type, item }

  const categoryProducts = (cat) => products.filter((p) => p.catId === cat.id);
  const collectionProducts = (col) => products.filter((p) => p.coleccionId === col.id);
  const store = (type) => (type === 'category' ? categoriesStore : collectionsStore);

  function save(data) {
    const s = store(editing.type);
    if (editing.item) s.update(editing.item.id, data);
    else s.create(data);
    setEditing(null);
  }

  function confirmDelete() {
    const { type, item } = deleting;
    if (type === 'collection') {
      collectionProducts(item).forEach((p) => updateProduct(p.id, { coleccionId: null }));
    }
    store(type).remove(item.id);
    setDeleting(null);
  }

  // A category can't be removed while products still belong to it
  const blockedCategory = deleting?.type === 'category' && categoryProducts(deleting.item).length > 0;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-1 p-1 rounded-xl w-fit bg-brand-50">
          {[
            ['categorias', 'Categorías'],
            ['colecciones', 'Colecciones'],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === id
                  ? 'bg-white text-brand-800 shadow-[0_1px_3px_rgba(80,52,89,0.1)]'
                  : 'bg-transparent text-brand-600 shadow-none'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <Button onClick={() => setEditing({ type: tab === 'categorias' ? 'category' : 'collection', item: null })}>
          <Plus size={16} /> {tab === 'categorias' ? 'Nueva categoría' : 'Nueva colección'}
        </Button>
      </div>

      {tab === 'categorias' && (
        <div className="bg-white rounded-2xl border overflow-hidden border-brand-150">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-50">
                {['Categoría', 'Temporada', 'Productos', 'Activos', 'Inactivos', ''].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-600"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {categoriesStore.items.map((cat) => {
                const catProducts = categoryProducts(cat);
                const activos = catProducts.filter((p) => p.estado === 'Activo').length;
                return (
                  <tr key={cat.id} className="transition-colors hover:bg-brand-25">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-brand-200">
                          {cat.img && <img src={cat.img} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-brand-800">{cat.name}</p>
                          <p className="text-xs truncate text-brand-400">{cat.descripcion || 'Sin descripción'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      {cat.temporada ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-brand-200 text-brand-800">
                          {cat.temporada}
                        </span>
                      ) : (
                        <span className="text-xs text-brand-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 font-semibold text-brand-800">{catProducts.length}</td>
                    <td className="px-5 py-3 font-semibold text-success">{activos}</td>
                    <td className="px-5 py-3 font-semibold text-danger">{catProducts.length - activos}</td>
                    <td className="px-5 py-3">
                      <RowActions
                        label={cat.name}
                        onEdit={() => setEditing({ type: 'category', item: cat })}
                        onDelete={() => setDeleting({ type: 'category', item: cat })}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {categoriesStore.items.length === 0 && (
            <p className="px-5 py-10 text-center text-sm text-brand-400">No hay categorías.</p>
          )}
        </div>
      )}

      {tab === 'colecciones' && (
        <div className="space-y-3">
          {collectionsStore.items.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl border flex items-center gap-5 p-5 border-brand-150">
              <div className={`w-12 h-12 rounded-xl shrink-0 ${c.color}`} />
              <div className="flex-1">
                <p className="font-semibold text-brand-800">{c.name}</p>
                <p className="text-xs text-brand-600">{collectionProducts(c).length} productos</p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${collectionStateColors[c.estado]}`}>
                {c.estado}
              </span>
              <RowActions
                label={c.name}
                onEdit={() => setEditing({ type: 'collection', item: c })}
                onDelete={() => setDeleting({ type: 'collection', item: c })}
              />
            </div>
          ))}
          {collectionsStore.items.length === 0 && (
            <p className="py-10 text-center text-sm text-brand-400">No hay colecciones.</p>
          )}
        </div>
      )}

      {editing?.type === 'category' && (
        <CategoryForm category={editing.item} onSave={save} onClose={() => setEditing(null)} />
      )}
      {editing?.type === 'collection' && (
        <CollectionForm collection={editing.item} onSave={save} onClose={() => setEditing(null)} />
      )}

      {deleting &&
        (blockedCategory ? (
          <Modal
            title="No se puede eliminar"
            onClose={() => setDeleting(null)}
            footer={<Button onClick={() => setDeleting(null)}>Entendido</Button>}
          >
            <p className="text-sm text-brand-600">
              La categoría {deleting.item.name} tiene {categoryProducts(deleting.item).length} productos. Muévelos a
              otra categoría antes de eliminarla.
            </p>
          </Modal>
        ) : (
          <ConfirmDialog
            title={deleting.type === 'category' ? 'Eliminar categoría' : 'Eliminar colección'}
            message={
              deleting.type === 'collection' && collectionProducts(deleting.item).length > 0
                ? `¿Eliminar ${deleting.item.name}? Sus productos quedarán sin colección.`
                : `¿Eliminar ${deleting.item.name}?`
            }
            onCancel={() => setDeleting(null)}
            onConfirm={confirmDelete}
          />
        ))}
    </div>
  );
}
