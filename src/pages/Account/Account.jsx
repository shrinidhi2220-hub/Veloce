import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useUI } from '../../context/UIContext.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { Button } from '../../components/common/Button/Button.jsx';
import { Badge } from '../../components/common/Badge/Badge.jsx';
import { Modal } from '../../components/common/Modal/Modal.jsx';
import {
  User,
  Package,
  MapPin,
  Heart,
  Trophy,
  LogOut,
  Edit2,
  Plus,
  Trash2,
  Truck,
  Sparkles
} from 'lucide-react';
import './Account.css';

// Baseline demo orders for preview
const INITIAL_DEMO_ORDERS = [
  {
    orderId: 'VEL-IND-90214',
    date: '18 Nov 2026',
    status: 'Delivered',
    statusVariant: 'sage',
    total: 3500,
    paymentMethod: 'UPI (Google Pay)',
    items: [
      {
        name: 'Terracotta Fluted Ceramic Vase',
        category: 'Home & Living',
        quantity: 1,
        price: 1850,
        image: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'Artisan Olive Wood Serving Board',
        category: 'Home & Living',
        quantity: 1,
        price: 1650,
        image: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=400&q=80'
      }
    ]
  },
  {
    orderId: 'VEL-IND-88421',
    date: '12 Nov 2026',
    status: 'Dispatched',
    statusVariant: 'terracotta',
    total: 4890,
    paymentMethod: 'Cash on Delivery',
    items: [
      {
        name: 'Vegetable-Tanned Saddle Leather Tote',
        category: 'Accessories',
        quantity: 1,
        price: 4890,
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=400&q=80'
      }
    ]
  }
];

