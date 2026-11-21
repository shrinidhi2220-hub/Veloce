import { apiClient } from './api.js';

/**
 * Product API Service Layer Skeleton
 *
 * Prepared for future backend integration. Currently serves as an architectural
 * contract abstraction so UI components never touch raw URLs directly.
 */

export const productApi = {
  /**
   * Fetch paginated products with filtering & sorting
   */
  async getProducts(params = {}) {
    return apiClient('/products', {
      method: 'GET',
      params
    });
  },

  /**
   * Fetch single product by unique ID or slug
   */
  async getProductById(id) {
    return apiClient(`/products/${id}`, {
      method: 'GET'
    });
  },

  /**
   * Fetch category taxonomy
   */
  async getCategories() {
    return apiClient('/categories', {
      method: 'GET'
    });
  },

  /**
   * Search endpoint for future server-side search indexing
   */
  async search(query, filters = {}) {
    return apiClient('/search', {
      method: 'GET',
      params: { q: query, ...filters }
    });
  }
};

export default productApi;
