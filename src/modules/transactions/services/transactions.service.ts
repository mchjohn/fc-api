import { Injectable } from '@nestjs/common';

import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { TransactionsRepository } from 'src/shared/database/repositories/transactions.repositories';
import { ValidateTransactionOwnerShipService } from './validate-transaction-ownership.service';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionsRepo: TransactionsRepository,
    private readonly validateTransactionOwnership: ValidateTransactionOwnerShipService,
  ) {}

  findAllByUserId(userId: string) {
    return this.transactionsRepo.findMany({ where: { userId } });
  }

  findFirst(userId: string, transactionId: string) {
    return this.transactionsRepo.findFirst({
      where: { userId, id: transactionId },
    });
  }

  create(createTransactionDto: CreateTransactionDto) {
    return 'This action adds a new transaction';
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  async remove(userId: string, transactionId: string) {
    await this.validateTransactionOwnership.validate(userId, transactionId);

    return this.transactionsRepo.delete({
      where: { userId, id: transactionId },
    });
  }
}
