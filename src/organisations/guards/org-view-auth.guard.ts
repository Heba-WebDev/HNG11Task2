import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtAdapter } from '../../config/index';
import { payload } from '../../interfaces';
import { OrganisationsService } from '../organisations.service';

@Injectable()
export class OrgAuthGuard implements CanActivate {
  constructor(private readonly orgsService: OrganisationsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers['Authorization'] || req.headers['authorization'];
    if (!auth)
      throw new UnauthorizedException({
        status: 'Unauthorized',
        message: 'A valid token is required',
        statusCode: 401,
      });
    if (!auth.startsWith('Bearer '))
      throw new UnauthorizedException({
        status: 'Unauthorized',
        message: 'A valid token that starts with Bearer is required',
        statusCode: 401,
      });
    const token = auth.split(' ').at(1) || '';
    const decoded = (await JwtAdapter.validateToken(token)) as payload;
    req.body.userId = decoded.userId;
    return true;
  }
}
