import createCollection from '@/shared/lib/createCollection';

export const LEVELS = ['VIP', 'Frecuente', 'Nuevo'];

const useCustomers = createCollection('customers', [
  { id: 1, name: 'Laura Gómez', email: 'laura@gmail.com', tel: '311-234-5678', ciudad: 'Bogotá', nivel: 'VIP' },
  {
    id: 2,
    name: 'Daniela Torres',
    email: 'daniela.t@gmail.com',
    tel: '318-456-7890',
    ciudad: 'Medellín',
    nivel: 'Frecuente',
  },
  {
    id: 3,
    name: 'Marcela Ríos',
    email: 'marce.rios@hotmail.com',
    tel: '314-567-8901',
    ciudad: 'Cali',
    nivel: 'Frecuente',
  },
  { id: 4, name: 'Camila Herrera', email: 'camila.h@gmail.com', tel: '312-345-6789', ciudad: 'Bogotá', nivel: 'Nuevo' },
  {
    id: 5,
    name: 'Valentina Cruz',
    email: 'vale.cruz@gmail.com',
    tel: '315-678-9012',
    ciudad: 'Barranquilla',
    nivel: 'VIP',
  },
  {
    id: 6,
    name: 'Isabella Moreno',
    email: 'isa.moreno@outlook.com',
    tel: '317-789-0123',
    ciudad: 'Medellín',
    nivel: 'Nuevo',
  },
]);

export default useCustomers;
