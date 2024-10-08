import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'example@mail.ru',
    description: 'Почта пользователя',
  })
  @IsString({ message: 'Должно быть строкой' })
  @IsEmail({}, { message: 'Некорректный email' })
  readonly email: string;
  @ApiProperty({
    example: '123',
    description: 'Пароль пользователя',
  })
  @IsString({ message: 'Должно быть строкой' })
  @Length(5, 14, {
    message: (validationArguments) => {
      let message = '';

      if (
        validationArguments.value.length < validationArguments.constraints[0]
      ) {
        message = 'Пароль слишком короткий';
      }

      if (
        validationArguments.value.length > validationArguments.constraints[1]
      ) {
        message = 'Пароль слишком длинный';
      }

      return message;
    },
  })
  readonly password: string;
}
