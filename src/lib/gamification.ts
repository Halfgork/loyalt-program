import { LEVEL_CONFIG, POINTS_CONFIG } from './constants';
import { UserLevel, Achievement, Mission, Streak } from '@/types/gamification';

// Calculate user level from total XP
export function calculateLevel(totalXP: number): UserLevel {
  const { levels, baseXP, xpMultiplier } = LEVEL_CONFIG;
  
  let currentLevel = 1;
  let currentXP = totalXP;
  let nextLevelXP = baseXP;
  
  // Find current level
  for (let i = 1; i <= LEVEL_CONFIG.maxLevel; i++) {
    const requiredXP = i === 1 ? 0 : Math.floor(baseXP * Math.pow(xpMultiplier, i - 2));
    
    if (totalXP >= requiredXP) {
      currentLevel = i;
      currentXP = totalXP - requiredXP;
      nextLevelXP = i === LEVEL_CONFIG.maxLevel 
        ? 0 
        : Math.floor(baseXP * Math.pow(xpMultiplier, i - 1)) - requiredXP;
    } else {
      break;
    }
  }
  
  // Get level info
  const levelInfo = levels.find(l => l.level === currentLevel) || levels[0];
  
  return {
    level: currentLevel,
    currentXP,
    nextLevelXP,
    totalXP,
    title: levelInfo.title,
    badge: levelInfo.badge,
    benefits: getLevelBenefits(currentLevel),
  };
}

// Get benefits for a specific level
export function getLevelBenefits(level: number): string[] {
  const benefits: string[] = [];
  
  if (level >= 2) benefits.push('Access to exclusive rewards');
  if (level >= 3) benefits.push('2x points on weekends');
  if (level >= 4) benefits.push('VIP customer support');
  if (level >= 5) benefits.push('Early access to new features');
  if (level >= 10) benefits.push('Special anniversary rewards');
  if (level >= 15) benefits.push('Free shipping on all orders');
  if (level >= 20) benefits.push('Personal loyalty manager');
  if (level >= 25) benefits.push('Invitation to exclusive events');
  
  return benefits;
}

// Calculate XP needed for next level
export function getXPForNextLevel(currentLevel: number): number {
  if (currentLevel >= LEVEL_CONFIG.maxLevel) return 0;
  
  const { baseXP, xpMultiplier } = LEVEL_CONFIG;
  return Math.floor(baseXP * Math.pow(xpMultiplier, currentLevel - 1));
}

// Calculate total XP needed to reach a specific level
export function getTotalXPForLevel(level: number): number {
  if (level <= 1) return 0;
  
  const { baseXP, xpMultiplier } = LEVEL_CONFIG;
  let totalXP = 0;
  
  for (let i = 1; i < level; i++) {
    totalXP += Math.floor(baseXP * Math.pow(xpMultiplier, i - 1));
  }
  
  return totalXP;
}

// Check if achievement is unlocked
export function checkAchievementProgress(
  achievement: Achievement,
  userStats: Record<string, number>
): { unlocked: boolean; progress: number } {
  const { condition } = achievement;
  const currentValue = userStats[condition.metric] || 0;
  
  let progress = 0;
  let unlocked = false;
  
  switch (condition.type) {
    case 'count':
    case 'amount':
      progress = Math.min(100, (currentValue / condition.target) * 100);
      unlocked = currentValue >= condition.target;
      break;
    case 'streak':
      progress = Math.min(100, (currentValue / condition.target) * 100);
      unlocked = currentValue >= condition.target;
      break;
    case 'date':
      // For date-based achievements, check if current date meets condition
      const currentDate = new Date();
      const targetDate = new Date(condition.target);
      unlocked = currentDate >= targetDate;
      progress = unlocked ? 100 : 0;
      break;
  }
  
  return { unlocked, progress: Math.round(progress) };
}

// Generate daily missions based on user activity
export function generateDailyMissions(userLevel: number): Mission[] {
  const missions: Partial<Mission>[] = [
    {
      title: 'Daily Check-in',
      description: 'Visit the app and claim your daily bonus',
      icon: '📅',
      type: 'daily',
      difficulty: 'easy',
      pointReward: 10,
      xpReward: 5,
      requirements: [
        {
          id: 'checkin',
          type: 'visit_count',
          target: 1,
          current: 0,
          description: 'Check in today',
        },
      ],
    },
    {
      title: 'Spend & Earn',
      description: 'Make a purchase to earn bonus points',
      icon: '💰',
      type: 'daily',
      difficulty: 'medium',
      pointReward: 50,
      xpReward: 25,
      requirements: [
        {
          id: 'purchase',
          type: 'purchase_amount',
          target: 20,
          current: 0,
          description: 'Spend $20 or more',
        },
      ],
    },
    {
      title: 'Social Sharer',
      description: 'Share your achievement on social media',
      icon: '📱',
      type: 'daily',
      difficulty: 'easy',
      pointReward: 25,
      xpReward: 10,
      requirements: [
        {
          id: 'share',
          type: 'social_share',
          target: 1,
          current: 0,
          description: 'Share on social media',
        },
      ],
    },
  ];
  
  // Adjust rewards based on user level
  return missions.map((mission, index) => ({
    id: `daily_${Date.now()}_${index}`,
    title: mission.title!,
    description: mission.description!,
    icon: mission.icon!,
    type: mission.type!,
    difficulty: mission.difficulty!,
    pointReward: Math.floor(mission.pointReward! * (1 + userLevel * 0.1)),
    xpReward: Math.floor(mission.xpReward! * (1 + userLevel * 0.1)),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    requirements: mission.requirements!,
    status: 'active' as const,
    progress: 0,
  }));
}

