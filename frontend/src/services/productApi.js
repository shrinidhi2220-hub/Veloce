import { apiClient } from './api.js';

export const productApi = {
  getProducts(params = {}) {
    return apiClient('/products', { method: 'GET', params });
  },
  getProductById(id) {
    return apiClient(`/products/${encodeURIComponent(id)}`, { method: 'GET' });
  },
  search(query, filters = {}) {
    return apiClient('/products/search', { method: 'GET', params: { q: query, ...filters } });
  },
};
export default productApi;