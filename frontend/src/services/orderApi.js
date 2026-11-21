import { apiClient } from './api.js';
export const orderApi = {
  createOrder(orderPayload) {
    return apiClient('/orders', { method: 'POST', body: JSON.stringify(orderPayload) });
  },
  getOrder(orderId) {
    return apiClient(`/orders/${encodeURIComponent(orderId)}`, { method: 'GET' });
  },
};
export default orderApi;