import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Public } from 'src/shared/decorators/Public';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  signin(@Body() signinDto: SigninDto) {
    return this.authService.signin(signinDto);
  }

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }
}
