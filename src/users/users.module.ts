import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserService } from './user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users.model';
import { Role } from '../roles/roles.model';
import { UserRoles } from '../roles/user-roles.model';
import { RolesModule } from '../roles/roles.module';

@Module({
  controllers: [UsersController],
  providers: [UserService],
  imports: [SequelizeModule.forFeature([User, Role, UserRoles]), RolesModule],
  exports: [UserService],
})
export class UsersModule {}
