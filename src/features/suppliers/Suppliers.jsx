import { useState } from 'react';
import { Plus } from 'lucide-react';
import useSuppliers from '@/features/suppliers/store';
import useCategories from '@/features/categories/store';
import useProducts from '@/features/products/store';
import useSettings from '@/features/settings/store';
import Modal from '@/shared/components/Modal';
import ConfirmDialog from '@/shared/components/ConfirmDialog';
import DocumentInput, { defaultDocType, formatDocument } from '@/shared/components/DocumentInput';
import { Button, CheckboxList, Field, RowActions, StatusToggle, inputClass } from '@/shared/components/Form';
import usePagination from '@/shared/lib/usePagination';
import Pagination from '@/shared/components/Pagination';

const emptySupplier = {
  name: '',
  tipoDocumento: '',
  documento: '',
  contacto: '',
  email: '',
  tel: '',
  ciudad: '',
  categorias: [],
  estado: 'Activo',
};

function SupplierForm({ supplier, suppliers, categories, onSave, onClose }) {
  const { tiposDocumento } = useSettings();
  const initial = supplier ?? emptySupplier;
  // Suppliers are usually companies, so new ones start on NIT
  const [form, setForm] = useState({
    ...emptySupplier,
    ...initial,
    tipoDocumento: initial.tipoDocumento || defaultDocType(tiposDocumento, 'NIT'),
  });
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  // CheckboxList works with names; the store keeps category ids
  const nameOf = (id) => categories.find((c) => c.id === id)?.name;
  const idOf = (name) => categories.find((c) => c.name === name)?.id;

  function submit(e) {
    e.preventDefault();
    const documento = form.documento.trim();
    const errs = {};
    if (!form.name.trim()) errs.name = 'El nombre es obligatorio';
    if (!documento) errs.documento = 'El documento es obligatorio';
    else if (
      suppliers.some(
        (s) => s.id !== supplier?.id && s.tipoDocumento === form.tipoDocumento && s.documento === documento,
      )
    )
      errs.documento = 'Ya existe un proveedor con este documento';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    onSave({ ...form, name: form.name.trim(), documento });
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
        <Field label="Empresa" error={errors.name}>
          <input value={form.name} onChange={set('name')} className={inputClass} autoFocus />
        </Field>
        <Field label="Documento" error={errors.documento} group>
          <DocumentInput
            types={tiposDocumento}
            tipo={form.tipoDocumento}
            numero={form.documento}
            onTipoChange={(tipoDocumento) => setForm((f) => ({ ...f, tipoDocumento }))}
            onNumeroChange={(documento) => setForm((f) => ({ ...f, documento }))}
          />
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
        <Field label="Estado" group>
          <StatusToggle value={form.estado} onChange={(estado) => setForm((f) => ({ ...f, estado }))} />
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
  const pager = usePagination(suppliers);

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

      <div className="bg-white rounded-2xl border overflow-hidden border-brand-150">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-brand-50">
              {['Proveedor', 'Documento', 'Contacto', 'Ciudad', 'Categorías', 'Productos', 'Estado', ''].map((h) => (
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
            {pager.pageItems.map((s) => (
              <tr key={s.id} className="transition-colors hover:bg-brand-25">
                <td className="px-5 py-3.5">
                  <p className="font-semibold text-brand-800">{s.name}</p>
                  <p className="text-xs text-brand-400">{s.email}</p>
                </td>
                <td className="px-5 py-3.5 text-xs font-mono text-brand-600">
                  {formatDocument(s.tipoDocumento, s.documento) || <span className="font-sans text-brand-400">—</span>}
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
                  <StatusToggle value={s.estado} label={s.name} onChange={(estado) => update(s.id, { estado })} />
                </td>
                <td className="px-5 py-3.5">
                  <RowActions label={s.name} onEdit={() => setEditing(s)} onDelete={() => setDeleting(s)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {suppliers.length === 0 && <p className="px-5 py-10 text-center text-sm text-brand-400">No hay proveedores.</p>}
        <Pagination pager={pager} label="proveedores" />
      </div>

      {editing && (
        <SupplierForm
          supplier={editing === 'new' ? null : editing}
          suppliers={suppliers}
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
