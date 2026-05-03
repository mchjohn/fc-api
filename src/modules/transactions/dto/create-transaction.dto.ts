import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

import { TransactionType } from '../entities/transaction.entity';

export class CreateTransactionDto {
  @IsUUID()
  @IsString()
  @IsNotEmpty({ message: 'bank account is required' })
  bankAccountId: string;

  @IsUUID()
  @IsString()
  @IsNotEmpty({ message: 'category is required' })
  categoryId: string;

  @IsString()
  @IsNotEmpty({ message: 'name is required' })
  name: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  value: number;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsNotEmpty()
  @IsEnum(TransactionType, {
    message: 'type must be one of these values: [INCOME, EXPENSE]',
  })
  type: TransactionType;
}
