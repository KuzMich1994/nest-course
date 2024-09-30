import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { ErrorHandlerService } from '../error-handler/error-handler.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private errorHandler: ErrorHandlerService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const authHeader = req.headers.authorization;
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if (bearer !== 'Bearer' || !token) {
        this.errorHandler.setCommonError('Позьзователь не авторизован');
        this.errorHandler.throwError(HttpStatus.UNAUTHORIZED);
      }

      const user = this.jwtService.verify(token);

      req.user = user;
      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      this.errorHandler.setCommonError('Позьзователь не авторизован');
      this.errorHandler.throwError(HttpStatus.UNAUTHORIZED);
    }
  }
}
