import { Injectable, NotFoundException } from '@nestjs/common';

import { BankAccountRepository } from 'src/shared/database/repositories/bank-accounts.repositories';

@Injectable()
export class ValidateBankAccountOwnerShipService {
  constructor(private readonly bankAccountsRepo: BankAccountRepository) {}

  async validate(userId: string, bankAccountId: string) {
    const exists = await this.bankAccountsRepo.count({
      where: { id: bankAccountId, userId },
    });

    if (exists === 0) {
      throw new NotFoundException('Bank account not found.');
    }
  }
}
