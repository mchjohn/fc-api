import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SigninDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(7, { message: 'A senha deve ter no mínimo 7 caracteres' })
  password: string;
}
