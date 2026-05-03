import { Injectable, NotFoundException } from '@nestjs/common';

import { TransactionsRepository } from 'src/shared/database/repositories/transactions.repositories';

@Injectable()
export class ValidateTransactionOwnershipService {
  constructor(private readonly transactionsRepo: TransactionsRepository) {}

  async validate(userId: string, transactionId: string) {
    const exists = await this.transactionsRepo.count({
      where: { id: transactionId, userId },
    });

    if (exists === 0) {
      throw new NotFoundException('transaction not found.');
    }
  }
}
