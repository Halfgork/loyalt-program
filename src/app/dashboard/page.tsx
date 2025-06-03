'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useWalletStore } from '@/stores/walletStore';
import { useGameStore } from '@/stores/gameStore';
import { TokenOperations } from '@/lib/stellar/tokenOperations';
import { Coins, Trophy, Target, Gift, User, Settings, Crown, Star, Zap, Calendar, TrendingUp } from 'lucide-react';
import Link from 'next/link';

// Components
import UserLevelProgress from '@/components/UserLevelProgress';
import AchievementCard from '@/components/AchievementCard';
import MissionCard from '@/components/MissionCard';
import RewardsGrid from '@/components/RewardsGrid';
import PointsBalance from '@/components/PointsBalance';

export default function Dashboard() {
  const { isConnected, publicKey, connectWallet } = useWalletStore();
  const { userLevel, totalPoints, achievements, missions, claimReward } = useGameStore();
  const [tokenBalance, setTokenBalance] = useState('0');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isConnected && publicKey) {
      loadTokenBalance();
    }
  }, [isConnected, publicKey]);

  const loadTokenBalance = async () => {
    if (!publicKey) return;
    
    setLoading(true);
    try {
      const balance = await TokenOperations.getBalance(publicKey);
      setTokenBalance(balance.balance);
    } catch (error) {
      console.error('Failed to load token balance:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card-game text-center max-w-md mx-auto">
          <Crown className="h-16 w-16 text-gold-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4 gradient-text">Connect Your Wallet</h2>
          <p className="text-gray-300 mb-6">
            Connect your Stellar wallet to start earning loyalty points and unlocking rewards.
          </p>
          <button
            onClick={connectWallet}
            className="btn-game w-full"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  const quickStats = [
    {
      icon: Coins,
      label: 'Total Points',
      value: TokenOperations.formatTokenAmount(tokenBalance),
      change: '+12.5%',
      trend: 'up'
    },
    {
      icon: Star,
      label: 'Current Level',
      value: userLevel.toString(),
      change: 'Level ' + (userLevel - 1),
      trend: 'up'
    },
    {
      icon: Trophy,
      label: 'Achievements',
      value: achievements.filter(a => a.unlocked).length.toString(),
      change: '+3 this week',
      trend: 'up'
    },
    {
      icon: Target,
      label: 'Active Missions',
      value: missions.filter(m => m.status === 'active').length.toString(),
      change: '2 completing',
      trend: 'neutral'
    }
  ];

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <div className="bg-dark-800 border-b border-dark-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Crown className="h-8 w-8 text-gold-500" />
              <div>
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <p className="text-gray-400">Welcome back, Loyalty Member!</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <PointsBalance balance={tokenBalance} loading={loading} />
              <Link href="/profile" className="btn-game-secondary">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card-game"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className={`text-sm ${
                    stat.trend === 'up' ? 'text-green-400' : 
                    stat.trend === 'down' ? 'text-red-400' : 'text-gray-400'
                  }`}>
                    {stat.change}
                  </p>
                </div>
                <stat.icon className="h-8 w-8 text-primary-500" />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Level Progress */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Star className="h-5 w-5 mr-2 text-gold-500" />
                Level Progress
              </h2>
              <UserLevelProgress />
            </motion.div>

            {/* Active Missions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2 text-primary-500" />
                Active Missions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {missions
                  .filter(mission => mission.status === 'active')
                  .slice(0, 4)
                  .map((mission, index) => (
                    <MissionCard key={mission.id} mission={mission} />
                  ))}
              </div>
              <Link 
                href="/missions" 
                className="inline-flex items-center text-primary-400 hover:text-primary-300 mt-4"
              >
                View All Missions
                <TrendingUp className="h-4 w-4 ml-1" />
              </Link>
            </motion.div>

            {/* Recent Achievements */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-gold-500" />
                Recent Achievements
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements
                  .filter(achievement => achievement.unlocked)
                  .slice(0, 4)
                  .map((achievement, index) => (
                    <AchievementCard key={achievement.id} achievement={achievement} />
                  ))}
              </div>
              <Link 
                href="/achievements" 
                className="inline-flex items-center text-primary-400 hover:text-primary-300 mt-4"
              >
                View All Achievements
                <Trophy className="h-4 w-4 ml-1" />
              </Link>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="card-game"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/earn" className="btn-game-secondary w-full justify-center">
                  <Zap className="h-4 w-4 mr-2" />
                  Earn Points
                </Link>
                <Link href="/rewards" className="btn-game-secondary w-full justify-center">
                  <Gift className="h-4 w-4 mr-2" />
                  Browse Rewards
                </Link>
                <Link href="/missions" className="btn-game-secondary w-full justify-center">
                  <Target className="h-4 w-4 mr-2" />
                  View Missions
                </Link>
                <Link href="/leaderboard" className="btn-game-secondary w-full justify-center">
                  <Crown className="h-4 w-4 mr-2" />
                  Leaderboard
                </Link>
              </div>
            </motion.div>

            {/* Featured Rewards */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="card-game"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Featured Rewards</h3>
              <div className="space-y-4">
                <div className="border border-dark-600 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white">Premium Discount</h4>
                    <span className="text-gold-500 font-bold">500 PTS</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">25% off your next purchase</p>
                  <button className="btn-game-secondary w-full text-sm">
                    Redeem Now
                  </button>
                </div>
                
                <div className="border border-dark-600 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white">Free Shipping</h4>
                    <span className="text-gold-500 font-bold">200 PTS</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">Free shipping on any order</p>
                  <button className="btn-game-secondary w-full text-sm">
                    Redeem Now
                  </button>
                </div>
              </div>
              
              <Link 
                href="/rewards" 
                className="inline-flex items-center text-primary-400 hover:text-primary-300 mt-4 text-sm"
              >
                View All Rewards
                <Gift className="h-3 w-3 ml-1" />
              </Link>
            </motion.div>

            {/* Activity Feed */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="card-game"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">Earned 50 points from purchase</p>
                    <p className="text-gray-400 text-xs">2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gold-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">Unlocked "First Purchase" badge</p>
                    <p className="text-gray-400 text-xs">1 day ago</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">Completed daily mission</p>
                    <p className="text-gray-400 text-xs">2 days ago</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
} 