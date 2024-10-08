import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { ErrorHandlerService } from '../error-handler/error-handler.service';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles-auth.decorator';
import { User } from '../users/users.model';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private errorHandler: ErrorHandlerService,
    private reflector: Reflector,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );
      const req = context.switchToHttp().getRequest();
      if (!requiredRoles) {
        return true;
      }

      const authHeader = req.headers.authorization;
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if (bearer !== 'Bearer' || !token) {
        // this.errorHandler.setCommonError('Позьзователь не авторизован');
        // this.errorHandler.throwError(HttpStatus.UNAUTHORIZED);
      }

      const user = this.jwtService.verify(token) as User;

      req.user = user;

      const hasRequiredRole = user.roles.some((role) =>
        requiredRoles.includes(role.value),
      );

      if (!hasRequiredRole) {
        throw new Error();
      }

      return hasRequiredRole;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      this.errorHandler.setCommonError('Запрещено');
      this.errorHandler.throwError(HttpStatus.FORBIDDEN);
    }
  }
}
