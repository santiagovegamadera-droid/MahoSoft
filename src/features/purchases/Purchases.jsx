import { useState } from 'react';
import { registerPurchase, usePurchases } from '@/features/purchases/store';
import PurchaseForm from '@/features/purchases/PurchaseForm';
import PurchaseOrders from '@/features/purchases/PurchaseOrders';
import useSuppliers from '@/features/suppliers/store';
import useProducts from '@/features/products/store';
import { ErrorAlert, LoadingState } from '@/shared/components/Feedback';

/** `order` ({ productoId, talla }) opens a new purchase with that line, e.g. from a stock alert on the home screen */
export default function Purchases({ order, onOrderUsed }) {
  const { items: products, loaded: productsLoaded } = useProducts();
  const { items: purchases, loaded, loading, error, reload } = usePurchases();
  const { items: suppliers, loaded: suppliersLoaded } = useSuppliers();
  const [buying, setBuying] = useState(Boolean(order));

  function closeForm() {
    setBuying(false);
    onOrderUsed?.();
  }

  return (
    <div className="p-4 sm:p-6">
      {buying ? (
        // The form starts from the product and supplier lists, so it waits for them
        productsLoaded && suppliersLoaded ? (
          <PurchaseForm
            products={products}
            suppliers={suppliers}
            order={order}
            onClose={closeForm}
            onSave={async (data, file) => {
              await registerPurchase(data, file);
              closeForm();
            }}
          />
        ) : (
          <LoadingState message="Preparando la compra…" />
        )
      ) : (
        <>
          <ErrorAlert message={error} onRetry={reload} className="mb-4" />
          <PurchaseOrders
            purchases={purchases}
            loaded={loaded}
            loading={loading}
            suppliers={suppliers}
            onNew={() => setBuying(true)}
            canCreate={products.length > 0}
          />
        </>
      )}
    </div>
  );
}
