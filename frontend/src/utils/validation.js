/**
 * Form field validators for the VELOCE customer-facing checkout & patron interfaces.
 * Optimized for Indian e-commerce standards (+91 mobile numbers, 6-digit PIN codes, UPI).
 */

export const validateEmail = (email) => {
  if (!email || !email.trim()) return 'Email address is required.';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address (e.g. name@example.com).';
  }
  return null;
};

export const validateRequired = (value, fieldName = 'This field') => {
  if (!value || !value.toString().trim()) {
    return `${fieldName} is required.`;
  }
  return null;
};

export const validateIndianPhone = (phone) => {
  if (!phone || !phone.trim()) return 'Mobile number is required.';
  const digitsOnly = phone.replace(/\D/g, '');
  // Allows 10 digits or 12 digits with country code 91
  const valid10 = digitsOnly.length === 10 && /^[6-9]\d{9}$/.test(digitsOnly);
  const valid12 = digitsOnly.length === 12 && digitsOnly.startsWith('91') && /^91[6-9]\d{9}$/.test(digitsOnly);

  if (!valid10 && !valid12) {
    return 'Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).';
  }
  return null;
};

export const validateIndianPinCode = (code) => {
  if (!code || !code.trim()) return 'PIN code is required.';
  const clean = code.trim();
  if (!/^\d{6}$/.test(clean)) {
    return 'Please enter a valid 6-digit Indian PIN code (e.g. 560038).';
  }
  return null;
};

export const validateUPI = (vpa) => {
  if (!vpa || !vpa.trim()) return 'UPI ID is required.';
  if (!/^[\w.-]+@[\w.-]+$/.test(vpa.trim())) {
    return 'Please enter a valid UPI ID format (e.g. name@okhdfcbank).';
  }
  return null;
};

export const validateIndianCheckoutForm = (formData, paymentMethod, paymentDetails = {}) => {
  const errors = {};

  const nameError = validateRequired(formData.fullName, 'Full name');
  if (nameError) errors.fullName = nameError;

  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;

  const phoneError = validateIndianPhone(formData.phone);
  if (phoneError) errors.phone = phoneError;

  const addressError = validateRequired(formData.address, 'House / Flat no. & Street address');
  if (addressError) errors.address = addressError;

  const cityError = validateRequired(formData.city, 'City');
  if (cityError) errors.city = cityError;

  const stateError = validateRequired(formData.state, 'State');
  if (stateError) errors.state = stateError;

  const pinError = validateIndianPinCode(formData.postalCode);
  if (pinError) errors.postalCode = pinError;

  // Validate payment details if applicable
  if (paymentMethod === 'upi' && paymentDetails.upiType === 'id') {
    const upiError = validateUPI(paymentDetails.upiId);
    if (upiError) errors.upiId = upiError;
  }

  if (paymentMethod === 'card') {
    if (!paymentDetails.cardNumber || paymentDetails.cardNumber.replace(/\s/g, '').length < 15) {
      errors.cardNumber = 'Please enter a valid 16-digit card number.';
    }
    if (!paymentDetails.cardExpiry || !/^\d{2}\/\d{2}$/.test(paymentDetails.cardExpiry)) {
      errors.cardExpiry = 'Enter expiry as MM/YY.';
    }
    if (!paymentDetails.cardCvv || paymentDetails.cardCvv.length < 3) {
      errors.cardCvv = 'Enter 3-digit CVV.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export default {
  validateEmail,
  validateRequired,
  validateIndianPhone,
  validateIndianPinCode,
  validateUPI,
  validateIndianCheckoutForm
};
