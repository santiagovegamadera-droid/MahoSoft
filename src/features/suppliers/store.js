import createCollection from '@/shared/lib/createCollection';

// categorias holds category ids
const useSuppliers = createCollection('suppliers', [
  {
    id: 1,
    name: 'Textiles Bogotá S.A.S.',
    contacto: 'Pedro Vargas',
    email: 'pvargas@textilesbog.com',
    tel: '601-234-5678',
    ciudad: 'Bogotá',
    categorias: [1, 4, 2],
    estado: 'Activo',
  },
  {
    id: 2,
    name: 'ModaCali S.A.',
    contacto: 'Sandra Lozano',
    email: 'slozano@modacali.com',
    tel: '602-345-6789',
    ciudad: 'Cali',
    categorias: [2, 3],
    estado: 'Activo',
  },
  {
    id: 3,
    name: 'DenimCo',
    contacto: 'Ricardo Montoya',
    email: 'r.montoya@denimco.co',
    tel: '604-456-7890',
    ciudad: 'Medellín',
    categorias: [3],
    estado: 'Activo',
  },
  {
    id: 4,
    name: 'LuxFashion Ltda.',
    contacto: 'Andrea Silva',
    email: 'asilva@luxfashion.com',
    tel: '605-567-8901',
    ciudad: 'Bogotá',
    categorias: [5, 6],
    estado: 'Activo',
  },
  {
    id: 5,
    name: 'KnitCo Textiles',
    contacto: 'Jorge Pérez',
    email: 'jperez@knitco.co',
    tel: '607-678-9012',
    ciudad: 'Manizales',
    categorias: [6],
    estado: 'Inactivo',
  },
  {
    id: 6,
    name: 'GlamourBtq',
    contacto: 'Lucía Ramírez',
    email: 'lucia@glamourbtq.co',
    tel: '601-876-5432',
    ciudad: 'Bogotá',
    categorias: [7],
    estado: 'Activo',
  },
]);

export default useSuppliers;
