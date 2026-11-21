import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiClient } from '../services/api.js';

const CartContext = createContext(null);
const SESSION_KEY = 'veloce_cart_session';
export const FREE_SHIPPING_THRESHOLD_INR = 999;
export const STANDARD_SHIPPING_INR = 0;

function getOrCreateSessionId() {
  let value = localStorage.getItem(SESSION_KEY);
  if (!value) {
    value = (globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function')
      ? globalThis.crypto.randomUUID()
      : `vlc-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(SESSION_KEY, value);
  }
  return value;
}

function normalizeCart(raw) {
  return (raw?.items || []).map((line) => {
    const product = line.product || {};
    const images = Array.isArray(product.images) ? product.images : [];
    const id = line.productId || product.id;
    const unitPrice = Number(line.unitPrice ?? product.price ?? 0);
    return {
      ...line,
      id,
      product: {
        ...product,
        id,
        price: unitPrice,
        images,
        image: images[0] || product.image || '',
        category: product.category || 'Marketplace',
        categorySlug: String(product.category || 'marketplace').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        inStock: Number(product.stock || 0) > 0,
      },
      unitPrice,
      quantity: Number(line.quantity || 0),
      selectedVariant: null,
    };
  });
}

export function CartProvider({ children }) {
  const sessionId = useMemo(() => getOrCreateSessionId(), []);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cartError, setCartError] = useState('');

  const refreshCart = async () => {
    const response = await apiClient(`/cart/${encodeURIComponent(sessionId)}`);
    const next = normalizeCart(response.data);
    setItems(next);
    setCartError('');
    return next;
  };

  useEffect(() => {
    let active = true;
    apiClient(`/cart/${encodeURIComponent(sessionId)}`)
      .then((response) => { if (active) setItems(normalizeCart(response.data)); })
      .catch((error) => { if (active) setCartError(error.message || 'Cart could not be loaded'); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [sessionId]);

  const addToCart = async (product, quantity = 1) => {
    if (!product?.id) throw new Error('This product is not connected to the live catalogue yet. Refresh the catalogue and try again.');
    const response = await apiClient('/cart', {
      method: 'POST',
      body: JSON.stringify({ sessionId, productId: product.id, quantity }),
    });
    setItems(normalizeCart(response.data));
    return response.data;
  };

  const removeFromCart = async (productId) => {
    const response = await apiClient(`/cart/${encodeURIComponent(sessionId)}/items/${encodeURIComponent(productId)}`, { method: 'DELETE' });
    setItems(normalizeCart(response.data));
    return response.data;
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) return removeFromCart(productId);
    const response = await apiClient(`/cart/${encodeURIComponent(sessionId)}/items/${encodeURIComponent(productId)}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    });
    setItems(normalizeCart(response.data));
    return response.data;
  };

  // The backend checkout clears database cart rows in the same transaction as
  // the order. This local clear is called only after a successful server reply.
  const clearCart = () => setItems([]);
  const applyPromo = () => ({ success: false, message: 'Promo codes are not enabled in this MVP checkout.' });
  const removePromo = () => {};

  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const value = {
    items, sessionId, isLoading, cartError, refreshCart,
    totalItemsCount, subtotal, discountAmount: 0, discountedSubtotal: subtotal,
    shipping: 0, amountToFreeShipping: 0, freeShippingThreshold: FREE_SHIPPING_THRESHOLD_INR,
    cgst: 0, sgst: 0, tax: 0, total: subtotal, appliedPromo: null,
    addToCart, removeFromCart, updateQuantity, clearCart, applyPromo, removePromo,
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
export default CartContext;