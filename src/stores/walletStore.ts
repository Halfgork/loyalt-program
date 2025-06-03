import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Keypair } from '@stellar/stellar-sdk';
import { WalletConnection, TokenBalance } from '@/types/stellar';
import { stellarClient } from '@/lib/stellar/client';
import { getBalance } from '@/lib/stellar/tokenOperations';

interface WalletState {
  // Connection state
  isConnected: boolean;
  publicKey: string | null;
  network: 'testnet' | 'mainnet';
  balance: TokenBalance | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  connect: (keypair: Keypair) => Promise<void>;
  disconnect: () => void;
  switchNetwork: (network: 'testnet' | 'mainnet') => Promise<void>;
  refreshBalance: () => Promise<void>;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      // Initial state
      isConnected: false,
      publicKey: null,
      network: 'testnet',
      balance: null,
      isLoading: false,
      error: null,

      // Connect wallet
      connect: async (keypair: Keypair) => {
        set({ isLoading: true, error: null });
        
        try {
          const publicKey = keypair.publicKey();
          
          // Initialize Stellar client
          await stellarClient.initContract();
          
          // Get initial balance
          const balance = await getBalance(publicKey);
          
          set({
            isConnected: true,
            publicKey,
            balance,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet';
          set({
            isConnected: false,
            publicKey: null,
            balance: null,
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      // Disconnect wallet
      disconnect: () => {
        set({
          isConnected: false,
          publicKey: null,
          balance: null,
          error: null,
        });
      },

      // Switch network
      switchNetwork: async (network: 'testnet' | 'mainnet') => {
        const { publicKey } = get();
        set({ isLoading: true, error: null });
        
        try {
          set({ network });
          
          // Refresh balance on new network if connected
          if (publicKey) {
            const balance = await getBalance(publicKey);
            set({ balance });
          }
          
          set({ isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to switch network';
          set({ isLoading: false, error: errorMessage });
        }
      },

      // Refresh balance
      refreshBalance: async () => {
        const { publicKey } = get();
        if (!publicKey) return;
        
        set({ isLoading: true });
        
        try {
          const balance = await getBalance(publicKey);
          set({ balance, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to refresh balance';
          set({ isLoading: false, error: errorMessage });
        }
      },

      // Set error
      setError: (error: string | null) => {
        set({ error });
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'loyaltymax-wallet',
      partialize: (state) => ({
        isConnected: state.isConnected,
        publicKey: state.publicKey,
        network: state.network,
      }),
    }
  )
);

// Utility hook for wallet connection status
export const useWalletConnection = (): WalletConnection => {
  const { isConnected, publicKey, network } = useWalletStore();
  
  return {
    isConnected,
    publicKey: publicKey || '',
    network,
  };
}; 