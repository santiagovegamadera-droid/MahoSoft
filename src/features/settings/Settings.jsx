import { useState } from 'react';
import { Boxes, Check, IdCard, RotateCcw, Ruler, ShoppingCart, Store } from 'lucide-react';
import useSettings, { DEFAULT_SETTINGS, updateSettings } from '@/features/settings/store';
import BusinessSettings, { businessKeys, validateBusiness } from '@/features/settings/BusinessSettings';
import PosSettings, { posKeys, validatePos } from '@/features/settings/PosSettings';
import InventorySettings, { inventoryKeys, validateInventory } from '@/features/settings/InventorySettings';
import SizeSettings, { sizeKeys, validateSizes } from '@/features/settings/SizeSettings';
import DocumentSettings, { documentKeys, validateDocuments } from '@/features/settings/DocumentSettings';
import ConfirmDialog from '@/shared/components/ConfirmDialog';
import { Button } from '@/shared/components/Form';
import { SegmentedTabs } from '@/shared/components/Toolbar';

// Each view edits and saves only its own keys of the settings
const VIEWS = [
  {
    id: 'negocio',
    label: 'Datos del negocio',
    description: 'Aparecen en los recibos de venta.',
    icon: Store,
    keys: businessKeys,
    validate: validateBusiness,
    Form: BusinessSettings,
  },
  {
    id: 'pos',
    label: 'Punto de venta',
    description: 'Opciones disponibles al registrar una venta.',
    icon: ShoppingCart,
    keys: posKeys,
    validate: validatePos,
    Form: PosSettings,
  },
  {
    id: 'inventario',
    label: 'Inventario',
    description: 'Cuándo marcar un producto o una talla con stock bajo.',
    icon: Boxes,
    keys: inventoryKeys,
    validate: validateInventory,
    Form: InventorySettings,
  },
  {
    id: 'tallas',
    label: 'Tallas',
    description: 'Tallas disponibles para los productos, agrupadas y en orden.',
    icon: Ruler,
    keys: sizeKeys,
    validate: validateSizes,
    Form: SizeSettings,
  },
  {
    id: 'documentos',
    label: 'Tipos de documento',
    description: 'Tipos de identificación que se piden a los clientes.',
    icon: IdCard,
    keys: documentKeys,
    validate: validateDocuments,
    Form: DocumentSettings,
  },
];

const pick = (obj, keys) => Object.fromEntries(keys.map((k) => [k, obj[k]]));

function SettingsView({ view }) {
  const settings = useSettings();
  const current = pick(settings, view.keys);
  const [form, setForm] = useState(current);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const [resetting, setResetting] = useState(false);
  const { Form, icon: Icon } = view;

  const dirty = JSON.stringify(form) !== JSON.stringify(current);

  function update(patch) {
    setForm((f) => ({ ...f, ...patch }));
    setSaved(false);
  }

  function save() {
    const { values, errors: errs } = view.validate(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    updateSettings(values);
    setForm(values);
    setSaved(true);
  }

  function reset() {
    const defaults = pick(DEFAULT_SETTINGS, view.keys);
    updateSettings(defaults);
    setForm(defaults);
    setErrors({});
    setResetting(false);
  }

  return (
    <section className="bg-white rounded-2xl border border-brand-150">
      <div className="flex items-start gap-3 px-5 py-3 border-b border-brand-50">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-brand-200 text-brand-800">
          <Icon size={18} strokeWidth={1.75} />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-brand-800">{view.label}</h2>
          <p className="text-xs text-brand-600">{view.description}</p>
        </div>
      </div>

      <div className="px-5 py-4">
        <Form form={form} update={update} errors={errors} />
      </div>

      <div className="flex justify-end items-center gap-2 px-5 py-3 border-t border-brand-50">
        {saved && !dirty && (
          <span className="flex items-center gap-1 mr-auto text-xs font-semibold text-success">
            <Check size={14} /> Cambios guardados
          </span>
        )}
        <Button variant="secondary" onClick={() => setResetting(true)}>
          <RotateCcw size={16} /> Restaurar predeterminados
        </Button>
        <Button onClick={save} disabled={!dirty}>
          Guardar cambios
        </Button>
      </div>

      {resetting && (
        <ConfirmDialog
          title="Restaurar predeterminados"
          message={`¿Restaurar "${view.label}" a sus valores predeterminados? Se perderán los cambios guardados en esta sección.`}
          confirmLabel="Restaurar"
          onCancel={() => setResetting(false)}
          onConfirm={reset}
        />
      )}
    </section>
  );
}

export default function Settings() {
  const [viewId, setViewId] = useState(VIEWS[0].id);
  const view = VIEWS.find((v) => v.id === viewId);

  return (
    <div className="p-6">
      <div className="mb-6">
        <SegmentedTabs
          value={viewId}
          onChange={setViewId}
          label="Sección"
          options={VIEWS.map((v) => [v.id, v.label])}
        />
      </div>

      <div className="max-w-3xl">
        {/* key: switching views starts a fresh form with that view's saved values */}
        <SettingsView key={view.id} view={view} />
      </div>
    </div>
  );
}
