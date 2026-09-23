import { useState } from 'react';
import { Plus } from 'lucide-react';
import useSuppliers from '@/features/suppliers/store';
import { useCategories } from '@/features/categories/store';
import useProducts from '@/features/products/store';
import Modal from '@/shared/components/Modal';
import ConfirmDialog from '@/shared/components/ConfirmDialog';
import { Button, CheckboxList, Field, RowActions, inputClass } from '@/shared/components/Form';

const emptySupplier = { name: '', contacto: '', email: '', tel: '', ciudad: '', categorias: [], estado: 'Activo' };

function SupplierForm({ supplier, categories, onSave, onClose }) {
  const [form, setForm] = useState(supplier ?? emptySupplier);
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  // CheckboxList works with names; the store keeps category ids
  const nameOf = (id) => categories.find((c) => c.id === id)?.name;
  const idOf = (name) => categories.find((c) => c.name === name)?.id;

  function submit(e) {
    e.preventDefault();
    if (!form.name.trim()) return setError('El nombre es obligatorio');
    onSave({ ...form, name: form.name.trim() });
  }

  return (
    <Modal
      title={supplier ? 'Editar proveedor' : 'Nuevo proveedor'}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="supplier-form">
            Guardar
          </Button>
        </>
      }
    >
      <form id="supplier-form" onSubmit={submit} className="space-y-4">
        <Field label="Empresa" error={error}>
          <input value={form.name} onChange={set('name')} className={inputClass} autoFocus />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Contacto">
            <input value={form.contacto} onChange={set('contacto')} className={inputClass} />
          </Field>
          <Field label="Teléfono">
            <input value={form.tel} onChange={set('tel')} className={inputClass} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Email">
            <input type="email" value={form.email} onChange={set('email')} className={inputClass} />
          </Field>
          <Field label="Ciudad">
            <input value={form.ciudad} onChange={set('ciudad')} className={inputClass} />
          </Field>
        </div>
        <Field label="Categorías que surte" group>
          <CheckboxList
            options={categories.map((c) => c.name)}
            value={form.categorias.map(nameOf).filter(Boolean)}
            onChange={(names) => setForm((f) => ({ ...f, categorias: names.map(idOf) }))}
          />
        </Field>
        <Field label="Estado">
          <select value={form.estado} onChange={set('estado')} className={inputClass}>
            <option>Activo</option>
            <option>Inactivo</option>
          </select>
        </Field>
      </form>
    </Modal>
  );
}

export default function Suppliers() {
  const { items: suppliers, create, update, remove } = useSuppliers();
  const { items: categories } = useCategories();
  const { items: products, update: updateProduct } = useProducts();
  const [editing, setEditing] = useState(null); // null | 'new' | supplier
  const [deleting, setDeleting] = useState(null);

  const productCount = (s) => products.filter((p) => p.proveedorId === s.id).length;

  function save(data) {
    if (editing === 'new') create(data);
    else update(editing.id, data);
    setEditing(null);
  }

  function confirmDelete() {
    products.filter((p) => p.proveedorId === deleting.id).forEach((p) => updateProduct(p.id, { proveedorId: null }));
    remove(deleting.id);
    setDeleting(null);
  }

  return (
    <div className="p-8">
      <div className="flex justify-end items-center mb-5">
        <Button onClick={() => setEditing('new')}>
          <Plus size={16} /> Nuevo proveedor
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total proveedores', val: suppliers.length },
          { label: 'Activos', val: suppliers.filter((s) => s.estado === 'Activo').length },
          { label: 'Productos surtidos', val: products.filter((p) => p.proveedorId).length },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-2xl p-5 border border-brand-150">
            <p className="text-xs uppercase tracking-wide mb-1 text-brand-600">{k.label}</p>
            <p className="text-2xl font-bold text-brand-800">{k.val}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden border-brand-150">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-brand-50">
              {['Proveedor', 'Contacto', 'Ciudad', 'Categorías', 'Productos', 'Estado', ''].map((h) => (
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
            {suppliers.map((s) => (
              <tr key={s.id} className="transition-colors hover:bg-brand-25">
                <td className="px-5 py-3.5">
                  <p className="font-semibold text-brand-800">{s.name}</p>
                  <p className="text-xs text-brand-400">{s.email}</p>
                </td>
                <td className="px-5 py-3.5">
                  <p className="text-sm text-brand-800">{s.contacto}</p>
                  <p className="text-xs text-brand-400">{s.tel}</p>
                </td>
                <td className="px-5 py-3.5 text-xs text-brand-600">{s.ciudad}</td>
                <td className="px-5 py-3.5">
                  <div className="flex flex-wrap gap-1">
                    {s.categorias.map((id) => {
                      const cat = categories.find((c) => c.id === id);
                      return (
                        cat && (
                          <span key={id} className="text-[10px] px-1.5 py-0.5 rounded bg-brand-200 text-brand-800">
                            {cat.name}
                          </span>
                        )
                      );
                    })}
                  </div>
                </td>
                <td className="px-5 py-3.5 font-semibold text-brand-800">{productCount(s)}</td>
                <td className="px-5 py-3.5">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                      s.estado === 'Activo' ? 'bg-success-soft text-success' : 'bg-muted-soft text-muted'
                    }`}
                  >
                    {s.estado}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <RowActions label={s.name} onEdit={() => setEditing(s)} onDelete={() => setDeleting(s)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {suppliers.length === 0 && <p className="px-5 py-10 text-center text-sm text-brand-400">No hay proveedores.</p>}
      </div>

      {editing && (
        <SupplierForm
          supplier={editing === 'new' ? null : editing}
          categories={categories}
          onSave={save}
          onClose={() => setEditing(null)}
        />
      )}
      {deleting && (
        <ConfirmDialog
          title="Eliminar proveedor"
          message={
            productCount(deleting) > 0
              ? `¿Eliminar a ${deleting.name}? Sus ${productCount(deleting)} productos quedarán sin proveedor.`
              : `¿Eliminar a ${deleting.name}?`
          }
          onCancel={() => setDeleting(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
