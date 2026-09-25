// Calls to the MahoSoft API. The URL comes from VITE_API_URL (see .env.example).
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5241';

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

// Set by the session module so every request carries the token and a 401 signs the user out
let auth = { token: () => null, onUnauthorized: () => {} };
export const configureApiAuth = (config) => (auth = config);

/**
 * fetch() against the API: sends JSON and the session token, returns the parsed body,
 * and throws ApiError with the server's message (ProblemDetails `detail`) when it fails.
 */
export async function api(path, { method = 'GET', body, signal } = {}) {
  const token = auth.token();
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      signal,
      headers: {
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (e) {
    if (e.name === 'AbortError') throw e;
    throw new ApiError('No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.', 0);
  }

  if (res.status === 401 && token) auth.onUnauthorized();
  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message =
      data?.detail ??
      (data?.errors && Object.values(data.errors).flat()[0]) ??
      data?.title ??
      'Ocurrió un error inesperado. Inténtalo de nuevo.';
    throw new ApiError(message, res.status);
  }
  return data;
}
