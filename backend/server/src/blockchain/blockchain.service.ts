import { Injectable, Logger } from '@nestjs/common';

import { Contract, JsonRpcProvider, Signer, Wallet, ethers } from 'ethers';

// Read the artifcats and contract address
import * as LOCK_ARTIFACT from '../contracts/Lock.json';
import * as LOCK_CONTRACT_ADDRESS from '../contracts/contract-address.json';

@Injectable()
export class BlockchainService {
    // JSON-ROC Provider
    _provider: JsonRpcProvider;

    // Signer wallet
    _signer: Signer;

    // Contract
    _lock: Contract;

    private readonly logger = new Logger(BlockchainService.name);
    constructor() {
        this._provider = new JsonRpcProvider(process.env.PROVIDER_URL);
        this._signer = new Wallet(process.env.PRIVATE_KEY, this._provider);
        this._lock = new Contract(
            LOCK_CONTRACT_ADDRESS.Lock,
            LOCK_ARTIFACT.abi,
            this._signer
        );

        // Event Listener
        this._lock.connect(this._signer).on(
            "Withdrawal",
            (amount, when) => this.logger.log(amount, when)
        );
    }

    async withdraw() {
        try {
            await this._lock.withdraw();
            return {
                ststus: 'sucess',
                message: 'withdraw request placed',
            };
        } catch(error) {
            return {
                ststus: 'error',
                message: `withdraw request failed to be placed: ${error}`,
            };
        }
    }
}
