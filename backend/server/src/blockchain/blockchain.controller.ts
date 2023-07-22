import { Controller, Post } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';

@Controller('blockchain')
export class BlockchainController {
    constructor(private readonly blockchainService: BlockchainService) {}
    
    @Post()
    async withdraw() {
        this.blockchainService.withdraw();
    }
}
