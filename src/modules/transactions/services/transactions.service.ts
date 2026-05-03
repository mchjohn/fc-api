import { Injectable } from '@nestjs/common';

import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { TransactionsRepository } from 'src/shared/database/repositories/transactions.repositories';
import { ValidateBankAccountOwnerShipService } from 'src/modules/bank-accounts/services/validate-bank-account-ownership.service';
import { ValidateCategoryOwnerShipService } from 'src/modules/categories/services/validate-category-ownership.service';
import { ValidateTransactionOwnershipService } from './validate-transaction-ownership.service';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionsRepo: TransactionsRepository,
    private readonly validateCategoryOwnershipService: ValidateCategoryOwnerShipService,
    private readonly validateBankAccountOwnerShipService: ValidateBankAccountOwnerShipService,
    private readonly validateTransactionOwnershipService: ValidateTransactionOwnershipService,
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

  async update(
    userId: string,
    transactionId: string,
    updateTransactionDto: UpdateTransactionDto,
  ) {
    const { name, type, value, bankAccountId, categoryId, date } =
      updateTransactionDto;

    await this.validateEntitiesOwnership({ userId, categoryId, bankAccountId });

    return this.transactionsRepo.update({
      where: { id: transactionId },
      data: { name, type, value, userId, bankAccountId, categoryId, date },
    });
  }

  async remove(userId: string, transactionId: string) {
    await this.validateEntitiesOwnership({ userId, transactionId });

    await this.transactionsRepo.delete({
      where: { id: transactionId },
    });

    return null;
  }

  private async validateEntitiesOwnership({
    userId,
    categoryId,
    bankAccountId,
    transactionId,
  }: {
    userId: string;
    categoryId?: string;
    bankAccountId?: string;
    transactionId?: string;
  }) {
    await Promise.all([
      transactionId &&
        this.validateTransactionOwnershipService.validate(
          userId,
          transactionId,
        ),
      bankAccountId &&
        this.validateBankAccountOwnerShipService.validate(
          userId,
          bankAccountId,
        ),
      categoryId &&
        this.validateCategoryOwnershipService.validate(userId, categoryId),
    ]);
  }
}
