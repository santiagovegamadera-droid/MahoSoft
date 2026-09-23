import { useState } from 'react';
import { Plus } from 'lucide-react';
import useUsers, { PERMISSIONS, ROLES } from '@/features/users/store';
import Modal from '@/shared/components/Modal';
import ConfirmDialog from '@/shared/components/ConfirmDialog';
import { Button, CheckboxList, Field, RowActions, inputClass } from '@/shared/components/Form';

const rolColors = {
  Administradora: 'bg-brand-800 text-white',
  Vendedora: 'bg-brand-200 text-brand-800',
  Bodega: 'bg-brand-50 text-brand-600',
};

const emptyUser = {
  name: '',
  email: '',
  rol: 'Vendedora',
  permisos: ['POS'],
  estado: 'Activo',
  ultimo: '—',
};
const initials = (name) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

function UserForm({ user, onSave, onClose }) {
  const [form, setForm] = useState(() =>
    user ? { ...user, permisos: user.permisos.filter((p) => PERMISSIONS.includes(p)) } : emptyUser,
  );
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function submit(e) {
    e.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = 'El nombre es obligatorio';
    if (!form.email.trim()) next.email = 'El email es obligatorio';
    setErrors(next);
    if (Object.keys(next).length === 0) onSave({ ...form, name: form.name.trim(), email: form.email.trim() });
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
          <Button type="submit" form="user-form">
            Guardar
          </Button>
        </>
      }
    >
      <form id="user-form" onSubmit={submit} className="space-y-4">
        <Field label="Nombre" error={errors.name}>
          <input value={form.name} onChange={set('name')} className={inputClass} autoFocus />
        </Field>
        <Field label="Email" error={errors.email}>
          <input type="email" value={form.email} onChange={set('email')} className={inputClass} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Rol">
            <select value={form.rol} onChange={set('rol')} className={inputClass}>
              {ROLES.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </Field>
          <Field label="Estado">
            <select value={form.estado} onChange={set('estado')} className={inputClass}>
              <option>Activo</option>
              <option>Inactivo</option>
            </select>
          </Field>
        </div>
        <Field label="Permisos de acceso" group>
          <CheckboxList
            options={PERMISSIONS}
            value={form.permisos}
            onChange={(permisos) => setForm((f) => ({ ...f, permisos }))}
          />
        </Field>
      </form>
    </Modal>
  );
}

export default function Users() {
  const { items: users, create, update, remove } = useUsers();
  const [role, setRole] = useState('Todos');
  const [editing, setEditing] = useState(null); // null | 'new' | user
  const [deleting, setDeleting] = useState(null);

  const filtered = users.filter((u) => role === 'Todos' || u.rol === role);

  function save(data) {
    if (editing === 'new') create(data);
    else update(editing.id, data);
    setEditing(null);
  }

  return (
    <div className="p-8">
      <div className="flex justify-between mb-5">
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="px-3 py-2.5 text-sm rounded-xl border outline-none border-brand-200 bg-white text-brand-800"
        >
          <option value="Todos">Todos los roles</option>
          {ROLES.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
        <Button onClick={() => setEditing('new')}>
          <Plus size={16} /> Nuevo usuario
        </Button>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden border-brand-150">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-brand-50">
              {['Usuario', 'Rol', 'Permisos', 'Último acceso', 'Estado', ''].map((h) => (
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
            {filtered.map((user) => (
              <tr key={user.id} className="transition-colors hover:bg-brand-25">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-brand-200 text-brand-800">
                      {initials(user.name)}
                    </div>
                    <div>
                      <p className="font-medium text-brand-800">{user.name}</p>
                      <p className="text-xs text-brand-400">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${rolColors[user.rol]}`}>
                    {user.rol}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-1 flex-wrap">
                    {PERMISSIONS.every((p) => user.permisos.includes(p)) ? (
                      <span className="text-[10px] px-1.5 py-0.5 rounded border border-brand-400 text-brand-600">
                        Todo
                      </span>
                    ) : (
                      PERMISSIONS.filter((p) => user.permisos.includes(p)).map((p) => (
                        <span
                          key={p}
                          className="text-[10px] px-1.5 py-0.5 rounded border border-brand-400 text-brand-600"
                        >
                          {p}
                        </span>
                      ))
                    )}
                  </div>
                </td>
                <td className="px-5 py-3.5 text-xs font-mono text-brand-600">{user.ultimo}</td>
                <td className="px-5 py-3.5">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                      user.estado === 'Activo' ? 'bg-success-soft text-success' : 'bg-muted-soft text-muted'
                    }`}
                  >
                    {user.estado}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <RowActions label={user.name} onEdit={() => setEditing(user)} onDelete={() => setDeleting(user)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="px-5 py-10 text-center text-sm text-brand-400">No hay usuarios.</p>}
      </div>

      {editing && <UserForm user={editing === 'new' ? null : editing} onSave={save} onClose={() => setEditing(null)} />}
      {deleting && (
        <ConfirmDialog
          title="Eliminar usuario"
          message={`¿Eliminar a ${deleting.name}? Perderá el acceso al sistema.`}
          onCancel={() => setDeleting(null)}
          onConfirm={() => {
            remove(deleting.id);
            setDeleting(null);
          }}
        />
      )}
    </div>
  );
}
