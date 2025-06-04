import React from 'react';
import Link from 'next/link';
import { Coins, Trophy, Users, Zap, Star, Gift, Target, Crown, Wallet } from 'lucide-react';
import { WalletConnectButton } from '@/components/WalletConnectButton';

export default function LandingPage() {
  const features = [
    {
      icon: Coins,
      title: 'Earn Points',
      description: 'Get rewarded for every purchase, check-in, and engagement with bonus multipliers.',
    },
    {
      icon: Trophy,
      title: 'Unlock Achievements',
      description: 'Complete challenges and unlock exclusive badges with real rewards.',
    },
    {
      icon: Users,
      title: 'Refer Friends',
      description: 'Share the rewards! Earn bonus points for every friend you invite.',
    },
    {
      icon: Zap,
      title: 'Daily Missions',
      description: 'Complete fun daily challenges to boost your points and level up faster.',
    },
    {
      icon: Star,
      title: 'Level Up',
      description: 'Progress through levels to unlock VIP benefits and exclusive perks.',
    },
    {
      icon: Gift,
      title: 'Redeem Rewards',
      description: 'Exchange your points for discounts, free items, and exclusive experiences.',
    },
  ];

  const stats = [
    { number: '10M+', label: 'Points Earned' },
    { number: '50K+', label: 'Active Members' },
    { number: '500+', label: 'Rewards Available' },
    { number: '95%', label: 'Satisfaction Rate' },
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Crown className="h-8 w-8 text-gold-500" />
            <span className="text-2xl font-bold gradient-text">LoyaltyMax</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-300 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">
              How It Works
            </Link>
            <Link href="#pricing" className="text-gray-300 hover:text-white transition-colors">
              Pricing
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <WalletConnectButton />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 gradient-text">
            The Future of
            <br />
            Loyalty Rewards
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Experience gamified loyalty like never before. Earn blockchain-powered points, 
            unlock achievements, and redeem exclusive rewards in our revolutionary ecosystem.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <WalletConnectButton 
              variant="primary" 
              size="large"
              text="Connect Wallet & Start Earning"
            />
            <Link href="#features" className="btn-game-secondary text-lg px-8 py-4">
              Learn More
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            {stats.map((stat, index) => (
              <div key={index} className="card-game text-center">
                <div className="text-3xl md:text-4xl font-bold text-gold-500 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our platform combines the best of gamification, blockchain technology, 
            and user experience to create an unparalleled loyalty system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card-game card-hover group">
              <div className="mb-6">
                <feature.icon className="h-12 w-12 text-primary-500 group-hover:text-gold-500 transition-colors" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">
                {feature.title}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            How It Works
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Getting started is easy. Follow these simple steps to begin your loyalty journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-purple-gradient rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-white">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-white">Connect Wallet</h3>
            <p className="text-gray-300">
              Connect your Stellar wallet to start earning blockchain-powered loyalty points.
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-purple-gradient rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-white">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-white">Earn Points</h3>
            <p className="text-gray-300">
              Shop, complete missions, and engage with brands to earn loyalty points automatically.
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-purple-gradient rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-white">Redeem Rewards</h3>
            <p className="text-gray-300">
              Use your points to unlock exclusive rewards, discounts, and premium experiences.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="card-game text-center max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already earning rewards and leveling up 
            their shopping experience with LoyaltyMax.
          </p>
          <WalletConnectButton 
            variant="primary" 
            size="large"
            text="Connect Wallet & Start Your Journey"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 border-t border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Crown className="h-6 w-6 text-gold-500" />
              <span className="text-xl font-bold gradient-text">LoyaltyMax</span>
            </div>
            <p className="text-gray-400">
              The future of loyalty rewards, powered by blockchain technology.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Platform</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link href="/rewards" className="hover:text-white transition-colors">Rewards</Link></li>
              <li><Link href="/missions" className="hover:text-white transition-colors">Missions</Link></li>
              <li><Link href="/leaderboard" className="hover:text-white transition-colors">Leaderboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Merchants</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/merchant" className="hover:text-white transition-colors">Merchant Dashboard</Link></li>
              <li><Link href="/merchant/setup" className="hover:text-white transition-colors">Setup Program</Link></li>
              <li><Link href="/merchant/analytics" className="hover:text-white transition-colors">Analytics</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2024 LoyaltyMax. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 