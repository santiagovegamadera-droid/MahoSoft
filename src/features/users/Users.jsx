import { useState } from 'react';
import { KeyRound, Loader2, Pencil, Plus, UserCog } from 'lucide-react';
import useUsers, {
  PASSWORD_MIN,
  PERMISSIONS,
  ROLES,
  initials,
  resetPassword,
  useCurrentUser,
} from '@/features/users/store';
import { refreshUser } from '@/features/auth/session';
import useSettings from '@/features/settings/store';
import DocumentInput, { defaultDocType } from '@/shared/components/DocumentInput';
import { ErrorAlert, LoadingState } from '@/shared/components/Feedback';
import Modal from '@/shared/components/Modal';
import { Button, CheckboxList, Field, StatusToggle, inputClass } from '@/shared/components/Form';
import usePagination from '@/shared/lib/usePagination';
import Pagination from '@/shared/components/Pagination';
import { EmptyState, Table, TableCard } from '@/shared/components/Table';
import { FilterSelect, Toolbar } from '@/shared/components/Toolbar';

const rolColors = {
  Administradora: 'bg-brand-800 text-white',
  Vendedora: 'bg-brand-200 text-brand-800',
  Bodega: 'bg-brand-50 text-brand-600',
};

const emptyUser = {
  nombre: '',
  email: '',
  rol: 'Vendedora',
  telefono: '',
  tipoDocumento: '',
  documento: '',
  permisos: ['POS'],
  activo: true,
};

