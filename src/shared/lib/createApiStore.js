import { useEffect, useSyncExternalStore } from 'react';
import { api } from '@/shared/lib/api';

/**
 * Records of one API resource (e.g. '/api/categorias'), shared by every screen that uses them.
 * Each screen that mounts the hook refreshes the list, so changes made elsewhere show up.
 * create/update/remove call the API and keep the list in sync; they throw ApiError with the
 * server's message so the screen can show it. `sort` keeps the list in the API's order after a change.
 */
export default function createApiStore(path, { sort } = {}) {
  let state = { items: [], loaded: false, loading: false, error: '' };
  const listeners = new Set();
  const setState = (patch) => {
    state = { ...state, ...patch };
    listeners.forEach((l) => l());
  };
  const setItems = (items) => setState({ items: sort ? [...items].sort(sort) : items });

  let pending = null;
  function load() {
    if (pending) return pending;
    setState({ loading: true });
    pending = api(path)
      .then((items) => setState({ items, loaded: true, loading: false, error: '' }))
      .catch((e) => setState({ loading: false, error: e.message }))
      .finally(() => (pending = null));
    return pending;
  }

  const actions = {
    reload: load,
    getById: (id) => state.items.find((i) => i.id === id),
    async create(data) {
      const item = await api(path, { method: 'POST', body: data });
      setItems([...state.items, item]);
      return item;
    },
    async update(id, data) {
      const item = await api(`${path}/${id}`, { method: 'PUT', body: data });
      setItems(state.items.map((i) => (i.id === id ? item : i)));
      return item;
    },
    async remove(id) {
      await api(`${path}/${id}`, { method: 'DELETE' });
      setItems(state.items.filter((i) => i.id !== id));
    },
  };

  const subscribe = (l) => {
    listeners.add(l);
    return () => listeners.delete(l);
  };
  const getSnapshot = () => state;

  return function useApiStore() {
    const current = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
    useEffect(() => {
      load();
    }, []);
    return { ...current, ...actions };
  };
}
