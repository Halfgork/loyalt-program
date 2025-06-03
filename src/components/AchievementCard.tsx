'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Crown, Shield, Zap, Target } from 'lucide-react';
import { Achievement } from '@/types/gamification';

interface AchievementCardProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
}

export default function AchievementCard({ achievement, size = 'md' }: AchievementCardProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'trophy': return Trophy;
      case 'star': return Star;
      case 'crown': return Crown;
      case 'shield': return Shield;
      case 'zap': return Zap;
      case 'target': return Target;
      default: return Trophy;
    }
  };

  const IconComponent = getIcon(achievement.icon);

  const sizeClasses = {
    sm: {
      card: 'p-3',
      icon: 'h-8 w-8',
      title: 'text-sm',
      description: 'text-xs',
      points: 'text-xs'
    },
    md: {
      card: 'p-4',
      icon: 'h-10 w-10',
      title: 'text-base',
      description: 'text-sm',
      points: 'text-sm'
    },
    lg: {
      card: 'p-6',
      icon: 'h-12 w-12',
      title: 'text-lg',
      description: 'text-base',
      points: 'text-base'
    }
  };

  const rarityColors = {
    common: 'text-gray-400 border-gray-600',
    rare: 'text-blue-400 border-blue-600',
    epic: 'text-purple-400 border-purple-600',
    legendary: 'text-gold-400 border-gold-600'
  };

  const isUnlocked = achievement.unlocked;

  return (
    <motion.div
      className={`card-game relative overflow-hidden ${sizeClasses[size].card} ${
        isUnlocked ? '' : 'opacity-75'
      }`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Rarity Border */}
      <div className={`absolute inset-0 border-2 rounded-lg ${rarityColors[achievement.rarity]}`}></div>
      
      {/* Unlock Effect */}
      {isUnlocked && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-gold-500/20 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 3,
            ease: "easeInOut"
          }}
        />
      )}

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className={`p-2 rounded-lg ${
            isUnlocked 
              ? `bg-${achievement.rarity === 'legendary' ? 'gold' : achievement.rarity === 'epic' ? 'purple' : achievement.rarity === 'rare' ? 'blue' : 'gray'}-500/20`
              : 'bg-dark-600'
          }`}>
            <IconComponent className={`${sizeClasses[size].icon} ${
              isUnlocked 
                ? rarityColors[achievement.rarity].split(' ')[0]
                : 'text-gray-500'
            }`} />
          </div>
          
          <div className="text-right">
            <div className={`${sizeClasses[size].points} font-bold ${
              isUnlocked ? 'text-gold-400' : 'text-gray-500'
            }`}>
              +{achievement.points}
            </div>
            <div className="text-xs text-gray-400">PTS</div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className={`font-semibold ${sizeClasses[size].title} ${
            isUnlocked ? 'text-white' : 'text-gray-400'
          }`}>
            {achievement.title}
          </h3>
          
          <p className={`${sizeClasses[size].description} ${
            isUnlocked ? 'text-gray-300' : 'text-gray-500'
          }`}>
            {achievement.description}
          </p>
        </div>

        {/* Progress Bar (for partially completed achievements) */}
        {!isUnlocked && achievement.progress !== undefined && achievement.progress > 0 && (
          <div className="mt-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-400">Progress</span>
              <span className="text-xs text-gray-400">{achievement.progress}%</span>
            </div>
            <div className="w-full bg-dark-600 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-primary-500 to-gold-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${achievement.progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        )}

        {/* Unlock Status */}
        <div className="mt-3 flex items-center justify-between">
          <span className={`text-xs px-2 py-1 rounded-full border ${
            isUnlocked 
              ? 'bg-green-500/20 border-green-500 text-green-400'
              : 'bg-dark-600 border-dark-500 text-gray-500'
          }`}>
            {isUnlocked ? 'Unlocked' : 'Locked'}
          </span>
          
          <span className={`text-xs capitalize ${rarityColors[achievement.rarity].split(' ')[0]}`}>
            {achievement.rarity}
          </span>
        </div>

        {/* Unlock Date */}
        {isUnlocked && achievement.unlockedAt && (
          <div className="mt-2 text-xs text-gray-400">
            Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
          </div>
        )}
      </div>
    </motion.div>
  );
} 