import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserService } from './user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users.model';

@Module({
  controllers: [UsersController],
  providers: [UserService],
  imports: [SequelizeModule.forFeature([User])],
})
export class UsersModule {}
