import {
  IsEnum,
  IsHexColor,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

import { BankAccountType } from '../entities/bank-account.entity';

export class CreateBankAccountDto {
  @IsString({ message: 'Name is required' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Initital balance is required' })
  initialBalance: number;

  @IsNotEmpty()
  @IsEnum(BankAccountType, {
    message: 'Type must be one of these values: [CHECKING, INVESTMENT, CASH]',
  })
  type: BankAccountType;

  @IsString({ message: 'Color is required' })
  @IsNotEmpty({ message: 'Color is required' })
  @IsHexColor()
  color: string;
}
