import { useState } from 'react';
import { registerPurchase, usePurchases } from '@/features/purchases/store';
import PurchaseForm from '@/features/purchases/PurchaseForm';
import PurchaseOrders from '@/features/purchases/PurchaseOrders';
import useSuppliers from '@/features/suppliers/store';
import useProducts from '@/features/products/store';

export default function Purchases() {
  const { items: products } = useProducts();
  const { items: purchases } = usePurchases();
  const { items: suppliers } = useSuppliers();
  const [buying, setBuying] = useState(false);

  return (
    <div className="p-6">
      {buying ? (
        <PurchaseForm
          products={products}
          suppliers={suppliers}
          onClose={() => setBuying(false)}
          onSave={(data, file) => {
            registerPurchase(data, file);
            setBuying(false);
          }}
        />
      ) : (
        <PurchaseOrders
          purchases={purchases}
          suppliers={suppliers}
          products={products}
          onNew={() => setBuying(true)}
          canCreate={products.length > 0}
        />
      )}
    </div>
  );
}
