import { useState } from 'react';

const employees = [
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
    permisos: ['Inventario'],
    estado: 'Activo',
    ultimo: '2026-09-23 07:58',
    iniciales: 'JM',
  },
];

const rolColors = {
  Administradora: { bg: '#503459', color: '#fff' },
  Vendedora: { bg: '#dac9df', color: '#503459' },
  Bodega: { bg: '#f5f0f7', color: '#81638b' },
};

const allPerms = ['Dashboard', 'POS', 'Productos', 'Inventario', 'Clientes', 'Proveedores', 'Empleados', 'Reportes'];

export default function Employees() {
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
            <select
              className="px-3 py-2.5 text-sm rounded-xl border outline-none"
              style={{ borderColor: '#dac9df', color: '#503459' }}
            >
              <option>Todos los roles</option>
              <option>Administradora</option>
              <option>Vendedora</option>
              <option>Bodega</option>
            </select>
          </div>
          <button className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: '#81638b' }}>
            + Nuevo usuario
          </button>
        </div>

        <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#e8dff0' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#f5f0f7' }}>
                {['Usuario', 'Rol', 'Permisos', 'Último acceso', 'Estado', ''].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                    style={{ color: '#81638b' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: '#f5f0f7' }}>
              {employees.map((emp) => (
                <tr
                  key={emp.id}
                  className="transition-colors cursor-pointer"
                  onClick={() => openEdit(emp)}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#faf7fc')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = selected?.id === emp.id ? '#faf7fc' : '')}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                        style={{ background: '#dac9df', color: '#503459' }}
                      >
                        {emp.iniciales}
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: '#503459' }}>
                          {emp.name}
                        </p>
                        <p className="text-xs" style={{ color: '#b695c0' }}>
                          {emp.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={rolColors[emp.rol]}>
                      {emp.rol}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-1 flex-wrap">
                      {emp.permisos.map((p) => (
                        <span
                          key={p}
                          className="text-[10px] px-1.5 py-0.5 rounded border"
                          style={{ borderColor: '#b695c0', color: '#81638b' }}
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs font-mono" style={{ color: '#81638b' }}>
                    {emp.ultimo}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-semibold"
                      style={{
                        background: emp.estado === 'Activo' ? '#d1f5e0' : '#f0f0f0',
                        color: emp.estado === 'Activo' ? '#1a7a45' : '#666',
                      }}
                    >
                      {emp.estado}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      className="text-xs px-3 py-1.5 rounded-lg font-semibold"
                      style={{ background: '#dac9df', color: '#503459' }}
                    >
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
          <div className="bg-white rounded-2xl border" style={{ borderColor: '#e8dff0' }}>
            <div
              className="p-5 border-b"
              style={{ borderColor: '#f5f0f7', background: '#f5f0f7', borderRadius: '1rem 1rem 0 0' }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                  style={{ background: '#503459' }}
                >
                  {selected.iniciales}
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: '#503459' }}>
                    {selected.name}
                  </p>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={rolColors[selected.rol]}>
                    {selected.rol}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#503459' }}>
                Permisos de acceso
              </p>
              <div className="space-y-2">
                {allPerms.map((p) => (
                  <label key={p} className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm" style={{ color: '#503459' }}>
                      {p}
                    </span>
                    <input
                      type="checkbox"
                      checked={perms.includes(p)}
                      onChange={() =>
                        setPerms((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]))
                      }
                      className="w-4 h-4 accent-[#81638b]"
                    />
                  </label>
                ))}
              </div>
              <button
                className="w-full mt-4 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: '#81638b' }}
              >
                Guardar permisos
              </button>
              <button className="w-full mt-2 py-2 rounded-xl text-xs font-semibold" style={{ color: '#c0392b' }}>
                Desactivar usuario
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
