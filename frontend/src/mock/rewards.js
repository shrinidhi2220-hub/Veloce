export const INITIAL_USER_REWARDS = {
  demoUser: 'Rahul S.',
  pointsBalance: 1450, // "VELOCE Seeds"
  tier: 'Sage Patron',
  nextTierPoints: 2000,
  dailyStreakDays: 5,
  lastDailyClaim: null,
  completedChallenges: ['welcome-bonus', 'profile-complete'],
  history: [
    { id: 'h1', date: '20 Nov 2026', title: 'Daily Wheel of Earth', seeds: '+150 Seeds', type: 'earn' },
    { id: 'h2', date: '18 Nov 2026', title: 'Eco & Craft Quiz Challenge', seeds: '+200 Seeds', type: 'earn' },
    { id: 'h3', date: '14 Nov 2026', title: 'Welcome Patron Bonus', seeds: '+500 Seeds', type: 'earn' },
    { id: 'h4', date: '10 Nov 2026', title: 'Order #VEL-IND-90214 Reward', seeds: '+600 Seeds', type: 'earn' }
  ]
};

export const REWARD_VOUCHERS = [
  {
    id: 'vouch-01',
    title: '₹250 Off Mindful Finds',
    pointsCost: 500,
    discountAmount: 250,
    code: 'SEEDS250',
    category: 'Store Voucher',
    description: 'Valid across any regular catalog purchase over ₹999.',
    icon: 'Ticket'
  },
  {
    id: 'vouch-02',
    title: 'Free Handcrafted Cotton Tote',
    pointsCost: 900,
    discountAmount: 450,
    code: 'FREETOTE',
    category: 'Physical Gift',
    description: 'We will automatically bundle an artisanal tote with your next order.',
    icon: 'Gift'
  },
  {
    id: 'vouch-03',
    title: '₹500 Off Artisan Orders',
    pointsCost: 1200,
    discountAmount: 500,
    code: 'EARTH500',
    category: 'Store Voucher',
    description: 'Take ₹500 off any order above ₹1,999 or wholesale sample bundle.',
    icon: 'Sparkles'
  },
  {
    id: 'vouch-04',
    title: 'Plant 5 Native Trees in Western Ghats',
    pointsCost: 750,
    discountAmount: 0,
    code: 'PLANT5TREES',
    category: 'Eco Impact',
    description: 'Dedicated re-wilding planting in Western Ghats with verified digital certificate.',
    icon: 'Trees'
  }
];

export const ENGAGEMENT_GAMES = [
  {
    id: 'game-spin',
    title: 'Daily Wheel of Earth',
    badge: 'Available Daily',
    pointsAward: 'Up to +250 Seeds',
    description: 'Spin once every 24 hours to win seeds, free shipping vouchers, or surprise maker discounts.',
    type: 'spin',
    actionText: 'Spin for Today'
  },
  {
    id: 'game-quiz',
    title: 'Weekly Eco & Craft Quiz',
    badge: '3 Questions',
    pointsAward: '+200 Seeds',
    description: 'Test your knowledge on circular fashion, natural Indian dyes, and sustainable ceramics.',
    type: 'quiz',
    actionText: 'Start 60s Quiz'
  },
  {
    id: 'game-recycle',
    title: 'Circular Drop-Off Pledge',
    badge: 'Action Quest',
    pointsAward: '+300 Seeds',
    description: 'Pledge to send back an eligible pre-loved VELOCE item for restoration and resale in Bangalore.',
    type: 'pledge',
    actionText: 'Take Pledge'
  }
];

export const SAMPLE_QUIZ_QUESTIONS = [
  {
    question: 'Which natural fiber produced extensively in India breathes exceptionally well and softens with every wash?',
    options: ['Synthetic Polyester', 'Pure Flax Linen', 'Acrylic Wool', 'Virgin Nylon'],
    correctIndex: 1,
    explanation: 'Flax linen contains natural lignins that become more supple, soft and durable with water and mindful use.'
  },
  {
    question: 'What is authentic vegetable-tanned leather treated with?',
    options: ['Heavy chemical salts', 'Natural tree bark, acorn, and plant tannins', 'Petroleum polymers', 'Formaldehyde dyes'],
    correctIndex: 1,
    explanation: 'Vegetable tanning uses natural tree bark and plant extracts, eliminating toxic chromium pollutants from Indian waterways.'
  },
  {
    question: 'How does buying Circular Market goods in India reduce environmental footprint?',
    options: ['Diverts craft goods from landfills', 'Saves manufacturing carbon emissions', 'Supports local restorative artisans', 'All of the above'],
    correctIndex: 3,
    explanation: 'Circular commerce addresses waste, carbon, and artisan livelihood preservation simultaneously.'
  }
];

export default {
  INITIAL_USER_REWARDS,
  REWARD_VOUCHERS,
  ENGAGEMENT_GAMES,
  SAMPLE_QUIZ_QUESTIONS
};
