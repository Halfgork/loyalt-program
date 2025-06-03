'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Star, Tag, Zap } from 'lucide-react';

interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  category: 'discount' | 'product' | 'experience' | 'exclusive';
  imageUrl?: string;
  available: boolean;
  redeemed?: boolean;
}

interface RewardsGridProps {
  rewards?: Reward[];
  userPoints?: number;
}

export default function RewardsGrid({ rewards = [], userPoints = 0 }: RewardsGridProps) {
  // Sample rewards if none provided
  const defaultRewards: Reward[] = [
    {
      id: '1',
      title: '25% Off Next Purchase',
      description: 'Get 25% discount on your next order',
      pointsCost: 500,
      category: 'discount',
      available: true
    },
    {
      id: '2',
      title: 'Free Shipping',
      description: 'Free shipping on any order',
      pointsCost: 200,
      category: 'discount',
      available: true
    },
    {
      id: '3',
      title: 'Premium Product',
      description: 'Exclusive premium item',
      pointsCost: 1000,
      category: 'product',
      available: true
    },
    {
      id: '4',
      title: 'VIP Experience',
      description: 'Exclusive event access',
      pointsCost: 2000,
      category: 'experience',
      available: false
    }
  ];

  const displayRewards = rewards.length > 0 ? rewards : defaultRewards;

  const categoryColors = {
    discount: 'text-green-400 border-green-600',
    product: 'text-blue-400 border-blue-600',
    experience: 'text-purple-400 border-purple-600',
    exclusive: 'text-gold-400 border-gold-600'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayRewards.map((reward, index) => {
        const canAfford = userPoints >= reward.pointsCost;
        const isAvailable = reward.available && !reward.redeemed;
        
        return (
          <motion.div
            key={reward.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`card-game relative overflow-hidden ${
              !isAvailable || !canAfford ? 'opacity-50' : ''
            }`}
          >
            {/* Category Badge */}
            <div className="absolute top-4 right-4 z-10">
              <span className={`text-xs px-2 py-1 rounded-full border ${categoryColors[reward.category]}`}>
                {reward.category}
              </span>
            </div>

            {/* Image Placeholder */}
            <div className="h-32 bg-gradient-to-br from-primary-500/20 to-gold-500/20 rounded-lg mb-4 flex items-center justify-center">
              <Gift className="h-12 w-12 text-primary-400" />
            </div>

            {/* Content */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">
                {reward.title}
              </h3>
              
              <p className="text-gray-300 text-sm">
                {reward.description}
              </p>

              {/* Cost */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-gold-500" />
                  <span className="text-gold-500 font-bold">
                    {reward.pointsCost} PTS
                  </span>
                </div>
                
                {canAfford && (
                  <Zap className="h-4 w-4 text-green-400" />
                )}
              </div>

              {/* Action Button */}
              <button
                disabled={!isAvailable || !canAfford}
                className={`btn-game w-full ${
                  !isAvailable || !canAfford
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:scale-105'
                }`}
              >
                {reward.redeemed 
                  ? 'Redeemed'
                  : !reward.available
                  ? 'Unavailable'
                  : !canAfford
                  ? 'Not Enough Points'
                  : 'Redeem Now'
                }
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
} 