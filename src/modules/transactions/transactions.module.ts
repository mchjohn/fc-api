import { Module } from '@nestjs/common';

import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './services/transactions.service';
import { ValidateTransactionOwnerShipService } from './services/validate-transaction-ownership.service';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService, ValidateTransactionOwnerShipService],
  exports: [ValidateTransactionOwnerShipService],
})
export class TransactionsModule {}
