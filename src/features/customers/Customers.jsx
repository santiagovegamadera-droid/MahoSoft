import { useState } from 'react';
import { Plus } from 'lucide-react';

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
  VIP: 'bg-brand-800 text-white',
  Frecuente: 'bg-brand-200 text-brand-800',
  Nuevo: 'bg-brand-50 text-brand-600',
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
            className="px-4 py-2.5 text-sm rounded-xl border outline-none border-brand-200 bg-white text-brand-800 w-[260px]"
          />
          <select className="px-3 py-2.5 text-sm rounded-xl border outline-none border-brand-200 text-brand-800">
            <option>Todos los niveles</option>
            <option>VIP</option>
            <option>Frecuente</option>
            <option>Nuevo</option>
          </select>
          <button className="ml-auto flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand-600">
            <Plus size={16} /> Nuevo cliente
          </button>
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
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className={`cursor-pointer transition-colors hover:bg-brand-25 ${
                    selected?.id === c.id ? 'bg-brand-25' : ''
                  }`}
                  onClick={() => setSelected(c)}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-brand-200 text-brand-800">
                        {c.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <div>
                        <p className="font-medium text-brand-800">{c.name}</p>
                        <p className="text-xs text-brand-400">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-brand-600">{c.ciudad}</td>
                  <td className="px-5 py-3.5 font-semibold text-brand-800">{c.compras}</td>
                  <td className="px-5 py-3.5 font-mono font-semibold text-brand-800">{c.total}</td>
                  <td className="px-5 py-3.5 text-xs font-mono text-brand-600">{c.ultimo}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${levelColors[c.nivel]}`}>
                      {c.nivel}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button className="text-xs px-2.5 py-1 rounded-lg bg-brand-50 text-brand-600">Ver</button>
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
          <div className="bg-white rounded-2xl border overflow-hidden border-brand-150">
            <div className="p-5 text-center border-b border-brand-50 bg-brand-50">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3 bg-brand-800 text-white">
                {selected.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <p className="font-semibold text-brand-800">{selected.name}</p>
              <p className="text-xs mb-2 text-brand-600">{selected.email}</p>
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${levelColors[selected.nivel]}`}>
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
                  <span className="text-brand-600">{row.label}</span>
                  <span className="font-semibold text-brand-800">{row.val}</span>
                </div>
              ))}
            </div>
            <div className="px-5 pb-5 space-y-2">
              <button className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-brand-600">
                Ver historial
              </button>
              <button className="w-full py-2 rounded-xl text-sm font-semibold border border-brand-200 text-brand-600">
                Editar datos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
