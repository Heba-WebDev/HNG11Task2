import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { JwtAdapter } from '../../config/index';
import { payload } from '../../interfaces';

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers['Authorization'] || req.headers['authorization'];
    if (!auth.startsWith('Bearer '))
      throw new UnauthorizedException({
        status: 'Unauthorized',
        message: 'A valid token that starts with Bearer is required',
        statusCode: 401,
      });
    const token = auth.split(' ').at(1) || '';
    if (!token) {
      throw new UnauthorizedException({
        status: 'Unauthorized',
        message: 'Invalid token',
        statusCode: 401,
      });
    }
    const decoded = (await JwtAdapter.validateToken(token)) as payload;
    req.body.token = decoded;
    await this.usersService.userExists(decoded.userId);
    const id: string = req.params.id;
    if (decoded.userId !== id) {
      const haveOrgInCommon = await this.usersService.viewAuth(
        decoded.userId,
        id,
      );
      if (!haveOrgInCommon)
        throw new UnauthorizedException({
          status: 'Unauthorized',
          message: 'Unauthorized to perform this action',
          statusCode: 401,
        });
    }
    return true;
  }
}
