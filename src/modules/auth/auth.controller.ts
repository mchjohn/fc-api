import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('signin')
  signin(@Body() signinDto: SigninDto) {
    return this.authService.signin(signinDto);
  }

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }
}