export function Account() {
  const { user, isAuthenticated, logout, updateProfile, addAddress, deleteAddress, updateAddress, setDefaultAddress } = useAuth();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useUI();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'rewards' | 'addresses' | 'wishlist' | 'profile'
  const [orders, setOrders] = useState([]);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  // Edit Profile Modal
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');

  // Add/Edit Address Modal
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addrTitle, setAddrTitle] = useState('Home');
  const [addrFullName, setAddrFullName] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrLine, setAddrLine] = useState('');
  const [addrCity, setAddrCity] = useState('Bengaluru');
  const [addrState, setAddrState] = useState('Karnataka');
  const [addrPin, setAddrPin] = useState('560038');
  const [addrIsDefault, setAddrIsDefault] = useState(false);

  // Load orders from localStorage or defaults
  useEffect(() => {
    try {
      const savedOrders = localStorage.getItem('veloce_orders');
      if (savedOrders) {
        const parsed = JSON.parse(savedOrders);
        setOrders([...parsed, ...INITIAL_DEMO_ORDERS]);
      } else {
        setOrders(INITIAL_DEMO_ORDERS);
      }
    } catch {
      setOrders(INITIAL_DEMO_ORDERS);
    }
  }, []);

  // Sync profile fields when user changes
  useEffect(() => {
    if (user) {
      setEditName(user.fullName || '');
      setEditEmail(user.email || '');
      setEditPhone(user.phone || '');
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    showToast('You have been signed out safely. Hope to see you again soon!');
    navigate('/');
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!editName.trim() || !editEmail.trim()) {
      showToast('Please provide your name and email.', 'error');
      return;
    }
    updateProfile({
      fullName: editName.trim(),
      email: editEmail.trim(),
      phone: editPhone.trim()
    });
    showToast('Patron profile details updated successfully.');
    setIsEditProfileOpen(false);
  };

  const openAddAddressModal = () => {
    setEditingAddressId(null);
    setAddrTitle('Home');
    setAddrFullName(user?.fullName || '');
    setAddrPhone(user?.phone || '');
    setAddrLine('');
    setAddrCity('Bengaluru');
    setAddrState('Karnataka');
    setAddrPin('560038');
    setAddrIsDefault(user?.addresses?.length === 0);
    setIsAddAddressOpen(true);
  };

  const openEditAddressModal = (addr) => {
    setEditingAddressId(addr.id);
    setAddrTitle(addr.title);
    setAddrFullName(addr.fullName);
    setAddrPhone(addr.phone);
    setAddrLine(addr.addressLine);
    setAddrCity(addr.city);
    setAddrState(addr.state);
    setAddrPin(addr.postalCode);
    setAddrIsDefault(Boolean(addr.isDefault));
    setIsAddAddressOpen(true);
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!addrLine.trim() || !addrPin.trim()) {
      showToast('Please fill out the street address and 6-digit PIN code.', 'error');
      return;
    }

    const payload = {
      title: addrTitle,
      fullName: addrFullName || user?.fullName || 'Patron',
      phone: addrPhone || user?.phone || '+91 98765 43210',
      addressLine: addrLine.trim(),
      city: addrCity.trim(),
      state: addrState,
      postalCode: addrPin.trim(),
      country: 'India',
      isDefault: addrIsDefault
    };

    if (editingAddressId) {
      updateAddress(editingAddressId, payload);
      if (addrIsDefault) setDefaultAddress(editingAddressId);
      showToast('Address updated successfully.');
    } else {
      addAddress(payload);
      showToast('New delivery address saved to address book.');
    }

    setIsAddAddressOpen(false);
  };

  if (!user || !isAuthenticated) {
    return (
      <div className="account-page">
        <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <h2>Patron Account Access</h2>
          <p style={{ color: 'var(--color-muted)', margin: '8px 0 1.5rem' }}>
            Please sign in to view your orders, saved addresses, and VELOCE Seeds rewards.
          </p>
          <Link to="/login">
            <Button variant="terracotta" size="lg">
              Sign In to Account
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const initials = user.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'CP';

  return (
    <div className="account-page">
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <span style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--color-terracotta)', fontWeight: 700, letterSpacing: '0.12em', display: 'block', marginBottom: '4px' }}>
            Conscious Patron Dashboard
          </span>
          <h1>My Account</h1>
        </div>

        <div className="account-layout">
          {/* Left Navigation Sidebar */}
          <aside className="account-sidebar">
            <div className="account-user-card">
              <div className="account-avatar">{initials}</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '2px', color: 'var(--color-charcoal)' }}>{user.fullName}</h3>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>{user.email}</p>
              <div style={{ marginTop: '8px' }}>
                <Badge variant="sage">{user.tier || 'Sprout Patron'}</Badge>
              </div>
            </div>

            <nav className="account-nav-list" aria-label="Account navigation">
              <button
                className={`account-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                <Package size={18} />
                <span>My Orders ({orders.length})</span>
              </button>

              <button
                className={`account-nav-item ${activeTab === 'rewards' ? 'active' : ''}`}
                onClick={() => setActiveTab('rewards')}
              >
                <Trophy size={18} />
                <span>VELOCE Seeds ({user.seedsBalance || 0})</span>
              </button>

              <button
                className={`account-nav-item ${activeTab === 'addresses' ? 'active' : ''}`}
                onClick={() => setActiveTab('addresses')}
              >
                <MapPin size={18} />
                <span>Saved Addresses ({user.addresses?.length || 0})</span>
              </button>

              <button
                className={`account-nav-item ${activeTab === 'wishlist' ? 'active' : ''}`}
                onClick={() => setActiveTab('wishlist')}
              >
                <Heart size={18} />
                <span>Saved Wishlist ({wishlistItems.length})</span>
              </button>

              <button
                className={`account-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <User size={18} />
                <span>Patron Profile</span>
              </button>

              <div style={{ borderTop: '1px solid var(--color-border)', margin: '8px 0', paddingTop: '8px' }}>
                <button
                  className="account-nav-item"
                  onClick={handleLogout}
                  style={{ color: 'var(--color-danger)' }}
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </div>
            </nav>
          </aside>

          {/* Right Content Area */}
          <main className="account-content-card">
            {/* TAB 1: ORDERS */}
            {activeTab === 'orders' && (
              <div>
                <div className="account-content-header">
                  <div>
                    <h2>Order History</h2>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>
                      Track dispatches and review previous conscious artisanal purchases.
                    </p>
                  </div>
                  <Link to="/track-order">
                    <Button variant="outline" size="sm" icon={Truck}>
                      Quick Order Tracker
                    </Button>
                  </Link>
                </div>

                {orders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                    <Package size={40} color="var(--color-muted)" style={{ margin: '0 auto 12px' }} />
                    <h4>No Orders Placed Yet</h4>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', marginBottom: '1.25rem' }}>
                      Handcrafted items you purchase will appear here with live tracking.
                    </p>
                    <Link to="/catalogue">
                      <Button variant="terracotta" size="sm">Browse Market</Button>
                    </Link>
                  </div>
                ) : (
                  <div>
                    {orders.map((ord) => (
                      <div key={ord.orderId} className="order-history-card">
                        <div className="order-history-header">
                          <div>
                            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-muted)', fontWeight: 700 }}>
                              Order #{ord.orderId}
                            </span>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', marginTop: '2px' }}>
                              Placed on {ord.date} • {ord.paymentMethod}
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Badge variant={ord.statusVariant || 'sage'}>{ord.status}</Badge>
                            <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-charcoal)' }}>
                              {formatCurrency(ord.total || ord.pricing?.total)}
                            </span>
                          </div>
                        </div>

                        {/* Order items mini grid */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                          {(ord.items || []).map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <img
                                src={item.image || (item.product?.images ? item.product.images[0] : item.product?.image)}
                                alt={item.name || item.product?.name}
                                style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                              />
                              <div style={{ flex: 1, fontSize: 'var(--text-xs)' }}>
                                <div style={{ fontWeight: 600, color: 'var(--color-charcoal)' }}>
                                  {item.name || item.product?.name}
                                </div>
                                <div style={{ color: 'var(--color-muted)' }}>
                                  Qty: {item.quantity} × {formatCurrency(item.price || item.product?.price)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid var(--color-border)', paddingTop: '10px' }}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedOrderDetails(ord)}
                          >
                            View Order Details
                          </Button>
                          <Link to={`/track-order?ref=${ord.orderId}`}>
                            <Button variant="charcoal" size="sm" icon={Truck}>
                              Live Tracking Status
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: REWARDS & SEEDS */}
            {activeTab === 'rewards' && (
              <div>
                <div className="account-content-header">
                  <div>
                    <h2>VELOCE Seeds Wallet</h2>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>
                      Virtual seeds earned by cherishing conscious craft and taking mindful slow-living actions.
                    </p>
                  </div>
                  <Link to="/play-earn">
                    <Button variant="terracotta" size="sm" icon={Sparkles}>
                      Play & Earn Arena
                    </Button>
                  </Link>
                </div>

                <div
                  style={{
                    backgroundColor: 'var(--color-charcoal)',
                    color: 'var(--color-white)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '2rem',
                    marginBottom: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1.5rem'
                  }}
                >
                  <div>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-eucalyptus)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
                      Active Seed Balance
                    </span>
                    <h1 style={{ color: 'var(--color-white)', margin: '4px 0 6px', fontSize: '2.5rem' }}>
                      {user.seedsBalance || 0} Seeds
                    </h1>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'rgba(245,240,230,0.7)' }}>
                      Demo Reward Points • Earn 10 Seeds per ₹100 spent or via daily rituals.
                    </p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <Badge variant="terracotta">{user.tier || 'Sprout Patron'}</Badge>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(245,240,230,0.7)', marginTop: '8px' }}>
                      Unlock Sage Patron tier at 1,000 Seeds
                    </div>
                  </div>
                </div>

                {/* Ledger History */}
                <h4 style={{ marginBottom: '1rem', color: 'var(--color-charcoal)' }}>Seeds Activity Ledger</h4>
                <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.85rem 1.25rem', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-ivory)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-muted)' }}>
                    <span>Activity Description</span>
                    <span>Seeds Impact</span>
                  </div>
                  {(user.seedHistory && user.seedHistory.length > 0
                    ? user.seedHistory
                    : [
                        { id: 'sh-1', title: 'Patron Welcome Bonus', date: 'Registration', seeds: 500, type: 'earned' }
                      ]
                  ).map((row, i) => (
                    <div key={row.id || i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', borderBottom: '1px solid var(--color-border)' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--color-charcoal)' }}>{row.title}</div>
                        <div style={{ fontSize: '11px', color: 'var(--color-muted)' }}>{row.date}</div>
                      </div>
                      <div style={{ fontWeight: 700, color: row.type === 'spent' ? 'var(--color-danger)' : 'var(--color-success)', fontSize: 'var(--text-sm)' }}>
                        {row.type === 'spent' ? `${row.seeds} Seeds` : `+${row.seeds} Seeds`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: ADDRESSES */}
            {activeTab === 'addresses' && (
              <div>
                <div className="account-content-header">
                  <div>
                    <h2>Saved Delivery Addresses</h2>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>
                      Manage Indian shipping destinations for plastic-free courier delivery.
                    </p>
                  </div>
                  <Button variant="charcoal" size="sm" icon={Plus} onClick={openAddAddressModal}>
                    Add New Address
                  </Button>
                </div>

                <div className="address-grid">
                  {user.addresses && user.addresses.length > 0 ? (
                    user.addresses.map((addr) => (
                      <div key={addr.id} className="address-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-charcoal)' }}>
                            {addr.title}
                          </span>
                          {addr.isDefault && <Badge variant="sage">Default</Badge>}
                        </div>

                        <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-charcoal)', marginBottom: '4px' }}>
                          {addr.fullName} • {addr.phone}
                        </div>

                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', lineHeight: 1.6, flex: 1, marginBottom: '1rem' }}>
                          {addr.addressLine}<br />
                          {addr.city}, {addr.state} - <strong>{addr.postalCode}</strong><br />
                          {addr.country}
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '8px', fontSize: '11px' }}>
                          <div>
                            {!addr.isDefault && (
                              <button
                                onClick={() => {
                                  setDefaultAddress(addr.id);
                                  showToast('Default address updated.');
                                }}
                                style={{ color: 'var(--color-terracotta)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                              >
                                Set as Default
                              </button>
                            )}
                          </div>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                              onClick={() => openEditAddressModal(addr)}
                              style={{ color: 'var(--color-charcoal)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                            >
                              <Edit2 size={12} /> Edit
                            </button>
                            <button
                              onClick={() => {
                                deleteAddress(addr.id);
                                showToast('Address removed from address book.');
                              }}
                              style={{ color: 'var(--color-danger)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                            >
                              <Trash2 size={12} /> Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ gridColumn: '1 / -1', padding: '2rem 0', textAlign: 'center' }}>
                      <p style={{ color: 'var(--color-muted)', fontSize: 'var(--text-sm)', marginBottom: '1rem' }}>
                        No saved addresses yet. Save one for faster checkout.
                      </p>
                      <Button variant="outline" size="sm" icon={Plus} onClick={openAddAddressModal}>
                        Add Your First Address
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: WISHLIST */}
            {activeTab === 'wishlist' && (
              <div>
                <div className="account-content-header">
                  <div>
                    <h2>Saved Objects Wishlist</h2>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>
                      Handmade objects you have saved for mindful curation.
                    </p>
                  </div>
                  <Link to="/wishlist">
                    <Button variant="outline" size="sm">
                      Go to Full Wishlist ({wishlistItems.length})
                    </Button>
                  </Link>
                </div>

                {wishlistItems.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                    <Heart size={40} color="var(--color-muted)" style={{ margin: '0 auto 12px' }} />
                    <h4>Your Wishlist is Empty</h4>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', marginBottom: '1.25rem' }}>
                      Click the heart icon on any product in the catalogue to save it here.
                    </p>
                    <Link to="/catalogue">
                      <Button variant="terracotta" size="sm">Discover Finds</Button>
                    </Link>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
                    {wishlistItems.map((prod) => (
                      <div
                        key={prod.id}
                        style={{
                          backgroundColor: 'var(--color-white)',
                          border: '1px solid var(--color-border)',
                          borderRadius: 'var(--radius-lg)',
                          padding: '12px',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <Link to={`/product/${prod.id}`} style={{ textDecoration: 'none' }}>
                          <img
                            src={prod.images ? prod.images[0] : prod.image}
                            alt={prod.name}
                            style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '8px' }}
                          />
                          <h4 style={{ fontSize: 'var(--text-sm)', color: 'var(--color-charcoal)', marginBottom: '4px' }}>
                            {prod.name}
                          </h4>
                          <span style={{ fontWeight: 700, color: 'var(--color-terracotta)', fontSize: 'var(--text-sm)' }}>
                            {formatCurrency(prod.price)}
                          </span>
                        </Link>
                        <div style={{ display: 'flex', gap: '6px', marginTop: '12px', borderTop: '1px solid var(--color-border)', paddingTop: '8px' }}>
                          <Button
                            variant="terracotta"
                            size="sm"
                            style={{ flex: 1, fontSize: '11px', padding: '6px 8px' }}
                            onClick={() => {
                              addToCart(prod, 1);
                              showToast(`Added ${prod.name} to shopping bag.`);
                            }}
                          >
                            Add to Bag
                          </Button>
                          <button
                            onClick={() => {
                              removeFromWishlist(prod.id);
                              showToast('Removed from wishlist.');
                            }}
                            style={{ background: 'none', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '6px 8px', cursor: 'pointer', color: 'var(--color-danger)' }}
                            title="Remove item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: PROFILE */}
            {activeTab === 'profile' && (
              <div>
                <div className="account-content-header">
                  <div>
                    <h2>Patron Profile Information</h2>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>
                      Personal contact details and slow-living preferences.
                    </p>
                  </div>
                  <Button variant="outline" size="sm" icon={Edit2} onClick={() => setIsEditProfileOpen(true)}>
                    Edit Profile
                  </Button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                  <div style={{ backgroundColor: 'var(--color-ivory)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-muted)', fontWeight: 700 }}>
                      Full Legal Name
                    </span>
                    <h4 style={{ margin: '4px 0 0', fontSize: '1.1rem', color: 'var(--color-charcoal)' }}>{user.fullName}</h4>
                  </div>

                  <div style={{ backgroundColor: 'var(--color-ivory)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-muted)', fontWeight: 700 }}>
                      Primary Email
                    </span>
                    <h4 style={{ margin: '4px 0 0', fontSize: '1.1rem', color: 'var(--color-charcoal)' }}>{user.email}</h4>
                  </div>

                  <div style={{ backgroundColor: 'var(--color-ivory)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-muted)', fontWeight: 700 }}>
                      Contact Phone (India)
                    </span>
                    <h4 style={{ margin: '4px 0 0', fontSize: '1.1rem', color: 'var(--color-charcoal)' }}>{user.phone}</h4>
                  </div>

                  <div style={{ backgroundColor: 'var(--color-ivory)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-muted)', fontWeight: 700 }}>
                      Patron Status
                    </span>
                    <h4 style={{ margin: '4px 0 0', fontSize: '1.1rem', color: 'var(--color-terracotta)' }}>
                      {user.tier || 'Sprout Patron'}
                    </h4>
                  </div>
                </div>

                <div style={{ backgroundColor: 'var(--color-white)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
                  <h4 style={{ marginBottom: '8px' }}>Security & Demo Authentication</h4>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
                    Your session is stored securely in your browser's private session storage. No actual credentials or banking tokens are transmitted over public networks.
                  </p>
                  <Button variant="ghost" size="sm" icon={LogOut} onClick={handleLogout} style={{ color: 'var(--color-danger)' }}>
                    Sign Out on This Device
                  </Button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        title="Edit Patron Profile"
        maxWidth="480px"
      >
        <form onSubmit={handleSaveProfile}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mobile Number (+91)</label>
            <input
              type="tel"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
              className="form-input"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.5rem' }}>
            <Button variant="ghost" onClick={() => setIsEditProfileOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="terracotta">
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add / Edit Address Modal */}
      <Modal
        isOpen={isAddAddressOpen}
        onClose={() => setIsAddAddressOpen(false)}
        title={editingAddressId ? 'Edit Delivery Address' : 'Add New Indian Address'}
        maxWidth="540px"
      >
        <form onSubmit={handleSaveAddress}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Address Label</label>
              <select
                value={addrTitle}
                onChange={(e) => setAddrTitle(e.target.value)}
                className="form-select"
              >
                <option value="Home">Home</option>
                <option value="Studio Workspace">Studio Workspace</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Recipient Full Name *</label>
              <input
                type="text"
                value={addrFullName}
                onChange={(e) => setAddrFullName(e.target.value)}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Flat / House No. & Street Address *</label>
            <input
              type="text"
              value={addrLine}
              onChange={(e) => setAddrLine(e.target.value)}
              placeholder="e.g. 42, 3rd Cross, 12th Main, Indiranagar"
              className="form-input"
              required
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">City *</label>
              <input
                type="text"
                value={addrCity}
                onChange={(e) => setAddrCity(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">State *</label>
              <select
                value={addrState}
                onChange={(e) => setAddrState(e.target.value)}
                className="form-select"
              >
                <option value="Karnataka">Karnataka</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Telangana">Telangana</option>
                <option value="Kerala">Kerala</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="West Bengal">West Bengal</option>
                <option value="Gujarat">Gujarat</option>
              </select>
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">6-Digit PIN Code *</label>
              <input
                type="text"
                value={addrPin}
                onChange={(e) => setAddrPin(e.target.value)}
                placeholder="560038"
                maxLength={6}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone (+91) *</label>
              <input
                type="tel"
                value={addrPhone}
                onChange={(e) => setAddrPhone(e.target.value)}
                className="form-input"
                required
              />
            </div>
          </div>

          <div style={{ marginTop: '0.5rem', marginBottom: '1.25rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-xs)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={addrIsDefault}
                onChange={(e) => setAddrIsDefault(e.target.checked)}
                style={{ accentColor: 'var(--color-terracotta)' }}
              />
              <span>Set as my default shipping address</span>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.5rem' }}>
            <Button variant="ghost" onClick={() => setIsAddAddressOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="terracotta">
              {editingAddressId ? 'Save Changes' : 'Save Address'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Order Details Modal */}
      {selectedOrderDetails && (
        <Modal
          isOpen={Boolean(selectedOrderDetails)}
          onClose={() => setSelectedOrderDetails(null)}
          title={`Order #${selectedOrderDetails.orderId}`}
          maxWidth="580px"
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>Date Placed</span>
                <div style={{ fontWeight: 600, color: 'var(--color-charcoal)' }}>{selectedOrderDetails.date}</div>
              </div>
              <Badge variant={selectedOrderDetails.statusVariant || 'sage'}>{selectedOrderDetails.status}</Badge>
            </div>

            <h4 style={{ fontSize: 'var(--text-sm)', marginBottom: '8px' }}>Purchased Items</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              {(selectedOrderDetails.items || []).map((it, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--color-ivory)', padding: '8px 12px', borderRadius: 'var(--radius-md)' }}>
                  <img
                    src={it.image || (it.product?.images ? it.product.images[0] : it.product?.image)}
                    alt={it.name || it.product?.name}
                    style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, fontSize: 'var(--text-xs)' }}>
                    <div style={{ fontWeight: 700, color: 'var(--color-charcoal)' }}>{it.name || it.product?.name}</div>
                    <div style={{ color: 'var(--color-muted)' }}>
                      Qty: {it.quantity} × {formatCurrency(it.price || it.product?.price)}
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-charcoal)' }}>
                    {formatCurrency((it.price || it.product?.price || 0) * (it.quantity || 1))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <span style={{ fontWeight: 600 }}>Total Paid:</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-terracotta)' }}>
                {formatCurrency(selectedOrderDetails.total || selectedOrderDetails.pricing?.total)}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to={`/track-order?ref=${selectedOrderDetails.orderId}`} style={{ flex: 1 }}>
                <Button variant="charcoal" icon={Truck} style={{ width: '100%' }}>
                  Live Tracking
                </Button>
              </Link>
              <Button variant="ghost" onClick={() => setSelectedOrderDetails(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Account;
