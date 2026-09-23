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
        <button className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: '#81638b' }}>
          + Nuevo proveedor
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total proveedores', val: suppliers.length },
          { label: 'Pedidos este mes', val: 8 },
          { label: 'Monto total pedidos', val: '$17.55M' },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-2xl p-5 border" style={{ borderColor: '#e8dff0' }}>
            <p className="text-xs uppercase tracking-wide mb-1" style={{ color: '#81638b' }}>
              {k.label}
            </p>
            <p className="text-2xl font-bold" style={{ color: '#503459' }}>
              {k.val}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#e8dff0' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#f5f0f7' }}>
              {['Proveedor', 'Contacto', 'Ciudad', 'Categorías', 'Último pedido', 'Monto', 'Estado', ''].map((h) => (
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
            {suppliers.map((s) => (
              <tr
                key={s.id}
                className="transition-colors"
                onMouseEnter={(e) => (e.currentTarget.style.background = '#faf7fc')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '')}
              >
                <td className="px-5 py-3.5">
                  <p className="font-semibold" style={{ color: '#503459' }}>
                    {s.name}
                  </p>
                  <p className="text-xs" style={{ color: '#b695c0' }}>
                    {s.email}
                  </p>
                </td>
                <td className="px-5 py-3.5">
                  <p className="text-sm" style={{ color: '#503459' }}>
                    {s.contacto}
                  </p>
                  <p className="text-xs" style={{ color: '#b695c0' }}>
                    {s.tel}
                  </p>
                </td>
                <td className="px-5 py-3.5 text-xs" style={{ color: '#81638b' }}>
                  {s.ciudad}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex flex-wrap gap-1">
                    {s.categorias.slice(0, 2).map((c) => (
                      <span
                        key={c}
                        className="text-[10px] px-1.5 py-0.5 rounded"
                        style={{ background: '#dac9df', color: '#503459' }}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-3.5 text-xs font-mono" style={{ color: '#81638b' }}>
                  {s.ultimoPedido}
                </td>
                <td className="px-5 py-3.5 font-mono font-semibold text-sm" style={{ color: '#503459' }}>
                  {s.montoPedido}
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className="text-xs px-2.5 py-1 rounded-full font-semibold"
                    style={{
                      background: s.estado === 'Activo' ? '#d1f5e0' : '#f0f0f0',
                      color: s.estado === 'Activo' ? '#1a7a45' : '#666',
                    }}
                  >
                    {s.estado}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <button
                    className="text-xs px-3 py-1.5 rounded-lg font-semibold"
                    style={{ background: '#dac9df', color: '#503459' }}
                  >
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
