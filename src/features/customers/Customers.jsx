import { useState } from 'react';
import { Plus } from 'lucide-react';
import useCustomers, { LEVELS } from '@/features/customers/store';
import useSales from '@/features/sales/store';
import saleTotals from '@/features/sales/saleTotals';
import Modal from '@/shared/components/Modal';
import ConfirmDialog from '@/shared/components/ConfirmDialog';
import { Button, Field, RowActions, inputClass } from '@/shared/components/Form';

const levelColors = {
  VIP: 'bg-brand-800 text-white',
  Frecuente: 'bg-brand-200 text-brand-800',
  Nuevo: 'bg-brand-50 text-brand-600',
};

const emptyCustomer = { name: '', email: '', tel: '', ciudad: '', nivel: 'Nuevo' };
const fmt = (n) => `$${n.toLocaleString('es-CO')}`;
const initials = (name) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

function CustomerForm({ customer, onSave, onClose }) {
  const [form, setForm] = useState(customer ?? emptyCustomer);
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function submit(e) {
    e.preventDefault();
    if (!form.name.trim()) return setError('El nombre es obligatorio');
    onSave({ ...form, name: form.name.trim() });
  }

  return (
    <Modal
      title={customer ? 'Editar cliente' : 'Nuevo cliente'}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="customer-form">
            Guardar
          </Button>
        </>
      }
    >
      <form id="customer-form" onSubmit={submit} className="space-y-4">
        <Field label="Nombre" error={error}>
          <input value={form.name} onChange={set('name')} className={inputClass} autoFocus />
        </Field>
        <Field label="Email">
          <input type="email" value={form.email} onChange={set('email')} className={inputClass} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Teléfono">
            <input value={form.tel} onChange={set('tel')} className={inputClass} />
          </Field>
          <Field label="Ciudad">
            <input value={form.ciudad} onChange={set('ciudad')} className={inputClass} />
          </Field>
        </div>
        <Field label="Nivel">
          <select value={form.nivel} onChange={set('nivel')} className={inputClass}>
            {LEVELS.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </Field>
      </form>
    </Modal>
  );
}

export default function Customers() {
  const { items: customers, create, update, remove } = useCustomers();
  const { items: sales, update: updateSale } = useSales();
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('Todos');
  const [selectedId, setSelectedId] = useState(null);
  const [editing, setEditing] = useState(null); // null | 'new' | customer
  const [deleting, setDeleting] = useState(null);

  // Purchase stats come from the sales registered under the customer's name
  const stats = (c) => {
    const own = sales.filter((s) => s.cliente === c.name);
    return {
      compras: own.length,
      total: own.reduce((sum, s) => sum + saleTotals(s).total, 0),
      ultimo:
        own
          .map((s) => s.fecha.slice(0, 10))
          .sort()
          .pop() ?? '—',
    };
  };

  const q = search.toLowerCase();
  const filtered = customers.filter(
    (c) =>
      (level === 'Todos' || c.nivel === level) &&
      (c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)),
  );
  const selected = customers.find((c) => c.id === selectedId);

  function save(data) {
    if (editing === 'new') {
      create(data);
    } else {
      update(editing.id, data);
      // Keep past sales linked to the customer after a rename
      if (data.name !== editing.name) {
        sales.filter((s) => s.cliente === editing.name).forEach((s) => updateSale(s.id, { cliente: data.name }));
      }
    }
    setEditing(null);
  }

  return (
    <div className="p-8 flex gap-6">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-5">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o email..."
            className="px-4 py-2.5 text-sm rounded-xl border outline-none border-brand-200 bg-white text-brand-800 w-65 focus:border-brand-600"
          />
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="px-3 py-2.5 text-sm rounded-xl border outline-none border-brand-200 bg-white text-brand-800"
          >
            <option value="Todos">Todos los niveles</option>
            {LEVELS.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
          <Button className="ml-auto" onClick={() => setEditing('new')}>
            <Plus size={16} /> Nuevo cliente
          </Button>
        </div>

        <div className="bg-white rounded-2xl border overflow-hidden border-brand-150">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-50">
                {['Cliente', 'Ciudad', 'Compras', 'Total gastado', 'Última compra', 'Nivel', ''].map((h) => (
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
              {filtered.map((c) => {
                const st = stats(c);
                return (
                  <tr
                    key={c.id}
                    className={`cursor-pointer transition-colors hover:bg-brand-25 ${
                      selectedId === c.id ? 'bg-brand-25' : ''
                    }`}
                    onClick={() => setSelectedId(c.id)}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-brand-200 text-brand-800">
                          {initials(c.name)}
                        </div>
                        <div>
                          <p className="font-medium text-brand-800">{c.name}</p>
                          <p className="text-xs text-brand-400">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-brand-600">{c.ciudad}</td>
                    <td className="px-5 py-3.5 font-semibold text-brand-800">{st.compras}</td>
                    <td className="px-5 py-3.5 font-mono font-semibold text-brand-800">{fmt(st.total)}</td>
                    <td className="px-5 py-3.5 text-xs font-mono text-brand-600">{st.ultimo}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${levelColors[c.nivel]}`}>
                        {c.nivel}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <RowActions label={c.name} onEdit={() => setEditing(c)} onDelete={() => setDeleting(c)} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="px-5 py-10 text-center text-sm text-brand-400">No hay clientes.</p>}
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="w-72 shrink-0">
          <div className="bg-white rounded-2xl border overflow-hidden border-brand-150">
            <div className="p-5 text-center border-b border-brand-50 bg-brand-50">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3 bg-brand-800 text-white">
                {initials(selected.name)}
              </div>
              <p className="font-semibold text-brand-800">{selected.name}</p>
              <p className="text-xs mb-2 text-brand-600">{selected.email}</p>
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${levelColors[selected.nivel]}`}>
                {selected.nivel}
              </span>
            </div>
            <div className="p-5 space-y-3">
              {[
                { label: 'Teléfono', val: selected.tel || '—' },
                { label: 'Ciudad', val: selected.ciudad || '—' },
                { label: 'Total compras', val: stats(selected).compras },
                { label: 'Total gastado', val: fmt(stats(selected).total) },
                { label: 'Última compra', val: stats(selected).ultimo },
              ].map((row) => (
                <div key={row.label} className="flex justify-between text-xs">
                  <span className="text-brand-600">{row.label}</span>
                  <span className="font-semibold text-brand-800">{row.val}</span>
                </div>
              ))}
            </div>
            <div className="px-5 pb-5">
              <Button variant="secondary" className="w-full" onClick={() => setEditing(selected)}>
                Editar datos
              </Button>
            </div>
          </div>
        </div>
      )}

      {editing && (
        <CustomerForm customer={editing === 'new' ? null : editing} onSave={save} onClose={() => setEditing(null)} />
      )}
      {deleting && (
        <ConfirmDialog
          title="Eliminar cliente"
          message={`¿Eliminar a ${deleting.name}? Sus ventas registradas se conservan en el historial.`}
          onCancel={() => setDeleting(null)}
          onConfirm={() => {
            remove(deleting.id);
            if (selectedId === deleting.id) setSelectedId(null);
            setDeleting(null);
          }}
        />
      )}
    </div>
  );
}
