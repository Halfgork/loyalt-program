'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Coins, Loader2 } from 'lucide-react';
import { TokenOperations } from '@/lib/stellar/tokenOperations';

interface PointsBalanceProps {
  balance: string;
  loading?: boolean;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function PointsBalance({ 
  balance, 
  loading = false, 
  showIcon = true,
  size = 'md' 
}: PointsBalanceProps) {
  const formattedBalance = TokenOperations.formatTokenAmount(balance);

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  return (
    <motion.div 
      className="flex items-center space-x-2"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {showIcon && (
        <div className="relative">
          {loading ? (
            <Loader2 className={`${iconSizes[size]} text-gold-500 animate-spin`} />
          ) : (
            <Coins className={`${iconSizes[size]} text-gold-500`} />
          )}
        </div>
      )}
      
      <div className="flex flex-col">
        <div className={`font-bold text-white ${sizeClasses[size]}`}>
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="h-4 w-16 bg-dark-600 rounded animate-pulse"></div>
            </div>
          ) : (
            <motion.span
              key={formattedBalance}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {formattedBalance}
            </motion.span>
          )}
        </div>
        
        <span className="text-xs text-gold-400 font-medium">PTS</span>
      </div>
    </motion.div>
  );
} 