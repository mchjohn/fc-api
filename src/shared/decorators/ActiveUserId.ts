import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticatedRequest } from 'src/modules/auth/interface/authenticated-request.interface';

export const ActiveUserId = createParamDecorator<undefined>(
  (data, context: ExecutionContext) => {
    const request: AuthenticatedRequest = context.switchToHttp().getRequest();
    const userId = request.userId;

    if (!userId) {
      throw new UnauthorizedException();
    }

    return userId;
  },
);
