import { Contract, SorobanRpc } from '@stellar/stellar-sdk';

export interface SorobanClient {
  server: SorobanRpc.Server;
  contract: Contract;
}

export interface TokenBalance {
  balance: string;
  symbol: string;
  decimals: number;
}

export interface ContractCall {
  method: string;
  args: any[];
}

export interface TransactionResult {
  success: boolean;
  hash?: string;
  error?: string;
  result?: any;
}

export interface WalletConnection {
  publicKey: string;
  isConnected: boolean;
  network: 'testnet' | 'mainnet';
}

export interface TokenMintParams {
  to: string;
  amount: string;
}

export interface TokenBurnParams {
  from: string;
  amount: string;
}

export interface TokenTransferParams {
  from: string;
  to: string;
  amount: string;
}

export interface ContractAddresses {
  tokenContract: string;
  network: 'testnet' | 'mainnet';
} 