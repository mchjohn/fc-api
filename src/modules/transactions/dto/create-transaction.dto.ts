import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { Transaction } from '../entities/transaction.entity';

export class CreateTransactionDto {
  @IsString({ message: 'Name is required' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Initital balance is required' })
  value: number;

  @IsNotEmpty()
  @IsEnum(Transaction, {
    message: 'Type must be one of these values: [INCOME, EXPENSE]',
  })
  type: Transaction;
}
