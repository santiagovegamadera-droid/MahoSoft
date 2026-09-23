const suppliers = [
  {
    id: 1,
    name: 'Textiles Bogotá S.A.S.',
    contacto: 'Pedro Vargas',
    email: 'pvargas@textilesbog.com',
    tel: '601-234-5678',
    ciudad: 'Bogotá',
    categorias: ['Vestidos', 'Faldas', 'Blusas'],
    ultimoPedido: '2026-09-15',
    montoPedido: '$4.250.000',
    estado: 'Activo',
  },
  {
    id: 2,
    name: 'ModaCali S.A.',
    contacto: 'Sandra Lozano',
    email: 'slozano@modacali.com',
    tel: '602-345-6789',
    ciudad: 'Cali',
    categorias: ['Blusas', 'Pantalones'],
    ultimoPedido: '2026-09-10',
    montoPedido: '$2.800.000',
    estado: 'Activo',
  },
  {
    id: 3,
    name: 'DenimCo',
    contacto: 'Ricardo Montoya',
    email: 'r.montoya@denimco.co',
    tel: '604-456-7890',
    ciudad: 'Medellín',
    categorias: ['Pantalones', 'Jeans'],
    ultimoPedido: '2026-08-28',
    montoPedido: '$3.150.000',
    estado: 'Activo',
  },
  {
    id: 4,
    name: 'LuxFashion Ltda.',
    contacto: 'Andrea Silva',
    email: 'asilva@luxfashion.com',
    tel: '605-567-8901',
    ciudad: 'Bogotá',
    categorias: ['Conjuntos', 'Abrigos'],
    ultimoPedido: '2026-09-05',
    montoPedido: '$5.400.000',
    estado: 'Activo',
  },
  {
    id: 5,
    name: 'KnitCo Textiles',
    contacto: 'Jorge Pérez',
    email: 'jperez@knitco.co',
    tel: '607-678-9012',
    ciudad: 'Manizales',
    categorias: ['Abrigos', 'Cardigans'],
    ultimoPedido: '2026-09-20',
    montoPedido: '$1.950.000',
    estado: 'Inactivo',
  },
];

export default function Suppliers() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-5">
        <div />
        <button className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand-600">
          + Nuevo proveedor
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total proveedores', val: suppliers.length },
          { label: 'Pedidos este mes', val: 8 },
          { label: 'Monto total pedidos', val: '$17.55M' },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-2xl p-5 border border-brand-150">
            <p className="text-xs uppercase tracking-wide mb-1 text-brand-600">{k.label}</p>
            <p className="text-2xl font-bold text-brand-800">{k.val}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden border-brand-150">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-brand-50">
              {['Proveedor', 'Contacto', 'Ciudad', 'Categorías', 'Último pedido', 'Monto', 'Estado', ''].map((h) => (
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
            {suppliers.map((s) => (
              <tr key={s.id} className="transition-colors hover:bg-brand-25">
                <td className="px-5 py-3.5">
                  <p className="font-semibold text-brand-800">{s.name}</p>
                  <p className="text-xs text-brand-400">{s.email}</p>
                </td>
                <td className="px-5 py-3.5">
                  <p className="text-sm text-brand-800">{s.contacto}</p>
                  <p className="text-xs text-brand-400">{s.tel}</p>
                </td>
                <td className="px-5 py-3.5 text-xs text-brand-600">{s.ciudad}</td>
                <td className="px-5 py-3.5">
                  <div className="flex flex-wrap gap-1">
                    {s.categorias.slice(0, 2).map((c) => (
                      <span key={c} className="text-[10px] px-1.5 py-0.5 rounded bg-brand-200 text-brand-800">
                        {c}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-3.5 text-xs font-mono text-brand-600">{s.ultimoPedido}</td>
                <td className="px-5 py-3.5 font-mono font-semibold text-sm text-brand-800">{s.montoPedido}</td>
                <td className="px-5 py-3.5">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                      s.estado === 'Activo' ? 'bg-success-soft text-success' : 'bg-muted-soft text-muted'
                    }`}
                  >
                    {s.estado}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <button className="text-xs px-3 py-1.5 rounded-lg font-semibold bg-brand-200 text-brand-800">
                    Ver pedidos
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
