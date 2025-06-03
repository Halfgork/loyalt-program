// App configuration
export const APP_CONFIG = {
  name: 'LoyaltyMax',
  description: 'A gamified loyalty reward system',
  version: '1.0.0',
  supportEmail: 'support@loyaltymax.com',
};

// Points configuration
export const POINTS_CONFIG = {
  defaultPointsPerDollar: 1,
  welcomeBonus: 100,
  referralBonus: 500,
  dailyCheckinBonus: 10,
  minimumRedemption: 100,
  maxPointsPerTransaction: 1000,
};

// Level configuration
export const LEVEL_CONFIG = {
  maxLevel: 50,
  baseXP: 100,
  xpMultiplier: 1.5,
  levels: [
    { level: 1, title: 'Newcomer', xp: 0, badge: '🌟' },
    { level: 2, title: 'Explorer', xp: 100, badge: '🚀' },
    { level: 3, title: 'Adventurer', xp: 250, badge: '⚡' },
    { level: 4, title: 'Champion', xp: 500, badge: '👑' },
    { level: 5, title: 'Legend', xp: 1000, badge: '💎' },
  ],
};

// Achievement categories
export const ACHIEVEMENT_CATEGORIES = [
  {
    id: 'purchase',
    name: 'Purchase Master',
    icon: '💰',
    color: 'text-green-600',
    description: 'Achievements related to purchases and spending',
  },
  {
    id: 'streak',
    name: 'Streak Hunter',
    icon: '🔥',
    color: 'text-orange-600',
    description: 'Achievements for maintaining streaks',
  },
  {
    id: 'social',
    name: 'Social Butterfly',
    icon: '🦋',
    color: 'text-blue-600',
    description: 'Achievements for social activities and referrals',
  },
  {
    id: 'exploration',
    name: 'Explorer',
    icon: '🗺️',
    color: 'text-purple-600',
    description: 'Achievements for trying new features',
  },
  {
    id: 'milestone',
    name: 'Milestone Master',
    icon: '🏆',
    color: 'text-yellow-600',
    description: 'Major milestone achievements',
  },
];

// Reward categories
export const REWARD_CATEGORIES = [
  {
    id: 'discount',
    name: 'Discounts',
    icon: '🏷️',
    color: 'text-red-600',
    description: 'Percentage or fixed amount discounts',
  },
  {
    id: 'freebie',
    name: 'Free Items',
    icon: '🎁',
    color: 'text-green-600',
    description: 'Free products and services',
  },
  {
    id: 'experience',
    name: 'Experiences',
    icon: '🎪',
    color: 'text-purple-600',
    description: 'Special experiences and events',
  },
  {
    id: 'exclusive',
    name: 'Exclusive Access',
    icon: '⭐',
    color: 'text-gold-600',
    description: 'VIP access and exclusive offers',
  },
];

// Mission types
export const MISSION_TYPES = {
  daily: {
    name: 'Daily',
    color: 'text-blue-600',
    icon: '📅',
    duration: 24 * 60 * 60 * 1000, // 24 hours
  },
  weekly: {
    name: 'Weekly',
    color: 'text-green-600',
    icon: '📊',
    duration: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
  monthly: {
    name: 'Monthly',
    color: 'text-purple-600',
    icon: '🗓️',
    duration: 30 * 24 * 60 * 60 * 1000, // 30 days
  },
  special: {
    name: 'Special',
    color: 'text-gold-600',
    icon: '🌟',
    duration: null, // Custom duration
  },
};

// Difficulty levels
export const DIFFICULTY_LEVELS = {
  easy: {
    name: 'Easy',
    color: 'text-green-600',
    multiplier: 1,
    icon: '🟢',
  },
  medium: {
    name: 'Medium',
    color: 'text-yellow-600',
    multiplier: 1.5,
    icon: '🟡',
  },
  hard: {
    name: 'Hard',
    color: 'text-red-600',
    multiplier: 2,
    icon: '🔴',
  },
};

// Rarity levels
export const RARITY_LEVELS = {
  common: {
    name: 'Common',
    color: 'text-gray-600',
    borderColor: 'border-gray-300',
    bgColor: 'bg-gray-50',
    chance: 60,
  },
  rare: {
    name: 'Rare',
    color: 'text-blue-600',
    borderColor: 'border-blue-300',
    bgColor: 'bg-blue-50',
    chance: 25,
  },
  epic: {
    name: 'Epic',
    color: 'text-purple-600',
    borderColor: 'border-purple-300',
    bgColor: 'bg-purple-50',
    chance: 12,
  },
  legendary: {
    name: 'Legendary',
    color: 'text-gold-600',
    borderColor: 'border-gold-300',
    bgColor: 'bg-gold-50',
    chance: 3,
  },
};

// Default merchant settings
export const DEFAULT_MERCHANT_SETTINGS = {
  pointsPerDollar: 1,
  welcomeBonus: 100,
  referralBonus: 500,
  minimumRedemption: 100,
  maxPointsPerTransaction: 1000,
  enableQRCodes: true,
  enableMissions: true,
  enableReferrals: true,
  brandColors: {
    primary: '#a855f7',
    secondary: '#f59e0b',
  },
};

// API endpoints (if using external services)
export const API_ENDPOINTS = {
  tokenInfo: '/api/token/info',
  balance: '/api/token/balance',
  mint: '/api/token/mint',
  burn: '/api/token/burn',
  transfer: '/api/token/transfer',
  rewards: '/api/rewards',
  missions: '/api/missions',
  achievements: '/api/achievements',
  leaderboard: '/api/leaderboard',
  analytics: '/api/analytics',
};

// Local storage keys
export const STORAGE_KEYS = {
  wallet: 'loyaltymax_wallet',
  user: 'loyaltymax_user',
  preferences: 'loyaltymax_preferences',
  theme: 'loyaltymax_theme',
  onboardingComplete: 'loyaltymax_onboarding_complete',
};

// Theme configuration
export const THEME_CONFIG = {
  colors: {
    primary: '#a855f7',
    secondary: '#f59e0b',
    background: '#0f0f23',
    surface: '#1a1a2e',
    accent: '#16213e',
  },
  animations: {
    duration: {
      fast: 150,
      normal: 300,
      slow: 500,
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },
}; 