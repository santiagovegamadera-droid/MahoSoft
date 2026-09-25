import { useState } from 'react';
import { Loader2, Plus, Truck } from 'lucide-react';
import useSuppliers from '@/features/suppliers/store';
import { IVA_RATES } from '@/features/purchases/store';
import useSettings from '@/features/settings/store';
import Modal from '@/shared/components/Modal';
import ConfirmDialog from '@/shared/components/ConfirmDialog';
import DocumentInput, { defaultDocType, formatDocument } from '@/shared/components/DocumentInput';
import { ErrorAlert, LoadingState } from '@/shared/components/Feedback';
import { Button, Field, RowActions, StatusToggle, inputClass } from '@/shared/components/Form';
import usePagination from '@/shared/lib/usePagination';
import Pagination from '@/shared/components/Pagination';
import { EmptyState, Table, TableCard } from '@/shared/components/Table';
import { SegmentedTabs, Toolbar } from '@/shared/components/Toolbar';

const emptySupplier = {
  nombre: '',
  tipoDocumento: '',
  documento: '',
  contacto: '',
  email: '',
  telefono: '',
  direccion: '',
  ciudad: '',
  ivaPorcentaje: 0, // rate it usually charges; purchases start from it
  activo: true,
};

// Fields the API takes when saving (compras, productos and categorias are computed by the server)
const toRequest = (s) => Object.fromEntries(Object.keys(emptySupplier).map((k) => [k, s[k]]));
const estadoOf = (activo) => (activo ? 'Activo' : 'Inactivo');
const supplierIvaLabel = (rate) => (rate ? `Cobra IVA ${rate}%` : 'No cobra IVA');
const comprasLabel = (n) => `${n} ${n === 1 ? 'compra registrada' : 'compras registradas'}`;

function SupplierForm({ supplier, onSave, onClose }) {
  const { tiposDocumento } = useSettings();
  const initial = supplier ? toRequest(supplier) : emptySupplier;
  // Suppliers are usually companies, so new ones start on NIT
  const [form, setForm] = useState({
    ...initial,
    tipoDocumento: initial.tipoDocumento || defaultDocType(tiposDocumento, 'NIT'),
  });
  const [errors, setErrors] = useState({});
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    const documento = form.documento.trim();
    const errs = {};
    if (!form.nombre.trim()) errs.nombre = 'El nombre es obligatorio';
    if (!documento) errs.documento = 'El documento es obligatorio';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSaveError('');
    setSaving(true);
    try {
      await onSave({ ...form, nombre: form.nombre.trim(), documento });
    } catch (err) {
      setSaveError(err.message);
      setSaving(false);
    }
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
          <Button type="submit" form="supplier-form" disabled={saving}>
            {saving && <Loader2 size={16} className="animate-spin" />}
            {saving ? 'Guardando…' : 'Guardar'}
          </Button>
        </>
      }
    >
      <form id="supplier-form" onSubmit={submit} className="space-y-5">
        {/* Same data a supplier prints at the top of its invoice */}
        <fieldset className="space-y-3">
          <legend className="mb-2 text-sm font-semibold text-brand-800">Datos de la empresa</legend>
          <Field label="Nombre o razón social" error={errors.nombre}>
            <input value={form.nombre} onChange={set('nombre')} maxLength={200} className={inputClass} autoFocus />
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
              value={String(form.ivaPorcentaje ?? 0)}
              onChange={(v) => setForm((f) => ({ ...f, ivaPorcentaje: Number(v) }))}
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
                maxLength={250}
                className={inputClass}
              />
            </Field>
            <Field label="Ciudad">
              <input value={form.ciudad} onChange={set('ciudad')} maxLength={100} className={inputClass} />
            </Field>
          </div>
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="mb-2 text-sm font-semibold text-brand-800">Contacto</legend>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Teléfono">
              <input
                value={form.telefono}
                onChange={set('telefono')}
                inputMode="tel"
                maxLength={30}
                className={inputClass}
              />
            </Field>
            <Field label="Email">
              <input type="email" value={form.email} onChange={set('email')} maxLength={256} className={inputClass} />
            </Field>
          </div>
          <Field label="Persona de contacto / vendedor">
            <input value={form.contacto} onChange={set('contacto')} maxLength={150} className={inputClass} />
          </Field>
        </fieldset>
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

