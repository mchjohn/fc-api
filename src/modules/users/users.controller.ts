import { Controller, Get, Req } from '@nestjs/common';

import { UsersService } from './users.service';
import type { AuthenticatedRequest } from '../auth/interface/authenticated-request.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getUserById(@Req() resquest: AuthenticatedRequest) {
    return this.usersService.me(resquest.userId);
  }
}