// Fields the API takes when saving (the password only when creating)
const toRequest = (u) => Object.fromEntries(Object.keys(emptyUser).map((k) => [k, u[k]]));
const estadoOf = (activo) => (activo ? 'Activo' : 'Inactivo');
const fmtAccess = (iso) =>
  iso
    ? new Date(iso).toLocaleString('es-CO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
    : 'Nunca';

function SaveButton({ saving, label = 'Guardar', form }) {
  return (
    <Button type="submit" form={form} disabled={saving}>
      {saving && <Loader2 size={16} className="animate-spin" />}
      {saving ? 'Guardando…' : label}
    </Button>
  );
}

function UserForm({ user, onSave, onClose }) {
  const { tiposDocumento } = useSettings();
  const [form, setForm] = useState(() => {
    const base = user ? toRequest(user) : emptyUser;
    return { ...base, tipoDocumento: base.tipoDocumento || defaultDocType(tiposDocumento, 'CC'), password: '' };
  });
  const [errors, setErrors] = useState({});
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    const next = {};
    if (!form.nombre.trim()) next.nombre = 'El nombre es obligatorio';
    if (!form.email.trim()) next.email = 'El email es obligatorio';
    if (!user && form.password.length < PASSWORD_MIN) next.password = `Mínimo ${PASSWORD_MIN} caracteres`;
    setErrors(next);
    if (Object.keys(next).length) return;

    setSaveError('');
    setSaving(true);
    try {
      await onSave({
        ...toRequest(form),
        nombre: form.nombre.trim(),
        email: form.email.trim(),
        telefono: form.telefono.trim(),
        documento: form.documento.trim(),
        ...(!user && { password: form.password }),
      });
    } catch (err) {
      setSaveError(err.message);
      setSaving(false);
    }
  }

  return (
    <Modal
      title={user ? 'Editar usuario' : 'Nuevo usuario'}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <SaveButton saving={saving} form="user-form" />
        </>
      }
    >
      <form id="user-form" onSubmit={submit} className="space-y-4">
        <Field label="Nombre" error={errors.nombre}>
          <input value={form.nombre} onChange={set('nombre')} maxLength={150} className={inputClass} autoFocus />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Email" error={errors.email}>
            <input type="email" value={form.email} onChange={set('email')} maxLength={256} className={inputClass} />
          </Field>
          <Field label="Teléfono">
            <input
              value={form.telefono}
              onChange={set('telefono')}
              maxLength={30}
              inputMode="tel"
              className={inputClass}
            />
          </Field>
        </div>
        <Field label="Documento" group>
          <DocumentInput
            types={tiposDocumento}
            tipo={form.tipoDocumento}
            numero={form.documento}
            onTipoChange={(tipoDocumento) => setForm((f) => ({ ...f, tipoDocumento }))}
            onNumeroChange={(documento) => setForm((f) => ({ ...f, documento }))}
          />
        </Field>
        {!user && (
          <Field label="Contraseña inicial" error={errors.password}>
            <input
              type="password"
              value={form.password}
              onChange={set('password')}
              autoComplete="new-password"
              className={inputClass}
            />
            <span className="block mt-1 text-xs text-subtle">
              Dísela al usuario; luego podrá cambiarla en Mi perfil.
            </span>
          </Field>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Rol">
            <select value={form.rol} onChange={set('rol')} className={inputClass}>
              {ROLES.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </Field>
          <Field label="Estado" group>
            <div className="py-2.5">
              <StatusToggle
                value={estadoOf(form.activo)}
                onChange={(estado) => setForm((f) => ({ ...f, activo: estado === 'Activo' }))}
              />
            </div>
          </Field>
        </div>
        <Field label="Permisos de acceso" group>
          <CheckboxList
            options={PERMISSIONS}
            value={form.permisos}
            onChange={(permisos) => setForm((f) => ({ ...f, permisos }))}
          />
        </Field>
        <ErrorAlert message={saveError} />
      </form>
    </Modal>
  );
}

/** The administrator sets a new password for someone who forgot theirs */
function ResetPassword({ user, onClose }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (password.length < PASSWORD_MIN) return setError(`La contraseña debe tener al menos ${PASSWORD_MIN} caracteres`);
    setError('');
    setSaving(true);
    try {
      await resetPassword(user.id, password);
      setDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      title="Restablecer contraseña"
      onClose={onClose}
      footer={
        done ? (
          <Button onClick={onClose}>Listo</Button>
        ) : (
          <>
            <Button variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <SaveButton saving={saving} form="reset-form" label="Guardar contraseña" />
          </>
        )
      }
    >
      {done ? (
        <p className="text-sm text-brand-600">
          Listo. Dile a {user.nombre} su nueva contraseña; podrá cambiarla en Mi perfil.
        </p>
      ) : (
        <form id="reset-form" onSubmit={submit} className="space-y-4">
          <p className="text-sm text-brand-600">Nueva contraseña para {user.nombre}.</p>
          <Field label="Nueva contraseña">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className={inputClass}
              autoFocus
            />
          </Field>
          <ErrorAlert message={error} />
        </form>
      )}
    </Modal>
  );
}

export default function Users() {
  const me = useCurrentUser();
  const { items: users, loaded, loading, error, reload, create, update } = useUsers();
  const [role, setRole] = useState('Todos');
  const [editing, setEditing] = useState(null); // null | 'new' | user
  const [resetting, setResetting] = useState(null);
  const [actionError, setActionError] = useState('');

  const filtered = users.filter((u) => role === 'Todos' || u.rol === role);
  const pager = usePagination(filtered, role);

  async function save(data) {
    if (editing === 'new') await create(data);
    else await update(editing.id, data);
    // The sidebar shows the session's name and permissions
    if (editing !== 'new' && editing.id === me.id) await refreshUser();
    setEditing(null);
  }

  async function setActivo(user, activo) {
    setActionError('');
    try {
      await update(user.id, { ...toRequest(user), activo });
    } catch (err) {
      setActionError(err.message);
    }
  }

  return (
    <div className="p-4 sm:p-6">
      <Toolbar>
        <FilterSelect value={role} onChange={setRole} label="Rol" options={[['Todos', 'Todos los roles'], ...ROLES]} />
        <Button onClick={() => setEditing('new')} className="ml-auto">
          <Plus size={16} /> Nuevo usuario
        </Button>
      </Toolbar>

      <ErrorAlert message={error} onRetry={reload} className="mb-4" />
      <ErrorAlert message={actionError} className="mb-4" />

      <TableCard>
        <Table columns={['Usuario', 'Rol', 'Permisos', 'Último acceso', 'Estado', '']}>
          {pager.pageItems.map((user) => (
            <tr key={user.id} className="transition-colors hover:bg-brand-25">
              <td className="px-4 py-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-brand-200 text-brand-800">
                    {initials(user.nombre)}
                  </div>
                  <div>
                    <p className="font-medium text-brand-800">
                      {user.nombre}
                      {user.id === me.id && <span className="ml-1.5 text-xs font-normal text-subtle">(tú)</span>}
                    </p>
                    <p className="text-xs text-subtle">{user.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-2.5">
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${rolColors[user.rol]}`}>
                  {user.rol}
                </span>
              </td>
              <td className="px-4 py-2.5">
                <div className="flex gap-1 flex-wrap">
                  {PERMISSIONS.every((p) => user.permisos.includes(p)) ? (
                    <span className="text-xs px-1.5 py-0.5 rounded border border-brand-400 text-brand-600">Todo</span>
                  ) : (
                    PERMISSIONS.filter((p) => user.permisos.includes(p)).map((p) => (
                      <span key={p} className="text-xs px-1.5 py-0.5 rounded border border-brand-400 text-brand-600">
                        {p}
                      </span>
                    ))
                  )}
                </div>
              </td>
              <td className="px-4 py-2.5 text-xs text-brand-600">{fmtAccess(user.ultimoAcceso)}</td>
              <td className="px-4 py-2.5">
                <StatusToggle
                  value={estadoOf(user.activo)}
                  label={user.nombre}
                  onChange={(estado) => setActivo(user, estado === 'Activo')}
                />
              </td>
              <td className="px-4 py-2.5">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setEditing(user)}
                    className="p-1.5 rounded-lg text-brand-600 hover:bg-brand-50 hover:text-brand-800"
                    aria-label={`Editar ${user.nombre}`}
                    title="Editar"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setResetting(user)}
                    className="p-1.5 rounded-lg text-brand-600 hover:bg-brand-50 hover:text-brand-800"
                    aria-label={`Restablecer contraseña de ${user.nombre}`}
                    title="Restablecer contraseña"
                  >
                    <KeyRound size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
        {!loaded && loading && <LoadingState message="Cargando usuarios…" />}
        {loaded && filtered.length === 0 && <EmptyState icon={UserCog} message="No hay usuarios." />}
        <Pagination pager={pager} label="usuarios" />
      </TableCard>

      {editing && <UserForm user={editing === 'new' ? null : editing} onSave={save} onClose={() => setEditing(null)} />}
      {resetting && <ResetPassword user={resetting} onClose={() => setResetting(null)} />}
    </div>
  );
}
