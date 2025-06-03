import { ContractAddresses } from '@/types/stellar';

// Contract addresses for different networks
// Update these with your actual deployed contract addresses
export const CONTRACT_ADDRESSES: Record<string, ContractAddresses> = {
  testnet: {
    // Replace with your actual deployed contract address on Stellar testnet
    // You can deploy your contract using: stellar contract deploy --wasm soroban_token_contract.wasm --source-account <your-account> --rpc-url https://soroban-testnet.stellar.org:443 --network-passphrase "Test SDF Network ; September 2015"
    tokenContract: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQAHHAGK3HH4', // Demo contract address
    network: 'testnet',
  },
  mainnet: {
    // Replace with your actual deployed contract address on Stellar mainnet
    tokenContract: 'CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', // Replace with actual mainnet contract address
    network: 'mainnet',
  },
};

// Default network for development
export const DEFAULT_NETWORK = 'testnet';

// Get contract address for current network
export function getContractAddress(network: 'testnet' | 'mainnet' = DEFAULT_NETWORK): string {
  const addresses = CONTRACT_ADDRESSES[network];
  if (!addresses) {
    throw new Error(`No contract addresses configured for network: ${network}`);
  }
  return addresses.tokenContract;
}

// Validate contract address format
export function isValidContractAddress(address: string): boolean {
  // Stellar contract addresses are 56 characters long and start with 'C'
  return /^C[A-Z0-9]{55}$/.test(address);
}

// Network configuration
export const NETWORK_CONFIG = {
  testnet: {
    networkPassphrase: 'Test SDF Network ; September 2015',
    rpcUrl: 'https://soroban-testnet.stellar.org',
    horizonUrl: 'https://horizon-testnet.stellar.org',
  },
  mainnet: {
    networkPassphrase: 'Public Global Stellar Network ; September 2015',
    rpcUrl: 'https://soroban-mainnet.stellar.org',
    horizonUrl: 'https://horizon.stellar.org',
  },
} as const;

// Environment configuration
export const getNetworkFromEnv = (): 'testnet' | 'mainnet' => {
  const network = process.env.NEXT_PUBLIC_STELLAR_NETWORK as 'testnet' | 'mainnet';
  return network || DEFAULT_NETWORK;
};

// Contract deployment information
export const CONTRACT_INFO = {
  name: 'Loyalty Token Contract',
  symbol: 'PTS',
  decimals: 7,
  description: 'Blockchain-powered loyalty points token for reward systems',
  github: 'https://github.com/Halfgork/soroban-token-contract',
}; 