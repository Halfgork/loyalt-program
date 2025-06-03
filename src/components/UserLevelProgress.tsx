'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { Star, Crown, Zap } from 'lucide-react';
import { getLevelBenefits, getXPForNextLevel, getTotalXPForLevel } from '@/lib/gamification';

export default function UserLevelProgress() {
  const { userLevel, totalXP } = useGameStore();
  
  const currentLevel = userLevel.level;
  const currentLevelThreshold = getTotalXPForLevel(currentLevel);
  const nextLevelThreshold = getTotalXPForLevel(currentLevel + 1);
  const levelRewards = getLevelBenefits(currentLevel);
  
  // Calculate progress to next level
  const pointsInCurrentLevel = totalXP - currentLevelThreshold;
  const pointsNeededForNextLevel = nextLevelThreshold - currentLevelThreshold;
  const progressPercentage = Math.min(
    (pointsInCurrentLevel / pointsNeededForNextLevel) * 100,
    100
  );

  const isMaxLevel = currentLevel >= 50;

  return (
    <div className="card-game">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-16 h-16 bg-purple-gradient rounded-full flex items-center justify-center">
              {currentLevel >= 25 ? (
                <Crown className="h-8 w-8 text-white" />
              ) : currentLevel >= 10 ? (
                <Star className="h-8 w-8 text-white" />
              ) : (
                <Zap className="h-8 w-8 text-white" />
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-gold-500 text-dark-900 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {currentLevel}
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-white">
              Level {currentLevel}
            </h3>
            <p className="text-gray-400">
              {userLevel.title}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold text-gold-500">
            {totalXP.toLocaleString()}
          </p>
          <p className="text-gray-400 text-sm">Total XP</p>
        </div>
      </div>

      {!isMaxLevel && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400 text-sm">
              Progress to Level {currentLevel + 1}
            </span>
            <span className="text-white text-sm font-medium">
              {pointsInCurrentLevel.toLocaleString()} / {pointsNeededForNextLevel.toLocaleString()}
            </span>
          </div>
          
          <div className="relative">
            <div className="w-full bg-dark-600 rounded-full h-3">
              <motion.div
                className="bg-gradient-to-r from-primary-500 to-gold-500 h-3 rounded-full relative overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-shimmer"></div>
              </motion.div>
            </div>
            
            <div className="absolute right-0 top-full mt-1">
              <span className="text-xs text-gray-400">
                {(nextLevelThreshold - totalXP).toLocaleString()} XP to go
              </span>
            </div>
          </div>
        </div>
      )}

      {isMaxLevel && (
        <div className="text-center py-4 border-2 border-gold-500 rounded-lg bg-gold-500/10">
          <Crown className="h-8 w-8 text-gold-500 mx-auto mb-2" />
          <p className="text-gold-500 font-bold">Max Level Reached!</p>
          <p className="text-gray-400 text-sm">You've mastered the loyalty program</p>
        </div>
      )}

      {/* Level Rewards */}
      <div className="border-t border-dark-600 pt-4">
        <h4 className="text-white font-semibold mb-3 flex items-center">
          <Star className="h-4 w-4 mr-2 text-gold-500" />
          Level {currentLevel} Benefits
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {levelRewards.map((reward, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-3 p-3 bg-dark-700 rounded-lg"
            >
              <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
              <span className="text-gray-300 text-sm">{reward}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Next Level Preview */}
      {!isMaxLevel && (
        <div className="border-t border-dark-600 pt-4 mt-4">
          <h4 className="text-white font-semibold mb-3 flex items-center">
            <Zap className="h-4 w-4 mr-2 text-primary-500" />
            Next Level Preview
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {getLevelBenefits(currentLevel + 1).slice(0, 2).map((reward, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-dark-700/50 rounded-lg border border-primary-500/20"
              >
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <span className="text-gray-400 text-sm">{reward}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 