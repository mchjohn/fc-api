import { Injectable } from '@nestjs/common';

import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { TransactionsRepository } from 'src/shared/database/repositories/transactions.repositories';
import { ValidateBankAccountOwnerShipService } from 'src/modules/bank-accounts/services/validate-bank-account-ownership.service';
import { ValidateCategoryOwnerShipService } from 'src/modules/categories/services/validate-category-ownership.service';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionsRepo: TransactionsRepository,
    private readonly validateCategoryOwnership: ValidateCategoryOwnerShipService,
    private readonly validateBankAccountOwnerShipService: ValidateBankAccountOwnerShipService,
  ) {}

  findAllByUserId(userId: string) {
    return this.transactionsRepo.findMany({ where: { userId } });
  }

  findFirst(userId: string, transactionId: string) {
    return this.transactionsRepo.findFirst({
      where: { userId, id: transactionId },
    });
  }

  async create(userId: string, createTransactionDto: CreateTransactionDto) {
    const { name, type, value, bankAccountId, categoryId, date } =
      createTransactionDto;

    await this.validateEntitiesOwnership({ userId, categoryId, bankAccountId });

    return this.transactionsRepo.create({
      data: { name, type, value, userId, bankAccountId, categoryId, date },
    });
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  async remove(userId: string, transactionId: string) {
    return this.transactionsRepo.delete({
      where: { userId, id: transactionId },
    });
  }

  private async validateEntitiesOwnership({
    userId,
    categoryId,
    bankAccountId,
  }: {
    userId: string;
    categoryId: string;
    bankAccountId: string;
  }) {
    await Promise.all([
      this.validateBankAccountOwnerShipService.validate(userId, bankAccountId),
      this.validateCategoryOwnership.validate(userId, categoryId),
    ]);
  }
}
