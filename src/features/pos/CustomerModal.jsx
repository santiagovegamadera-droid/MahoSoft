import { useState } from 'react';
import { Truck } from 'lucide-react';
import Modal from '@/shared/components/Modal';
import { Button, Field, inputClass } from '@/shared/components/Form';
import DocumentInput, { defaultDocType } from '@/shared/components/DocumentInput';
import { isEmail } from '@/features/pos/SendInvoice';
import useSettings from '@/features/settings/store';

export const EMPTY_CUSTOMER = { nombre: '', tipoDocumento: '', documento: '', telefono: '', correo: '' };
export const EMPTY_DELIVERY = { direccion: '', barrio: '', ciudad: '', fecha: '', envio: 0, notas: '' };

// Orders can't be charged until we know who receives them and where
export const deliveryMissing = (c, d) => !c.nombre.trim() || !c.telefono.trim() || !d.direccion.trim();

export default function CustomerModal({ isOrder, customer, delivery, onSave, onClose }) {
  const { tiposDocumento } = useSettings();
  // Customers start on CC (or the first configured type) until one is picked
  const [c, setC] = useState({
    ...customer,
    tipoDocumento: customer.tipoDocumento || defaultDocType(tiposDocumento, 'CC'),
  });
  const [d, setD] = useState(delivery);
  const [touched, setTouched] = useState(false);
  const setCustomer = (k) => (e) => setC({ ...c, [k]: e.target.value });
  const setDelivery = (k) => (e) => setD({ ...d, [k]: e.target.value });

  const errors = {
    nombre: isOrder && !c.nombre.trim() && 'Requerido para el pedido',
    telefono: isOrder && !c.telefono.trim() && 'Requerido para coordinar la entrega',
    correo: c.correo.trim() && !isEmail(c.correo) && 'Correo no válido',
    direccion: isOrder && !d.direccion.trim() && 'Requerida para el pedido',
  };
  const hasErrors = Object.values(errors).some(Boolean);

  function save() {
    setTouched(true);
    if (hasErrors) return;
    onSave(
      { ...c, nombre: c.nombre.trim(), telefono: c.telefono.trim(), correo: c.correo.trim() },
      { ...d, envio: Number(d.envio) || 0 },
    );
  }

  return (
    <Modal
      title={isOrder ? 'Datos del pedido' : 'Datos del cliente'}
      size={isOrder ? 'lg' : 'md'}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={save}>Guardar</Button>
        </>
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
        className="space-y-5"
      >
        <div className="grid grid-cols-[3fr_2fr] gap-3">
          <Field label="Nombre" error={touched && errors.nombre} className="col-span-2">
            <input value={c.nombre} onChange={setCustomer('nombre')} className={inputClass} autoFocus />
          </Field>
          <Field label="Documento" group>
            <DocumentInput
              types={tiposDocumento}
              tipo={c.tipoDocumento}
              numero={c.documento}
              onTipoChange={(tipoDocumento) => setC({ ...c, tipoDocumento })}
              onNumeroChange={(documento) => setC({ ...c, documento })}
            />
          </Field>
          <Field label="Teléfono / WhatsApp" error={touched && errors.telefono}>
            <input
              value={c.telefono}
              onChange={setCustomer('telefono')}
              className={inputClass}
              inputMode="tel"
              placeholder="300 000 0000"
            />
          </Field>
          <Field label="Correo" error={touched && errors.correo} className="col-span-2">
            <input
              type="email"
              value={c.correo}
              onChange={setCustomer('correo')}
              className={inputClass}
              placeholder="correo@cliente.com"
            />
          </Field>
        </div>

        {isOrder && (
          <div className="pt-4 border-t border-brand-100">
            <p className="flex items-center gap-2 mb-3 text-sm font-semibold text-brand-800">
              <Truck size={16} />
              Entrega
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Dirección" error={touched && errors.direccion} className="col-span-2">
                <input
                  value={d.direccion}
                  onChange={setDelivery('direccion')}
                  className={inputClass}
                  placeholder="Calle 00 # 00 - 00, apto 000"
                />
              </Field>
              <Field label="Barrio">
                <input value={d.barrio} onChange={setDelivery('barrio')} className={inputClass} />
              </Field>
              <Field label="Ciudad">
                <input value={d.ciudad} onChange={setDelivery('ciudad')} className={inputClass} />
              </Field>
              <Field label="Fecha de entrega">
                <input type="date" value={d.fecha} onChange={setDelivery('fecha')} className={inputClass} />
              </Field>
              <Field label="Costo de envío">
                <input
                  type="number"
                  min={0}
                  step={1000}
                  value={d.envio}
                  onChange={setDelivery('envio')}
                  className={inputClass}
                />
              </Field>
              <Field label="Notas de entrega" className="col-span-2">
                <textarea
                  value={d.notas}
                  onChange={setDelivery('notas')}
                  rows={2}
                  className={`${inputClass} resize-none`}
                  placeholder="Referencias, horario, quién recibe..."
                />
              </Field>
            </div>
          </div>
        )}
        <button type="submit" hidden />
      </form>
    </Modal>
  );
}
