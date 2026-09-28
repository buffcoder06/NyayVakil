// src/lib/http.ts
// Browser-side helper for calling our /api routes. Unwraps { success, data, message },
// throws an Error carrying the server's message, and sends the user to /login when
// the session has expired.

export async function apiFetch<T>(
  url: string,
  options: { method?: 'GET' | 'POST' | 'PUT' | 'DELETE'; body?: unknown } = {}
): Promise<T> {
  const res = await fetch(url, {
    method: options.method ?? 'GET',
    headers: options.body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (res.status === 401 && typeof window !== 'undefined') {
    const next = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.href = `/login?expired=1&next=${next}`;
    throw new Error('Your session has expired. Please sign in again.');
  }

  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.success) {
    throw new Error(json?.message ?? `Request failed (${res.status})`);
  }
  return json.data as T;
}
