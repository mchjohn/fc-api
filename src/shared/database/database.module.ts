import { Global, Module } from '@nestjs/common';

import { UsersRepository } from './repositories/users.repositories';
import { PrismaService } from './prisma.service';
import { CategoriesRepository } from './repositories/categories.repositories';
import { BankAccountRepository } from './repositories/bank-accounts.repositories';

@Global()
@Module({
  exports: [UsersRepository, CategoriesRepository, BankAccountRepository],
  providers: [
    PrismaService,
    UsersRepository,
    CategoriesRepository,
    BankAccountRepository,
  ],
})
export class DatabaseModule {}
