import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserService } from './user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users.model';
import { Role } from '../roles/roles.model';
import { UserRoles } from '../roles/user-roles.model';
import { RolesModule } from '../roles/roles.module';
import { AuthModule } from '../auth/auth.module';
import { ErrorHandlerService } from '../error-handler/error-handler.service';

@Module({
  controllers: [UsersController],
  providers: [UserService, ErrorHandlerService],
  imports: [
    SequelizeModule.forFeature([User, Role, UserRoles]),
    RolesModule,
    forwardRef(() => AuthModule),
  ],
  exports: [UserService],
})
export class UsersModule {}
