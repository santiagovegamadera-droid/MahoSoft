import { useState } from 'react';
import { Plus } from 'lucide-react';

const users = [
  {
    id: 1,
    name: 'Ana Martínez',
    email: 'ana@ellaboutique.co',
    rol: 'Administradora',
    permisos: ['Todo'],
    estado: 'Activo',
    ultimo: '2026-09-23 08:15',
    iniciales: 'AM',
  },
  {
    id: 2,
    name: 'Carla Rodríguez',
    email: 'carla@ellaboutique.co',
    rol: 'Vendedora',
    permisos: ['POS', 'Clientes'],
    estado: 'Activo',
    ultimo: '2026-09-23 09:02',
    iniciales: 'CR',
  },
  {
    id: 3,
    name: 'Sofía Parra',
    email: 'sofia@ellaboutique.co',
    rol: 'Vendedora',
    permisos: ['POS', 'Clientes'],
    estado: 'Activo',
    ultimo: '2026-09-22 18:45',
    iniciales: 'SP',
  },
  {
    id: 4,
    name: 'Valentina Ruiz',
    email: 'vale@ellaboutique.co',
    rol: 'Vendedora',
    permisos: ['POS', 'Clientes'],
    estado: 'Inactivo',
    ultimo: '2026-09-10 12:30',
    iniciales: 'VR',
  },
  {
    id: 5,
    name: 'Jorge Mejía',
    email: 'jorge@ellaboutique.co',
    rol: 'Bodega',
    permisos: ['Compras'],
    estado: 'Activo',
    ultimo: '2026-09-23 07:58',
    iniciales: 'JM',
  },
];

const rolColors = {
  Administradora: 'bg-brand-800 text-white',
  Vendedora: 'bg-brand-200 text-brand-800',
  Bodega: 'bg-brand-50 text-brand-600',
};

const allPerms = ['Dashboard', 'POS', 'Compras', 'Clientes', 'Proveedores', 'Usuarios', 'Reportes'];

export default function Users() {
  const [selected, setSelected] = useState(null);
  const [perms, setPerms] = useState([]);

  function openEdit(e) {
    setSelected(e);
    setPerms(e.permisos[0] === 'Todo' ? allPerms : e.permisos);
  }

  return (
    <div className="p-8 flex gap-6">
      <div className="flex-1">
        <div className="flex justify-between mb-5">
          <div className="flex gap-3">
            <select className="px-3 py-2.5 text-sm rounded-xl border outline-none border-brand-200 text-brand-800">
              <option>Todos los roles</option>
              <option>Administradora</option>
              <option>Vendedora</option>
              <option>Bodega</option>
            </select>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand-600">
            <Plus size={16} /> Nuevo usuario
          </button>
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
              {users.map((user) => (
                <tr
                  key={user.id}
                  className={`transition-colors cursor-pointer hover:bg-brand-25 ${
                    selected?.id === user.id ? 'bg-brand-25' : ''
                  }`}
                  onClick={() => openEdit(user)}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-brand-200 text-brand-800">
                        {user.iniciales}
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
                      {user.permisos.map((p) => (
                        <span
                          key={p}
                          className="text-[10px] px-1.5 py-0.5 rounded border border-brand-400 text-brand-600"
                        >
                          {p}
                        </span>
                      ))}
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
                    <button className="text-xs px-3 py-1.5 rounded-lg font-semibold bg-brand-200 text-brand-800">
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permission editor */}
      {selected && (
        <div className="w-72 shrink-0">
          <div className="bg-white rounded-2xl border border-brand-150">
            <div className="p-5 border-b border-brand-50 bg-brand-50 rounded-t-2xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white bg-brand-800">
                  {selected.iniciales}
                </div>
                <div>
                  <p className="font-semibold text-sm text-brand-800">{selected.name}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${rolColors[selected.rol]}`}>
                    {selected.rol}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wide mb-3 text-brand-800">Permisos de acceso</p>
              <div className="space-y-2">
                {allPerms.map((p) => (
                  <label key={p} className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-brand-800">{p}</span>
                    <input
                      type="checkbox"
                      checked={perms.includes(p)}
                      onChange={() =>
                        setPerms((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]))
                      }
                      className="w-4 h-4 accent-brand-600"
                    />
                  </label>
                ))}
              </div>
              <button className="w-full mt-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand-600">
                Guardar permisos
              </button>
              <button className="w-full mt-2 py-2 rounded-xl text-xs font-semibold text-danger">
                Desactivar usuario
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
