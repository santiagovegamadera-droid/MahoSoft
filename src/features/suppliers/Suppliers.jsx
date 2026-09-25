import { useState } from 'react';
import { Plus, Truck } from 'lucide-react';
import useSuppliers from '@/features/suppliers/store';
import useCategories from '@/features/categories/store';
import { IVA_RATES, productsOfSupplier, usePurchases } from '@/features/purchases/store';
import useSettings from '@/features/settings/store';
import Modal from '@/shared/components/Modal';
import ConfirmDialog from '@/shared/components/ConfirmDialog';
import DocumentInput, { defaultDocType, formatDocument } from '@/shared/components/DocumentInput';
import { Button, CheckboxList, Field, RowActions, StatusToggle, inputClass } from '@/shared/components/Form';
import usePagination from '@/shared/lib/usePagination';
import Pagination from '@/shared/components/Pagination';
import { EmptyState, Table, TableCard } from '@/shared/components/Table';
import { SegmentedTabs, Toolbar } from '@/shared/components/Toolbar';

const emptySupplier = {
  name: '',
  tipoDocumento: '',
  documento: '',
  contacto: '',
  email: '',
  tel: '',
  direccion: '',
  ciudad: '',
  iva: 0, // rate it usually charges; purchases start from it
  categorias: [],
  estado: 'Activo',
};

const supplierIvaLabel = (rate) => (rate ? `Cobra IVA ${rate}%` : 'No cobra IVA');

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
      <form id="supplier-form" onSubmit={submit} className="space-y-5">
        {/* Same data a supplier prints at the top of its invoice */}
        <fieldset className="space-y-3">
          <legend className="mb-2 text-sm font-semibold text-brand-800">Datos de la empresa</legend>
          <Field label="Nombre o razón social" error={errors.name}>
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
          <Field label="IVA que cobra" group>
            <SegmentedTabs
              value={String(form.iva ?? 0)}
              onChange={(v) => setForm((f) => ({ ...f, iva: Number(v) }))}
              label="IVA que cobra"
              options={IVA_RATES.map((r) => [String(r), r ? `${r}%` : 'No cobra IVA'])}
            />
            <span className="block mt-1 text-xs text-subtle">
              Se usa por defecto al registrar sus compras; cada factura se puede cambiar.
            </span>
          </Field>
          <div className="grid grid-cols-[3fr_2fr] gap-3">
            <Field label="Dirección">
              <input
                value={form.direccion}
                onChange={set('direccion')}
                placeholder="Calle, número, local"
                className={inputClass}
              />
            </Field>
            <Field label="Ciudad">
              <input value={form.ciudad} onChange={set('ciudad')} className={inputClass} />
            </Field>
          </div>
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="mb-2 text-sm font-semibold text-brand-800">Contacto</legend>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Teléfono">
              <input value={form.tel} onChange={set('tel')} inputMode="tel" className={inputClass} />
            </Field>
            <Field label="Email">
              <input type="email" value={form.email} onChange={set('email')} className={inputClass} />
            </Field>
          </div>
          <Field label="Persona de contacto / vendedor">
            <input value={form.contacto} onChange={set('contacto')} className={inputClass} />
          </Field>
        </fieldset>
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
  const { items: purchases } = usePurchases();
  const [editing, setEditing] = useState(null); // null | 'new' | supplier
  const [deleting, setDeleting] = useState(null);

  // Products a supplier provides are the ones bought from it in Compras
  const productCount = (s) => productsOfSupplier(purchases, s.id).length;
  const purchaseCount = (s) => purchases.filter((p) => p.proveedorId === s.id).length;
  const pager = usePagination(suppliers);

  function save(data) {
    if (editing === 'new') create(data);
    else update(editing.id, data);
    setEditing(null);
  }

  // A supplier with purchases can't be removed: its invoices would lose who issued them
  const blocked = deleting && purchaseCount(deleting) > 0;
  function deactivate() {
    update(deleting.id, { estado: 'Inactivo' });
    setDeleting(null);
  }

  return (
    <div className="p-6">
      <Toolbar>
        <Button onClick={() => setEditing('new')} className="ml-auto">
          <Plus size={16} /> Nuevo proveedor
        </Button>
      </Toolbar>

      <TableCard>
        <Table columns={['Proveedor', 'Documento', 'Contacto', 'Ubicación', 'Categorías', 'Productos', 'Estado', '']}>
          {pager.pageItems.map((s) => (
            <tr key={s.id} className="transition-colors hover:bg-brand-25">
              <td className="px-4 py-2.5">
                <p className="font-semibold text-brand-800">{s.name}</p>
                <p className="text-xs text-subtle">{s.email}</p>
              </td>
              <td className="px-4 py-2.5 whitespace-nowrap">
                <p className="text-xs font-mono text-brand-600">
                  {formatDocument(s.tipoDocumento, s.documento) || <span className="font-sans text-subtle">—</span>}
                </p>
                <p className="text-xs text-subtle">{supplierIvaLabel(s.iva)}</p>
              </td>
              <td className="px-4 py-2.5">
                <p className="text-sm text-brand-800">{s.contacto}</p>
                <p className="text-xs text-subtle">{s.tel}</p>
              </td>
              <td className="px-4 py-2.5">
                <p className="text-xs text-brand-800">{s.ciudad || '—'}</p>
                {s.direccion && <p className="text-xs text-subtle">{s.direccion}</p>}
              </td>
              <td className="px-4 py-2.5">
                <div className="flex flex-wrap gap-1">
                  {s.categorias.map((id) => {
                    const cat = categories.find((c) => c.id === id);
                    return (
                      cat && (
                        <span key={id} className="text-xs px-1.5 py-0.5 rounded bg-brand-200 text-brand-800">
                          {cat.name}
                        </span>
                      )
                    );
                  })}
                </div>
              </td>
              <td className="px-4 py-2.5 font-semibold text-brand-800">{productCount(s)}</td>
              <td className="px-4 py-2.5">
                <StatusToggle value={s.estado} label={s.name} onChange={(estado) => update(s.id, { estado })} />
              </td>
              <td className="px-4 py-2.5">
                <RowActions label={s.name} onEdit={() => setEditing(s)} onDelete={() => setDeleting(s)} />
              </td>
            </tr>
          ))}
        </Table>
        {suppliers.length === 0 && <EmptyState icon={Truck} message="No hay proveedores." />}
        <Pagination pager={pager} label="proveedores" />
      </TableCard>

      {editing && (
        <SupplierForm
          supplier={editing === 'new' ? null : editing}
          suppliers={suppliers}
          categories={categories}
          onSave={save}
          onClose={() => setEditing(null)}
        />
      )}
      {deleting &&
        (blocked ? (
          <Modal
            title="No se puede eliminar"
            onClose={() => setDeleting(null)}
            footer={
              <>
                <Button variant="secondary" onClick={() => setDeleting(null)}>
                  Cancelar
                </Button>
                <Button onClick={deactivate}>Desactivar proveedor</Button>
              </>
            }
          >
            <p className="text-sm text-brand-600">
              {deleting.name} tiene {purchaseCount(deleting)}{' '}
              {purchaseCount(deleting) === 1 ? 'compra registrada' : 'compras registradas'}. Si lo eliminas, esas
              facturas quedarían sin proveedor. Puedes desactivarlo para que ya no aparezca al registrar compras.
            </p>
          </Modal>
        ) : (
          <ConfirmDialog
            title="Eliminar proveedor"
            message={`¿Eliminar a ${deleting.name}?`}
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
