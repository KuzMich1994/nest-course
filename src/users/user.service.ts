import { HttpStatus, Injectable } from '@nestjs/common';
import { User } from './users.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from '../roles/roles.service';
import { AddRoleDto } from './dto/add-role.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { ErrorHandlerService } from '../error-handler/error-handler.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private roleService: RolesService,
    private errorHandler: ErrorHandlerService,
  ) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.userRepository.create(dto);
    const role = await this.roleService.getRoleByValue('USER');
    await user.$set('roles', [role.id]);
    user.roles = [role];

    const userJSON = user.toJSON();

    delete userJSON.password;

    return userJSON;
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll({
      include: { all: true },
    });

    const JSONUsers = users.map((user) => {
      const userJSON = user.toJSON();

      delete userJSON.password;

      return userJSON;
    });

    return JSONUsers;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      include: { all: true },
    });

    if (!user) {
      this.errorHandler.setCommonError('Пользователь не найден');
      this.errorHandler.throwError(HttpStatus.NOT_FOUND);
    }

    const userJSON = user.toJSON();

    delete userJSON.password;

    return userJSON;
  }

  async addRole(dto: AddRoleDto) {
    const user = await this.userRepository.findByPk(dto.userId);
    const role = await this.roleService.getRoleByValue(dto.value);

    if (role && user) {
      await user.$add('roles', role.id);
      return dto;
    }

    if (!role) {
      this.errorHandler.addFieldError('role', ['Роль не найдена']);
    }

    if (!user) {
      this.errorHandler.addFieldError('user', ['Пользователь не найден']);
    }

    this.errorHandler.throwError(HttpStatus.NOT_FOUND);
  }

  async ban(dto: BanUserDto) {
    const user = await this.userRepository.findByPk(dto.userId);

    if (!user) {
      this.errorHandler.setCommonError('Пользователь не найден');
      this.errorHandler.throwError(HttpStatus.NOT_FOUND);
    }

    user.banned = true;
    user.banReason = dto.banReason;
    await user.save();
    return user;
  }

  async delete(id: string) {
    const user = await this.userRepository.findByPk(id);
    await this.userRepository.destroy({
      where: { id: id },
    });

    if (!user) {
      this.errorHandler.setCommonError('Пользователь не найден');
      this.errorHandler.throwError(HttpStatus.NOT_FOUND);
    }

    return user;
  }
}
