import { Keypair } from '@stellar/stellar-sdk';
import { stellarClient } from './client';
import { TokenMintParams, TokenBurnParams, TokenTransferParams, TokenBalance, TransactionResult } from '@/types/stellar';

// Token operations for loyalty points system
export class TokenOperations {
  
  // Mint tokens (award points to user)
  static async mintTokens(params: TokenMintParams, adminKeypair: Keypair): Promise<TransactionResult> {
    try {
      await stellarClient.initContract();
      
      const result = await stellarClient.submitTransaction(
        adminKeypair,
        'mint',
        [params.to, params.amount]
      );

      return result;
    } catch (error) {
      console.error('Failed to mint tokens:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Burn tokens (redeem points for rewards)
  static async burnTokens(params: TokenBurnParams, userKeypair: Keypair): Promise<TransactionResult> {
    try {
      await stellarClient.initContract();
      
      const result = await stellarClient.submitTransaction(
        userKeypair,
        'burn',
        [params.from, params.amount]
      );

      return result;
    } catch (error) {
      console.error('Failed to burn tokens:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Transfer tokens between users
  static async transferTokens(params: TokenTransferParams, fromKeypair: Keypair): Promise<TransactionResult> {
    try {
      await stellarClient.initContract();
      
      const result = await stellarClient.submitTransaction(
        fromKeypair,
        'transfer',
        [params.from, params.to, params.amount]
      );

      return result;
    } catch (error) {
      console.error('Failed to transfer tokens:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Get token balance for user
  static async getBalance(userAddress: string): Promise<TokenBalance> {
    try {
      await stellarClient.initContract();
      
      const result = await stellarClient.callContract('balance', [userAddress]);
      
      return {
        balance: result.result?.value || '0',
        symbol: 'PTS', // Loyalty Points Token Symbol
        decimals: 7, // Soroban standard decimals
      };
    } catch (error) {
      console.error('Failed to get token balance:', error);
      return {
        balance: '0',
        symbol: 'PTS',
        decimals: 7,
      };
    }
  }

  // Get token info (name, symbol, decimals, total supply)
  static async getTokenInfo() {
    try {
      await stellarClient.initContract();
      
      const [name, symbol, decimals, totalSupply] = await Promise.all([
        stellarClient.callContract('name'),
        stellarClient.callContract('symbol'),
        stellarClient.callContract('decimals'),
        stellarClient.callContract('total_supply'),
      ]);

      return {
        name: name.result?.value || 'Loyalty Points',
        symbol: symbol.result?.value || 'PTS',
        decimals: decimals.result?.value || 7,
        totalSupply: totalSupply.result?.value || '0',
      };
    } catch (error) {
      console.error('Failed to get token info:', error);
      return {
        name: 'Loyalty Points',
        symbol: 'PTS',
        decimals: 7,
        totalSupply: '0',
      };
    }
  }

  // Check allowance (if contract supports allowances)
  static async getAllowance(owner: string, spender: string): Promise<string> {
    try {
      await stellarClient.initContract();
      
      const result = await stellarClient.callContract('allowance', [owner, spender]);
      return result.result?.value || '0';
    } catch (error) {
      console.error('Failed to get allowance:', error);
      return '0';
    }
  }

  // Approve allowance (if contract supports allowances)
  static async approve(owner: Keypair, spender: string, amount: string): Promise<TransactionResult> {
    try {
      await stellarClient.initContract();
      
      const result = await stellarClient.submitTransaction(
        owner,
        'approve',
        [owner.publicKey(), spender, amount]
      );

      return result;
    } catch (error) {
      console.error('Failed to approve allowance:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Utility: Convert token amount from contract format to display format
  static formatTokenAmount(amount: string, decimals: number = 7): string {
    const num = BigInt(amount);
    const divisor = BigInt(10 ** decimals);
    const whole = num / divisor;
    const remainder = num % divisor;
    
    if (remainder === 0n) {
      return whole.toString();
    }
    
    const fractional = remainder.toString().padStart(decimals, '0').replace(/0+$/, '');
    return `${whole}.${fractional}`;
  }

  // Utility: Convert display amount to contract format
  static parseTokenAmount(amount: string, decimals: number = 7): string {
    const [whole, fractional = ''] = amount.split('.');
    const paddedFractional = fractional.padEnd(decimals, '0').slice(0, decimals);
    const fullAmount = whole + paddedFractional;
    return BigInt(fullAmount).toString();
  }
}

// Export individual functions for convenience
export const {
  mintTokens,
  burnTokens,
  transferTokens,
  getBalance,
  getTokenInfo,
  getAllowance,
  approve,
  formatTokenAmount,
  parseTokenAmount,
} = TokenOperations; 