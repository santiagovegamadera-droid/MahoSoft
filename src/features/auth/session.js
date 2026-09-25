import { useSyncExternalStore } from 'react';
import { api, configureApiAuth } from '@/shared/lib/api';

/**
 * The signed-in user and their API token. "Recordarme" keeps the session in localStorage
 * (survives closing the browser); otherwise it lives in sessionStorage (ends with the tab).
 */
const KEY = 'mahosoft:session';
const listeners = new Set();

const read = (storage) => {
  try {
    return JSON.parse(storage.getItem(KEY));
  } catch {
    return null;
  }
};
const clearStorage = () => {
  try {
    localStorage.removeItem(KEY);
    sessionStorage.removeItem(KEY);
  } catch {
    // Storage unavailable: nothing was saved
  }
};

const isExpired = (s) => !s?.token || new Date(s.expiraEn) <= new Date();

let session = read(localStorage) ?? read(sessionStorage);
if (isExpired(session)) {
  session = null;
  clearStorage();
}

function set(next, remember) {
  session = next;
  clearStorage();
  if (next) {
    try {
      (remember ? localStorage : sessionStorage).setItem(KEY, JSON.stringify(next));
    } catch {
      // Storage unavailable: the session still works until the page reloads
    }
  }
  listeners.forEach((l) => l());
}

configureApiAuth({ token: () => session?.token ?? null, onUnauthorized: () => logout() });

export async function login(email, password, remember) {
  const res = await api('/api/auth/login', { method: 'POST', body: { email, password } });
  set(res, remember);
  return res.usuario;
}

export function logout() {
  set(null);
}

/** Re-reads the user from the API (permissions may have changed); a dead token signs out through the 401 */
export async function refreshUser() {
  if (!session) return;
  const usuario = await api('/api/auth/me');
  const remember = read(localStorage) !== null;
  set({ ...session, usuario }, remember);
}

const subscribe = (l) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

/** Current session ({ token, expiraEn, usuario }) or null */
export function useSession() {
  return useSyncExternalStore(subscribe, () => session);
}
