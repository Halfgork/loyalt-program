'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Target, CheckCircle, Star, Calendar, Zap, Gift } from 'lucide-react';
import { Mission } from '@/types/gamification';
import { useGameStore } from '@/stores/gameStore';

interface MissionCardProps {
  mission: Mission;
  size?: 'sm' | 'md' | 'lg';
}

export default function MissionCard({ mission, size = 'md' }: MissionCardProps) {
  const { completeMission } = useGameStore();

  const sizeClasses = {
    sm: {
      card: 'p-3',
      icon: 'h-6 w-6',
      title: 'text-sm',
      description: 'text-xs',
      button: 'px-3 py-1 text-xs'
    },
    md: {
      card: 'p-4',
      icon: 'h-8 w-8',
      title: 'text-base',
      description: 'text-sm',
      button: 'px-4 py-2 text-sm'
    },
    lg: {
      card: 'p-6',
      icon: 'h-10 w-10',
      title: 'text-lg',
      description: 'text-base',
      button: 'px-6 py-3 text-base'
    }
  };

  const difficultyColors = {
    easy: 'text-green-400 border-green-600',
    medium: 'text-yellow-400 border-yellow-600',
    hard: 'text-red-400 border-red-600'
  };

  const typeIcons = {
    daily: Calendar,
    weekly: Clock,
    monthly: Clock,
    special: Star,
    achievement: Target
  };

  const TypeIcon = typeIcons[mission.type as keyof typeof typeIcons] || Target;

  const isCompleted = mission.status === 'completed';
  const isExpired = mission.expiresAt && new Date() > new Date(mission.expiresAt);
  const timeRemaining = mission.expiresAt ? new Date(mission.expiresAt).getTime() - Date.now() : 0;
  const hoursRemaining = Math.max(0, Math.floor(timeRemaining / (1000 * 60 * 60)));

  const handleComplete = () => {
    if (mission.progress >= 100 && !isCompleted) {
      completeMission(mission.id);
    }
  };

  return (
    <motion.div
      className={`card-game relative overflow-hidden ${sizeClasses[size].card} ${
        isCompleted ? 'opacity-75' : isExpired ? 'opacity-50' : ''
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={!isCompleted ? { scale: 1.02 } : {}}
      transition={{ duration: 0.2 }}
    >
      {/* Status Overlay */}
      {isCompleted && (
        <div className="absolute inset-0 bg-green-500/10 border border-green-500/30 rounded-lg" />
      )}
      
      {isExpired && !isCompleted && (
        <div className="absolute inset-0 bg-red-500/10 border border-red-500/30 rounded-lg" />
      )}

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              isCompleted 
                ? 'bg-green-500/20'
                : isExpired 
                ? 'bg-red-500/20'
                : 'bg-primary-500/20'
            }`}>
              <TypeIcon className={`${sizeClasses[size].icon} ${
                isCompleted 
                  ? 'text-green-400'
                  : isExpired 
                  ? 'text-red-400'
                  : 'text-primary-400'
              }`} />
            </div>
            
            <div>
              <span className={`text-xs px-2 py-1 rounded-full border ${difficultyColors[mission.difficulty]}`}>
                {mission.difficulty}
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className={`${sizeClasses[size].title.replace('text-', 'text-')} font-bold ${
              isCompleted ? 'text-green-400' : 'text-gold-400'
            }`}>
              +{mission.pointReward}
            </div>
            <div className="text-xs text-gray-400">PTS</div>
          </div>
        </div>

        {/* Mission Icon and Type */}
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-2xl">{mission.icon}</span>
          <span className={`text-xs px-2 py-1 rounded-full bg-dark-600 text-gray-300 uppercase tracking-wider`}>
            {mission.type}
          </span>
        </div>

        {/* Content */}
        <div className="space-y-2 mb-4">
          <h3 className={`font-semibold ${sizeClasses[size].title} ${
            isCompleted ? 'text-green-400' : 'text-white'
          }`}>
            {mission.title}
          </h3>
          
          <p className={`${sizeClasses[size].description} text-gray-300`}>
            {mission.description}
          </p>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-400">Progress</span>
            <span className="text-xs text-gray-300 font-medium">{mission.progress}%</span>
          </div>
          
          <div className="w-full bg-dark-600 rounded-full h-2">
            <motion.div
              className={`h-2 rounded-full ${
                isCompleted 
                  ? 'bg-green-500'
                  : 'bg-gradient-to-r from-primary-500 to-gold-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${mission.progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Requirements */}
        {mission.requirements && mission.requirements.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs text-gray-400 mb-2">Requirements</h4>
            <div className="space-y-1">
              {mission.requirements.map((req, index) => (
                <div key={req.id} className="flex items-center justify-between text-xs">
                  <span className="text-gray-300">{req.description}</span>
                  <span className={`${
                    req.current >= req.target ? 'text-green-400' : 'text-gray-400'
                  }`}>
                    {req.current}/{req.target}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timer */}
        {!isCompleted && !isExpired && timeRemaining > 0 && (
          <div className="mb-4 flex items-center space-x-2 text-xs text-gray-400">
            <Clock className="h-3 w-3" />
            <span>
              {hoursRemaining > 24 
                ? `${Math.floor(hoursRemaining / 24)}d ${hoursRemaining % 24}h remaining`
                : `${hoursRemaining}h remaining`
              }
            </span>
          </div>
        )}

        {/* Action Button */}
        <div className="flex items-center justify-between">
          {isCompleted ? (
            <div className="flex items-center space-x-2 text-green-400">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Completed</span>
            </div>
          ) : isExpired ? (
            <div className="flex items-center space-x-2 text-red-400">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">Expired</span>
            </div>
          ) : mission.progress >= 100 ? (
            <motion.button
              onClick={handleComplete}
              className={`btn-game ${sizeClasses[size].button} flex items-center space-x-2`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Gift className="h-4 w-4" />
              <span>Claim Reward</span>
            </motion.button>
          ) : (
            <span className="text-sm text-gray-400">In Progress</span>
          )}

          {/* XP Reward */}
          <div className="flex items-center space-x-1 text-xs text-gray-400">
            <Zap className="h-3 w-3" />
            <span>+{mission.xpReward} XP</span>
          </div>
        </div>

        {/* Completion Date */}
        {isCompleted && mission.completedAt && (
          <div className="mt-2 text-xs text-gray-400">
            Completed {new Date(mission.completedAt).toLocaleDateString()}
          </div>
        )}
      </div>
    </motion.div>
  );
} 