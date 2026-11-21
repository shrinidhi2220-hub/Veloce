import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { Button } from '../../components/common/Button/Button.jsx';
import { Badge } from '../../components/common/Badge/Badge.jsx';
import {
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Calendar
} from 'lucide-react';
import './TrackOrder.css';

const DEMO_ORDERS_DATABASE = {
  'VEL-IND-90214': {
    orderId: 'VEL-IND-90214',
    date: '18 Nov 2026',
    expectedDelivery: '24 Nov 2026 (Simulated)',
    courier: 'Bluedart Carbon-Neutral Surface Express (Simulated)',
    awbNumber: 'BLR-582910482',
    status: 'Delivered',
    statusVariant: 'sage',
    currentLocation: 'Indiranagar Delivery Hub, Bengaluru',
    shippingAddress: '42, 3rd Cross, 12th Main, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka - 560038',
    currentStep: 5,
    steps: [
      { label: 'Order Confirmed', date: '18 Nov, 10:30 AM', desc: 'Patron order verified and logged' },
      { label: 'Processing', date: '19 Nov, 02:15 PM', desc: 'Biodegradable packaging & studio check' },
      { label: 'Shipped', date: '20 Nov, 09:00 AM', desc: 'Dispatched via electric logistics fleet' },
      { label: 'Out for Delivery', date: '21 Nov, 11:45 AM', desc: 'With localIndiranagar courier delivery partner' },
      { label: 'Delivered', date: '21 Nov, 03:20 PM', desc: 'Safely handed over to patron' }
    ],
    items: [
      {
        name: 'Terracotta Fluted Ceramic Vase',
        quantity: 1,
        price: 1850,
        image: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'Artisan Olive Wood Serving Board',
        quantity: 1,
        price: 1650,
        image: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=400&q=80'
      }
    ],
    total: 3500
  },
  'VEL-IND-88421': {
    orderId: 'VEL-IND-88421',
    date: '12 Nov 2026',
    expectedDelivery: '25 Nov 2026 (Simulated)',
    courier: 'Delhivery Green Express (Simulated)',
    awbNumber: 'DLH-992182741',
    status: 'Shipped',
    statusVariant: 'terracotta',
    currentLocation: 'National Transit Sorting Hub, Pune',
    shippingAddress: 'Suite 304, Green Hub, Koramangala 4th Block, Bengaluru, Karnataka - 560034',
    currentStep: 3,
    steps: [
      { label: 'Order Confirmed', date: '12 Nov, 04:00 PM', desc: 'Patron order verified and logged' },
      { label: 'Processing', date: '13 Nov, 11:20 AM', desc: 'Handcrafted artisan inspection complete' },
      { label: 'Shipped', date: '14 Nov, 06:15 PM', desc: 'In surface transit between regional sorting hubs' },
      { label: 'Out for Delivery', date: 'Expected 24 Nov', desc: 'Pending local delivery vehicle dispatch' },
      { label: 'Delivered', date: 'Pending', desc: 'Doorstep handover with OTP verification' }
    ],
    items: [
      {
        name: 'Vegetable-Tanned Saddle Leather Tote',
        quantity: 1,
        price: 4890,
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=400&q=80'
      }
    ],
    total: 4890
  }
};

