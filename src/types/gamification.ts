export interface UserLevel {
  level: number;
  currentXP: number;
  nextLevelXP: number;
  totalXP: number;
  title: string;
  badge: string;
  benefits: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'purchase' | 'streak' | 'social' | 'exploration' | 'milestone';
  points: number;
  xp: number;
  condition: {
    type: 'count' | 'streak' | 'amount' | 'date';
    target: number;
    metric: string;
  };
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: number;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  difficulty: 'easy' | 'medium' | 'hard';
  pointReward: number;
  xpReward: number;
  expiresAt: Date;
  requirements: MissionRequirement[];
  status: 'active' | 'completed' | 'expired' | 'locked';
  progress: number; // 0-100
  completedAt?: Date;
}

export interface MissionRequirement {
  id: string;
  type: 'purchase_amount' | 'visit_count' | 'referral' | 'social_share' | 'review';
  target: number;
  current: number;
  description: string;
}

export interface Streak {
  type: 'daily_visit' | 'weekly_purchase' | 'mission_complete';
  current: number;
  best: number;
  lastActivity: Date;
  multiplier: number; // Bonus multiplier for points
}

export interface Leaderboard {
  id: string;
  name: string;
  type: 'points' | 'level' | 'achievements' | 'streak';
  period: 'daily' | 'weekly' | 'monthly' | 'all-time';
  entries: LeaderboardEntry[];
  userRank?: number;
  totalParticipants: number;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar?: string;
  score: number;
  rank: number;
  change: number; // Rank change from previous period
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt?: Date;
} 