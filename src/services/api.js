/**
 * VELOCE API Configuration & Base Client Shell
 *
 * NOTE: STRICTLY PREPARED FOR FUTURE BACKEND INTEGRATION.
 * No network calls are made during the frontend demonstration phase.
 * Ready to be connected to backend baseURL and authentication headers once provided.
 */

export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

/**
 * Lightweight fetch wrapper skeleton ready for future REST API integration.
 */
export async function apiClient(endpoint, options = {}) {
  const url = `${API_CONFIG.baseURL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const headers = {
    ...API_CONFIG.headers,
    ...options.headers
  };

  // When backend integration is initiated, uncomment real network request:
  /*
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }
  return response.json();
  */

  console.info(`[API Shell] Request prepared for: ${url}`, { options });
  return { status: 'mock_pending_backend', endpoint };
}

export default apiClient;
