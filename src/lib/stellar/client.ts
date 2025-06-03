import { 
  Contract, 
  SorobanRpc, 
  TransactionBuilder, 
  Networks, 
  BASE_FEE,
  Keypair,
  Account,
  Operation
} from '@stellar/stellar-sdk';
import { getContractAddress, NETWORK_CONFIG } from './contractAddress';
import { SorobanClient, TransactionResult } from '@/types/stellar';

class StellarClient {
  private server: SorobanRpc.Server;
  private contract: Contract | null = null;
  private network: 'testnet' | 'mainnet';

  constructor(network: 'testnet' | 'mainnet' = 'testnet') {
    this.network = network;
    const config = NETWORK_CONFIG[network];
    this.server = new SorobanRpc.Server(config.rpcUrl);
  }

  // Initialize contract with deployed address
  async initContract(): Promise<void> {
    try {
      const contractAddress = getContractAddress(this.network);
      this.contract = new Contract(contractAddress);
    } catch (error) {
      console.error('Failed to initialize contract:', error);
      throw new Error('Contract initialization failed');
    }
  }

  // Get contract instance
  getContract(): Contract {
    if (!this.contract) {
      throw new Error('Contract not initialized. Call initContract() first.');
    }
    return this.contract;
  }

  // Get server instance
  getServer(): SorobanRpc.Server {
    return this.server;
  }

  // Call contract method (read-only)
  async callContract(method: string, args: any[] = []): Promise<any> {
    if (!this.contract) {
      await this.initContract();
    }

    try {
      const result = await this.server.simulateTransaction(
        new TransactionBuilder(
          new Account('GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF', '0'),
          { fee: BASE_FEE, networkPassphrase: Networks[this.network.toUpperCase() as keyof typeof Networks] }
        )
          .addOperation(this.contract!.call(method, ...args))
          .setTimeout(30)
          .build()
      );

      return result;
    } catch (error) {
      console.error(`Contract call failed for method ${method}:`, error);
      throw error;
    }
  }

  // Submit transaction to contract
  async submitTransaction(
    sourceKeypair: Keypair,
    method: string,
    args: any[] = []
  ): Promise<TransactionResult> {
    if (!this.contract) {
      await this.initContract();
    }

    try {
      // Get account info
      const account = await this.server.getAccount(sourceKeypair.publicKey());

      // Build transaction
      const transaction = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: Networks[this.network.toUpperCase() as keyof typeof Networks],
      })
        .addOperation(this.contract!.call(method, ...args))
        .setTimeout(30)
        .build();

      // Simulate first
      const simulated = await this.server.simulateTransaction(transaction);
      
      if (SorobanRpc.Api.isSimulationError(simulated)) {
        throw new Error(`Simulation failed: ${simulated.error}`);
      }

      // Prepare transaction
      const prepared = SorobanRpc.assembleTransaction(transaction, simulated);
      
      // Sign transaction
      prepared.sign(sourceKeypair);

      // Submit transaction
      const result = await this.server.sendTransaction(prepared);
      
      if (result.status === 'ERROR') {
        throw new Error(`Transaction failed: ${result.errorResult}`);
      }

      // Wait for confirmation
      const hash = result.hash;
      let getResponse = await this.server.getTransaction(hash);
      
      while (getResponse.status === SorobanRpc.Api.GetTransactionStatus.NOT_FOUND) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        getResponse = await this.server.getTransaction(hash);
      }

      if (getResponse.status === SorobanRpc.Api.GetTransactionStatus.SUCCESS) {
        return {
          success: true,
          hash,
          result: getResponse.returnValue,
        };
      } else {
        return {
          success: false,
          hash,
          error: 'Transaction failed',
        };
      }
    } catch (error) {
      console.error(`Transaction submission failed for method ${method}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Get account balance
  async getBalance(publicKey: string): Promise<string> {
    try {
      const account = await this.server.getAccount(publicKey);
      return account.balances.find(b => b.asset_type === 'native')?.balance || '0';
    } catch (error) {
      console.error('Failed to get balance:', error);
      return '0';
    }
  }

  // Get network info
  getNetworkInfo() {
    return {
      network: this.network,
      config: NETWORK_CONFIG[this.network],
      contractAddress: this.contract?.contractId() || null,
    };
  }
}

// Create singleton instance
export const stellarClient = new StellarClient();

// Export class for creating multiple instances if needed
export { StellarClient }; 