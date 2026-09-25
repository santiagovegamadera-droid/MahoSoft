import { useRef, useState } from 'react';
import { ImagePlus, Loader2, RefreshCw, Trash2 } from 'lucide-react';
import { uploadProductImage } from '@/features/products/store';

// Shrinks the photo before uploading (phone photos are several MB); the server keeps at most 1200 px anyway
function resizeImage(file, max = 1200) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      const done = (blob) =>
        blob ? resolve(new File([blob], 'foto.jpg', { type: 'image/jpeg' })) : reject(new Error('unreadable'));
      canvas.toBlob(done, 'image/jpeg', 0.85);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('unreadable'));
    };
    img.src = url;
  });
}

/** Product photo: uploads it to the server right away and reports { id, url } (or null when removed) */
export default function ImageUpload({ url, onChange, alt }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function pick(file) {
    if (!file || uploading) return;
    if (!file.type.startsWith('image/')) return setError('El archivo debe ser una imagen');
    setError('');
    setUploading(true);
    try {
      let photo;
      try {
        photo = await resizeImage(file);
      } catch {
        return setError('No se pudo leer la imagen');
      }
      onChange(await uploadProductImage(photo));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="w-40 shrink-0">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          pick(e.dataTransfer.files[0]);
        }}
        className={`group relative w-40 aspect-square rounded-2xl overflow-hidden border-2 transition-colors ${
          dragging ? 'border-brand-600 bg-brand-50' : url ? 'border-transparent' : 'border-dashed border-brand-200'
        }`}
      >
        {uploading ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-brand-600" role="status">
            <Loader2 size={24} className="animate-spin" />
            <span className="text-xs font-semibold">Subiendo…</span>
          </div>
        ) : url ? (
          <>
            <img src={url} alt={alt} className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-brand-900/45 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
              <button
                type="button"
                onClick={() => inputRef.current.click()}
                className="p-2 rounded-lg bg-white text-brand-800 hover:bg-brand-50"
                aria-label="Cambiar imagen"
                title="Cambiar imagen"
              >
                <RefreshCw size={16} />
              </button>
              <button
                type="button"
                onClick={() => onChange(null)}
                className="p-2 rounded-lg bg-white text-danger hover:bg-danger-soft"
                aria-label="Quitar imagen"
                title="Quitar imagen"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current.click()}
            className="w-full h-full flex flex-col items-center justify-center gap-1.5 px-3 text-center text-brand-600 hover:bg-brand-25"
          >
            <ImagePlus size={26} strokeWidth={1.5} className="text-subtle" />
            <span className="text-xs font-semibold">Subir imagen</span>
            <span className="text-xs text-subtle">o arrástrala aquí</span>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => {
          pick(e.target.files[0]);
          e.target.value = '';
        }}
        className="hidden"
      />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
