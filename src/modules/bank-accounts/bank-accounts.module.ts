import { Module } from '@nestjs/common';

import { BankAccountsService } from './services/bank-accounts.service';
import { BankAccountsController } from './bank-accounts.controller';

@Module({
  controllers: [BankAccountsController],
  providers: [BankAccountsService],
})
export class BankAccountsModule {}
