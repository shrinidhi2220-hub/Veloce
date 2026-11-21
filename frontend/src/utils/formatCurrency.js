/**
 * Centralized Indian Rupee (INR / ₹) currency formatting utility for VELOCE ONLINE STORE.
 * Uses standard Indian numbering system (Lakhs, Crores) with proper ₹ symbol.
 *
 * @param {number} amount - The amount in INR to format
 * @param {boolean} forceDecimals - Whether to always show .00 (defaults to false for clean e-commerce UI)
 * @returns {string} - Formatted currency string, e.g. "₹1,499" or "₹2,450.50"
 */
export function formatCurrency(amount, forceDecimals = false) {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }

  const num = Number(amount);
  const hasDecimals = num % 1 !== 0;

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: forceDecimals || hasDecimals ? 2 : 0,
    maximumFractionDigits: 2
  }).format(num);
}

export default formatCurrency;
