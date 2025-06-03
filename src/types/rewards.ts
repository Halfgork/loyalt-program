export interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number; // Points required
  category: 'discount' | 'freebie' | 'experience' | 'exclusive';
  image: string;
  available: boolean;
  expiresAt?: Date;
  merchantId: string;
  terms?: string;
  redemptionInstructions: string;
}

export interface UserReward {
  id: string;
  rewardId: string;
  userId: string;
  redeemedAt: Date;
  usedAt?: Date;
  expiresAt?: Date;
  status: 'active' | 'used' | 'expired';
  code: string; // Unique redemption code
}

export interface RewardCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export interface RewardCatalog {
  categories: RewardCategory[];
  rewards: Reward[];
  featured: string[]; // Reward IDs
}

export interface PointTransaction {
  id: string;
  userId: string;
  type: 'earn' | 'burn' | 'bonus';
  amount: number;
  source: 'purchase' | 'mission' | 'referral' | 'bonus' | 'redemption';
  description: string;
  createdAt: Date;
  merchantId?: string;
  missionId?: string;
  metadata?: Record<string, any>;
} 