// Calculate streak multiplier
export function calculateStreakMultiplier(streak: Streak): number {
  const { current } = streak;
  
  if (current >= 30) return 3.0; // 30+ days: 3x multiplier
  if (current >= 14) return 2.5; // 14+ days: 2.5x multiplier
  if (current >= 7) return 2.0;  // 7+ days: 2x multiplier
  if (current >= 3) return 1.5;  // 3+ days: 1.5x multiplier
  
  return 1.0; // No bonus
}

// Check if streak is still active
export function isStreakActive(streak: Streak): boolean {
  const now = new Date();
  const lastActivity = new Date(streak.lastActivity);
  const hoursSinceLastActivity = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60);
  
  switch (streak.type) {
    case 'daily_visit':
      return hoursSinceLastActivity <= 48; // Allow 48 hours for daily visits
    case 'weekly_purchase':
      return hoursSinceLastActivity <= 168; // 7 days for weekly purchases
    case 'mission_complete':
      return hoursSinceLastActivity <= 24; // 24 hours for mission completion
    default:
      return false;
  }
}

// Update streak based on activity
export function updateStreak(streak: Streak, activityDate: Date = new Date()): Streak {
  const isActive = isStreakActive(streak);
  const lastActivity = new Date(streak.lastActivity);
  const timeDiff = activityDate.getTime() - lastActivity.getTime();
  
  if (!isActive) {
    // Streak broken, reset to 1
    return {
      ...streak,
      current: 1,
      lastActivity: activityDate,
      multiplier: calculateStreakMultiplier({ ...streak, current: 1 }),
    };
  }
  
  // Check if this is a new streak day
  const hoursSinceLastActivity = timeDiff / (1000 * 60 * 60);
  let newCurrent = streak.current;
  
  switch (streak.type) {
    case 'daily_visit':
      if (hoursSinceLastActivity >= 20) { // New day
        newCurrent = streak.current + 1;
      }
      break;
    case 'weekly_purchase':
      if (hoursSinceLastActivity >= 144) { // New week (6 days)
        newCurrent = streak.current + 1;
      }
      break;
    case 'mission_complete':
      newCurrent = streak.current + 1; // Always increment for mission completion
      break;
  }
  
  const updatedStreak = {
    ...streak,
    current: newCurrent,
    best: Math.max(streak.best, newCurrent),
    lastActivity: activityDate,
  };
  
  updatedStreak.multiplier = calculateStreakMultiplier(updatedStreak);
  
  return updatedStreak;
}

// Calculate bonus points from streaks and level
export function calculateBonusPoints(
  basePoints: number,
  userLevel: number,
  streaks: Streak[]
): number {
  let multiplier = 1.0;
  
  // Apply streak multipliers
  streaks.forEach(streak => {
    if (isStreakActive(streak)) {
      multiplier *= streak.multiplier;
    }
  });
  
  // Apply level bonus (5% per level)
  multiplier *= (1 + userLevel * 0.05);
  
  return Math.floor(basePoints * multiplier);
}

// Get random achievement based on rarity
export function getRandomAchievementByRarity(): string {
  const rarities = ['common', 'rare', 'epic', 'legendary'];
  const weights = [60, 25, 12, 3]; // Probability weights
  
  const random = Math.random() * 100;
  let cumulative = 0;
  
  for (let i = 0; i < rarities.length; i++) {
    cumulative += weights[i];
    if (random <= cumulative) {
      return rarities[i];
    }
  }
  
  return 'common';
}

// Create mission progress summary
export function getMissionProgressSummary(missions: Mission[]): {
  total: number;
  completed: number;
  active: number;
  expired: number;
  completionRate: number;
} {
  const total = missions.length;
  const completed = missions.filter(m => m.status === 'completed').length;
  const active = missions.filter(m => m.status === 'active').length;
  const expired = missions.filter(m => m.status === 'expired').length;
  
  return {
    total,
    completed,
    active,
    expired,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
} 