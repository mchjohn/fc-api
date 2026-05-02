import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { BankAccountRepository } from 'src/shared/database/repositories/bank-accounts.repositories';

@Injectable()
export class BankAccountsService {
  constructor(private readonly bankAccountsRepo: BankAccountRepository) {}

  create(userId: string, createBankAccountDto: CreateBankAccountDto) {
    const { name, initialBalance, type, color } = createBankAccountDto;

    return this.bankAccountsRepo.create({
      data: {
        userId,
        name,
        initialBalance,
        type,
        color,
      },
    });
  }

  findAllByUserId(userId: string) {
    return this.bankAccountsRepo.findMany({ where: { userId } });
  }

  async findFirst(userId: string, bankAccountId: string) {
    const bankAccount = await this.bankAccountsRepo.findFirst({
      where: { id: bankAccountId, userId },
    });

    if (!bankAccount) {
      throw new NotFoundException('Bank account not found.');
    }

    return bankAccount;
  }

  async update(
    userId: string,
    bankAccountId: string,
    updateBankAccountDto: UpdateBankAccountDto,
  ) {
    const { name, initialBalance, type, color } = updateBankAccountDto;

    const exists = await this.bankAccountsRepo.count({
      where: { id: bankAccountId, userId },
    });

    if (exists === 0) {
      throw new NotFoundException('Bank account not found.');
    }

    return this.bankAccountsRepo.update({
      where: { id: bankAccountId },
      data: {
        name,
        initialBalance,
        type,
        color,
      },
    });
  }

  async remove(userId: string, bankAccountId: string) {
    const exists = await this.bankAccountsRepo.count({
      where: { id: bankAccountId, userId },
    });

    if (exists === 0) {
      throw new NotFoundException('Bank account not found.');
    }

    await this.bankAccountsRepo.delete({
      where: { id: bankAccountId },
    });

    return null;
  }
}
