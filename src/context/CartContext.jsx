import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'veloce_cart';
const APPLIED_PROMO_KEY = 'veloce_applied_promo';

// Indian E-Commerce Shipping & Tax Rules
export const FREE_SHIPPING_THRESHOLD_INR = 999;
export const STANDARD_SHIPPING_INR = 99;

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedPromo, setAppliedPromo] = useState(() => {
    try {
      const saved = localStorage.getItem(APPLIED_PROMO_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  }, [items]);

  useEffect(() => {
    try {
      if (appliedPromo) {
        localStorage.setItem(APPLIED_PROMO_KEY, JSON.stringify(appliedPromo));
      } else {
        localStorage.removeItem(APPLIED_PROMO_KEY);
      }
    } catch (e) {
      console.warn('Failed to save promo to localStorage', e);
    }
  }, [appliedPromo]);

  const addToCart = (product, quantity = 1, selectedVariant = null) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedVariant === selectedVariant
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      }
      return [...prev, { id: `${product.id}-${selectedVariant || 'default'}`, product, quantity, selectedVariant }];
    });
  };

  const removeFromCart = (itemId) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedPromo(null);
  };

  const applyPromo = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'EARTH15') {
      const promo = { code: 'EARTH15', type: 'percent', value: 0.15, label: '15% Off Earthy Living' };
      setAppliedPromo(promo);
      return { success: true, message: '15% discount applied successfully!' };
    }
    if (cleanCode === 'SEEDS250') {
      const promo = { code: 'SEEDS250', type: 'fixed', value: 250, label: '₹250 Seeds Voucher' };
      setAppliedPromo(promo);
      return { success: true, message: '₹250 discount voucher applied successfully!' };
    }
    if (cleanCode === 'EARTH500') {
      const promo = { code: 'EARTH500', type: 'fixed', value: 500, label: '₹500 Artisan Voucher' };
      setAppliedPromo(promo);
      return { success: true, message: '₹500 discount voucher applied!' };
    }
    if (cleanCode === 'WELCOME10') {
      const promo = { code: 'WELCOME10', type: 'percent', value: 0.10, label: '10% Welcome Patron Off' };
      setAppliedPromo(promo);
      return { success: true, message: '10% Welcome Patron discount applied!' };
    }
    return { success: false, message: 'Invalid or expired promotional code. Try EARTH15 or SEEDS250.' };
  };

  const removePromo = () => {
    setAppliedPromo(null);
  };

  // Indian Pricing & Tax Calculations
  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === 'percent') {
      discountAmount = Math.round(subtotal * appliedPromo.value);
    } else if (appliedPromo.type === 'fixed') {
      discountAmount = Math.min(subtotal, appliedPromo.value);
    }
  }

  const discountedSubtotal = Math.max(0, subtotal - discountAmount);

  // Free shipping above ₹999, else ₹99
  const shipping = subtotal === 0 ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD_INR ? 0 : STANDARD_SHIPPING_INR;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD_INR - subtotal);

  // Configurable GST calculation: Item-level or 12% standard GST average
  // Split into CGST (50%) and SGST (50%) for clear Indian tax invoice
  const calculatedGst = items.reduce((acc, item) => {
    const rate = item.product.gstRate || 0.12;
    const itemTotal = item.product.price * item.quantity;
    return acc + (itemTotal * rate);
  }, 0);

  // Pro-rate GST on discounted subtotal
  const effectiveGst = subtotal > 0 ? (calculatedGst * (discountedSubtotal / subtotal)) : 0;
  const cgst = Math.round((effectiveGst / 2) * 100) / 100;
  const sgst = Math.round((effectiveGst / 2) * 100) / 100;
  const totalTax = cgst + sgst;

  const total = Math.round(discountedSubtotal + shipping + totalTax);

  const value = {
    items,
    totalItemsCount,
    subtotal,
    discountAmount,
    discountedSubtotal,
    shipping,
    amountToFreeShipping,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD_INR,
    cgst,
    sgst,
    tax: totalTax,
    total,
    appliedPromo,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyPromo,
    removePromo
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default CartContext;
