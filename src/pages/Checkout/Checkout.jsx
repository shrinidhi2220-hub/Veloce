import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useUI } from '../../context/UIContext.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { validateIndianCheckoutForm } from '../../utils/validation.js';
import { Button } from '../../components/common/Button/Button.jsx';
import { Badge } from '../../components/common/Badge/Badge.jsx';
import {
  ShieldCheck,
  CreditCard,
  Banknote,
  QrCode,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Smartphone,
  Info
} from 'lucide-react';
import './Checkout.css';

const INDIAN_STATES = [
  'Karnataka',
  'Maharashtra',
  'Delhi NCR',
  'Tamil Nadu',
  'Telangana',
  'Kerala',
  'Gujarat',
  'Rajasthan',
  'West Bengal',
  'Uttar Pradesh',
  'Goa',
  'Punjab',
  'Haryana',
  'Madhya Pradesh'
];

export function Checkout() {
  const {
    items,
    subtotal,
    discountAmount,
    discountedSubtotal,
    shipping,
    cgst,
    sgst,
    tax,
    total,
    clearCart
  } = useCart();

  const { user, addSeeds } = useAuth();
  const { showToast } = useUI();
  const navigate = useNavigate();

  // Prefill from authenticated patron session if available
  const defaultAddr = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0];

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone ? user.phone.replace('+91 ', '') : '',
    flatNo: defaultAddr ? defaultAddr.addressLine.split(',')[0] : '',
    address: defaultAddr ? defaultAddr.addressLine : '',
    city: defaultAddr ? defaultAddr.city : 'Bengaluru',
    state: defaultAddr ? defaultAddr.state : 'Karnataka',
    postalCode: defaultAddr ? defaultAddr.postalCode : '560038',
    country: 'India'
  });

  // Sync with user data once loaded
  useEffect(() => {
    if (user) {
      const addr = user.addresses?.find((a) => a.isDefault) || user.addresses?.[0];
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.fullName || '',
        email: prev.email || user.email || '',
        phone: prev.phone || (user.phone ? user.phone.replace('+91 ', '') : ''),
        flatNo: prev.flatNo || (addr ? addr.addressLine.split(',')[0] : ''),
        address: prev.address || (addr ? addr.addressLine : ''),
        city: addr ? addr.city : prev.city,
        state: addr ? addr.state : prev.state,
        postalCode: addr ? addr.postalCode : prev.postalCode
      }));
    }
  }, [user]);

  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'cod' | 'card'

  // UPI sub-options
  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay'); // 'gpay' | 'phonepe' | 'paytm' | 'id'
  const [upiIdInput, setUpiIdInput] = useState('patron@okhdfcbank');

  // Card demo state
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '4532 8920 1284 9012',
    cardExpiry: '08/28',
    cardCvv: '482',
    cardName: user?.fullName || 'Conscious Patron'
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (!items.length) {
      showToast('Your bag is empty. Please add items before checking out.', 'error');
      navigate('/catalogue');
      return;
    }

    const paymentDetails = {
      upiType: selectedUpiApp === 'id' ? 'id' : 'app',
      upiId: upiIdInput,
      ...cardDetails
    };

    const { isValid, errors } = validateIndianCheckoutForm(formData, paymentMethod, paymentDetails);
    if (!isValid) {
      setFormErrors(errors);
      showToast('Please correct the highlighted fields.', 'error');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const generatedOrderId = `VEL-IND-${Math.floor(100000 + Math.random() * 900000)}`;

      let formattedPaymentMethod = 'Instant UPI (Google Pay)';
      if (paymentMethod === 'upi') {
        formattedPaymentMethod = selectedUpiApp === 'id' ? `UPI ID (${upiIdInput})` : `UPI App (${selectedUpiApp.toUpperCase()})`;
      } else if (paymentMethod === 'cod') {
        formattedPaymentMethod = 'Cash on Delivery (Doorstep QR / Cash)';
      } else if (paymentMethod === 'card') {
        formattedPaymentMethod = `Card ending in ${cardDetails.cardNumber.slice(-4)}`;
      }

      const orderRecap = {
        orderId: generatedOrderId,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: 'Order Confirmed',
        statusVariant: 'terracotta',
        customer: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone.startsWith('+91') ? formData.phone : `+91 ${formData.phone}`,
          address: `${formData.flatNo ? `${formData.flatNo}, ` : ''}${formData.address}`,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: 'India'
        },
        paymentMethod: formattedPaymentMethod,
        items: items.map((item) => ({
          name: item.product.name,
          category: item.product.category,
          quantity: item.quantity,
          price: item.product.price,
          image: item.product.images ? item.product.images[0] : item.product.image
        })),
        pricing: {
          subtotal,
          discountAmount,
          discountedSubtotal,
          shipping,
          cgst,
          sgst,
          tax,
          total
        }
      };

      // Persist order in localStorage so it appears in My Account and Order Tracking
      try {
        const existingOrders = JSON.parse(localStorage.getItem('veloce_orders') || '[]');
        localStorage.setItem('veloce_orders', JSON.stringify([orderRecap, ...existingOrders]));
      } catch (err) {
        console.warn('Failed to save order to localStorage', err);
      }

      // Award VELOCE Seeds (10 seeds per ₹100 spent)
      const earnedSeeds = Math.round(total / 10);
      addSeeds(earnedSeeds);

      clearCart();
      setIsSubmitting(false);

      showToast(`Order confirmed! You earned +${earnedSeeds} VELOCE Seeds!`);
      navigate('/order-success', { state: { order: orderRecap } });
    }, 850);
  };

  if (!items.length) {
    return (
      <div className="checkout-page">
        <div className="container" style={{ textAlign: 'center', padding: '5rem 0' }}>
          <h2>Your Shopping Bag is Empty</h2>
          <p style={{ marginTop: '8px', marginBottom: '1.5rem', color: 'var(--color-muted)' }}>
            Please add items from the market catalogue before proceeding to checkout.
          </p>
          <Link to="/catalogue">
            <Button variant="terracotta" size="lg">Browse Handcrafted Goods</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        {/* Hackathon Banner */}
        <div
          style={{
            backgroundColor: 'var(--color-sage-light)',
            border: '1px solid var(--color-sage)',
            borderRadius: 'var(--radius-lg)',
            padding: '0.85rem 1.25rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <Sparkles size={20} color="var(--color-sage)" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-charcoal)' }}>
            <strong>Build Bengaluru Hackathon Simulation:</strong> Complete Indian e-commerce checkout
            experience with live UPI, COD, and card selectors, GST invoicing, and local session persistence.
          </div>
        </div>

        <h1 style={{ marginBottom: '2rem' }}>Complete Your Order</h1>

        <form onSubmit={handlePlaceOrder} className="checkout-layout">
          {/* Left Column: Customer, Address & Payment */}
          <div>
            {/* 1. Customer Information */}
            <div className="checkout-card">
              <div className="checkout-step-header">
                <span className="step-num">1</span>
                <div>
                  <h3 style={{ fontSize: '1.25rem' }}>Customer & Contact Details</h3>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>
                    Your Indian mobile number for courier SMS dispatch updates.
                  </p>
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. Rahul Sharma"
                    className="form-input"
                  />
                  {formErrors.fullName && <span className="form-error">{formErrors.fullName}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Indian Mobile Number (+91) *</label>
                  <div style={{ display: 'flex' }}>
                    <span style={{ padding: '0.8rem 0.9rem', backgroundColor: 'var(--color-ivory)', border: '1px solid var(--color-border)', borderRight: 'none', borderRadius: 'var(--radius-md) 0 0 var(--radius-md)', fontSize: 'var(--text-sm)', color: 'var(--color-muted)', fontWeight: 600 }}>
                      +91
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="9876543210"
                      maxLength={10}
                      className="form-input"
                      style={{ borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}
                    />
                  </div>
                  {formErrors.phone && <span className="form-error">{formErrors.phone}</span>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address for Invoice *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="rahul@example.com"
                  className="form-input"
                />
                {formErrors.email && <span className="form-error">{formErrors.email}</span>}
              </div>
            </div>

            {/* 2. Indian Delivery Destination */}
            <div className="checkout-card">
              <div className="checkout-step-header">
                <span className="step-num">2</span>
                <div>
                  <h3 style={{ fontSize: '1.25rem' }}>Shipping Destination in India</h3>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>
                    Plastic-free, carbon-neutral delivery across all Indian pin codes.
                  </p>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Flat / House No., Apartment / Building *</label>
                <input
                  type="text"
                  name="flatNo"
                  value={formData.flatNo}
                  onChange={handleInputChange}
                  placeholder="e.g. Flat 402, Magnolia Residency"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Street Address, Colony / Landmark *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="e.g. 12th Main, Indiranagar near Metro Station"
                  className="form-input"
                />
                {formErrors.address && <span className="form-error">{formErrors.address}</span>}
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g. Bengaluru"
                    className="form-input"
                  />
                  {formErrors.city && <span className="form-error">{formErrors.city}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">State *</label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">6-Digit Indian PIN Code *</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder="560038"
                    maxLength={6}
                    className="form-input"
                  />
                  {formErrors.postalCode && <span className="form-error">{formErrors.postalCode}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Country</label>
                  <input
                    type="text"
                    value="India"
                    disabled
                    className="form-input"
                    style={{ backgroundColor: 'var(--color-ivory)' }}
                  />
                </div>
              </div>
            </div>

            {/* 3. Payment Method: UPI, COD, Card */}
            <div className="checkout-card">
              <div className="checkout-step-header">
                <span className="step-num">3</span>
                <div>
                  <h3 style={{ fontSize: '1.25rem' }}>Payment Selection</h3>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>
                    Choose your preferred simulated Indian payment gateway.
                  </p>
                </div>
              </div>

              {/* Option 1: Instant UPI */}
              <div
                className={`payment-method-option ${paymentMethod === 'upi' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('upi')}
              >
                <Smartphone size={22} color="var(--color-terracotta)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>Instant UPI (GPay / PhonePe / Paytm)</span>
                    <Badge variant="terracotta">Fast & Free</Badge>
                  </div>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', marginTop: '2px' }}>
                    Pay zero transaction fee via any Indian UPI application or virtual address.
                  </p>

                  {paymentMethod === 'upi' && (
                    <div style={{ marginTop: '12px', borderTop: '1px solid var(--color-border)', paddingTop: '10px' }}>
                      <div className="upi-apps-row">
                        <button
                          type="button"
                          className={`upi-app-pill ${selectedUpiApp === 'gpay' ? 'selected' : ''}`}
                          onClick={(e) => { e.stopPropagation(); setSelectedUpiApp('gpay'); }}
                        >
                          Google Pay
                        </button>
                        <button
                          type="button"
                          className={`upi-app-pill ${selectedUpiApp === 'phonepe' ? 'selected' : ''}`}
                          onClick={(e) => { e.stopPropagation(); setSelectedUpiApp('phonepe'); }}
                        >
                          PhonePe
                        </button>
                        <button
                          type="button"
                          className={`upi-app-pill ${selectedUpiApp === 'paytm' ? 'selected' : ''}`}
                          onClick={(e) => { e.stopPropagation(); setSelectedUpiApp('paytm'); }}
                        >
                          Paytm
                        </button>
                        <button
                          type="button"
                          className={`upi-app-pill ${selectedUpiApp === 'id' ? 'selected' : ''}`}
                          onClick={(e) => { e.stopPropagation(); setSelectedUpiApp('id'); }}
                        >
                          Enter UPI ID
                        </button>
                      </div>

                      {selectedUpiApp === 'id' && (
                        <div style={{ marginTop: '10px' }} onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            value={upiIdInput}
                            onChange={(e) => setUpiIdInput(e.target.value)}
                            placeholder="username@bank"
                            className="form-input"
                            style={{ fontSize: 'var(--text-xs)', padding: '0.6rem 0.8rem' }}
                          />
                          {formErrors.upiId && <span className="form-error">{formErrors.upiId}</span>}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Option 2: Cash on Delivery */}
              <div
                className={`payment-method-option ${paymentMethod === 'cod' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('cod')}
              >
                <Banknote size={22} color="var(--color-charcoal)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>Cash on Delivery (COD)</div>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', marginTop: '2px' }}>
                    Pay via cash or doorstep UPI scan when your artisan pack arrives.
                  </p>
                </div>
              </div>

              {/* Option 3: Card */}
              <div
                className={`payment-method-option ${paymentMethod === 'card' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('card')}
              >
                <CreditCard size={22} color="var(--color-sage)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>Credit / Debit / Rupay Card</div>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', marginTop: '2px' }}>
                    Simulated card interface (Visa, Mastercard, RuPay accepted).
                  </p>

                  {paymentMethod === 'card' && (
                    <div style={{ marginTop: '12px', borderTop: '1px solid var(--color-border)', paddingTop: '10px' }} onClick={(e) => e.stopPropagation()}>
                      <div className="form-group" style={{ marginBottom: '8px' }}>
                        <input
                          type="text"
                          value={cardDetails.cardNumber}
                          onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                          placeholder="Card Number (4XXX XXXX XXXX XXXX)"
                          className="form-input"
                          style={{ fontSize: 'var(--text-xs)' }}
                        />
                        {formErrors.cardNumber && <span className="form-error">{formErrors.cardNumber}</span>}
                      </div>

                      <div className="grid-2">
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <input
                            type="text"
                            value={cardDetails.cardExpiry}
                            onChange={(e) => setCardDetails({ ...cardDetails, cardExpiry: e.target.value })}
                            placeholder="MM/YY"
                            maxLength={5}
                            className="form-input"
                            style={{ fontSize: 'var(--text-xs)' }}
                          />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <input
                            type="password"
                            value={cardDetails.cardCvv}
                            onChange={(e) => setCardDetails({ ...cardDetails, cardCvv: e.target.value })}
                            placeholder="CVV"
                            maxLength={3}
                            className="form-input"
                            style={{ fontSize: 'var(--text-xs)' }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Invoicing */}
          <aside>
            <div className="checkout-card" style={{ position: 'sticky', top: 'calc(var(--navbar-height) + 20px)' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>
                Order Summary ({items.length} {items.length === 1 ? 'find' : 'finds'})
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '240px', overflowY: 'auto', marginBottom: '1.25rem' }}>
                {items.map((item) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={item.product.images ? item.product.images[0] : item.product.image}
                      alt={item.product.name}
                      style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1, fontSize: 'var(--text-xs)' }}>
                      <div style={{ fontWeight: 600, color: 'var(--color-charcoal)' }}>{item.product.name}</div>
                      <div style={{ color: 'var(--color-muted)' }}>Qty: {item.quantity}</div>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: 'var(--text-xs)' }}>
                      {formatCurrency(item.product.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing & GST Breakdown */}
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', marginBottom: '6px' }}>
                  <span>Items Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--color-terracotta)', marginBottom: '6px' }}>
                    <span>Promotional Discount</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', marginBottom: '6px' }}>
                  <span>Pan-India Delivery</span>
                  <span>{shipping === 0 ? <strong style={{ color: 'var(--color-success)' }}>FREE</strong> : formatCurrency(shipping)}</span>
                </div>

                {/* GST Box */}
                <div className="summary-gst-breakdown">
                  <div className="gst-line">
                    <span>Central GST (CGST @ 6%)</span>
                    <span>{formatCurrency(cgst)}</span>
                  </div>
                  <div className="gst-line">
                    <span>State GST (SGST @ 6%)</span>
                    <span>{formatCurrency(sgst)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: 'var(--color-charcoal)', marginTop: '4px', borderTop: '1px dashed var(--color-border)', paddingTop: '4px' }}>
                    <span>Total Tax Included</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 700, borderTop: '1px solid var(--color-border)', paddingTop: '10px', color: 'var(--color-charcoal)' }}>
                  <span>Grand Total (INR)</span>
                  <span style={{ color: 'var(--color-charcoal)' }}>{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Seeds Earned Preview */}
              <div style={{ backgroundColor: 'var(--color-eucalyptus-light)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--color-charcoal)' }}>
                <Sparkles size={14} color="var(--color-terracotta)" />
                <span>You will harvest <strong>+{Math.round(total / 10)} VELOCE Seeds</strong> on this purchase!</span>
              </div>

              <Button
                type="submit"
                variant="terracotta"
                size="lg"
                loading={isSubmitting}
                style={{ width: '100%' }}
              >
                Confirm Order • {formatCurrency(total)}
              </Button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '11px', color: 'var(--color-muted)', marginTop: '12px' }}>
                <Lock size={12} />
                <span>Simulated 256-bit Indian payment gateway</span>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
