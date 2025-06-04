'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  StellarWalletsKit, 
  WalletNetwork, 
  ISupportedWallet,
  FreighterModule,
  xBullModule,
  AlbedoModule,
  RabetModule,
  LobstrModule,
  HanaModule,
  HotWalletModule
} from '@creit.tech/stellar-wallets-kit';

// Freighter API interface
interface FreighterAPI {
  isConnected(): Promise<boolean>;
  getPublicKey(): Promise<string>;
  signTransaction(xdr: string, opts?: any): Promise<string>;
  getNetwork(): Promise<string>;
}

// Global window type
declare global {
  interface Window {
    freighterApi?: FreighterAPI;
  }
}

interface WalletContextType {
  kit: StellarWalletsKit | null;
  connectedWallet: ISupportedWallet | null;
  publicKey: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  openModal: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [kit, setKit] = useState<StellarWalletsKit | null>(null);
  const [connectedWallet, setConnectedWallet] = useState<ISupportedWallet | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize Stellar Wallets Kit
    const stellarKit = new StellarWalletsKit({
      network: WalletNetwork.TESTNET, // Change to PUBLIC for production
      selectedWalletId: 'freighter',
      modules: [
        new FreighterModule(),
        new xBullModule(),
        new AlbedoModule(),
        new RabetModule(),
        new LobstrModule(),
        new HanaModule(),
        new HotWalletModule()
      ]
    });

    setKit(stellarKit);

    // Check if wallet was previously connected
    const savedWalletId = localStorage.getItem('selectedWalletId');
    const savedPublicKey = localStorage.getItem('walletPublicKey');
    
    if (savedWalletId && savedPublicKey) {
      setPublicKey(savedPublicKey);
      setIsConnected(true);
      // Try to restore the selected wallet
      try {
        stellarKit.setWallet(savedWalletId);
      } catch (err) {
        console.warn('Could not restore wallet:', err);
      }
    }
  }, []);

  const connectWallet = async () => {
    if (!kit) {
      setError('Wallet kit not initialized');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const { address } = await kit.getAddress();
      
      setPublicKey(address);
      setIsConnected(true);
      
      // Save to localStorage
      localStorage.setItem('walletPublicKey', address);
      localStorage.setItem('selectedWalletId', 'freighter');
      
    } catch (err: any) {
      console.error('Wallet connection failed:', err);
      setError(err?.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setConnectedWallet(null);
    setPublicKey(null);
    setIsConnected(false);
    setError(null);
    
    // Clear localStorage
    localStorage.removeItem('walletPublicKey');
    localStorage.removeItem('selectedWalletId');
  };

  const openModal = () => {
    if (kit) {
      kit.openModal({
        onWalletSelected: async (option: ISupportedWallet) => {
          setConnectedWallet(option);
          kit.setWallet(option.id);
          await connectWallet();
        },
        onClosed: () => {
          setIsConnecting(false);
        }
      });
    }
  };

  const value: WalletContextType = {
    kit,
    connectedWallet,
    publicKey,
    isConnected,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    openModal
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}; 