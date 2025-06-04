'use client';

import React from 'react';
import { Wallet, LogOut, Loader2 } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { cn } from '@/lib/utils';

interface WalletConnectButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  text?: string;
  className?: string;
}

export function WalletConnectButton({ 
  variant = 'primary', 
  size = 'medium',
  text,
  className 
}: WalletConnectButtonProps) {
  const { 
    isConnected, 
    isConnecting, 
    publicKey, 
    error,
    openModal,
    disconnectWallet 
  } = useWallet();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'px-3 py-2 text-sm';
      case 'large':
        return 'px-8 py-4 text-lg';
      default:
        return 'px-6 py-3 text-base';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'secondary':
        return 'btn-game-secondary';
      case 'outline':
        return 'border border-purple-500 text-purple-400 hover:bg-purple-500/10';
      default:
        return 'btn-game';
    }
  };

  const baseClasses = cn(
    'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    getSizeClasses(),
    getVariantClasses(),
    className
  );

  // If connected, show wallet info
  if (isConnected && publicKey) {
    return (
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-green-500/20 text-green-400 rounded-lg border border-green-500/30">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-mono">{formatAddress(publicKey)}</span>
        </div>
        <button
          onClick={disconnectWallet}
          className="p-2 text-gray-400 hover:text-red-400 transition-colors"
          title="Disconnect Wallet"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    );
  }

  // Show connect button
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={openModal}
        disabled={isConnecting}
        className={baseClasses}
      >
        {isConnecting ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Wallet className="w-5 h-5" />
        )}
        {isConnecting 
          ? 'Connecting...' 
          : text || 'Connect Wallet'
        }
      </button>
      
      {error && (
        <p className="text-red-400 text-sm max-w-xs text-center">
          {error}
        </p>
      )}
      
      <p className="text-gray-400 text-xs text-center">
        Choose from multiple wallets
      </p>
    </div>
  );
} 