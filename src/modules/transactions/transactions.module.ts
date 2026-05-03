import { Module } from '@nestjs/common';

import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './services/transactions.service';
import { BankAccountsModule } from '../bank-accounts/bank-accounts.module';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService],
  imports: [BankAccountsModule, CategoriesModule],
})
export class TransactionsModule {}
