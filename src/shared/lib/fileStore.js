// Keeps uploaded files (invoice PDFs, photos) in the browser's IndexedDB until the backend can store them.
// localStorage is too small for files, so records only keep the file's name/type/size.
const DB = 'mahosoft-files';
const STORE = 'files';

function open() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function run(mode, action) {
  const db = await open();
  return new Promise((resolve, reject) => {
    const req = action(db.transaction(STORE, mode).objectStore(STORE));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export const saveFile = (key, file) => run('readwrite', (s) => s.put(file, key));
export const getFile = (key) => run('readonly', (s) => s.get(key));
export const deleteFile = (key) => run('readwrite', (s) => s.delete(key));

/** Name, type and size of a file, the part a record can safely keep */
export const fileInfo = (file) => ({ nombre: file.name, tipo: file.type, tamano: file.size });

export const formatSize = (n) =>
  n < 1024 * 1024 ? `${Math.round(n / 1024)} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`;

/** Opens a stored file in a new tab; returns false when it is no longer in this browser */
export async function openFile(key) {
  const tab = window.open('', '_blank'); // open synchronously so the popup isn't blocked
  const blob = await getFile(key).catch(() => null);
  if (!blob) {
    tab?.close();
    return false;
  }
  const url = URL.createObjectURL(blob);
  if (tab) tab.location.href = url;
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
  return true;
}
