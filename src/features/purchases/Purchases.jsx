import { useState } from 'react';
import { Plus } from 'lucide-react';
import { registerPurchase, usePurchases } from '@/features/purchases/store';
import PurchaseForm from '@/features/purchases/PurchaseForm';
import PurchaseOrders from '@/features/purchases/PurchaseOrders';
import useSuppliers from '@/features/suppliers/store';
import useProducts from '@/features/products/store';
import { Button } from '@/shared/components/Form';

export default function Purchases() {
  const { items: products } = useProducts();
  const { items: purchases } = usePurchases();
  const { items: suppliers } = useSuppliers();
  const [buying, setBuying] = useState(false);

  return (
    <div className="p-8">
      <div className="flex justify-end items-center mb-6">
        <Button onClick={() => setBuying(true)} disabled={products.length === 0}>
          <Plus size={16} /> Nueva compra
        </Button>
      </div>

      <PurchaseOrders
        purchases={purchases}
        suppliers={suppliers}
        products={products}
        onNew={() => setBuying(true)}
      />

      {buying && (
        <PurchaseForm
          products={products}
          suppliers={suppliers}
          onClose={() => setBuying(false)}
          onSave={(data) => {
            registerPurchase(data);
            setBuying(false);
          }}
        />
      )}
    </div>
  );
}
