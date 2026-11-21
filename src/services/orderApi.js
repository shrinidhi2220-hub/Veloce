import { apiClient } from './api.js';

/**
 * Order & Checkout API Service Layer Skeleton
 *
 * Prepared for future backend integration.
 */

export const orderApi = {
  /**
   * Submit an order for server processing
   */
  async createOrder(orderPayload) {
    return apiClient('/orders', {
      method: 'POST',
      body: JSON.stringify(orderPayload)
    });
  },

  /**
   * Validate promotional or reward voucher code
   */
  async validatePromoCode(code, subtotal) {
    return apiClient('/promos/validate', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal })
    });
  },

  /**
   * Fetch order status by reference ID
   */
  async getOrder(orderId) {
    return apiClient(`/orders/${orderId}`, {
      method: 'GET'
    });
  }
};

export default orderApi;
