import React, { useState } from 'react';
import { WHOLESALE_PRODUCTS, WHOLESALE_BENEFITS } from '../../mock/wholesale.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { Button } from '../../components/common/Button/Button.jsx';
import { Badge } from '../../components/common/Badge/Badge.jsx';
import { Modal } from '../../components/common/Modal/Modal.jsx';
import { useUI } from '../../context/UIContext.jsx';
import {
  Layers,
  ArrowRight,
  ShieldCheck,
  Package,
  Clock,
  Sparkles,
  Send,
  FileText
} from 'lucide-react';
import './Wholesale.css';

export function Wholesale() {
  const { showToast } = useUI();
  const [selectedProductForInquiry, setSelectedProductForInquiry] = useState(null);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryQuantity, setInquiryQuantity] = useState(50);
  const [inquiryMessage, setInquiryMessage] = useState('');

  const handleOpenInquiry = (product) => {
    setSelectedProductForInquiry(product);
    setInquiryQuantity(product.moq);
  };

  const handleCloseInquiry = () => {
    setSelectedProductForInquiry(null);
  };

  const handleSubmitInquiry = (e) => {
    e.preventDefault();
    showToast(`Wholesale inquiry dispatched for "${selectedProductForInquiry.name}". An account manager will respond shortly.`);
    handleCloseInquiry();
    setInquiryName('');
    setInquiryEmail('');
    setInquiryMessage('');
  };

  return (
    <div className="wholesale-page">
      {/* Wholesale Hero */}
      <section className="wholesale-hero">
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-eucalyptus)', textTransform: 'uppercase', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', marginBottom: '1rem' }}>
            <Layers size={16} /> B2B & Retail Procurement
          </div>
          <h1>Conscious Bulk Wholesale</h1>
          <p>
            Equip your interior boutique, hotel, coffee bar, or curated gift studio with
            sustainably sourced, master-crafted lifestyle goods. Transparent volume breaks with low MOQs.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <a href="#wholesale-catalogue">
              <Button variant="terracotta" size="lg" icon={ArrowRight}>
                Browse Bulk Catalogue
              </Button>
            </a>
            <Button
              variant="outline"
              size="lg"
              style={{ color: 'var(--color-ivory)', borderColor: 'rgba(255,255,255,0.3)' }}
              onClick={() => handleOpenInquiry({ name: 'General Wholesale Catalog Request', moq: 25 })}
            >
              Request Line Sheet
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Row */}
      <section className="section-spacing-sm" style={{ backgroundColor: 'var(--color-white)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="grid-4" style={{ gap: '1.5rem' }}>
            {WHOLESALE_BENEFITS.map((benefit, idx) => (
              <div key={idx} style={{ padding: '1rem', textAlign: 'left' }}>
                <h4 style={{ fontSize: '1.05rem', marginBottom: '6px', color: 'var(--color-charcoal)' }}>
                  {benefit.title}
                </h4>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', lineHeight: 1.6 }}>
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wholesale Product Grid */}
      <section id="wholesale-catalogue" className="section-spacing">
        <div className="container">
          <div className="section-header">
            <span className="tagline">Production Lots</span>
            <h2>Curated Wholesale Batches</h2>
            <p>Ready for direct pallet shipment or bespoke studio co-branding.</p>
          </div>

          <div className="wholesale-grid">
            {WHOLESALE_PRODUCTS.map((item) => (
              <div key={item.id} className="wholesale-card">
                <div className="wholesale-img-wrap">
                  <img src={item.image} alt={item.name} className="wholesale-img" loading="lazy" />
                  <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                    <span className="moq-tag">MOQ: {item.moq} Units</span>
                  </div>
                </div>

                <div className="wholesale-content">
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-muted)', fontWeight: 700 }}>
                    {item.category}
                  </span>
                  <h3 style={{ fontSize: '1.2rem', margin: '4px 0 8px' }}>{item.name}</h3>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', lineHeight: 1.6, marginBottom: '12px' }}>
                    {item.description}
                  </p>

                  <div className="pricing-tiers-box">
                    <div className="tier-line">
                      <span>Sample Unit Price:</span>
                      <span>{formatCurrency(item.samplePrice)}</span>
                    </div>
                    <div className="tier-line">
                      <span>Tier 1 ({item.moq}+ units):</span>
                      <span style={{ fontWeight: 600 }}>{formatCurrency(item.tier1Price)} / unit</span>
                    </div>
                    <div className="tier-line highlight">
                      <span>Tier 2 (Large Volume):</span>
                      <span>{formatCurrency(item.tier2Price)} / unit</span>
                    </div>
                  </div>

                  <div style={{ fontSize: '11px', color: 'var(--color-charcoal)', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={12} color="var(--color-muted)" />
                      <span>Production Lead Time: <strong>{item.leadTime}</strong></span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Sparkles size={12} color="var(--color-terracotta)" />
                      <span>{item.customBranding}</span>
                    </div>
                  </div>

                  <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                    <Button
                      variant="charcoal"
                      size="sm"
                      style={{ flex: 1 }}
                      onClick={() => handleOpenInquiry(item)}
                    >
                      Inquire / Order
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenInquiry({ ...item, isSample: true })}
                    >
                      Sample
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry & Sample Request Modal */}
      <Modal
        isOpen={Boolean(selectedProductForInquiry)}
        onClose={handleCloseInquiry}
        title="Wholesale Procurement Inquiry"
        maxWidth="540px"
      >
        {selectedProductForInquiry && (
          <form onSubmit={handleSubmitInquiry}>
            <div style={{ backgroundColor: 'var(--color-ivory)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--color-muted)', fontWeight: 700 }}>
                Target Lot
              </div>
              <h4 style={{ margin: '2px 0 4px', fontSize: '1.05rem' }}>{selectedProductForInquiry.name}</h4>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-terracotta)', fontWeight: 600 }}>
                Minimum Order: {selectedProductForInquiry.moq || 20} units
              </span>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Contact Name *</label>
                <input
                  type="text"
                  value={inquiryName}
                  onChange={(e) => setInquiryName(e.target.value)}
                  placeholder="e.g. Sanya Roy"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Business Email *</label>
                <input
                  type="email"
                  value={inquiryEmail}
                  onChange={(e) => setInquiryEmail(e.target.value)}
                  placeholder="sanya@studio.com"
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Estimated Quantity Needed</label>
              <input
                type="number"
                min={selectedProductForInquiry.moq || 1}
                value={inquiryQuantity}
                onChange={(e) => setInquiryQuantity(Number(e.target.value))}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Custom Branding or Delivery Notes</label>
              <textarea
                rows={3}
                value={inquiryMessage}
                onChange={(e) => setInquiryMessage(e.target.value)}
                placeholder="Include details about your delivery timeline or custom laser engraving requirements..."
                className="form-textarea"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <Button variant="ghost" onClick={handleCloseInquiry}>
                Cancel
              </Button>
              <Button type="submit" variant="terracotta" icon={Send}>
                Send Wholesale Inquiry
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

export default Wholesale;
