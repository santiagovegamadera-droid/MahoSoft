import { useSyncExternalStore } from 'react';

/**
 * In-memory collection shared by every component that uses it, persisted to localStorage
 * until the backend exists. Returns a hook exposing the items plus create/update/remove.
 */
export default function createCollection(name, initialItems) {
  const storageKey = `mahosoft:${name}`;
  const listeners = new Set();

  let items = initialItems;
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) items = JSON.parse(saved);
  } catch {
    // Storage unavailable or corrupt: fall back to the initial items
  }

  function setItems(next) {
    items = next;
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {
      // Ignore quota/privacy errors; data still lives in memory
    }
    listeners.forEach((l) => l());
  }

  const api = {
    getAll: () => items,
    getById: (id) => items.find((i) => i.id === id),
    create(data) {
      const item = { ...data, id: Date.now() + Math.random() };
      setItems([...items, item]);
      return item;
    },
    update(id, patch) {
      setItems(items.map((i) => (i.id === id ? { ...i, ...patch } : i)));
    },
    remove(id) {
      setItems(items.filter((i) => i.id !== id));
    },
  };

  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }
  const getSnapshot = () => items;

  function useCollection() {
    const current = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
    return { ...api, items: current };
  }

  useCollection.api = api;
  return useCollection;
}
