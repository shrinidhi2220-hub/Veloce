export const API_CONFIG = {
  baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/$/, ''),
  headers: { Accept: 'application/json' },
};

export async function apiClient(endpoint, options = {}) {
  const { params, headers: customHeaders, ...fetchOptions } = options;
  const url = new URL(`${API_CONFIG.baseURL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`);
  if (params && typeof params === 'object') {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, String(value));
    }
  }
  const headers = new Headers(API_CONFIG.headers);
  if (customHeaders) Object.entries(customHeaders).forEach(([key, value]) => headers.set(key, value));
  const token = localStorage.getItem('veloce_access_token');
  if (token && !headers.has('Authorization')) headers.set('Authorization', `Bearer ${token}`);
  if (fetchOptions.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  const response = await fetch(url.toString(), { ...fetchOptions, headers });
  let payload = {};
  try { payload = await response.json(); } catch { payload = {}; }
  if (!response.ok) throw new Error(payload.message || `API request failed (${response.status})`);
  return payload;
}

export default apiClient;