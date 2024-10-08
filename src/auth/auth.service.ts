import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/users.model';
import { ErrorHandlerService } from '../error-handler/error-handler.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private errorHandler: ErrorHandlerService,
  ) {}

  async login(userDto: CreateUserDto) {
    this.errorHandler.clearErrors();
    if (!userDto.email) {
      this.errorHandler.addFieldError('email', ['Не указан Email']);
      this.errorHandler.throwError(HttpStatus.BAD_REQUEST);
    }
    const user = await this.validateUser(userDto);
    return this.generateToken(user);
  }

  async registration(userDto: CreateUserDto) {
    this.errorHandler.clearErrors();

    if (!userDto.email) {
      this.errorHandler.addFieldError('email', ['Обязательное поле']);
    }

    if (!userDto.password) {
      this.errorHandler.addFieldError('password', ['Обязательное поле']);
    }

    if (this.errorHandler.getErrors().fieldErrors.length > 0) {
      this.errorHandler.throwError(HttpStatus.BAD_REQUEST);
    }

    const candidate = await this.userService.getUserByEmail(userDto.email);

    if (candidate) {
      this.errorHandler.setCommonError('Пользователь с таким email существует');
      this.errorHandler.throwError(HttpStatus.BAD_REQUEST);
    }

    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = await this.userService.createUser({
      ...userDto,
      password: hashPassword,
    });

    return this.generateToken(user);
  }

  private async generateToken(user: User) {
    const payload = { email: user.email, id: user.id, roles: user.roles };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(userDto: CreateUserDto) {
    const user = await this.userService.getUserByEmail(userDto.email);

    if (!user) {
      this.errorHandler.addFieldError('email', ['Пользователь не найден.']);
      this.errorHandler.throwError(HttpStatus.NOT_FOUND);
    }

    console.log(userDto);

    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );

    if (!passwordEquals) {
      this.errorHandler.addFieldError('password', ['Пароль не верный']);
    }

    if (this.errorHandler.getErrors().fieldErrors.length > 0) {
      this.errorHandler.throwError(HttpStatus.UNAUTHORIZED);
    }

    if (user && passwordEquals) {
      return user;
    }
  }
}
