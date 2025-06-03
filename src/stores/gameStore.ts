import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserLevel, Achievement, Mission, Streak, Leaderboard } from '@/types/gamification';
import { calculateLevel, generateDailyMissions, updateStreak } from '@/lib/gamification';

interface GameState {
  // User progression
  userLevel: UserLevel;
  totalXP: number;
  
  // Achievements
  achievements: Achievement[];
  unlockedAchievements: string[];
  
  // Missions
  dailyMissions: Mission[];
  weeklyMissions: Mission[];
  specialMissions: Mission[];
  
  // Streaks
  streaks: Streak[];
  
  // Leaderboards
  leaderboards: Leaderboard[];
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addXP: (amount: number) => void;
  unlockAchievement: (achievementId: string) => void;
  completeMission: (missionId: string) => void;
  updateMissionProgress: (missionId: string, progress: number) => void;
  updateStreakActivity: (streakType: string) => void;
  refreshDailyMissions: () => void;
  setLeaderboards: (leaderboards: Leaderboard[]) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  userLevel: calculateLevel(0),
  totalXP: 0,
  achievements: [],
  unlockedAchievements: [],
  dailyMissions: [],
  weeklyMissions: [],
  specialMissions: [],
  streaks: [
    {
      type: 'daily_visit' as const,
      current: 0,
      best: 0,
      lastActivity: new Date(),
      multiplier: 1,
    },
    {
      type: 'weekly_purchase' as const,
      current: 0,
      best: 0,
      lastActivity: new Date(),
      multiplier: 1,
    },
    {
      type: 'mission_complete' as const,
      current: 0,
      best: 0,
      lastActivity: new Date(),
      multiplier: 1,
    },
  ],
  leaderboards: [],
  isLoading: false,
  error: null,
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Add XP and update level
      addXP: (amount: number) => {
        const { totalXP } = get();
        const newTotalXP = totalXP + amount;
        const newLevel = calculateLevel(newTotalXP);
        
        set({
          totalXP: newTotalXP,
          userLevel: newLevel,
        });
      },

      // Unlock achievement
      unlockAchievement: (achievementId: string) => {
        const { unlockedAchievements, achievements } = get();
        
        if (!unlockedAchievements.includes(achievementId)) {
          const achievement = achievements.find(a => a.id === achievementId);
          
          set({
            unlockedAchievements: [...unlockedAchievements, achievementId],
          });
          
          // Add XP reward if achievement exists
          if (achievement) {
            get().addXP(achievement.xp);
          }
        }
      },

      // Complete mission
      completeMission: (missionId: string) => {
        const state = get();
        const allMissions = [
          ...state.dailyMissions,
          ...state.weeklyMissions,
          ...state.specialMissions,
        ];
        
        const mission = allMissions.find(m => m.id === missionId);
        
        if (mission && mission.status === 'active') {
          // Update mission status
          const updateMissions = (missions: Mission[]) =>
            missions.map(m =>
              m.id === missionId
                ? { ...m, status: 'completed' as const, progress: 100, completedAt: new Date() }
                : m
            );
          
          set({
            dailyMissions: updateMissions(state.dailyMissions),
            weeklyMissions: updateMissions(state.weeklyMissions),
            specialMissions: updateMissions(state.specialMissions),
          });
          
          // Add rewards
          get().addXP(mission.xpReward);
          
          // Update mission completion streak
          get().updateStreakActivity('mission_complete');
        }
      },

      // Update mission progress
      updateMissionProgress: (missionId: string, progress: number) => {
        const state = get();
        
        const updateMissions = (missions: Mission[]) =>
          missions.map(m =>
            m.id === missionId ? { ...m, progress: Math.min(100, progress) } : m
          );
        
        set({
          dailyMissions: updateMissions(state.dailyMissions),
          weeklyMissions: updateMissions(state.weeklyMissions),
          specialMissions: updateMissions(state.specialMissions),
        });
        
        // Auto-complete if progress reaches 100%
        if (progress >= 100) {
          get().completeMission(missionId);
        }
      },

      // Update streak activity
      updateStreakActivity: (streakType: string) => {
        const { streaks } = get();
        
        const updatedStreaks = streaks.map(streak =>
          streak.type === streakType ? updateStreak(streak) : streak
        );
        
        set({ streaks: updatedStreaks });
      },

      // Refresh daily missions
      refreshDailyMissions: () => {
        const { userLevel } = get();
        const newDailyMissions = generateDailyMissions(userLevel.level);
        
        set({ dailyMissions: newDailyMissions });
      },

      // Set leaderboards
      setLeaderboards: (leaderboards: Leaderboard[]) => {
        set({ leaderboards });
      },

      // Set error
      setError: (error: string | null) => {
        set({ error });
      },

      // Reset game state
      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'loyaltymax-game',
      partialize: (state) => ({
        userLevel: state.userLevel,
        totalXP: state.totalXP,
        unlockedAchievements: state.unlockedAchievements,
        streaks: state.streaks,
      }),
    }
  )
);

// Utility hooks
export const useUserLevel = () => {
  return useGameStore(state => state.userLevel);
};

export const useStreaks = () => {
  return useGameStore(state => state.streaks);
};

export const useMissions = () => {
  return useGameStore(state => ({
    daily: state.dailyMissions,
    weekly: state.weeklyMissions,
    special: state.specialMissions,
  }));
};

export const useAchievements = () => {
  return useGameStore(state => ({
    all: state.achievements,
    unlocked: state.unlockedAchievements,
  }));
}; 