export default function Suppliers() {
  const { items: suppliers, loaded, loading, error, reload, create, update, remove } = useSuppliers();
  const [editing, setEditing] = useState(null); // null | 'new' | supplier
  const [deleting, setDeleting] = useState(null);
  const [actionError, setActionError] = useState('');
  const pager = usePagination(suppliers);

  async function save(data) {
    if (editing === 'new') await create(data);
    else await update(editing.id, data);
    setEditing(null);
  }

  // Row actions (toggle, delete, deactivate) report failures above the table
  async function run(action) {
    setActionError('');
    try {
      await action();
    } catch (err) {
      setActionError(err.message);
    }
  }

  const setActivo = (s, activo) => run(() => update(s.id, { ...toRequest(s), activo }));

  function confirmDelete() {
    const s = deleting;
    setDeleting(null);
    run(() => remove(s.id));
  }

  function deactivate() {
    const s = deleting;
    setDeleting(null);
    setActivo(s, false);
  }

  return (
    <div className="p-6">
      <Toolbar>
        <Button onClick={() => setEditing('new')} className="ml-auto">
          <Plus size={16} /> Nuevo proveedor
        </Button>
      </Toolbar>

      <ErrorAlert message={error} onRetry={reload} className="mb-4" />
      <ErrorAlert message={actionError} className="mb-4" />

      <TableCard>
        <Table columns={['Proveedor', 'Documento', 'Contacto', 'Ubicación', 'Categorías', 'Productos', 'Estado', '']}>
          {pager.pageItems.map((s) => (
            <tr key={s.id} className="transition-colors hover:bg-brand-25">
              <td className="px-4 py-2.5">
                <p className="font-semibold text-brand-800">{s.nombre}</p>
                <p className="text-xs text-subtle">{s.email}</p>
              </td>
              <td className="px-4 py-2.5 whitespace-nowrap">
                <p className="text-xs font-mono text-brand-600">
                  {formatDocument(s.tipoDocumento, s.documento) || <span className="font-sans text-subtle">—</span>}
                </p>
                <p className="text-xs text-subtle">{supplierIvaLabel(s.ivaPorcentaje)}</p>
              </td>
              <td className="px-4 py-2.5">
                <p className="text-sm text-brand-800">{s.contacto}</p>
                <p className="text-xs text-subtle">{s.telefono}</p>
              </td>
              <td className="px-4 py-2.5">
                <p className="text-xs text-brand-800">{s.ciudad || '—'}</p>
                {s.direccion && <p className="text-xs text-subtle">{s.direccion}</p>}
              </td>
              <td className="px-4 py-2.5">
                {/* What it supplies: the categories of the products bought from it */}
                <div className="flex flex-wrap gap-1">
                  {s.categorias.map((c) => (
                    <span key={c.id} className="text-xs px-1.5 py-0.5 rounded bg-brand-200 text-brand-800">
                      {c.nombre}
                    </span>
                  ))}
                  {s.categorias.length === 0 && <span className="text-xs text-subtle">Sin compras</span>}
                </div>
              </td>
              <td className="px-4 py-2.5 font-semibold text-brand-800">{s.productos}</td>
              <td className="px-4 py-2.5">
                <StatusToggle
                  value={estadoOf(s.activo)}
                  label={s.nombre}
                  onChange={(estado) => setActivo(s, estado === 'Activo')}
                />
              </td>
              <td className="px-4 py-2.5">
                <RowActions label={s.nombre} onEdit={() => setEditing(s)} onDelete={() => setDeleting(s)} />
              </td>
            </tr>
          ))}
        </Table>
        {!loaded && loading && <LoadingState message="Cargando proveedores…" />}
        {loaded && suppliers.length === 0 && <EmptyState icon={Truck} message="No hay proveedores." />}
        <Pagination pager={pager} label="proveedores" />
      </TableCard>

      {editing && (
        <SupplierForm supplier={editing === 'new' ? null : editing} onSave={save} onClose={() => setEditing(null)} />
      )}
      {/* A supplier with purchases can't be removed (the server checks it too): its invoices need it */}
      {deleting &&
        (deleting.compras > 0 ? (
          <Modal
            title="No se puede eliminar"
            onClose={() => setDeleting(null)}
            footer={
              <>
                <Button variant="secondary" onClick={() => setDeleting(null)}>
                  Cancelar
                </Button>
                {deleting.activo && <Button onClick={deactivate}>Desactivar proveedor</Button>}
              </>
            }
          >
            <p className="text-sm text-brand-600">
              {deleting.nombre} tiene {comprasLabel(deleting.compras)}. Si lo eliminas, esas facturas quedarían sin
              proveedor.{' '}
              {deleting.activo
                ? 'Puedes desactivarlo para que ya no aparezca al registrar compras.'
                : 'Ya está desactivado.'}
            </p>
          </Modal>
        ) : (
          <ConfirmDialog
            title="Eliminar proveedor"
            message={`¿Eliminar a ${deleting.nombre}?`}
            onCancel={() => setDeleting(null)}
            onConfirm={confirmDelete}
          />
        ))}
    </div>
  );
}
