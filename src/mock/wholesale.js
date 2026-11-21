export const WHOLESALE_PRODUCTS = [
  {
    id: 'ws-01',
    name: 'Artisan Terracotta Pots & Planters (Crate of 24)',
    category: 'Home & Living',
    moq: 24, // Minimum Order Quantity
    samplePrice: 850,
    tier1Price: 550, // 24-48 units
    tier2Price: 420, // 49+ units
    gstRate: 0.12,
    leadTime: '10-14 days',
    image: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=800&q=80',
    description: 'Bulk packed kiln-fired terracotta planters with drainage saucers, ideal for boutique plant nurseries and interior studios.',
    customBranding: 'Embossed stamp available at 100+ units',
    packSize: '24 units per reinforced wooden crate'
  },
  {
    id: 'ws-02',
    name: 'Natural Soy & Hinoki Wellness Candles (Case of 50)',
    category: 'Beauty & Lifestyle',
    moq: 50,
    samplePrice: 550,
    tier1Price: 380,
    tier2Price: 290,
    gstRate: 0.12,
    leadTime: '7-10 days',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
    description: 'Private-label friendly botanical candles hand-poured into matte ceramic or glass vessels for hospitality, spas, and curated gift boxes.',
    customBranding: 'Custom screen-printed box packaging included',
    packSize: '50 units per master carton'
  },
  {
    id: 'ws-03',
    name: 'Hand-Woven Natural Jute & Linen Market Totes (Lot of 40)',
    category: 'Accessories',
    moq: 40,
    samplePrice: 750,
    tier1Price: 480,
    tier2Price: 360,
    gstRate: 0.05,
    leadTime: '14-18 days',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
    description: 'Sturdy eco-fiber carryalls with double-stitched cotton webbing handles, popular with sustainable grocers and hotel gift shops.',
    customBranding: 'Silkscreen logo printing available',
    packSize: '40 flat-packed units'
  },
  {
    id: 'ws-04',
    name: 'Live-Edge Olive Wood Tasting Boards (Box of 20)',
    category: 'Home & Living',
    moq: 20,
    samplePrice: 950,
    tier1Price: 680,
    tier2Price: 520,
    gstRate: 0.12,
    leadTime: '12-16 days',
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80',
    description: 'Sustainably salvaged timber boards for restaurants, cafes, and corporate gifting suites.',
    customBranding: 'Laser engraved brand emblem included',
    packSize: '20 units boxed with protective parchment'
  },
  {
    id: 'ws-05',
    name: 'Organic Stone-Washed Linen Tea Towels (Bundle of 60)',
    category: 'Fashion',
    moq: 60,
    samplePrice: 380,
    tier1Price: 240,
    tier2Price: 180,
    gstRate: 0.05,
    leadTime: '7-12 days',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    description: 'Ultra-absorbent lint-free Indian linen tea towels in earthy sage, terracotta, and warm ivory colorways.',
    customBranding: 'Woven label stitching available',
    packSize: '60 units (10 bundles of 6)'
  },
  {
    id: 'ws-06',
    name: 'Speckled Oatmeal Ceramic Cups (Set of 36)',
    category: 'Handmade Products',
    moq: 36,
    samplePrice: 580,
    tier1Price: 360,
    tier2Price: 275,
    gstRate: 0.12,
    leadTime: '14-20 days',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    description: 'Commercial dishwasher-safe ceramic cups for specialty coffee roasters and boutique cafes.',
    customBranding: 'Custom bottom ceramic maker stamp',
    packSize: '36 cups safely packed with pulp trays'
  }
];

export const WHOLESALE_BENEFITS = [
  {
    title: 'Tiered Volume Discounts',
    description: 'Save up to 45% off retail pricing with transparent volume breaks starting at low Indian MOQs.'
  },
  {
    title: 'Dedicated Account Specialist',
    description: 'One-on-one procurement support, tailored logistics, and pan-India GST compliant invoicing.'
  },
  {
    title: 'Custom Co-Branding & Packaging',
    description: 'Laser engraving, screen printing, and bespoke unboxing cards for corporate or retail branding.'
  },
  {
    title: 'Flexible Net-30 Terms',
    description: 'Apply for commercial credit terms with streamlined GST e-invoicing for verified Indian businesses.'
  }
];

export default WHOLESALE_PRODUCTS;
