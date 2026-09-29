import { useState } from 'react';
import { Shirt } from 'lucide-react';

// Shows the product photo, or a placeholder when there is none or it fails to load
export default function ProductImage({ src, alt, className = '' }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className={`flex items-center justify-center bg-brand-100 text-brand-300 ${className}`}>
        <Shirt size={22} strokeWidth={1.5} />
      </div>
    );
  }
  return <img src={src} alt={alt} onError={() => setFailed(true)} className={`object-cover ${className}`} />;
}
