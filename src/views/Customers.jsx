import { useState } from 'react';

const customers = [
  {
    id: 1,
    name: 'Laura Gómez',
    email: 'laura@gmail.com',
    tel: '311-234-5678',
    ciudad: 'Bogotá',
    compras: 12,
    total: '$1.245.000',
    ultimo: '2026-09-21',
    nivel: 'VIP',
  },
  {
    id: 2,
    name: 'Daniela Torres',
    email: 'daniela.t@gmail.com',
    tel: '318-456-7890',
    ciudad: 'Medellín',
    compras: 8,
    total: '$820.000',
    ultimo: '2026-09-20',
    nivel: 'Frecuente',
  },
  {
    id: 3,
    name: 'Marcela Ríos',
    email: 'marce.rios@hotmail.com',
    tel: '314-567-8901',
    ciudad: 'Cali',
    compras: 5,
    total: '$425.000',
    ultimo: '2026-09-18',
    nivel: 'Frecuente',
  },
  {
    id: 4,
    name: 'Camila Herrera',
    email: 'camila.h@gmail.com',
    tel: '312-345-6789',
    ciudad: 'Bogotá',
    compras: 1,
    total: '$89.900',
    ultimo: '2026-09-22',
    nivel: 'Nuevo',
  },
  {
    id: 5,
    name: 'Valentina Cruz',
    email: 'vale.cruz@gmail.com',
    tel: '315-678-9012',
    ciudad: 'Barranquilla',
    compras: 20,
    total: '$2.890.000',
    ultimo: '2026-09-23',
    nivel: 'VIP',
  },
  {
    id: 6,
    name: 'Isabella Moreno',
    email: 'isa.moreno@outlook.com',
    tel: '317-789-0123',
    ciudad: 'Medellín',
    compras: 3,
    total: '$265.000',
    ultimo: '2026-09-15',
    nivel: 'Nuevo',
  },
];

const levelColors = {
  VIP: { bg: '#503459', color: '#fff' },
  Frecuente: { bg: '#dac9df', color: '#503459' },
  Nuevo: { bg: '#f5f0f7', color: '#81638b' },
};

export default function Customers() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = customers.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-8 flex gap-6">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-5">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o email..."
            className="px-4 py-2.5 text-sm rounded-xl border outline-none"
            style={{ borderColor: '#dac9df', background: '#fff', color: '#503459', width: 260 }}
          />
          <select
            className="px-3 py-2.5 text-sm rounded-xl border outline-none"
            style={{ borderColor: '#dac9df', color: '#503459' }}
          >
            <option>Todos los niveles</option>
            <option>VIP</option>
            <option>Frecuente</option>
            <option>Nuevo</option>
          </select>
          <button
            className="ml-auto px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: '#81638b' }}
          >
            + Nuevo cliente
          </button>
        </div>

        <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#e8dff0' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#f5f0f7' }}>
                {['Cliente', 'Ciudad', 'Compras', 'Total gastado', 'Última compra', 'Nivel', ''].map((h) => (
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
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="cursor-pointer transition-colors"
                  style={{ background: selected?.id === c.id ? '#faf7fc' : '' }}
                  onClick={() => setSelected(c)}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#faf7fc')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = selected?.id === c.id ? '#faf7fc' : '')}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                        style={{ background: '#dac9df', color: '#503459' }}
                      >
                        {c.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: '#503459' }}>
                          {c.name}
                        </p>
                        <p className="text-xs" style={{ color: '#b695c0' }}>
                          {c.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs" style={{ color: '#81638b' }}>
                    {c.ciudad}
                  </td>
                  <td className="px-5 py-3.5 font-semibold" style={{ color: '#503459' }}>
                    {c.compras}
                  </td>
                  <td className="px-5 py-3.5 font-mono font-semibold" style={{ color: '#503459' }}>
                    {c.total}
                  </td>
                  <td className="px-5 py-3.5 text-xs font-mono" style={{ color: '#81638b' }}>
                    {c.ultimo}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={levelColors[c.nivel]}>
                      {c.nivel}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      className="text-xs px-2.5 py-1 rounded-lg"
                      style={{ background: '#f5f0f7', color: '#81638b' }}
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="w-72 shrink-0">
          <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#e8dff0' }}>
            <div className="p-5 text-center border-b" style={{ borderColor: '#f5f0f7', background: '#f5f0f7' }}>
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3"
                style={{ background: '#503459', color: '#fff' }}
              >
                {selected.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <p className="font-semibold" style={{ color: '#503459' }}>
                {selected.name}
              </p>
              <p className="text-xs mb-2" style={{ color: '#81638b' }}>
                {selected.email}
              </p>
              <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={levelColors[selected.nivel]}>
                {selected.nivel}
              </span>
            </div>
            <div className="p-5 space-y-3">
              {[
                { label: 'Teléfono', val: selected.tel },
                { label: 'Ciudad', val: selected.ciudad },
                { label: 'Total compras', val: selected.compras },
                { label: 'Total gastado', val: selected.total },
                { label: 'Última compra', val: selected.ultimo },
              ].map((row) => (
                <div key={row.label} className="flex justify-between text-xs">
                  <span style={{ color: '#81638b' }}>{row.label}</span>
                  <span className="font-semibold" style={{ color: '#503459' }}>
                    {row.val}
                  </span>
                </div>
              ))}
            </div>
            <div className="px-5 pb-5 space-y-2">
              <button
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: '#81638b' }}
              >
                Ver historial
              </button>
              <button
                className="w-full py-2 rounded-xl text-sm font-semibold border"
                style={{ borderColor: '#dac9df', color: '#81638b' }}
              >
                Editar datos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
