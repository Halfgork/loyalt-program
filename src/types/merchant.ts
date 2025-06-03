export interface Merchant {
  id: string;
  name: string;
  description: string;
  logo: string;
  website?: string;
  email: string;
  phone?: string;
  address: Address;
  category: string;
  settings: MerchantSettings;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface MerchantSettings {
  pointsPerDollar: number; // Points earned per dollar spent
  welcomeBonus: number; // Points for first visit
  referralBonus: number; // Points for successful referral
  minimumRedemption: number; // Minimum points to redeem
  maxPointsPerTransaction: number; // Cap on points per transaction
  enableQRCodes: boolean;
  enableMissions: boolean;
  enableReferrals: boolean;
  brandColors: {
    primary: string;
    secondary: string;
  };
}

export interface QRCode {
  id: string;
  merchantId: string;
  type: 'checkin' | 'purchase' | 'bonus';
  value: number; // Points to award
  name: string;
  description?: string;
  isActive: boolean;
  usageLimit?: number;
  usageCount: number;
  expiresAt?: Date;
  createdAt: Date;
}

export interface MerchantAnalytics {
  period: 'day' | 'week' | 'month' | 'year';
  startDate: Date;
  endDate: Date;
  metrics: {
    totalCustomers: number;
    newCustomers: number;
    returningCustomers: number;
    totalPointsIssued: number;
    totalPointsRedeemed: number;
    averagePointsPerCustomer: number;
    engagementRate: number;
    retentionRate: number;
    topRewards: Array<{
      rewardId: string;
      name: string;
      redemptions: number;
    }>;
    customerLevels: Array<{
      level: number;
      count: number;
    }>;
    dailyActivity: Array<{
      date: Date;
      visits: number;
      points: number;
      redemptions: number;
    }>;
  };
}

export interface LoyaltyProgram {
  merchantId: string;
  name: string;
  description: string;
  isActive: boolean;
  settings: MerchantSettings;
  rewards: string[]; // Reward IDs
  missions: string[]; // Mission IDs
  achievements: string[]; // Achievement IDs
  analytics: MerchantAnalytics;
}

export interface CustomerInsight {
  userId: string;
  customerSince: Date;
  totalPoints: number;
  pointsRedeemed: number;
  level: number;
  visitCount: number;
  lastVisit: Date;
  favoriteRewards: string[];
  averageSpending: number;
  lifetimeValue: number;
  engagementScore: number;
} 