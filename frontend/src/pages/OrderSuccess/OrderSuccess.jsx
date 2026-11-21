import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { Button } from '../../components/common/Button/Button.jsx';
import { Badge } from '../../components/common/Badge/Badge.jsx';
import {
  CheckCircle2,
  Package,
  Calendar,
  MapPin,
  ArrowRight,
  Sparkles,
  Printer,
  Truck
} from 'lucide-react';
import './OrderSuccess.css';

export function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  // If navigated without state, use realistic Indian demo fallback
  const order = location.state?.order || {
    orderId: 'VEL-IND-90214',
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    customer: {
      fullName: 'Rahul Sharma',
      email: 'rahul.dev@example.com',
      phone: '+91 98765 43210',
      address: '42, 12th Main, HAL 2nd Stage, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560038',
      country: 'India'
    },
    paymentMethod: 'Instant UPI (Google Pay)',
    items: [
      {
        name: 'Terracotta Fluted Ceramic Vase',
        category: 'Home & Living',
        quantity: 1,
        price: 1850,
        image: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=400&q=80'
      }
    ],
    pricing: {
      subtotal: 1850,
      discountAmount: 0,
      shipping: 0,
      cgst: 111,
      sgst: 111,
      tax: 222,
      total: 2072
    }
  };

  return (
    <div className="order-success-page">
      <div className="container">
        <div className="order-success-card">
          {/* Top Status */}
          <div className="success-header-wrap">
            <div className="success-icon-badge">
              <CheckCircle2 size={38} />
            </div>

            <div style={{ display: 'inline-block', marginBottom: '8px' }}>
              <Badge variant="terracotta">Order Placed Successfully</Badge>
            </div>

            <h1 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', marginBottom: '8px' }}>
              Dhanyavaad for Your Order!
            </h1>
            <p style={{ color: 'var(--color-muted)', maxWidth: '520px', margin: '0 auto', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
              Your Cash on Delivery order has been confirmed by the VELOCE backend. Delivery updates will appear here when courier integration is enabled. In production,
              SMS dispatch notifications will arrive on {order.customer?.phone || '+91 98765 43210'}.
            </p>
          </div>

          {/* Demonstration Notice */}
          <div
            style={{
              backgroundColor: 'var(--color-ivory)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '1rem',
              marginBottom: '2rem',
              textAlign: 'center',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-charcoal)'
            }}
          >
            <strong>Server-confirmed COD order:</strong> Your order was accepted by the VELOCE backend. Courier tracking is a separate integration and is not live in this MVP.
          </div>

          {/* Order Metadata Box */}
          <div className="order-meta-box">
            <div className="order-meta-item">
              <h5>Order Reference</h5>
              <p style={{ color: 'var(--color-terracotta)' }}>{order.orderId}</p>
            </div>
            <div className="order-meta-item">
              <h5>Order Date</h5>
              <p>{order.date}</p>
            </div>
            <div className="order-meta-item">
              <h5>Payment Method</h5>
              <p>{order.paymentMethod}</p>
            </div>
            <div className="order-meta-item">
              <h5>Total Due on Delivery (INR)</h5>
              <p style={{ color: 'var(--color-charcoal)' }}>{formatCurrency(order.pricing.total)}</p>
            </div>
          </div>

          {/* Delivery & Customer Info */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ backgroundColor: 'var(--color-ivory)', padding: '1.25rem', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--color-terracotta)', marginBottom: '8px' }}>
                <MapPin size={14} /> Shipping Destination
              </div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-charcoal)' }}>
                {order.customer.fullName} • {order.customer.phone}
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', lineHeight: 1.6, marginTop: '4px' }}>
                {order.customer.address}<br />
                {order.customer.city}, {order.customer.state} - <strong>{order.customer.postalCode}</strong><br />
                {order.customer.country}
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--color-ivory)', padding: '1.25rem', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--color-sage)', marginBottom: '8px' }}>
                <Calendar size={14} /> Estimated Arrival
              </div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-charcoal)' }}>
                3 - 5 Business Days
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', marginTop: '4px', lineHeight: 1.6 }}>
                Eco-courier dispatch from Bengaluru hub via carbon-neutral postal partners.
              </p>
            </div>
          </div>

          {/* Ordered Line Items Recap */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Items in this Dispatch</h4>
            <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem 1.25rem',
                    borderBottom: idx < order.items.length - 1 ? '1px solid var(--color-border)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={item.image || (item.product?.images ? item.product.images[0] : item.product?.image)}
                      alt={item.name}
                      style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--color-charcoal)' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>
                        Qty: {item.quantity} × {formatCurrency(item.price)}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <Link to={`/track-order?ref=${order.orderId}`}>
              <Button variant="charcoal" size="lg" icon={Truck}>
                Track This Dispatch
              </Button>
            </Link>
            <Link to="/catalogue">
              <Button variant="terracotta" size="lg" icon={ArrowRight}>
                Continue Shopping
              </Button>
            </Link>
            <Button variant="outline" size="lg" icon={Printer} onClick={() => window.print()}>
              Print Order Summary
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;