export function TrackOrder() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryRef = searchParams.get('ref') || 'VEL-IND-90214';

  const [orderRefInput, setOrderRefInput] = useState(queryRef);
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (queryRef) {
      setOrderRefInput(queryRef);
      handleSearchOrder(queryRef);
    }
  }, [queryRef]);

  const handleSearchOrder = (refToFind) => {
    const cleanRef = (refToFind || '').trim().toUpperCase();
    setErrorMessage('');

    if (!cleanRef) {
      setErrorMessage('Please enter an Order ID reference (e.g. VEL-IND-90214).');
      setTrackedOrder(null);
      return;
    }

    if (cleanRef.length < 5) {
      setErrorMessage('Please enter a valid Order ID (must be at least 5 characters).');
      setTrackedOrder(null);
      return;
    }

    setIsSearching(true);

    // 1. Check in hardcoded demo database
    if (DEMO_ORDERS_DATABASE[cleanRef]) {
      setTrackedOrder(DEMO_ORDERS_DATABASE[cleanRef]);
      setIsSearching(false);
      return;
    }

    // 2. Check localStorage orders
    try {
      const savedOrders = JSON.parse(localStorage.getItem('veloce_orders') || '[]');
      const found = savedOrders.find((o) => o.orderId.toUpperCase() === cleanRef);
      if (found) {
        setTrackedOrder({
          orderId: found.orderId,
          date: found.date,
          expectedDelivery: '3 to 5 Days from booking (Simulated)',
          courier: 'Bluedart Carbon-Neutral Surface Express (Simulated)',
          awbNumber: `BLR-${Math.floor(10000000 + Math.random() * 90000000)}`,
          status: found.status || 'Order Confirmed',
          statusVariant: found.statusVariant || 'terracotta',
          currentLocation: 'Bengaluru Fulfillment Studio (Indiranagar)',
          shippingAddress: found.customer
            ? `${found.customer.address}, ${found.customer.city}, ${found.customer.state} - ${found.customer.postalCode}`
            : 'Indiranagar, Bengaluru, Karnataka - 560038',
          currentStep: 2,
          steps: [
            { label: 'Order Confirmed', date: found.date, desc: 'Patron order verified and logged' },
            { label: 'Processing', date: 'In Progress', desc: '100% biodegradable cornstarch cushioning' },
            { label: 'Shipped', date: 'Upcoming', desc: 'Handover to Bluedart Eco-Fleet' },
            { label: 'Out for Delivery', date: 'Upcoming', desc: 'With local city delivery partner' },
            { label: 'Delivered', date: 'Pending', desc: 'Doorstep handover with OTP verification' }
          ],
          items: found.items || [],
          total: found.pricing ? found.pricing.total : found.total
        });
        setIsSearching(false);
        return;
      }
    } catch (e) {
      console.warn('Error reading orders from localStorage', e);
    }

    // 3. Fallback: If format starts with VEL or looks like an order, generate simulated tracker
    if (cleanRef.startsWith('VEL') || cleanRef.includes('-')) {
      setTrackedOrder({
        orderId: cleanRef,
        date: 'Recent Order',
        expectedDelivery: 'Estimated in 3-4 Business Days (Simulated)',
        courier: 'India Post Speed Post / Surface (Simulated)',
        awbNumber: `IND-${Math.floor(10000000 + Math.random() * 90000000)}`,
        status: 'Processing',
        statusVariant: 'sage',
        currentLocation: 'Artisan Hub & Studio Verification Center',
        shippingAddress: 'Patron Registered Address, India',
        currentStep: 2,
        steps: [
          { label: 'Order Confirmed', date: 'Verified', desc: 'Order logged in slow-living registry' },
          { label: 'Processing', date: 'Current Stage', desc: 'Artisanal micro-sealing and zero-plastic wrap' },
          { label: 'Shipped', date: 'Next Step', desc: 'Dispatch to carbon-neutral transit vehicle' },
          { label: 'Out for Delivery', date: 'Upcoming', desc: 'Delivery route optimization' },
          { label: 'Delivered', date: 'Pending', desc: 'Doorstep delivery with OTP' }
        ],
        items: [
          {
            name: 'Handcrafted Artisan Consignment',
            quantity: 1,
            price: 2450,
            image: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=400&q=80'
          }
        ],
        total: 2450
      });
      setIsSearching(false);
      return;
    }

    // Invalid Order ID
    setErrorMessage(`No consignment found with Order ID "${cleanRef}". Try demo IDs: VEL-IND-90214 or VEL-IND-88421.`);
    setTrackedOrder(null);
    setIsSearching(false);
  };

  const onSubmitSearch = (e) => {
    e.preventDefault();
    if (!orderRefInput.trim()) return;
    const clean = orderRefInput.trim().toUpperCase();
    setSearchParams({ ref: clean });
    handleSearchOrder(clean);
  };

  return (
    <div className="track-page">
      <div className="container">
        <div className="track-hero">
          <span style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--color-terracotta)', fontWeight: 700, letterSpacing: '0.12em', display: 'block', marginBottom: '6px' }}>
            Live Dispatch Tracking
          </span>
          <h1>Track Your Artisan Dispatch</h1>
          <p style={{ color: 'var(--color-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.6, maxWidth: '600px', margin: '0 auto 1.5rem' }}>
            Enter your order reference code to check real-time courier movement, fulfillment milestones, and estimated delivery.
          </p>

          <form onSubmit={onSubmitSearch} className="track-input-wrap">
            <input
              type="text"
              value={orderRefInput}
              onChange={(e) => {
                setOrderRefInput(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="e.g. VEL-IND-90214"
              className="form-input"
              style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}
              required
            />
            <Button type="submit" variant="terracotta" icon={Search} loading={isSearching}>
              Track Order
            </Button>
          </form>

          {/* Quick Demo ID pills */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '12px', flexWrap: 'wrap', fontSize: '11px', color: 'var(--color-muted)' }}>
            <span>Try sample order codes:</span>
            <button
              type="button"
              onClick={() => {
                setOrderRefInput('VEL-IND-90214');
                setSearchParams({ ref: 'VEL-IND-90214' });
                handleSearchOrder('VEL-IND-90214');
              }}
              style={{ background: 'var(--color-white)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '2px 8px', cursor: 'pointer', fontWeight: 600, color: 'var(--color-charcoal)' }}
            >
              VEL-IND-90214 (Delivered)
            </button>
            <button
              type="button"
              onClick={() => {
                setOrderRefInput('VEL-IND-88421');
                setSearchParams({ ref: 'VEL-IND-88421' });
                handleSearchOrder('VEL-IND-88421');
              }}
              style={{ background: 'var(--color-white)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '2px 8px', cursor: 'pointer', fontWeight: 600, color: 'var(--color-charcoal)' }}
            >
              VEL-IND-88421 (Shipped)
            </button>
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div
            style={{
              maxWidth: '680px',
              margin: '0 auto 2rem',
              backgroundColor: 'rgba(194, 84, 80, 0.1)',
              border: '1px solid var(--color-danger)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              color: 'var(--color-danger)',
              fontSize: 'var(--text-xs)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Tracking details */}
        {trackedOrder && (
          <div className="timeline-card">
            {/* Top Overview */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--color-border)', paddingBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-muted)', fontWeight: 700 }}>
                  Order Reference
                </span>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--color-charcoal)', margin: '2px 0 4px' }}>
                  {trackedOrder.orderId}
                </h3>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>
                  AWB Tracking Number: <code>{trackedOrder.awbNumber}</code> • Placed on {trackedOrder.date}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <Badge variant={trackedOrder.statusVariant || 'sage'}>{trackedOrder.status}</Badge>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', marginTop: '6px' }}>
                  Carrier: <strong>{trackedOrder.courier}</strong>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-terracotta)', fontWeight: 600, marginTop: '2px' }}>
                  ETA: {trackedOrder.expectedDelivery}
                </div>
              </div>
            </div>

            {/* Visual 5-Stage Stepper: Order Confirmed -> Processing -> Shipped -> Out for Delivery -> Delivered */}
            <div className="timeline-stepper">
              {trackedOrder.steps.map((st, i) => {
                const stepNum = i + 1;
                const isCompleted = stepNum < trackedOrder.currentStep;
                const isActive = stepNum === trackedOrder.currentStep;

                return (
                  <div
                    key={i}
                    className={`timeline-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                  >
                    <div className="step-circle">
                      {isCompleted ? <CheckCircle2 size={18} /> : <span>{stepNum}</span>}
                    </div>
                    <div>
                      <div className="step-label">{st.label}</div>
                      <div className="step-date">{st.date}</div>
                      <div style={{ fontSize: '10px', color: 'var(--color-muted)', marginTop: '2px', maxWidth: '140px' }}>
                        {st.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Destination & Items Box */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', backgroundColor: 'var(--color-ivory)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-xs)', textTransform: 'uppercase', fontWeight: 700, color: 'var(--color-terracotta)', marginBottom: '6px' }}>
                  <MapPin size={14} /> Destination Address
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-charcoal)', lineHeight: 1.6 }}>
                  {trackedOrder.shippingAddress}
                </p>
                <div style={{ fontSize: '11px', color: 'var(--color-muted)', marginTop: '6px' }}>
                  Current Hub: <strong>{trackedOrder.currentLocation}</strong>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-xs)', textTransform: 'uppercase', fontWeight: 700, color: 'var(--color-sage)', marginBottom: '6px' }}>
                  <Package size={14} /> Consignment Summary
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-charcoal)' }}>
                  {(trackedOrder.items || []).map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span>{item.quantity} × {item.name || item.product?.name}</span>
                      <span style={{ fontWeight: 600 }}>{formatCurrency((item.price || item.product?.price || 0) * (item.quantity || 1))}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '6px', marginTop: '6px', fontWeight: 700, fontSize: 'var(--text-xs)' }}>
                  <span>Total Consignment Value:</span>
                  <span>{formatCurrency(trackedOrder.total)}</span>
                </div>
              </div>
            </div>

            {/* Simulated Disclaimer Banner */}
            <div style={{ backgroundColor: 'rgba(183, 123, 85, 0.08)', border: '1px dashed var(--color-terracotta)', borderRadius: 'var(--radius-md)', padding: '10px 14px', marginBottom: '1.5rem', fontSize: '11px', color: 'var(--color-charcoal)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} color="var(--color-terracotta)" />
              <span>
                <strong>Simulated Dispatch Tracking:</strong> This interface models real-time courier milestones for demonstration purposes. No live API connection to actual courier networks exists.
              </span>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>
                <ShieldCheck size={16} color="var(--color-sage)" />
                <span>Zero-contact OTP delivery simulation verified</span>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <Link to="/account">
                  <Button variant="ghost" size="sm">
                    Back to Account
                  </Button>
                </Link>
                <Link to="/catalogue">
                  <Button variant="terracotta" size="sm" icon={ArrowRight}>
                    Discover More Finds
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TrackOrder;
