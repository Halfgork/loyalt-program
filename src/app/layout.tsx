import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LoyaltyMax - Gamified Loyalty Rewards',
  description: 'A revolutionary loyalty program with blockchain-powered rewards, gamification, and real-time engagement.',
  keywords: 'loyalty program, rewards, blockchain, gamification, Stellar, Soroban',
  authors: [{ name: 'LoyaltyMax Team' }],
  openGraph: {
    title: 'LoyaltyMax - Gamified Loyalty Rewards',
    description: 'Earn points, unlock achievements, and redeem exclusive rewards in our gamified loyalty ecosystem.',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LoyaltyMax Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LoyaltyMax - Gamified Loyalty Rewards',
    description: 'Earn points, unlock achievements, and redeem exclusive rewards in our gamified loyalty ecosystem.',
    images: ['/og-image.png'],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: '#a855f7',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#a855f7" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <div className="min-h-screen bg-gradient-to-br from-game-bg via-game-surface to-game-accent">
            {/* Background effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gold-500/20 rounded-full blur-3xl"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
            </div>
            
            {/* Main content */}
            <div className="relative z-10">
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
} 