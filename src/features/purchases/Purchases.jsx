import { useState } from 'react';
import { registerPurchase, usePurchases } from '@/features/purchases/store';
import PurchaseForm from '@/features/purchases/PurchaseForm';
import PurchaseOrders from '@/features/purchases/PurchaseOrders';
import useSuppliers from '@/features/suppliers/store';
import useProducts from '@/features/products/store';
import { ErrorAlert } from '@/shared/components/Feedback';

export default function Purchases() {
  const { items: products } = useProducts();
  const { items: purchases, loaded, loading, error, reload } = usePurchases();
  const { items: suppliers } = useSuppliers();
  const [buying, setBuying] = useState(false);

  return (
    <div className="p-6">
      {buying ? (
        <PurchaseForm
          products={products}
          suppliers={suppliers}
          onClose={() => setBuying(false)}
          onSave={async (data, file) => {
            await registerPurchase(data, file);
            setBuying(false);
          }}
        />
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
