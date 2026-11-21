export const PRODUCTS = [
  {
    id: 'prod-01',
    name: 'Terracotta Fluted Ceramic Vase',
    slug: 'terracotta-fluted-ceramic-vase',
    category: 'Home & Living',
    categorySlug: 'home-living',
    price: 1850,
    comparePrice: 2400,
    gstRate: 0.12, // 12% GST on ceramics
    rating: 4.9,
    reviewCount: 38,
    inStock: true,
    stockCount: 14,
    badge: 'Best Seller',
    isTrending: true,
    isNew: false,
    images: [
      'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Wheel-thrown in natural terracotta clay with subtle fluted ridges and a tactile matte slip. Built to celebrate wild branches, dried florals, or standalone architectural display.',
    specs: {
      'Material': '100% Earthenware Terracotta Clay',
      'Dimensions': '10.5" H x 6" Diameter',
      'Finish': 'Unglazed matte textured exterior, water-tight glazed interior',
      'Origin': 'Handcrafted in Jaipur, Rajasthan',
      'Care': 'Hand wash gently with mild botanical soap'
    },
    reviews: [
      { id: 'r1', author: 'Ananya S.', rating: 5, date: '2 days ago', title: 'Stunning craftsmanship', comment: 'The terracotta finish has an authentic warmth that anchors my Bengaluru living room coffee table perfectly.' },
      { id: 'r2', author: 'Karan M.', rating: 5, date: '1 week ago', title: 'Exceeded expectations', comment: 'Substantial weight and beautifully textured. The fluting is subtle and modern.' }
    ]
  },
  {
    id: 'prod-02',
    name: 'Washed Sage Linen Kimono Robe',
    slug: 'washed-sage-linen-kimono-robe',
    category: 'Fashion',
    categorySlug: 'fashion',
    price: 3450,
    comparePrice: 4200,
    gstRate: 0.05, // 5% GST on organic apparel
    rating: 4.8,
    reviewCount: 42,
    inStock: true,
    stockCount: 9,
    badge: 'Eco Pick',
    isTrending: true,
    isNew: true,
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Stone-washed European flax linen tailored with relaxed drop shoulders, deep patch pockets, and a wide matching sash. Softens naturally with every gentle wash.',
    specs: {
      'Material': '100% Certified Organic European Flax (185 GSM)',
      'Fit': 'Relaxed unisex oversized silhouette',
      'Origin': 'Artisan studio woven in Auroville, Tamil Nadu',
      'Care': 'Machine wash cold on gentle cycle; air dry or low tumble'
    },
    reviews: [
      { id: 'r3', author: 'Devika R.', rating: 5, date: '3 days ago', title: 'Absolute luxury', comment: 'The sage color is serene and the linen breathes effortlessly during warm evenings.' }
    ]
  },
  {
    id: 'prod-03',
    name: 'Artisan Olive Wood Serving Board',
    slug: 'artisan-olive-wood-serving-board',
    category: 'Home & Living',
    categorySlug: 'home-living',
    price: 1650,
    comparePrice: 2100,
    gstRate: 0.12,
    rating: 4.9,
    reviewCount: 67,
    inStock: true,
    stockCount: 22,
    badge: 'Handcrafted',
    isTrending: false,
    isNew: true,
    images: [
      'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Carved from single pieces of salvaged seasoned timber, preserving organic live edges and dramatic swirling grain patterns. Sealed with cold-pressed organic walnut oil.',
    specs: {
      'Material': 'Salvaged Seasoned Olive Timber',
      'Dimensions': '18" L x 8" W x 0.8" Thickness',
      'Finish': 'Food-safe organic walnut oil & beeswax',
      'Origin': 'Carved in Saharanpur, Uttar Pradesh',
      'Care': 'Hand wash only; occasionally replenish with food-grade oil'
    },
    reviews: [
      { id: 'r4', author: 'Priya M.', rating: 5, date: '1 month ago', title: 'Centerpiece of my table', comment: 'No two boards are alike. Everyone asks where I got this whenever I host dinner in Indiranagar.' }
    ]
  },
  {
    id: 'prod-04',
    name: 'Vegetable-Tanned Saddle Leather Tote',
    slug: 'vegetable-tanned-saddle-leather-tote',
    category: 'Accessories',
    categorySlug: 'accessories',
    price: 4890,
    comparePrice: 5990,
    gstRate: 0.18, // 18% GST on premium leather accessories
    rating: 4.9,
    reviewCount: 51,
    inStock: true,
    stockCount: 6,
    badge: 'Artisan Made',
    isTrending: true,
    isNew: false,
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Minimalist heirloom tote structured from full-grain vegetable-tanned leather that develops an authentic, rich honey patina over decades of daily use.',
    specs: {
      'Material': 'Full-grain certified chemical-free vegetable-tanned leather',
      'Hardware': 'Solid antique brass rivets',
      'Dimensions': '15" W x 13" H x 5" D with 10" strap drop',
      'Origin': 'Hand-stitched in Kanpur artisan cluster',
      'Interior': 'Detachable zippered key/phone pouch included'
    },
    reviews: [
      { id: 'r5', author: 'Rahul S.', rating: 5, date: '2 weeks ago', title: 'True heirloom quality', comment: 'The smell of real vegetable-tanned leather is unmatched. Sturdy enough for my 15-inch laptop and diaries.' }
    ]
  },
  {
    id: 'prod-05',
    name: 'Wild Eucalyptus & Hinoki Candle',
    slug: 'wild-eucalyptus-hinoki-candle',
    category: 'Beauty & Lifestyle',
    categorySlug: 'beauty-lifestyle',
    price: 850,
    comparePrice: 1100,
    gstRate: 0.12,
    rating: 4.7,
    reviewCount: 89,
    inStock: true,
    stockCount: 35,
    badge: 'Popular',
    isTrending: true,
    isNew: false,
    images: [
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608248597359-57732df3df97?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Poured into a reusable matte charcoal ceramic vessel with pure golden soy wax, cracked wood wick, and therapeutic essential oils of Nilgiri blue gum eucalyptus and hinoki.',
    specs: {
      'Wax': '100% GMO-Free Plant Soy Wax',
      'Wick': 'FSC-Certified crackling wooden wick',
      'Burn Time': 'Approximately 55-60 hours',
      'Vessel': 'Handmade ceramic tumbler, food-safe after candle life'
    },
    reviews: [
      { id: 'r6', author: 'Meera K.', rating: 5, date: '5 days ago', title: 'Soothing ritual', comment: 'The wood wick crackles softly like a tiny fireplace, and the scent is crisp, woody and calming.' }
    ]
  },
  {
    id: 'prod-06',
    name: 'Handcrafted Walnut & Brass Speaker',
    slug: 'handcrafted-walnut-brass-speaker',
    category: 'Electronics',
    categorySlug: 'electronics',
    price: 5990,
    comparePrice: 7490,
    gstRate: 0.18,
    rating: 4.8,
    reviewCount: 29,
    inStock: true,
    stockCount: 8,
    badge: 'New Arrival',
    isTrending: true,
    isNew: true,
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Solid walnut acoustic enclosure paired with brushed solid brass volume dials. Powered by custom 40W neodymium drivers for warm, room-filling sound.',
    specs: {
      'Enclosure': 'Solid Walnut Wood with natural oil finish',
      'Connectivity': 'Bluetooth 5.3 Low Latency & 3.5mm Aux Input',
      'Battery Life': '18+ hours playback on USB-C fast charge',
      'Dimensions': '8.5" x 4.2" x 3.5"'
    },
    reviews: [
      { id: 'r7', author: 'Arjun V.', rating: 5, date: '1 week ago', title: 'Audiophile beauty', comment: 'Sound profile is warm and vocal-forward. It looks like a gallery piece on my desk.' }
    ]
  },
  {
    id: 'prod-07',
    name: 'Hand-Knotted Botanical Wool Rug',
    slug: 'hand-knotted-botanical-wool-rug',
    category: 'Handmade Products',
    categorySlug: 'handmade-products',
    price: 9800,
    comparePrice: 12500,
    gstRate: 0.12,
    rating: 5.0,
    reviewCount: 16,
    inStock: true,
    stockCount: 4,
    badge: 'Heirloom',
    isTrending: false,
    isNew: true,
    images: [
      'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Hand-spun virgin wool dyed with pomegranate rind, madder root, and indigo. Knotted by 4th-generation master weavers using upright looms.',
    specs: {
      'Pile': '100% Hand-spun unbleached virgin wool',
      'Knot Density': '80 knots per square inch',
      'Dimensions': '4 ft x 6 ft',
      'Origin': 'Woven in Bhadohi, India'
    },
    reviews: [
      { id: 'r8', author: 'Siddharth T.', rating: 5, date: '3 weeks ago', title: 'Remarkable texture', comment: 'Incredible underfoot cushion and the natural plant dyes give it a timeless, muted earthy warmth.' }
    ]
  },
  {
    id: 'prod-08',
    name: 'Textured Oatmeal Ceramic Mug Set',
    slug: 'textured-oatmeal-ceramic-mug-set',
    category: 'Home & Living',
    categorySlug: 'home-living',
    price: 1150,
    comparePrice: 1450,
    gstRate: 0.12,
    rating: 4.9,
    reviewCount: 114,
    inStock: true,
    stockCount: 40,
    badge: 'Staff Favorite',
    isTrending: true,
    isNew: false,
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Set of two stoneware cups thrown on the potter wheel with a speckled oatmeal glaze, exposed sandy rim, and thumb-rest handle tailored for mindful morning chai or filter coffee.',
    specs: {
      'Includes': 'Pair of 2 matching mugs (320 ml capacity each)',
      'Material': 'High-fire stoneware clay',
      'Safety': 'Microwave & dishwasher safe, lead-free food glaze'
    },
    reviews: [
      { id: 'r9', author: 'Tara N.', rating: 5, date: '4 days ago', title: 'My everyday morning cup', comment: 'The thumb rest is pure ergonomic genius. Perfect for morning South Indian filter coffee.' }
    ]
  },
  {
    id: 'prod-09',
    name: 'Raw Silk Relaxed Trousers',
    slug: 'raw-silk-relaxed-trousers',
    category: 'Fashion',
    categorySlug: 'fashion',
    price: 3890,
    comparePrice: 4750,
    gstRate: 0.05,
    rating: 4.7,
    reviewCount: 22,
    inStock: true,
    stockCount: 11,
    badge: 'Limited Run',
    isTrending: false,
    isNew: true,
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Tailored from noil raw silk with natural slub texture. Cut with an elasticated drawstring waistband, pleats at the hips, and a gentle tapered ankle break.',
    specs: {
      'Material': '100% Unbleached Mulberry Raw Silk (Noil)',
      'Closure': 'Elastic back with natural cotton drawstring',
      'Care': 'Gentle hand wash with silk detergent or dry clean'
    },
    reviews: [
      { id: 'r10', author: 'Kavita D.', rating: 5, date: '2 weeks ago', title: 'Drapes like a dream', comment: 'Breathable, luxurious, and so versatile with both Kolhapuris and loafers.' }
    ]
  },
  {
    id: 'prod-10',
    name: 'Hand-Hammered Brass Table Lamp',
    slug: 'hand-hammered-brass-table-lamp',
    category: 'Electronics',
    categorySlug: 'electronics',
    price: 4250,
    comparePrice: 5200,
    gstRate: 0.18,
    rating: 4.8,
    reviewCount: 31,
    inStock: true,
    stockCount: 7,
    badge: 'Artisan Made',
    isTrending: false,
    isNew: false,
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Dome shade hand-beaten by brass coppersmiths into dimpled facets that scatter warm amber light. Comes with a braided cotton cord and brass rotary dimmer switch.',
    specs: {
      'Base': 'Solid spun brass with hand-hammered shade',
      'Bulb': 'Warm 2200K Edison LED filament bulb included (dimmable)',
      'Cord': '6-foot twisted sage green cotton cloth wire with Indian 3-pin plug'
    },
    reviews: [
      { id: 'r11', author: 'Nikhil P.', rating: 5, date: '1 month ago', title: 'Moody and gorgeous', comment: 'The dimming function creates the coziest evening mood in our reading corner.' }
    ]
  },
  {
    id: 'prod-11',
    name: 'Botanical Cold-Pressed Body Elixir',
    slug: 'botanical-cold-pressed-body-elixir',
    category: 'Beauty & Lifestyle',
    categorySlug: 'beauty-lifestyle',
    price: 1290,
    comparePrice: 1650,
    gstRate: 0.12,
    rating: 4.9,
    reviewCount: 74,
    inStock: true,
    stockCount: 28,
    badge: 'Best Seller',
    isTrending: true,
    isNew: false,
    images: [
      'https://images.unsplash.com/photo-1608248597359-57732df3df97?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Cold-pressed golden jojoba, Kashmiri almond, and rosehip oils infused with sun-dried calendula blossoms and wild vetiver roots.',
    specs: {
      'Volume': '100 ml amber glass dropper bottle',
      'Ingredients': 'Pure Jojoba Oil, Sweet Almond Oil, Khus (Vetiver) Root Extract',
      'Ethics': 'Vegan, cruelty-free, zero mineral oil or synthetic fragrance'
    },
    reviews: [
      { id: 'r12', author: 'Sunita G.', rating: 5, date: '1 week ago', title: 'Liquid gold', comment: 'Leaves skin glowing without feeling sticky. The natural khus scent is so grounding.' }
    ]
  },
  {
    id: 'prod-12',
    name: 'Woven Raffia & Leather Shopper',
    slug: 'woven-raffia-leather-shopper',
    category: 'Accessories',
    categorySlug: 'accessories',
    price: 2450,
    comparePrice: 2990,
    gstRate: 0.12,
    rating: 4.6,
    reviewCount: 19,
    inStock: true,
    stockCount: 15,
    badge: 'Sustainable',
    isTrending: false,
    isNew: true,
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Hand-crocheted natural palm fiber market tote, reinforced with supple terracotta vegetable-tanned leather handles.',
    specs: {
      'Body': '100% Biodegradable natural palm fiber',
      'Handles': 'Full-grain saddle leather',
      'Dimensions': '17" W x 14" H x 6" Base gusset'
    },
    reviews: [
      { id: 'r13', author: 'Zoe B.', rating: 5, date: '6 days ago', title: 'Perfect weekend bag', comment: 'Lightweight yet holds all my weekend market produce comfortably.' }
    ]
  }
];

export default PRODUCTS;
